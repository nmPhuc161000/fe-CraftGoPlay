// components/profile/CoinTab.jsx
import { useEffect, useState } from "react";

const CoinTab = () => {
  const [coinInfo, setCoinInfo] = useState({ current: 0, history: [] });

  useEffect(() => {
    const fakeCoinData = {
      current: 1500,
      history: [
        {
          id: 1,
          type: "Nhận xu",
          amount: 1000,
          reason: "Hoàn tất đơn hàng #1234",
          date: "2025-07-01",
        },
        {
          id: 2,
          type: "Tiêu xu",
          amount: -500,
          reason: "Đổi ưu đãi 'Nâng cấp gói dịch vụ'",
          date: "2025-07-05",
        },
      ],
    };

    setCoinInfo(fakeCoinData);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Kho xu của bạn</h2>
      <div className="mb-6">
        <p className="text-lg">
          🪙 <strong>Số xu hiện tại:</strong>{" "}
          <span className="text-yellow-600">{coinInfo.current} xu</span>
        </p>
      </div>

      <h3 className="text-md font-semibold mb-2">Lịch sử giao dịch</h3>
      {coinInfo.history.length === 0 ? (
        <p>Chưa có giao dịch nào.</p>
      ) : (
        <div className="space-y-4">
          {coinInfo.history.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <p className="font-semibold">{item.type}</p>
              <p className="text-sm text-gray-600">{item.reason}</p>
              <p
                className={`text-sm font-bold ${
                  item.amount >= 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {item.amount >= 0 ? "+" : ""}
                {item.amount} xu
              </p>
              <p className="text-xs text-gray-500">Ngày: {item.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoinTab;
