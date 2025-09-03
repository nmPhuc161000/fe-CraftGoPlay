// /src/pages/Checkout/components/VoucherPicker.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FaTicketAlt } from "react-icons/fa";
import voucherService from "../../../services/apis/voucherApi";

const VoucherPicker = ({ voucherCode, setVoucherCode, onApply, subtotal = 0 }) => {
  const [voucherError, setVoucherError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [voucherSuccess, setVoucherSuccess] = useState("");

  const mapVoucherFromBE = (v) => ({
    id: v.id,
    code: v.code,
    name: v.name,
    description: v.description,
    type: v.type,
    discountType: v.discountType === "Percentage" ? "Percent" : (v.discountType === "Amount" ? "Amount" : v.discountType),
    discountValue: typeof v.discountValue === "number" ? v.discountValue : (typeof v.discount === "number" ? v.discount : 0),
    minOrder: v.minOrderValue ?? 0,
    maxDiscountAmount: v.maxDiscountAmount ?? 0,
    endDate: v.endDate,
    startDate: v.startDate,
    isActive: v.isActive,
    quantity: v.quantity
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setVoucherError("");
        const res = await voucherService.getAllVouchers();
        const raw = res?.data?.data ?? [];
        const mapped = raw.map(mapVoucherFromBE);
        if (mounted) setVouchers(mapped);
      } catch (e) {
        console.error("getAllVouchers error:", e);
        if (mounted) setVoucherError("Không tải được danh sách voucher.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const validVouchers = useMemo(() => {
    const now = new Date();
    return vouchers.filter(v => {
      const startOk = v.startDate ? new Date(v.startDate) <= now : true;
      const endOk = v.endDate ? new Date(v.endDate) >= now : true;
      const isActive = v.isActive !== false;
      return startOk && endOk && isActive;
    });
  }, [vouchers]);

  const handlePickVoucher = (voucher) => {
    if (subtotal < (voucher.minOrder || 0)) {
      setVoucherError(`Đơn tối thiểu ${Number(voucher.minOrder || 0).toLocaleString("vi-VN")}₫ để dùng mã này.`);
      setVoucherSuccess("");
      return;
    }
    setVoucherCode(voucher.code);
    setShowModal(false);
    setVoucherError("");
    setVoucherSuccess(`Đã áp dụng thành công mã ${voucher.code}.`);
    onApply && onApply(voucher);
  };

  const handleApplyByCode = () => {
    const code = (voucherCode || "").trim().toUpperCase();
    const found = validVouchers.find(v => (v.code || "").toUpperCase() === code);
    if (!found) {
      setVoucherError("Mã voucher không hợp lệ hoặc đã hết hạn.");
      setVoucherSuccess("");
      return;
    }
    if (subtotal < (found.minOrder || 0)) {
      setVoucherError(`Đơn tối thiểu ${Number(found.minOrder || 0).toLocaleString("vi-VN")}₫ để dùng mã này.`);
      setVoucherSuccess("");
      return;
    }
    setVoucherError("");
    setVoucherSuccess(`Đã áp dụng thành công mã ${found.code}.`);
    onApply && onApply(found);
  };

  const handleClearVoucher = () => {
    setVoucherCode("");
    setVoucherError("");
    onApply && onApply(null); 
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
              value={voucherCode}
              onChange={(e) => {
                setVoucherCode(e.target.value);
                setVoucherError("");
                setVoucherSuccess("");
              }}
              placeholder="Nhập mã voucher..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b28940]"
            />

            {voucherCode && (
              <button
                type="button"
                onClick={handleClearVoucher}
                aria-label="Bỏ voucher"
                title="Bỏ voucher"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleApplyByCode}
            className="px-4 py-2 bg-gradient-to-r from-[#5e3a1e] to-[#8b5e34] text-white rounded-xl font-medium text-sm shadow hover:opacity-90 transition"
          >
            Áp dụng
          </button>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 border border-[#b28940] text-[#5e3a1e] rounded-xl font-medium text-sm hover:bg-[#fff7ea] transition"
          >
            Chọn mã
          </button>
        </div>
      </div>

      {/* Error message */}
       {voucherSuccess && (
        <p className="text-sm text-green-600 text-right">{voucherSuccess}</p>
      )}
      {voucherError && (
        <p className="text-sm text-red-500 text-right">{voucherError}</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between bg-gradient-to-r from-[#fff7ea] to-white">
              <h3 className="text-lg font-bold text-[#5e3a1e]">Mã giảm giá của bạn</h3>
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded-md hover:bg-gray-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-5 space-y-4">
              {loading ? (
                <div className="text-center text-sm text-gray-500">Đang tải voucher…</div>
              ) : validVouchers.length === 0 ? (
                <div className="text-center text-sm text-gray-500">Không có voucher khả dụng.</div>
              ) : (
                validVouchers.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white"
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
                          {v.discountType === "Percent"
                            ? `Giảm ${v.discountValue}%`
                            : `Giảm ${Number(v.discountValue).toLocaleString("vi-VN")}₫`}
                          {v.maxDiscountAmount > 0
                            ? ` • Tối đa ${Number(v.maxDiscountAmount).toLocaleString("vi-VN")}₫`
                            : ""}
                          {v.minOrder > 0
                            ? ` • Đơn tối thiểu ${Number(v.minOrder).toLocaleString("vi-VN")}₫`
                            : ""}
                        </p>
                        {v.endDate && (
                          <p className="text-[11px] text-gray-400">
                            HSD: {new Date(v.endDate).toLocaleString("vi-VN")}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handlePickVoucher(v)}
                      className="px-4 py-2 bg-gradient-to-r from-[#5e3a1e] to-[#8b5e34] text-white rounded-lg font-medium text-sm hover:opacity-90 transition shadow"
                    >
                      Dùng
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default VoucherPicker;
