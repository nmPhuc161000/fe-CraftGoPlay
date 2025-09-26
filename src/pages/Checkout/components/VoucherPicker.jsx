import React, { useEffect, useMemo, useState, useContext } from "react";
import { FaTicketAlt } from "react-icons/fa";
import { AuthContext } from "../../../contexts/AuthContext";
import userVoucherService from "../../../services/apis/userVoucherApi";

const VoucherPicker = ({
  productCode = "",
  setProductCode = () => {},
  deliveryCode = "",
  setDeliveryCode = () => {},
  onApplyProduct,
  onApplyDelivery,
  subtotal = 0,
  paymentMethod = "",               // << nhận PTTT từ Checkout
}) => {
  const { user } = useContext(AuthContext);
  const [voucherError, setVoucherError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [voucherSuccess, setVoucherSuccess] = useState("");

  // Map 1 voucher từ BE
  const mapVoucherFromBE = (entry) => {
    const src = entry?.voucher ?? entry ?? {};
    return {
      id: src?.id,
      code: src?.code,
      name: src?.name,
      description: src?.description,
      type: (src?.type || "").trim(), // "Product" | "Delivery"
      discountType: src?.discountType ?? src?.discount_type ?? "",
      discountValue:
        typeof src?.discountValue === "number"
          ? src.discountValue
          : typeof src?.discount === "number"
          ? src.discount
          : 0,
      minOrder: src?.minOrderValue ?? src?.minOrder ?? 0,
      maxDiscountAmount: src?.maxDiscountAmount ?? 0,
      startDate: src?.startDate,
      endDate: src?.endDate,
      isActive: src?.isActive,
      quantity: src?.quantity,
      usedCount: src?.usedCount ?? 0,
      isUsed: entry?.isUsed ?? src?.isUsed ?? false,
      paymentMethod: src?.paymentMethod,
    };
  };

  // Chuẩn hoá list + _key duy nhất cho từng bản sao (kể cả trùng id/code)
  const normalizeVoucherList = (rawData) => {
    if (!Array.isArray(rawData)) return [];
    const out = [];
    const counter = new Map(); 

    const pushWithKey = (obj) => {
      const idOrCode = obj?.id ?? obj?.code ?? "unknown";
      const next = (counter.get(idOrCode) || 0) + 1;
      counter.set(idOrCode, next);
      out.push({ ...obj, _key: `${idOrCode}#${next}` });
    };

    for (const item of rawData) {
      if (item?.voucher) {
        pushWithKey(mapVoucherFromBE(item));
      } else if (Array.isArray(item?.vouchers)) {
        for (const v of item.vouchers) pushWithKey(mapVoucherFromBE(v));
      } else if (item && (item.code || item.name || item.id)) {
        pushWithKey(mapVoucherFromBE(item));
      }
    }
    return out;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user?.id) {
        setVouchers([]);
        setVoucherError("Bạn cần đăng nhập để xem mã giảm giá của mình.");
        return;
      }
      try {
        setLoading(true);
        setVoucherError("");
        const res = await userVoucherService.getAllVouchersByUserId(user.id, "");
        const wrapper = res?.data?.data ?? [];
        const normalized = normalizeVoucherList(wrapper);
        if (mounted) setVouchers(normalized);
      } catch (e) {
        console.error("getAllVouchersByUserId error:", e);
        if (mounted) setVoucherError("Không tải được danh sách voucher.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // helper: có phải là voucher % không? (hỗ trợ cả "Percentage", "Percent", "percentage", "percent")
  const isPercentType = (v) => {
    const t = (v?.discountType || "").toString().trim().toLowerCase();
    return t === "percentage" || t === "percent";
  };

  // Cho/không cho theo PTTT
  const allowsPayment = (voucher) => {
    if (!voucher) return true;
    const pm = (voucher.paymentMethod || "All").toString().toLowerCase();
    if (!paymentMethod) return false; // bắt buộc chọn PTTT trước
    if (pm === "all") return true;
    if (pm === "online") return paymentMethod === "vnpay";
    if (pm === "cash") return paymentMethod !== "vnpay";
    return paymentMethod !== "vnpay";
  };

  // Điều kiện khả dụng ở thời điểm chọn
  const canUseNow = (v) => {
    const now = new Date();
    const startOk = v.startDate ? new Date(v.startDate) <= now : true;
    const endOk = v.endDate ? new Date(v.endDate) >= now : true;
    const isActive = v.isActive !== false;
    const notUsed = !v.isUsed;
    const qtyOk = v.quantity == null ? true : (v.usedCount ?? 0) < v.quantity;
    const subtotalOk = subtotal >= (v.minOrder || 0);
    const pmOk = allowsPayment(v);
    return startOk && endOk && isActive && notUsed && qtyOk && subtotalOk && pmOk;
  };

  const disableReason = (v) => {
    if (!paymentMethod) return "Chọn PTTT trước";
    const now = new Date();
    if (v.startDate && new Date(v.startDate) > now) return "Chưa hiệu lực";
    if (v.endDate && new Date(v.endDate) < now) return "Hết hạn";
    if (v.isActive === false) return "Ngừng";
    if (v.isUsed) return "Đã dùng";
    if (v.quantity != null && (v.usedCount ?? 0) >= v.quantity) return "Hết lượt";
    if (subtotal < (v.minOrder || 0)) return "Chưa đạt tối thiểu";
    if (!allowsPayment(v)) return "Không hợp PTTT";
    return "Không khả dụng";
  };

  const combinedLabel = useMemo(() => {
    const parts = [];
    if (productCode) parts.push(`SP: ${productCode}`);
    if (deliveryCode) parts.push(`VC: ${deliveryCode}`);
    return parts.join(" | ");
  }, [productCode, deliveryCode]);

  const clearBoth = () => {
    setProductCode("");
    setDeliveryCode("");
    onApplyProduct && onApplyProduct(null);
    onApplyDelivery && onApplyDelivery(null);
    setVoucherError("");
    setVoucherSuccess("");
  };

  const handlePickVoucher = (type, voucher) => {
    // chặn khi chưa chọn PTTT
    if (!paymentMethod) {
      setVoucherError("Vui lòng chọn phương thức thanh toán trước.");
      setVoucherSuccess("");
      return;
    }

    const now = new Date();
    if (voucher.startDate && new Date(voucher.startDate) > now) {
      setVoucherError(`Mã ${voucher.code} chưa đến thời gian hiệu lực.`);
      setVoucherSuccess("");
      return;
    }
    if (voucher.endDate && new Date(voucher.endDate) < now) {
      setVoucherError(`Mã ${voucher.code} đã hết hạn.`);
      setVoucherSuccess("");
      return;
    }
    if (voucher.isActive === false) {
      setVoucherError(`Mã ${voucher.code} đã ngừng hoạt động.`);
      setVoucherSuccess("");
      return;
    }
    if (voucher.isUsed) {
      setVoucherError(`Mã ${voucher.code} bạn đã sử dụng.`);
      setVoucherSuccess("");
      return;
    }
    if (voucher.quantity != null && (voucher.usedCount ?? 0) >= voucher.quantity) {
      setVoucherError(`Mã ${voucher.code} đã hết lượt.`);
      setVoucherSuccess("");
      return;
    }
    if (subtotal < (voucher.minOrder || 0)) {
      setVoucherError(
        `Đơn tối thiểu ${Number(voucher.minOrder || 0).toLocaleString("vi-VN")}₫ để dùng mã này.`
      );
      setVoucherSuccess("");
      return;
    }
    if (!allowsPayment(voucher)) {
      setVoucherError(`Mã ${voucher.code} không áp dụng cho phương thức thanh toán đã chọn.`);
      setVoucherSuccess("");
      return;
    }

    if (type === "Product") {
      setProductCode(voucher.code);
      onApplyProduct && onApplyProduct(voucher);
      setVoucherSuccess(`Đã chọn mã sản phẩm ${voucher.code}.`);
    } else {
      setDeliveryCode(voucher.code);
      onApplyDelivery && onApplyDelivery(voucher);
      setVoucherSuccess(`Đã chọn mã vận chuyển ${voucher.code}.`);
    }

    setVoucherError("");
  };

  // ---- Tách cột & sắp xếp (khả dụng trước, gần hết hạn trước)
  const productSorted = useMemo(() => {
    const list = vouchers.filter((v) => (v.type || "") === "Product");
    return [...list].sort((a, b) => {
      const ua = canUseNow(a) ? 0 : 1;
      const ub = canUseNow(b) ? 0 : 1;
      if (ua !== ub) return ua - ub;
      const ea = a.endDate ? new Date(a.endDate).getTime() : Number.POSITIVE_INFINITY;
      const eb = b.endDate ? new Date(b.endDate).getTime() : Number.POSITIVE_INFINITY;
      return ea - eb;
    });
  }, [vouchers, subtotal, paymentMethod]);

  const deliverySorted = useMemo(() => {
    const list = vouchers.filter((v) => (v.type || "") === "Delivery");
    return [...list].sort((a, b) => {
      const ua = canUseNow(a) ? 0 : 1;
      const ub = canUseNow(b) ? 0 : 1;
      if (ua !== ub) return ua - ub;
      const ea = a.endDate ? new Date(a.endDate).getTime() : Number.POSITIVE_INFINITY;
      const eb = b.endDate ? new Date(b.endDate).getTime() : Number.POSITIVE_INFINITY;
      return ea - eb;
    });
  }, [vouchers, subtotal, paymentMethod]);

  const VoucherCard = ({ v, type }) => {
    const selected =
      (type === "Product" && productCode && v.code === productCode) ||
      (type === "Delivery" && deliveryCode && v.code === deliveryCode);

    const usable = canUseNow(v);
    const label = selected ? "Đang dùng" : usable ? "Dùng" : disableReason(v);

    // Hiển thị discount: nếu % thì show %, else show VNĐ
    const discountLabel = isPercentType(v)
      ? `Giảm ${v.discountValue}%`
      : `Giảm ${Number(v.discountValue).toLocaleString("vi-VN")}₫`;

    return (
      <div
        className={`flex items-center justify-between p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white ${
          selected ? "ring-2 ring-[#b28940]" : ""
        } ${!usable && !selected ? "opacity-70" : ""}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#b28940] to-[#e6c37f] text-white rounded-lg shadow">
            <FaTicketAlt />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#5e3a1e] truncate">
              {v.code} — {v.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {discountLabel}
              {v.maxDiscountAmount > 0 ? ` • Tối đa ${Number(v.maxDiscountAmount).toLocaleString("vi-VN")}₫` : ""}
              {v.minOrder > 0 ? ` • Đơn tối thiểu ${Number(v.minOrder).toLocaleString("vi-VN")}₫` : ""}
              {v.paymentMethod ? ` • PTTT: ${v.paymentMethod}` : ""}
            </p>
            {v.endDate && (
              <p className="text-[11px] text-gray-400">
                HSD: {new Date(v.endDate).toLocaleString("vi-VN")}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => handlePickVoucher(type, v)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition shadow ${
            selected
              ? "bg-gray-100 text-gray-600 cursor-default"
              : usable
              ? "bg-gradient-to-r from-[#5e3a1e] to-[#8b5e34] text-white hover:opacity-90"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={selected || !usable}
          title={!usable && !selected ? disableReason(v) : undefined}
        >
          {label}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-base font-semibold text-[#5e3a1e]">
          <FaTicketAlt className="text-[#b28940] text-lg" />
          <span>Mã giảm giá</span>
        </div>

        <div className="flex gap-3 w-[520px] max-w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={combinedLabel ?? ""}
              readOnly
              aria-readonly="true"
              placeholder="Chưa chọn mã"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm shadow-sm bg-gray-50 cursor-default select-text focus:outline-none placeholder:text-[#b28940]/70"
              title={combinedLabel || "Chưa chọn mã"}
            />
            {(productCode || deliveryCode) && (
              <button
                type="button"
                onClick={clearBoth}
                aria-label="Bỏ tất cả voucher"
                title="Bỏ tất cả voucher"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => (paymentMethod ? setShowModal(true) : setVoucherError("Vui lòng chọn phương thức thanh toán trước."))}
            className={`px-4 py-2 rounded-xl font-medium text-sm shadow transition ${
              paymentMethod
                ? "bg-gradient-to-r from-[#5e3a1e] to-[#8b5e34] text-white hover:opacity-90"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!paymentMethod}
            title={paymentMethod ? undefined : "Chọn phương thức thanh toán trước"}
          >
            Chọn mã
          </button>
        </div>
      </div>

      {/* Messages */}
      {voucherSuccess && <p className="text-sm text-green-600 text-right">{voucherSuccess}</p>}
      {voucherError && <p className="text-sm text-red-500 text-right">{voucherError}</p>}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between bg-gradient-to-r from-[#fff7ea] to-white">
              <h3 className="text-lg font-bold text-[#5e3a1e]">Mã giảm giá của bạn</h3>
              <button onClick={() => setShowModal(false)} className="px-3 py-1 rounded-md hover:bg-gray-100 text-sm">✕</button>
            </div>

            <div className="p-5 max-h-[520px] overflow-y-auto">
              {loading ? (
                <div className="text-center text-sm text-gray-500">Đang tải voucher…</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sản phẩm */}
                  <div>
                    <h4 className="font-semibold text-[#5e3a1e] mb-3">Voucher SẢN PHẨM</h4>
                    <div className="space-y-4">
                      {productSorted.length === 0 ? (
                        <div className="text-sm text-gray-500">Không có voucher sản phẩm.</div>
                      ) : (
                        productSorted.map((v) => <VoucherCard key={v._key} v={v} type="Product" />)
                      )}
                    </div>
                  </div>

                  {/* Vận chuyển */}
                  <div>
                    <h4 className="font-semibold text-[#5e3a1e] mb-3">Voucher VẬN CHUYỂN</h4>
                    <div className="space-y-4">
                      {deliverySorted.length === 0 ? (
                        <div className="text-sm text-gray-500">Không có voucher vận chuyển.</div>
                      ) : (
                        deliverySorted.map((v) => <VoucherCard key={v._key} v={v} type="Delivery" />)
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default VoucherPicker;
