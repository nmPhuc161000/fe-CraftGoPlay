import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../../contexts/CartContext";
import { FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import { createOrderFromCart, getVnpayUrl } from "../../services/apis/orderApi";

const Checkout = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    // const { user } = useContext(AuthContext);
    const { user: realUser } = useContext(AuthContext);
    const user = { ...realUser, coins: 5000 };

    const navigate = useNavigate();
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/cart");
        }
        window.scrollTo(0, 0);
    }, [cartItems]);

    const getTotal = () =>
        cartItems.reduce((total, item) => total + (item?.totalPrice ?? 0), 0);

    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [voucherError, setVoucherError] = useState("");
    const [useCoins, setUseCoins] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("vnpay");

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

    const groupedCart = cartItems.reduce((groups, item) => {
        const artisan = item.user?.userName || "Không rõ nghệ nhân";
        if (!groups[artisan]) groups[artisan] = [];
        groups[artisan].push(item);
        return groups;
    }, {});

    const handlePlaceOrder = async () => {
        const formData = new FormData();
        formData.append("UserId", user?.id);
        formData.append("PaymentMethod", paymentMethod === "vnpay" ? "Online" : "Cash");

        cartItems.forEach((item) => {
            formData.append("SelectedCartItemIds", item.id);
        });

        const result = await createOrderFromCart(formData);

        if (result.success) {
            const orderObj = result.data?.data?.[0];
            const orderId = typeof orderObj === "object" ? orderObj.id : orderObj;

            if (paymentMethod === "vnpay") {
                const vnpayResult = await getVnpayUrl(orderId);
                console.log("vnpayResult", vnpayResult);
                if (vnpayResult.success && vnpayResult.data) {
                    window.location.href = vnpayResult.data.data; // ✅ Redirect to VNPay
                } else {
                    alert("Không thể tạo URL thanh toán VNPay");
                }
            } else {
                clearCart();
                navigate("/payment-success");
            }
        } else {
            alert("Đặt hàng thất bại: " + result.error);
        }
    };

    return (
        <MainLayout>
            <main className="bg-[#f7f7f7] py-15 text-[#5e3a1e] text-[15px]">
                <h1 className="text-4xl font-bold mb-10 text-center">Thanh Toán</h1>

                <div className="w-[80%] max-w-[1400px] mx-auto space-y-6">

                    {/* dia chi */}
                    <section className="bg-white rounded shadow-sm border border-gray-200 p-4 flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#5e3a1e]" /> Địa chỉ nhận hàng
                            </h2>
                            <p>Nguyễn Văn A | 0901234567</p>
                            <p>example@gmail.com</p>
                            <p>123 Đường ABC, Quận XYZ, TP.HCM</p>
                        </div>
                        <button className="text-[15px] text-[#b28940] hover:underline">Thay đổi</button>
                    </section>

                    {/* sp */}
                    <section className="bg-white rounded shadow-sm border border-gray-200 p-4">
                        <div className="grid grid-cols-12 font-semibold text-[15px] text-gray-600 pb-2 mb-3">
                            <div className="col-span-6">Sản phẩm</div>
                            <div className="col-span-2 text-center">Đơn giá</div>
                            <div className="col-span-2 text-center">Số lượng</div>
                            <div className="col-span-2 text-right">Thành tiền</div>
                        </div>

                        {Object.entries(groupedCart).map(([artisanName, items], index) => (
                            <div key={index} className="mb-6">
                                <div className="text-[15px] font-semibold mb-3 pb-2">
                                    🛍 Nghệ nhân: {artisanName}
                                </div>

                                {items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-12 items-center py-3 text-[15px]"
                                    >
                                        <div className="col-span-6 flex items-center gap-4">
                                            <img
                                                src={item.productImages?.[0]?.imageUrl}
                                                alt={item.productName}
                                                className="w-14 h-14 object-cover rounded border"
                                            />
                                            <p className="font-medium max-w-[200px] truncate">
                                                {item.productName}
                                            </p>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            {(item.unitPrice ?? 0).toLocaleString("vi-VN")}₫
                                        </div>
                                        <div className="col-span-2 text-center">{item.quantity}</div>
                                        <div className="col-span-2 text-right font-medium">
                                            {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}₫
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-3 flex flex-col sm:flex-row sm:justify-between gap-3 text-[15px] font-medium">
                                    <div className="text-gray-700">
                                        Phí vận chuyển: <span className="text-red-500">15.000₫</span>
                                    </div>
                                    <div className="text-right sm:text-left">
                                        Tổng số tiền:{" "}
                                        <span className="text-red-600 font-semibold">
                                            {items
                                                .reduce(
                                                    (total, item) =>
                                                        total + item.unitPrice * item.quantity,
                                                    0
                                                )
                                                .toLocaleString("vi-VN")}
                                            ₫
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* voucher xu */}
                    <section className="bg-white rounded shadow-sm border border-gray-200 p-4 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-[15px] font-semibold text-[#5e3a1e]">
                                <FaTicketAlt className="text-[#b28940] text-[18px]" />
                                Mã giảm giá
                            </div>

                            <div className="flex gap-2 w-[300px]">
                                <input
                                    type="text"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    placeholder="Nhập mã"
                                    className="w-48 border border-gray-300 rounded px-3 py-2 text-[15px]"
                                />
                                <button
                                    onClick={handleApplyVoucher}
                                    className="px-4 py-2 bg-[#5e3a1e] hover:bg-[#4a2f15] text-white rounded text-[15px]"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>

                        {voucherError && (
                            <p className="text-[14px] text-red-500 mt-1 text-right">{voucherError}</p>
                        )}


                        <div className="flex items-center justify-between">
                            <label className="text-[15px] font-medium">
                                Dùng {user?.coins ?? 0} xu
                                <br />
                                <span className="text-xs text-gray-500">
                                    Giảm tối đa {(coinDiscount || 0).toLocaleString("vi-VN")}₫
                                </span>
                            </label>
                            <label className="relative inline-flex items-center cursor-pointer w-11 h-6">
                                <input
                                    type="checkbox"
                                    checked={useCoins}
                                    onChange={(e) => setUseCoins(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#5e3a1e] transition-colors duration-300"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                            </label>
                        </div>
                    </section>

                    {/* phuong thuc thanh toan */}
                    <section className="bg-white rounded shadow-sm border border-gray-200 p-4 text-[15px] space-y-6">
                        <div>
                            <h2 className="font-semibold text-[16px] mb-2">Phương thức thanh toán</h2>
                            <div className="flex flex-wrap gap-2">
                                {["vnpay", "cod"].map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`px-4 py-2 border rounded ${paymentMethod === method
                                            ? "border-[#d0011b] text-[#d0011b] font-semibold"
                                            : "border-gray-300 hover:border-[#d0011b]"
                                            }`}
                                    >
                                        {method === "vnpay"
                                            ? "Thanh toán VNPay"
                                            : "Thanh toán khi nhận hàng"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#fffdfa] p-4 rounded border border-gray-100 space-y-2 text-[15px]">
                            <div className="flex justify-between">
                                <span>Tổng tiền hàng</span>
                                <span>{getTotal().toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span>15.000₫</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Voucher giảm giá</span>
                                <span>-{discount.toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Giảm từ xu</span>
                                <span>-{coinDiscount.toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-[18px] font-semibold border-t border-gray-200 pt-3 text-[#d0011b]">
                                <span>Tổng thanh toán</span>
                                <span>
                                    {(getTotal() - discount - coinDiscount).toLocaleString("vi-VN")}₫
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            Nhấn <strong>"Đặt hàng"</strong> đồng nghĩa với việc bạn đồng ý tuân theo{" "}
                            <a href="#" className="text-[#5e3a1e] underline">
                                Điều khoản CraftGoPlay
                            </a>
                        </p>

                        <button
                            onClick={handlePlaceOrder}
                            className="w-full py-3 bg-[#5e3a1e] hover:bg-[#4a2f15] text-white rounded font-semibold transition">
                            Đặt hàng
                        </button>
                    </section>
                </div>
            </main>
        </MainLayout>
    );
};

export default Checkout;
