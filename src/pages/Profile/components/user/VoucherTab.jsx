// components/profile/VoucherTab.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const VoucherTab = () => {
  const [vouchers, setVouchers] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // TODO: thay bằng API thật: getMyVouchers(), getMyPoints()
    setPoints(1240);
    const fakeVouchers = [
      {
        id: 1,
        code: "GIAM10",
        status: "Còn hạn",
        description: "Giảm 10% cho đơn hàng từ 200.000đ",
        expiry: "2025-12-31",
      },
      {
        id: 2,
        code: "FREESHIP",
        status: "Hết hạn",
        description: "Áp dụng cho mọi đơn hàng",
        expiry: "2025-08-01",
      },
    ];
    setVouchers(fakeVouchers);
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Kho Voucher của bạn</h2>
          <p className="text-sm text-gray-500">
            Xem và sử dụng các voucher đã sở hữu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-100">
            <div className="text-xs text-gray-500">Xu hiện có</div>
            <div className="text-lg font-semibold">{points} xu</div>
          </div>
          <Link
            to="/profile-user/voucher-exchange"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5e3a1e] text-white rounded hover:bg-[#7a4b28] text-sm"
          >
            Đổi voucher
            <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
              <path fill="currentColor" d="M5 12h12l-4.5 4.5l1.42 1.42L21.84 12l-7.92-5.92L12.5 7.5L17 12H5z" />
            </svg>
          </Link>
        </div>
      </div>

      {vouchers.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
          Hiện chưa có voucher nào.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="border rounded-2xl p-4 shadow-sm bg-white hover:shadow transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold tracking-wide">🎟 {voucher.code}</p>
                <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700">
                  {voucher.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{voucher.description}</p>
              <p className="text-xs text-rose-600 mt-2">
                HSD: {voucher.expiry}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoucherTab;
