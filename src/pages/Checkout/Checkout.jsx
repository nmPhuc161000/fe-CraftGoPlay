import React, { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";


const Checkout = () => {
    const { cartItems } = useContext(CartContext);

    const getTotal = () =>
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [voucherError, setVoucherError] = useState("");

    const handleApplyVoucher = () => {
        if (voucherCode === "GIAM10") {
            const discountValue = getTotal() * 0.1;
            setDiscount(discountValue);
            setVoucherError("");
        } else {
            setDiscount(0);
            setVoucherError("Mã không hợp lệ hoặc đã hết hạn");
        }
    };

    return (
        <>
            <header className="bg-white shadow-sm border-b border-gray-200 px-50 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-[#5e3a1e]">
                    CraftGoPlay
                </Link>
                <Link to="/cart" title="Quay lại giỏ hàng">
                    <FaShoppingBag className="text-2xl text-[#5e3a1e] hover:text-[#b28940] transition" />
                </Link>
            </header>

            <div className="flex text-[#5e3a1e] min-h-screen w-full bg-white">
                {/* BÊN TRÁI: Thông tin giao hàng */}
                <div className="w-1/2 bg-white flex items-start justify-end px-0 py-12">
                    <div className="w-full max-w-[600px] pr-16 pl-12">
                        <h2 className="text-xl font-semibold mb-4">Liên hệ</h2>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full border border-gray-300 rounded px-4 py-2 mb-6"
                        />

                        <h2 className="text-xl font-semibold mb-2">Giao hàng</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <input placeholder="Tên" className="border border-gray-300 rounded px-4 py-2" />
                            <input placeholder="Họ" className="border border-gray-300 rounded px-4 py-2" />
                            <input placeholder="Địa chỉ" className="md:col-span-2 border border-gray-300 rounded px-4 py-2" />
                            <input placeholder="Thành phố" className="border border-gray-300 rounded px-4 py-2" />
                            <input placeholder="Mã bưu chính" className="border border-gray-300 rounded px-4 py-2" />
                            <input placeholder="Số điện thoại" className="md:col-span-2 border border-gray-300 rounded px-4 py-2" />
                        </div>

                        <h2 className="text-xl font-semibold mb-2">Phương thức thanh toán</h2>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="payment" defaultChecked />
                                <span>Thanh toán qua thẻ / QR (OnePay)</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="payment" />
                                <span>Thanh toán khi nhận hàng (COD)</span>
                            </label>
                        </div>
                    </div>
                </div>


                {/* ĐƯỜNG GẠCH DỌC */}
                <div className="w-px bg-gray-300"></div>

                {/* BÊN PHẢI: Chi tiết đơn hàng */}
                <div className="w-1/2 bg-[#f9f9f9] flex items-start justify-start px-0 py-12">
                    <div className="w-full max-w-[600px] pl-16 pr-12">
                        <h2 className="text-lg font-semibold mb-4">Đơn hàng</h2>

                        <div className="space-y-4 max-h-64 overflow-y-auto pr-1 mb-6">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-14 h-14 object-cover rounded-md border"
                                        />
                                        <div>
                                            <p className="text-base font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} × {item.price.toLocaleString("vi-VN")}₫
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-right font-medium">
                                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                                placeholder="Mã giảm giá"
                                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                            />
                            <button
                                onClick={handleApplyVoucher}
                                className="px-4 py-2 bg-[#5e3a1e] hover:bg-[#4a2f15] text-white rounded text-sm transition"
                            >
                                Áp dụng
                            </button>
                        </div>
                        {voucherError && <p className="text-sm text-red-500 mb-2">{voucherError}</p>}

                        <div className="space-y-1 text-base mb-6">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tạm tính</span>
                                <span>{getTotal().toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Giảm giá</span>
                                <span>− {(discount || 0).toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl border-t pt-3">
                                <span>Tổng</span>
                                <span>{(getTotal() - discount).toLocaleString("vi-VN")}₫</span>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-[#5e3a1e] hover:bg-[#4a2f15] text-white rounded flex justify-center items-center gap-2 transition">
                            <FaLock /> Thanh toán ngay
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
