import React, { useState, useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import MainLayout from "../../components/layout/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

    const getTotal = () =>
        cartItems.reduce((total, item) => total + (item?.totalPrice ?? 0), 0);
    // voucher
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

    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12 text-[#5e3a1e]">
                <h1 className="text-4xl font-bold mb-10 text-center">Giỏ hàng của bạn</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center text-lg">
                        <p>Không có sản phẩm nào trong giỏ hàng.</p>
                        <Link to="/products" className="text-[#b28940] hover:text-[#9e7635] font-medium underline:none">
                            Tiếp tục mua sắm →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                        {/* danh sach */}
                        <div className="lg:col-span-2 max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
                                    {/* sp*/}
                                    <div className="flex items-center gap-6">
                                        <img src={item.productImages?.[0]?.imageUrl} alt={item.productName} className="w-24 h-24 object-cover rounded-md border" />
                                        <div>
                                            <h2 className="font-semibold text-lg">{item.productName}</h2>
                                            <p className="text-[#5e3a1e] text-base">{(item?.unitPrice ?? 0).toLocaleString("vi-VN")}₫</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center h-10 rounded-md border border-gray-300 overflow-hidden bg-white shadow-sm">
                                        <button
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            className="w-10 h-full flex items-center justify-center text-lg font-bold text-[#5e3a1e] hover:bg-[#f0ece3] transition"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value)))}
                                            min={1}
                                            className="w-12 hide-spinner text-center h-full border-x border-gray-200 text-[#5e3a1e] font-medium focus:outline-none"
                                        />
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-10 h-full flex items-center justify-center text-lg font-bold text-[#5e3a1e] hover:bg-[#f0ece3] transition"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-end gap-4 pr-2">
                                        <div className="text-base text-right">
                                            {(item?.totalPrice ?? 0).toLocaleString("vi-VN")}₫
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-[#5e3a1e] hover:text-red-600 text-lg transition-transform duration-200 ml-2"
                                            title="Xoá sản phẩm"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* chi tiet */}
                        <div className="sticky top-24 self-start">
                            <div className="p-6 border border-gray-200 rounded shadow-sm bg-white">
                                <div className="mb-4 space-y-2">
                                    <div className="flex justify-between text-base">
                                        <span>Tạm tính</span>
                                        <span>{getTotal().toLocaleString("vi-VN")} ₫</span>
                                    </div>

                                    <div className="flex justify-between text-base">
                                        <span>Giảm giá</span>
                                        <span className="text-green-600">
                                            − {discount?.toLocaleString("vi-VN") || "0"} ₫
                                        </span>
                                    </div>

                                    <div className="flex justify-between font-bold text-2xl border-t border-gray-500 pt-3">
                                        <span>Thành tiền</span>
                                        <div className="text-right">
                                            <p>{(getTotal() - (discount || 0)).toLocaleString("vi-VN")} ₫</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 mt-2">
                                        Thuế và phí vận chuyển sẽ được tính ở bước tiếp theo
                                    </p>
                                </div>

                                {/* giam gia */}
                                <div className="mb-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={voucherCode}
                                            onChange={(e) => setVoucherCode(e.target.value)}
                                            placeholder="Nhập mã giảm giá"
                                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                                        />
                                        <button
                                            onClick={handleApplyVoucher}
                                            className="px-4 py-2 bg-[#5e3a1e] hover:bg-[#4a2f15] text-white rounded text-sm transition"
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                    {voucherError && <p className="text-sm text-red-500 mt-1">{voucherError}</p>}
                                </div>

                                <button onClick={() => navigate("/checkout")}
                                    className="w-full py-3 bg-[#5e3a1e] hover:bg-[#4a2f15] text-white rounded flex justify-center items-center gap-2 transition">
                                    <FaLock /> Thanh toán
                                </button>
                            </div>

                            <Link
                                to="/products"
                                className="block text-center mt-4 text-[#5e3a1e] underline:none text-base font-medium transition"
                            >
                                ← Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>

                )}
            </div>
        </MainLayout>
    );
};

export default Cart;
