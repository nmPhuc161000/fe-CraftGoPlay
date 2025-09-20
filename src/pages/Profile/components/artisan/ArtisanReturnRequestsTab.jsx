import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import returnRequestService from "../../../../services/apis/returnrequestApi";
import { useNotification } from "../../../../contexts/NotificationContext";
import {
  FiPackage,
  FiUser,
  FiPhone,
  FiCalendar,
  FiChevronRight,
} from "react-icons/fi";

import {
  statusMap,
  statusColorMap,
  reasonMap as reasonMapFull,
  formatDate,
  formatCurrency,
  rejectReasonMap,
} from "../../../../utils/returnRequestUtils";

const ArtisanReturnRequestsTab = () => {
  const { user } = useContext(AuthContext);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { showNotification } = useNotification();
  const [complaintId, setComplaintId] = useState(null);
  const [complaintReason, setComplaintReason] = useState("");
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  const [rejectingId, setRejectingId] = useState(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState("");
  const [submittingReject, setSubmittingReject] = useState(false);
  const role = localStorage.getItem("role");

  const statusFilters = useMemo(() => {
    const items = Object.keys(statusMap).map((value) => ({
      value,
      label: statusMap[value],
    }));
    return [{ value: "all", label: "Tất cả" }, ...items];
  }, []);

  // Fetch danh sách yêu cầu
  useEffect(() => {
    const fetchRequests = async (status = "") => {
      try {
        setLoading(true);
        let resApi;

        if (role === "Artisan") {
          resApi = await returnRequestService.getReturnRequestByArtisanId(
            user?.id,
            1,
            100,
            status
          );
        } else if (role === "User") {
          resApi = await returnRequestService.getReturnRequestByUserId(
            user?.id,
            1,
            100,
            status
          );
        }
        const res = resApi;
        if (res?.data?.error === 0 && Array.isArray(res?.data?.data)) {
          const data = res.data.data;

          if (status === "") {
            // đếm theo status
            const counts = statusFilters.reduce((acc, filter) => {
              if (filter.value === "all") acc[filter.value] = data.length;
              else
                acc[filter.value] = data.filter(
                  (r) => r.status === filter.value
                ).length;
              return acc;
            }, {});
            setStatusCounts(counts);
          }
          setFilteredRequests(data);
        } else {
          setFilteredRequests([]);
        }
      } catch (err) {
        console.error("Lỗi khi lấy yêu cầu trả hàng:", err);
        showNotification("Lỗi khi tải dữ liệu yêu cầu trả hàng", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRequests(selectedStatus === "all" ? "" : selectedStatus);
    }
  }, [user?.id, selectedStatus, statusFilters, showNotification]);

  const renderSkeleton = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm p-6 animate-pulse"
        >
          <div className="flex justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded-lg w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/6"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleApprove = async (id) => {
    try {
      await returnRequestService.updateStatusReturnRequest(id, "Approved");
      showNotification("Cập nhật trạng thái thành công", "success");
      await reloadList();
    } catch (err) {
      console.error(err);
      showNotification("Lỗi khi cập nhật trạng thái", "error");
    }
  };

  const openRejectModal = (id) => {
    setRejectingId(id);
    setSelectedRejectReason("");
  };

  const confirmReject = async () => {
    if (!rejectingId) return;
    if (!selectedRejectReason) {
      showNotification("Vui lòng chọn lý do từ chối", "warning");
      return;
    }
    try {
      setSubmittingReject(true);
      await returnRequestService.updateStatusReturnRequest(
        rejectingId,
        "Rejected",
        selectedRejectReason
      );
      showNotification("Đã từ chối yêu cầu trả hàng", "success");
      await reloadList();
    } catch (e) {
      console.error(e);
      showNotification("Lỗi khi từ chối yêu cầu", "error");
    } finally {
      setSubmittingReject(false);
      setRejectingId(null);
    }
  };

  const reloadList = async () => {
    const res = await returnRequestService.getReturnRequestByArtisanId(
      user?.id,
      1,
      100,
      selectedStatus === "all" ? "" : selectedStatus
    );
    if (res?.data?.error === 0 && Array.isArray(res?.data?.data)) {
      const data = res.data.data;
      setFilteredRequests(data);
      if (selectedStatus === "all") {
        const counts = statusFilters.reduce((acc, f) => {
          if (f.value === "all") acc[f.value] = data.length;
          else acc[f.value] = data.filter((r) => r.status === f.value).length;
          return acc;
        }, {});
        setStatusCounts(counts);
      }
    }
  };

  const handleEscalate = async () => {
    if (!complaintId || !complaintReason.trim()) {
      showNotification("Vui lòng nhập nội dung khiếu nại", "warning");
      return;
    }
    try {
      setSubmittingComplaint(true);
      await returnRequestService.escalatedReturnRequest(
        complaintId,
        complaintReason
      );
      showNotification("Đã gửi khiếu nại thành công", "success");
      setComplaintId(null);
      setComplaintReason("");
      await reloadList();
    } catch (err) {
      console.error(err);
      showNotification("Lỗi khi gửi khiếu nại", "error");
    } finally {
      setSubmittingComplaint(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-[#5e3a1e] mb-6 flex items-center">
        <FiPackage className="mr-2" /> Yêu cầu trả hàng
      </h2>

      {/* Filters */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2">
          {statusFilters.map((filter) => {
            const active = selectedStatus === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                  active
                    ? "bg-[#5e3a1e] text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {filter.label}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    active
                      ? "bg-white text-[#5e3a1e]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {statusCounts[filter.value] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        renderSkeleton()
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500">
            {selectedStatus === "all"
              ? "Chưa có yêu cầu trả hàng nào"
              : `Không có yêu cầu nào ở trạng thái "${
                  statusFilters.find((f) => f.value === selectedStatus)?.label
                }"`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((req) => {
            const idShort = (req?.id ?? "").split("-")[0]?.toUpperCase();
            const productImg = Array.isArray(
              req?.orderItem?.product?.productImages
            )
              ? req?.orderItem?.product?.productImages?.[0]?.imageUrl
              : req?.orderItem?.product?.productImages?.imageUrl;

            return (
              <div
                key={req?.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-lg text-gray-900">
                        #{idShort}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiCalendar size={16} />
                        <span className="text-sm">
                          {formatDate(req?.requestedAt)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        statusColorMap[req?.status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusMap[req?.status] || req?.status || "—"}
                    </span>
                  </div>
                </div>

                {/* Customer */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FiUser size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Khách hàng</p>
                          <p className="font-semibold text-gray-900">
                            {req?.user?.userName || "Khách hàng"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FiPhone size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Điện thoại</p>
                          <p className="font-medium text-gray-700">
                            {req?.user?.phoneNumber || "Chưa cập nhật"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        <img
                          src={productImg || "https://via.placeholder.com/80"}
                          alt={req?.orderItem?.product?.name || "Sản phẩm"}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {req?.orderItem?.product?.name || "Sản phẩm"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Giá: {formatCurrency(req?.orderItem?.unitPrice)} • Số
                          lượng: {req?.orderItem?.quantity ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ly do */}
                <div className="px-6 py-4 border-b border-gray-100 text-sm text-gray-700 space-y-3">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">📌</span>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-yellow-800 whitespace-nowrap">
                        Lý do:
                      </p>
                      <p className="text-gray-700">
                        {reasonMapFull[req?.reason] || req?.reason || "—"}
                      </p>
                    </div>
                  </div>

                  {req?.description && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
                      <span className="text-blue-600 font-bold mr-2">📝</span>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-blue-800 whitespace-nowrap">
                          Mô tả:
                        </p>
                        <p className="text-gray-700">{req?.description}</p>
                      </div>
                    </div>
                  )}

                  {req?.imageUrl && (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                      <p className="font-semibold text-gray-800 mb-2">
                        Ảnh yêu cầu trả hàng
                      </p>
                      <div className="w-32 h-32 rounded-md overflow-hidden border border-gray-300">
                        <img
                          src={req.imageUrl}
                          alt="Ảnh yêu cầu trả hàng"
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {/* placeholder */}
                  </div>

                  {role === "Artisan" && req?.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req?.id)}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700"
                      >
                        Chấp nhận
                        <FiChevronRight size={16} />
                      </button>
                      <button
                        onClick={() => openRejectModal(req?.id)}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 bg-red-600 hover:bg-red-700"
                      >
                        Từ chối
                        <FiChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {role === "User" && req?.status === "Rejected" && (
                    <div className="flex flex-col gap-2 w-full max-w-md">
                      {complaintId === req?.id ? (
                        <>
                          <textarea
                            value={complaintReason}
                            onChange={(e) => setComplaintReason(e.target.value)}
                            placeholder="Nhập nội dung khiếu nại..."
                            className="w-full p-2 border rounded-lg text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleEscalate}
                              disabled={submittingComplaint}
                              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              {submittingComplaint
                                ? "Đang gửi..."
                                : "Gửi khiếu nại"}
                            </button>
                            <button
                              onClick={() => {
                                setComplaintId(null);
                                setComplaintReason("");
                              }}
                              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              Hủy
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => setComplaintId(req?.id)}
                          className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                        >
                          Khiếu nại
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* popup tu choi*/}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setRejectingId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Chọn lý do từ chối</h3>
            <div className="space-y-3">
              <label className="text-sm text-gray-600">Lý do</label>
              <select
                value={selectedRejectReason}
                onChange={(e) => setSelectedRejectReason(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              >
                <option value="">-- Chọn lý do --</option>
                {Object.keys(rejectReasonMap).map((k) => (
                  <option key={k} value={k}>
                    {rejectReasonMap[k]}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                disabled={submittingReject}
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                disabled={submittingReject || !selectedRejectReason}
                className={`px-4 py-2 rounded-lg text-white ${
                  selectedRejectReason
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed"
                }`}
              >
                {submittingReject ? "Đang từ chối..." : "Xác nhận từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ArtisanReturnRequestsTab);
