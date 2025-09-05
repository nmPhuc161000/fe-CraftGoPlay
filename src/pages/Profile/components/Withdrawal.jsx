import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Thêm import useNavigate
import walletService from "../../../services/apis/walletApi";
import { useNotification } from "../../../contexts/NotificationContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { performApiRequest } from "../../../utils/apiUtils";

export default function Withdrawal() {
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate(); // Sử dụng hook useNavigate
  const [formData, setFormData] = useState({
    amount: "",
    bankCode: "",
    bankAccount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  // Hàm xử lý quay lại trang trước đó
  const handleGoBack = () => {
    navigate(-1); // -1 có nghĩa là quay lại trang trước đó trong lịch sử
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!formData.amount || !formData.bankCode || !formData.bankAccount) {
      setMessage("Vui lòng điền đầy đủ thông tin");
      setMessageType("error");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setMessage("Số tiền phải lớn hơn 0");
      setMessageType("error");
      return;
    }

    if (amount < 10000) {
      setMessage("Số tiền rút tối thiểu là 10,000 VND");
      setMessageType("error");
      return;
    }

    // Basic bank account validation (example: ensure it's numeric and at least 8 digits)
    if (!/^\d{8,}$/.test(formData.bankAccount)) {
      setMessage("Số tài khoản ngân hàng phải là số và có ít nhất 8 chữ số");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      // Create FormData object
      const withdrawalData = new FormData();
      withdrawalData.append("UserId", user.id);
      withdrawalData.append("Amount", amount);
      withdrawalData.append("BankCode", formData.bankCode);
      withdrawalData.append("BankAccount", formData.bankAccount);

      // Gọi API rút tiền đầu tiên
      const result = await walletService.withdrawal(withdrawalData);

      console.log("Kết quả từ API withdrawal:", result.data.withdrawUrl.data);

      if (result?.data?.withdrawUrl && result?.data?.withdrawUrl?.error === 0) {
        showNotification("Tạo yêu cầu thành công, đang xử lý...", "success");

        // Gọi API thứ hai từ URL trong data
        const withdrawalReturn = await performApiRequest(
          result?.data?.withdrawUrl?.data,
          {
            method: "GET",
          }
        );

        console.log(withdrawalReturn);

        showNotification(
          "Rút tiền thành công! Giao dịch đã được xử lý.",
          "success"
        );

        // Reset form sau khi thành công
        setFormData({
          amount: "",
          bankCode: "",
          bankAccount: "",
        });
      } else {
        showNotification(
          result?.data?.withdrawUrl?.message ||
            "Có lỗi xảy ra, vui lòng thử lại",
          "error"
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Lỗi khi rút tiền:", error);
      showNotification("Có lỗi xảy ra, vui lòng thử lại", "error");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const banks = [
    { code: "MBBank", name: "Ngân hàng Quân đội (MBBank)" },
    {
      code: "Vietcombank",
      name: "Ngân hàng Ngoại thương Việt Nam (Vietcombank)",
    },
    { code: "BIDV", name: "Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)" },
    { code: "Agribank", name: "Ngân hàng Nông nghiệp (Agribank)" },
    { code: "VietinBank", name: "Ngân hàng Công thương (VietinBank)" },
    { code: "TPBank", name: "Ngân hàng Tiên Phong (TPBank)" },
    { code: "Techcombank", name: "Ngân hàng Kỹ thương (Techcombank)" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        {/* Nút quay lại */}
        <button
          onClick={handleGoBack}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Quay lại
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Rút Tiền
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Số tiền muốn rút (VND)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Nhập số tiền"
              min="0"
              step="1000"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="bankCode"
              className="block text-sm font-medium text-gray-700"
            >
              Ngân hàng
            </label>
            <select
              id="bankCode"
              name="bankCode"
              value={formData.bankCode}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="">Chọn ngân hàng</option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="bankAccount"
              className="block text-sm font-medium text-gray-700"
            >
              Số tài khoản ngân hàng
            </label>
            <input
              type="text"
              id="bankAccount"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleInputChange}
              placeholder="Nhập số tài khoản"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </div>
            ) : (
              "Rút tiền"
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>User ID:</strong> {user.id}
          </p>
        </div>
      </div>
    </div>
  );
}
