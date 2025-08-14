import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pointService from "../../../../services/apis/pointApi";
import { AuthContext } from "../../../../contexts/AuthContext";

const PointTab = () => {
  const [coinInfo, setCoinInfo] = useState({ current: 0, history: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Helper function to map status to display text and icon
  const getTransactionDetails = (status) => {
    const transactionTypes = {
      Earned: { type: "Nhận xu", icon: "💰", isPositive: true },
      Swap: { type: "Đổi xu", icon: "🔄", isPositive: false },
      Redeemed: { type: "Dùng xu", icon: "🎁", isPositive: false },
      Expired: { type: "Xu hết hạn", icon: "⌛", isPositive: false },
      Refunded: { type: "Hoàn xu", icon: "↩️", isPositive: true },
      Bonus: { type: "Xu thưởng", icon: "🎉", isPositive: true }
    };

    return transactionTypes[status] || { type: "Giao dịch", icon: "💳", isPositive: true };
  };

  useEffect(() => {
    const fetchPointData = async () => {
      try {
        setLoading(true);
        const response = await pointService.getPointByUserId(user.id);

        if (response.data) {
          setCoinInfo({
            current: response.data.data.amount,
            history: response.data.data.pointTransactions.map((transaction) => {
              const details = getTransactionDetails(transaction.status);
              return {
                id: transaction.id,
                type: details.type,
                amount: details.isPositive ? transaction.amount : -transaction.amount,
                reason: transaction.description,
                date: new Date(transaction.createdAt).toISOString().split("T")[0],
                icon: details.icon
              };
            }),
          });
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu điểm");
        console.error("Error fetching point data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPointData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Kho Xu Của Bạn</h2>
        <Link
          to="/profile-user/daily-checkin"
          className="flex items-center px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-full hover:shadow-md transition-all"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Điểm danh nhận xu
        </Link>
      </div>

      {/* Current Points Card */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-6 mb-8 shadow-sm border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-1">Số dư hiện tại</p>
            <p className="text-3xl font-bold text-amber-600 flex items-center">
              <span className="mr-2">🪙</span>
              {coinInfo.current.toLocaleString()} xu
            </p>
          </div>
          <div className="bg-white rounded-full p-3 shadow-md">
            <svg
              className="w-8 h-8 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Lịch sử giao dịch
          </h3>
        </div>

        {coinInfo.history.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {coinInfo.history.map((item) => (
              <li
                key={item.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-amber-50 rounded-full p-2 mr-4">
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.type}
                      </p>
                      <p
                        className={`text-sm font-bold ml-2 ${
                          item.amount >= 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {item.amount >= 0 ? "+" : ""}
                        {item.amount.toLocaleString()} xu
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.reason}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Ngày: {item.date}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Additional Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/rewards"
          className="px-4 py-2 bg-white border border-orange-300 text-orange-500 rounded-full text-sm font-medium hover:bg-orange-50 transition"
        >
          Đổi ưu đãi
        </Link>
        <Link
          to="/how-to-earn"
          className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition"
        >
          Cách kiếm thêm xu
        </Link>
      </div>
    </div>
  );
};

export default PointTab;