import { useEffect, useState, useContext } from "react";
import walletService from "../../../../services/apis/walletApi";
import { AuthContext } from "../../../../contexts/AuthContext";

const RefundWalletTab = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
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
        return date.toLocaleDateString("vi-VN");
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">💰 Ví hoàn tiền</h2>

            <div className="mb-6 border rounded-lg p-4 shadow-sm bg-white">
                <p className="text-lg font-bold">Số dư hiện tại:</p>
                <p className="text-2xl font-semibold text-green-600 mt-2">
                    {formatCurrency(balance)}
                </p>
            </div>

            <h3 className="text-lg font-semibold mb-4">Lịch sử hoàn tiền</h3>

            {transactions.length === 0 ? (
                <p>Chưa có giao dịch hoàn tiền nào.</p>
            ) : (
                <div className="space-y-4">
                    {transactions.map((tx) => (
                        <div
                            key={tx.id}
                            className="border rounded-lg p-4 shadow-sm bg-white"
                        >
                            <p className="text-md font-bold">📦 {tx.description}</p>
                            <p className="text-sm text-green-600 mt-1">
                                Số tiền hoàn: +{formatCurrency(tx.amount)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Ngày: {formatDate(tx.dateTransaction)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RefundWalletTab;
