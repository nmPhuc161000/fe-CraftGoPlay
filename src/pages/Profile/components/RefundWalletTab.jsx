import { useEffect, useState, useContext } from "react";
import walletService from "../../../services/apis/walletApi";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const RefundWalletTab = () => {
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setIsLoading(true);
        let response;

        if (role === "User") {
          response = await walletService.getWalletByUserId(user?.id);
        } else if (role === "Artisan") {
          response = await walletService.getWalletByArtisanId(user?.id);
        }
        const walletResponse = response?.data;

        if (walletResponse?.error === 0 && walletResponse?.data) {
          setAvailableBalance(walletResponse.data.availableBalance || 0);
          setPendingBalance(walletResponse.data.pendingBalance || 0);
          setTransactions(walletResponse.data.walletTransactions || []);
        } else {
          console.error(
            "Lỗi khi lấy ví:",
            walletResponse?.message || "Không rõ lỗi"
          );
        }
      } catch (error) {
        console.error("Lỗi khi gọi API ví:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchWallet();
    }
  }, [user]);

  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleWithdrawClick = () => {
    navigate("/profile-user/withdrawal");
  };

  // Map transaction status to icon, color, and label
  const getTransactionStatusProps = (status, amount) => {
    switch (status) {
      case "Pending":
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-600",
          label: "Xử lý chờ thanh toán",
          amountPrefix: "",
        };
      case "Release":
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          bgColor: "bg-green-100",
          textColor: "text-green-600",
          label: "Đã thanh toán",
          amountPrefix: "+",
        };
      case "Purchase":
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ),
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          label: "Thanh toán",
          amountPrefix: "-",
        };
      case "Refund":
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          ),
          bgColor: "bg-green-100",
          textColor: "text-green-600",
          label: "Hoàn tiền",
          amountPrefix: "+",
        };
      case "Withdrawal":
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          ),
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          label: "Rút tiền",
          amountPrefix: "-",
        };
      default:
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          label: "Không xác định",
          amountPrefix: "",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-24 bg-gray-200 rounded mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-[#8d6349]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Số dư tài khoản
        </h2>

        {/* Nút rút tiền */}
        <button
          onClick={handleWithdrawClick}
          className="flex items-center px-4 py-2 bg-[#8d6349] text-white rounded-lg hover:bg-[#7a5540] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Rút tiền
        </button>
      </div>

      {/* Thẻ số dư */}
      <div className="mb-8 rounded-xl p-6 shadow-lg bg-gradient-to-r from-[#be9e7f] to-[#8d6349] text-white">
        <p className="text-lg font-medium">Số dư hiện tại</p>
        <p className="text-3xl font-bold mt-2">
          {formatCurrency(availableBalance)}
        </p>
        {role === "Artisan" && (
          <div className="mt-4 pt-4 border-t border-white-400 border-opacity-50">
            <p className="text-sm font-medium">Số tiền chờ hoàn</p>
            <p className="text-xl font-semibold">
              {formatCurrency(pendingBalance)}
            </p>
          </div>
        )}
      </div>

      {/* Lịch sử giao dịch */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Lịch sử giao dịch
          </h3>
        </div>

        <div className="p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-500">Chưa có giao dịch nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => {
                const { icon, bgColor, textColor, label, amountPrefix } =
                  getTransactionStatusProps(tx.type, tx.amount);
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className={`${bgColor} p-3 rounded-full mr-4`}>
                        {icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {tx.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(tx.dateTransaction)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${textColor}`}>
                        {amountPrefix}
                        {formatCurrency(Math.abs(tx.amount))}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefundWalletTab;
