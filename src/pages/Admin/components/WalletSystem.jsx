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
            <p className="text-gray-600">Số dư:</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrencyUtils(wallet.availableBalance)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Lịch sử giao dịch</h2>

        {wallet.walletTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wallet.walletTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTransactionId(transaction.id)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.amount >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrencyUtils(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.type === "Purchase"
                        ? "Mua hàng"
                        : transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.dateTransaction)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.description || "Không có mô tả"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Không tìm thấy lịch sử giao dịch nào.
          </p>
        )}
      </div>
    </div>
  );
}
