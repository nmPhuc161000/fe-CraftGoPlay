// components/profile/VoucherTab.jsx
import { useEffect, useState } from "react";

const VoucherTab = () => {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const fakeVouchers = [
      {
        id: 1,
        code: "GIAM10",
        discount: "10%",
        description: "Giảm 10% cho đơn hàng từ 200.000đ",
        expiry: "2025-12-31",
      },
      {
        id: 2,
        code: "FREESHIP",
        discount: "Miễn phí vận chuyển",
        description: "Áp dụng cho mọi đơn hàng",
        expiry: "2025-08-01",
      },
    ];

    setVouchers(fakeVouchers);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Kho Voucher của bạn</h2>
      {vouchers.length === 0 ? (
        <p>Hiện chưa có voucher nào.</p>
      ) : (
        <div className="space-y-4">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <p className="text-lg font-bold text-blue-700">
                🎟️ Mã: {voucher.code}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {voucher.description}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Ưu đãi: {voucher.discount}
              </p>
              <p className="text-sm text-red-500 mt-1">
                Hạn sử dụng: {voucher.expiry}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoucherTab;
