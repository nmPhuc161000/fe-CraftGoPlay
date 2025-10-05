import React, { useState, useEffect } from "react";
import walletService from "../../../services/apis/walletApi";
import { formatCurrencyUtils } from "../../../utils/formatCurrencyUtils";
import { formatTransactionId, formatDate } from "../../../utils/formatUtils";

export default function WalletSystem() {
  const [wallet, setWallet] = useState({
    id: "",
    user_Id: "",
    type: "",
    balance: 0,
    walletTransactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const response = await walletService.getWalletSystem();

        if (response.data.error === 0) {
          setWallet(response.data.data);
        } else {
          setError(response.message || "Failed to load wallet data");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  // Hàm chuyển đổi transaction type thành tiếng Việt
  const getTransactionTypeText = (type) => {
    switch (type) {
      case "Purchase":
        return "Mua hàng";
      case "Refund":
        return "Hoàn tiền";
      case "Withdrawal":
        return "Rút tiền";
      case "ReceiveFromOrder":
        return "Chi trả cho nghệ nhân";
      case "ReceiveShippingFee":
        return "Chi trả phí vận chuyển";
      case "SystemAdjustment":
        return "Điều chỉnh hệ thống";
      case "Pending":
        return "Đang chờ xử lý";
      case "Release":
        return "Đã xử lý";
      default:
        return type;
    }
  };

  // Hàm xác định loại giao dịch (cộng tiền hay trừ tiền)
  const getTransactionDirection = (type) => {
    // Các loại giao dịch TRỪ TIỀN khỏi ví hệ thống
    const debitTypes = [
      "Withdrawal",
      "ReceiveFromOrder",
      "ReceiveShippingFee",
      "Refund",
    ];

    // Các loại giao dịch CỘNG TIỀN vào ví hệ thống
    const creditTypes = ["Purchase", "SystemAdjustment", "Release"];

    if (debitTypes.includes(type)) {
      return "debit"; // Trừ tiền
    } else if (creditTypes.includes(type)) {
      return "credit"; // Cộng tiền
    } else if (type === "Pending") {
      return "pending"; // Đang chờ xử lý
    }

    return "unknown";
  };

  // Hàm xác định màu sắc cho số tiền dựa trên loại giao dịch
  const getAmountColor = (transaction) => {
    const { type } = transaction;
    const direction = getTransactionDirection(type);

    if (direction === "pending") {
      return "text-orange-600";
    } else if (direction === "credit") {
      return "text-green-600"; // Cộng tiền - màu xanh
    } else if (direction === "debit") {
      return "text-red-600"; // Trừ tiền - màu đỏ
    }

    return "text-gray-600";
  };

  // Hàm format số tiền hiển thị
  const formatDisplayAmount = (transaction) => {
    const { type, amount } = transaction;
    const absoluteAmount = Math.abs(amount);
    const formattedAmount = formatCurrencyUtils(absoluteAmount);
    const direction = getTransactionDirection(type);

    if (direction === "pending") {
      return formattedAmount;
    } else if (direction === "credit") {
      return `+${formattedAmount}`; // Cộng tiền - thêm dấu +
    } else if (direction === "debit") {
      return `-${formattedAmount}`; // Trừ tiền - thêm dấu -
    }

    return formattedAmount;
  };

  // Hàm xác định icon cho loại giao dịch
  const getTransactionIcon = (type) => {
    const direction = getTransactionDirection(type);

    // Icon với màu sắc tương ứng
    if (direction === "credit") {
      switch (type) {
        case "Purchase":
          return "🛒";
        case "SystemAdjustment":
          return "⚙️";
        default:
          return "💰";
      }
    } else if (direction === "debit") {
      switch (type) {
        case "Refund":
          return "↩️";
        case "Withdrawal":
          return "💳";
        case "ReceiveFromOrder":
          return "👨‍🎨";
        case "ReceiveShippingFee":
          return "🚚";
        case "Release":
          return "🔓";
        default:
          return "💸";
      }
    } else if (type === "Pending") {
      return "⏳";
    }

    return "💰";
  };

  // Hàm xác định background color cho icon dựa trên loại giao dịch
  const getIconBackgroundColor = (type) => {
    const direction = getTransactionDirection(type);

    if (direction === "pending") {
      return "bg-orange-100";
    } else if (direction === "credit") {
      return "bg-green-100"; // Cộng tiền - nền xanh nhạt
    } else if (direction === "debit") {
      return "bg-red-100"; // Trừ tiền - nền đỏ nhạt
    }

    return "bg-gray-100";
  };

  if (loading) {
    return <div className="text-center py-4">Đang tải thông tin ví...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ví Hệ Thống</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Thông Tin Ví Hệ Thống</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {wallet.type === "System" ? "Hệ thống" : wallet.type}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Số dư khả dụng:</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrencyUtils(wallet.availableBalance)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Số dư chờ xử lý:</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrencyUtils(wallet.pendingBalance)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Lịch sử giao dịch</h2>

        {wallet.walletTransactions.length > 0 ? (
          <div className="space-y-4">
            {wallet.walletTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${getIconBackgroundColor(
                        transaction.type
                      )}`}
                    >
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">
                          {getTransactionTypeText(transaction.type)}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {formatTransactionId(transaction.id)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {transaction.description || "Không có mô tả"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(transaction.dateTransaction)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${getAmountColor(
                        transaction
                      )}`}
                    >
                      {formatDisplayAmount(transaction)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">💸</div>
            <p className="text-gray-500 text-lg">
              Không tìm thấy lịch sử giao dịch nào.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
