import React, { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";


const Checkout = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    // const { user } = useContext(AuthContext);
    const { user: realUser } = useContext(AuthContext);
    const user = { ...realUser, coins: 5000 };

    const navigate = useNavigate();

    const getTotal = () =>
        cartItems.reduce((total, item) => total + (item?.totalPrice ?? 0), 0);

    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [voucherError, setVoucherError] = useState("");
    const [useCoins, setUseCoins] = useState(false);

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
    const coinDiscount = useCoins
        ? Math.min(user?.coins ?? 0, Math.floor(getTotal() / 100)) * 100
        : 0;

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
                                            src={item.productImages?.[0]?.imageUrl}
                                            alt={item.productName}
                                            className="w-14 h-14 object-cover rounded-md border"
                                        />
                                        <div>
                                            <p className="text-base font-medium">{item.productName}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} × {(item?.unitPrice ?? 0).toLocaleString("vi-VN")}₫
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-right font-medium">
                                        {((item?.unitPrice ?? 0) * item.quantity).toLocaleString("vi-VN")}₫
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

                        <div className="flex items-center justify-between mb-4">
                            <label htmlFor="use-coins" className="text-sm text-[#5e3a1e] font-medium">
                                Dùng {user?.coins ?? 0} xu <br />
                                <span className="text-xs text-gray-500">
                                    Giảm tối đa {(coinDiscount || 0).toLocaleString("vi-VN")}₫
                                </span>
                            </label>

                            <label className="relative inline-flex items-center cursor-pointer w-11 h-6">
                                <input
                                    type="checkbox"
                                    id="use-coins"
                                    checked={useCoins}
                                    onChange={(e) => setUseCoins(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#5e3a1e] transition-colors duration-300"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                            </label>
                        </div>

                        <div className="space-y-1 text-base mb-6">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tạm tính</span>
                                <span>{getTotal().toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Giảm giá</span>
                                <span>− {(discount || 0).toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-sm text-orange-600">
                                <span>Giảm từ xu</span>
                                <span>− {coinDiscount.toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl border-t pt-3">
                                <span>Tổng</span>
                                <span>{(getTotal() - discount - coinDiscount).toLocaleString("vi-VN")}₫</span>
                            </div>
                        </div>

                        <button
                            onClick={async () => {
                                await clearCart();
                                navigate("/payment-success");
                            }}
                            className="w-full py-3 bg-[#5e3a1e] hover:bg-[#4a2f15] text-white rounded flex justify-center items-center gap-2 transition">
                            <FaLock /> Thanh toán ngay
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
