import React, { useState } from "react";
import { FaTicketAlt } from "react-icons/fa";

const VoucherPicker = ({ voucherCode, setVoucherCode, onApply }) => {
  const [voucherError, setVoucherError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Demo data
  const availableVouchers = [
    { id: "v1", code: "NEWUSER10", name: "Giảm 10% cho đơn đầu", discountType: "Percent", discountValue: 10, minOrder: 0, endDate: "2025-12-31" },
    { id: "v2", code: "SAVE50K", name: "Giảm 50.000đ cho đơn từ 300.000đ", discountType: "Amount", discountValue: 50000, minOrder: 300000, endDate: "2025-09-30" },
  ];

  const handlePickVoucher = (voucher) => {
    setVoucherCode(voucher.code);
    setShowModal(false);
    onApply && onApply(voucher);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-base font-semibold text-[#5e3a1e]">
          <FaTicketAlt className="text-[#b28940] text-lg" />
          <span>Mã giảm giá</span>
        </div>

        <div className="flex gap-3 w-[420px]">
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Nhập mã voucher..."
            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b28940]"
          />

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#5e3a1e] to-[#8b5e34] text-white rounded-xl font-medium text-sm shadow hover:opacity-90 transition"
          >
            Chọn mã
          </button>
        </div>
      </div>

      {/* Error message */}
      {voucherError && (
        <p className="text-sm text-red-500 text-right">{voucherError}</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal card */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b flex items-center justify-between bg-gradient-to-r from-[#fff7ea] to-white">
              <h3 className="text-lg font-bold text-[#5e3a1e]">Mã giảm giá của bạn</h3>
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded-md hover:bg-gray-100 text-sm"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto p-5 space-y-4">
              {availableVouchers.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white"
                >
                  {/* Voucher info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#b28940] to-[#e6c37f] text-white rounded-lg shadow">
                      <FaTicketAlt />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#5e3a1e] truncate">
                        {v.code} — {v.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        HSD: {v.endDate}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handlePickVoucher(v)}
                    className="px-4 py-2 bg-gradient-to-r from-[#5e3a1e] to-[#8b5e34] text-white rounded-lg font-medium text-sm hover:opacity-90 transition shadow"
                  >
                    Dùng
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default VoucherPicker;
