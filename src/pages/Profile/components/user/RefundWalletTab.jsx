import { useEffect, useState, useContext } from "react";
import walletService from "../../../../services/apis/walletApi";
import { AuthContext } from "../../../../contexts/AuthContext";

const RefundWalletTab = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                setIsLoading(true);
                const response = await walletService.getWalletByUserId(user?.id);
                console.log("Wallet API response:", response);

                const walletResponse = response?.data;

                if (walletResponse?.error === 0 && walletResponse?.data) {
                    setBalance(walletResponse.data.balance || 0);
                    setTransactions(walletResponse.data.walletTransactions || []);
                } else {
                    console.error("Lỗi khi lấy ví:", walletResponse?.message || "Không rõ lỗi");
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
            minute: "2-digit"
        });
    };
    
    const totalRefund = transactions
        .filter((tx) => tx.type === "Refund")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const refundTransactions = transactions.filter(tx => tx.type === "Refund");

    if (isLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="h-24 bg-gray-200 rounded mb-6"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Ví hoàn tiền
            </h2>

            {/* Thẻ số dư */}
            <div className="mb-8 rounded-xl p-6 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <p className="text-lg font-medium">Số dư hiện tại</p>
                <p className="text-3xl font-bold mt-2">
                    {formatCurrency(balance)}
                </p>
                <div className="mt-4 pt-4 border-t border-blue-400 border-opacity-50">
                    <p className="text-sm font-medium">Tổng tiền đã hoàn</p>
                    <p className="text-xl font-semibold">{formatCurrency(totalRefund)}</p>
                </div>
            </div>

            {/* Lịch sử giao dịch */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Lịch sử hoàn tiền
                    </h3>
                </div>
                
                <div className="p-6">
                    {refundTransactions.length === 0 ? (
                        <div className="text-center py-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500">Chưa có giao dịch hoàn tiền nào</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {refundTransactions.map((tx) => {
                                const orderId = tx.description?.match(/[0-9a-fA-F-]{36}/)?.[0]?.split("-")[0]?.toUpperCase();
                                return (
                                    <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start">
                                            <div className="bg-green-100 p-3 rounded-full mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    Hoàn tiền đơn hàng #{orderId || "N/A"}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {formatDate(tx.dateTransaction)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">+{formatCurrency(tx.amount)}</p>
                                            <p className="text-xs text-gray-500 mt-1">Thành công</p>
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