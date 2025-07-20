import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#5e3a1e] px-4">
            <FaCheckCircle className="text-green-500 text-7xl mb-6" />
            <h1 className="text-4xl font-bold mb-4">Thanh toán thành công!</h1>
            <p className="text-center max-w-md text-lg mb-6">
                Cảm ơn bạn đã mua hàng tại <span className="font-semibold">CraftGoPlay</span>.
                Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
            </p>

            <div className="flex gap-4">
                <Link
                    to="/"
                    className="bg-[#5e3a1e] text-white px-6 py-3 rounded hover:bg-[#4a2f15] transition"
                >
                    Quay về trang chủ
                </Link>
                <Link
                    to="/profile-user/orders"
                    className="border border-[#5e3a1e] text-[#5e3a1e] px-6 py-3 rounded hover:bg-[#f5f5f5] transition"
                >
                    Xem đơn hàng
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
