import React, { useContext, useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useNotification } from "../../../../contexts/NotificationContext";
import returnRequestService from "../../../../services/apis/returnrequestApi";
import orderService from "../../../../services/apis/orderApi"; 
import { FiPackage, FiArrowLeft } from "react-icons/fi";

const RETURN_BLOCKED = new Set([
  "returnrequested",
  "returnapproved",
  "returned",
]);

const parseQS = (search, key) => new URLSearchParams(search).get(key) || "";

//fallback
const parseOrderItemsFromQS = (search) => {
  try {
    const raw = new URLSearchParams(search).get("orderItems");
    if (!raw) return [];
    const decoded = decodeURIComponent(raw);
    const json = JSON.parse(decoded);
    if (!Array.isArray(json)) return [];
    return json
      .filter((x) => x && x.orderItemId && x.name)
      .map((x) => ({
        id: x.orderItemId,
        name: x.name,
        imageUrl: x.product?.productImages?.imageUrl || x.imageUrl || "",
        price: x.price || 0,
      }));
  } catch {
    return [];
  }
};

const formatProductCode = (id) => {
  if (!id) return "";
  const shortId = id.slice(0, 8).toUpperCase();
  return `${shortId.slice(0, 4)}-${shortId.slice(4)}`;
};

const ReturnRequestTab = () => {
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = parseQS(location.search, "orderId");
  const orderItemIdQS = parseQS(location.search, "orderItemId");

  const productsFromQS = useMemo(() => parseOrderItemsFromQS(location.search), [location.search]);

  const [eligibleItems, setEligibleItems] = useState(productsFromQS);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setEligibleItems(productsFromQS);
        return;
      }
      try {
        setLoadingOrder(true);
        const res = await orderService.getOrderByOrderId(orderId);
        const items = res?.data?.data?.orderItems || [];
        const filtered = items
          .filter((it) => !RETURN_BLOCKED.has(String(it?.status || "").toLowerCase()))
          .map((it) => {
            const img = Array.isArray(it.product?.productImages)
              ? it.product?.productImages?.[0]?.imageUrl
              : it.product?.productImages?.imageUrl;
            return {
              id: it.id, 
              name: it.product?.name || "",
              imageUrl: img || "",
              price: it.unitPrice ?? it.product?.price ?? 0,
            };
          });

        setEligibleItems(filtered);
        setSelectedIds((prev) => prev.filter((id) => filtered.some((e) => e.id === id)));
      } catch {
        setEligibleItems(productsFromQS);
      } finally {
        setLoadingOrder(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const [selectedIds, setSelectedIds] = useState(orderItemIdQS ? [orderItemIdQS] : []);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedForms, setSelectedForms] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const ensureFormFor = (id) => {
    setSelectedForms((prev) =>
      prev[id]
        ? prev
        : {
            ...prev,
            [id]: { reason: "", otherReason: "", description: "", image: null },
          }
    );
  };

  const toggleItem = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        setErrors((e) => {
          const next = { ...e };
          delete next[id];
          return next;
        });
        return prev.filter((x) => x !== id);
      } else {
        ensureFormFor(id);
        return [...prev, id];
      }
    });
  };

  const onToggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
      setErrors({});
    } else {
      const allIds = eligibleItems.map((x) => x.id);
      setSelectedIds(allIds);
      setSelectedForms((prev) => {
        const next = { ...prev };
        for (const id of allIds) {
          if (!next[id]) next[id] = { reason: "", otherReason: "", description: "", image: null };
        }
        return next;
      });
      setSelectAll(true);
    }
  };

  const handleItemFormChange = (id, field, valueOrFile) => {
    setSelectedForms((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: valueOrFile },
    }));
    setErrors((prevE) => {
      const cur = prevE[id] || {};
      if (!Object.keys(cur).length) return prevE;
      const nextCur = { ...cur };
      delete nextCur[field];
      const next = { ...prevE, [id]: nextCur };
      if (!Object.keys(nextCur).length) delete next[id];
      return next;
    });
  };

  const selectedCount = selectedIds.length;
  const completedSelected = selectedIds.filter((id) => {
    const f = selectedForms[id] || {};
    if (!f.reason) return false;
    if (f.reason === "Other" && !String(f.otherReason || "").trim()) return false;
    return true;
  }).length;
  const isReady = selectedCount > 0 && completedSelected === selectedCount;

  const validateBeforeSubmit = () => {
    const newErr = {};
    if (!user?.id) {
      showNotification("Thiếu thông tin người dùng", "error");
      return false;
    }
    if (!orderId) {
      showNotification("Thiếu mã đơn hàng", "error");
      return false;
    }
    if (selectedCount === 0) {
      showNotification("Vui lòng chọn ít nhất 1 sản phẩm", "warning");
      return false;
    }

    let ok = true;
    for (const id of selectedIds) {
      const f = selectedForms[id] || {};
      const err = {};
      if (!f.reason) {
        err.reason = "Vui lòng chọn lý do";
        ok = false;
      }
      if (f.reason === "Other" && !String(f.otherReason || "").trim()) {
        err.otherReason = "Vui lòng nêu rõ lý do khác";
        ok = false;
      }
      if (Object.keys(err).length) newErr[id] = err;
    }
    setErrors(newErr);
    if (!ok) showNotification("Vui lòng hoàn thành thông tin cho sản phẩm đã chọn!", "warning");
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateBeforeSubmit()) return;

    try {
      setLoading(true);
      const tasks = selectedIds.map(async (oid) => {
        const f = selectedForms[oid] || {};
        const data = new FormData();
        data.append("OrderItemId", oid);
        data.append("UserId", user.id);
        data.append("Reason", f.reason);
        if (f.reason === "Other") data.append("OtherReason", f.otherReason || "");
        data.append("Description", f.description || "");
        if (f.image) data.append("ImageUrl", f.image);
        return returnRequestService.createReturnRequest(data);
      });

      const results = await Promise.allSettled(tasks);
      const okCount = results.filter(
        (r) => r.status === "fulfilled" && r.value?.data?.error === 0
      ).length;

      if (okCount === selectedIds.length) {
        showNotification("Gửi yêu cầu trả hàng thành công!", "success");
      } else if (okCount > 0) {
        showNotification(`Gửi thành công ${okCount}/${selectedIds.length} sản phẩm`, "warning");
      } else {
        showNotification("Không thể gửi yêu cầu trả hàng", "error");
      }

      navigate("/profile-user/orders", { state: { expandedOrderId: orderId } });
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu trả hàng:", err);
      showNotification("Có lỗi xảy ra khi gửi yêu cầu trả hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderItemIdQS) {
      setSelectedForms((prev) =>
        prev[orderItemIdQS]
          ? prev
          : { ...prev, [orderItemIdQS]: { reason: "", otherReason: "", description: "", image: null } }
      );
    }
  }, [orderItemIdQS]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-100 p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <FiPackage className="text-2xl text-orange-600" />
            <h2 className="text-3xl font-bold text-gray-800 font-sans">Yêu cầu trả hàng</h2>
          </div>
          <button
            onClick={() => navigate("/profile-user/orders", { state: { expandedOrderId: orderId } })}
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-300 text-sm font-medium"
          >
            <FiArrowLeft className="mr-2 text-lg" />
            Quay lại
          </button>
        </div>

        {/* Progress */}
        {eligibleItems.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-600">
                Đã hoàn tất: {completedSelected}/{selectedCount || 0} sản phẩm đã chọn
              </p>
              <p className={`text-sm font-semibold ${isReady ? "text-green-600" : "text-gray-600"}`}>
                {isReady ? "Sẵn sàng gửi!" : "Cần điền form cho sản phẩm đã chọn"}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${selectedCount ? (completedSelected / selectedCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Loading */}
        {loadingOrder && (
          <div className="text-center py-6 text-sm text-gray-500">Đang tải sản phẩm đủ điều kiện…</div>
        )}

        {/* danh sach sp*/}
        {!loadingOrder && (
          <div className="space-y-4">
            {eligibleItems.length > 1 && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className="text-sm px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100"
                >
                  {selectAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                </button>
              </div>
            )}

            {eligibleItems.map((p) => {
              const checked = selectedIds.includes(p.id);
              const f = selectedForms[p.id] || {};
              const err = errors[p.id] || {};
              return (
                <div
                  key={p.id}
                  className={`bg-gray-50 rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
                    checked ? "border-orange-200 ring-1 ring-orange-100" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      className="mt-1 w-5 h-5 accent-orange-600"
                      checked={checked}
                      onChange={() => toggleItem(p.id)}
                      onClick={() => !checked && ensureFormFor(p.id)}
                    />
                    <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200 flex-shrink-0">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-800">{p.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Mã sản phẩm: {formatProductCode(p.id)}</p>
                    </div>
                  </div>

                  {/* form chi hien khi tick */}
                  {checked && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lý do trả hàng <span className="text-orange-500">*</span>
                        </label>
                        <select
                          value={f.reason || ""}
                          onChange={(e) => handleItemFormChange(p.id, "reason", e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            err.reason ? "border-red-300" : "border-gray-200"
                          } focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-700 bg-white shadow-sm transition hover:border-orange-300`}
                          required
                        >
                          <option value="">Chọn lý do</option>
                          <option value="ChangedMind">Đổi ý</option>
                          <option value="WrongItemDelivered">Giao sai sản phẩm</option>
                          <option value="DamagedOrDefective">Hư hỏng hoặc lỗi</option>
                          <option value="NotAsDescribed">Không như mô tả</option>
                          <option value="LateDelivery">Giao hàng muộn</option>
                          <option value="NoLongerNeeded">Không còn cần</option>
                          <option value="MissingPartsOrAccessories">Thiếu bộ phận/phụ kiện</option>
                          <option value="OrderedByMistake">Đặt hàng nhầm</option>
                          <option value="Other">Khác</option>
                        </select>
                        {err.reason && <p className="text-sm text-red-500 mt-1">{err.reason}</p>}
                      </div>

                      {f.reason === "Other" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Lý do khác</label>
                          <input
                            type="text"
                            value={f.otherReason || ""}
                            onChange={(e) => handleItemFormChange(p.id, "otherReason", e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              err.otherReason ? "border-red-300" : "border-gray-200"
                            } focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-700 bg-white shadow-sm transition hover:border-orange-300`}
                            placeholder="Vui lòng nêu rõ lý do"
                          />
                          {err.otherReason && <p className="text-sm text-red-500 mt-1">{err.otherReason}</p>}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</label>
                        <textarea
                          value={f.description || ""}
                          onChange={(e) => handleItemFormChange(p.id, "description", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-700 bg-white shadow-sm transition hover:border-orange-300"
                          rows="3"
                          placeholder="Mô tả thêm về lý do trả hàng (tùy chọn)"
                          maxLength={1000}
                        />
                        <p className="text-right text-xs text-gray-500 mt-1">
                          {String(f.description || "").length}/1000
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hình ảnh minh họa (tùy chọn)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleItemFormChange(p.id, "image", e.target.files?.[0] || null)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-700 bg-white shadow-sm transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Action bar */}
        <form onSubmit={handleSubmit} className="flex justify-between items-center space-x-4 pt-6">
          <p className="text-sm text-orange-600 font-medium">
            {selectedCount > 0
              ? `Đã chọn ${selectedCount} sản phẩm • Hoàn tất ${completedSelected}/${selectedCount}`
              : "Tick vào sản phẩm để mở form điền thông tin"}
          </p>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate("/profile-user/orders", { state: { expandedOrderId: orderId } })}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-300 hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !isReady}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                isReady
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </form>

        {/* khi ko co sp nao */}
        {!loadingOrder && eligibleItems.length === 0 && (
          <div className="text-center py-10 mt-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-600 mb-4">
              Tất cả sản phẩm trong đơn đã có yêu cầu trả hoặc không đủ điều kiện.
            </p>
            <button
              onClick={() => navigate("/profile-user/orders", { state: { expandedOrderId: orderId } })}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition"
            >
              Quay lại đơn hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ReturnRequestTab);
