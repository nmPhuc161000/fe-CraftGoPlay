import React, { useState, useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import MainLayout from "../../components/layout/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

    const getSelectedTotal = () =>
        cartItems
            .filter((item) => selectedItems.includes(item.id))
            .reduce((total, item) => total + (item?.totalPrice ?? 0), 0);

    // voucher
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [voucherError, setVoucherError] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);

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
    const groupByArtisan = (items) => {
        const groups = {};
        items.forEach((item) => {
            const key = item.user?.userName || "Không rõ nghệ nhân";
            if (!groups[key]) {
                groups[key] = {
                    artisanName: item.user?.userName || "Không rõ nghệ nhân",
                    artisanAvatar: item.user?.thumbnail || null,
                    items: [],
                };
            }
            groups[key].items.push(item);
        });
        return Object.values(groups);
    };

    const toggleItem = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };
    const toggleGroup = (group) => {
        const allSelected = group.items.every((item) => selectedItems.includes(item.id));
        if (allSelected) {
            // Bỏ chọn tất cả sp trong group
            setSelectedItems((prev) => prev.filter((id) => !group.items.some((i) => i.id === id)));
        } else {
            // Chọn tất cả sp trong group
            setSelectedItems((prev) => [
                ...prev,
                ...group.items
                    .filter((item) => !prev.includes(item.id))
                    .map((item) => item.id),
            ]);
        }
    };


    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12 text-[#5e3a1e] text-[15px]">
                <h1 className="text-4xl font-bold mb-10 text-center">Giỏ hàng của bạn</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center">
                        <p>Không có sản phẩm nào trong giỏ hàng.</p>
                        <Link
                            to="/products"
                            className="text-[#b28940] hover:text-[#9e7635] font-medium"
                        >
                            Tiếp tục mua sắm →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                        {/* danh sach */}
                        <div className="lg:col-span-2 max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
                            <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_120px_140px_120px_60px] items-center font-semibold text-[#5e3a1e] px-4 py-2 gap-4 mb-3">
                                <div>Sản phẩm</div>
                                <div className="text-center">Đơn giá</div>
                                <div className="text-center">Số lượng</div>
                                <div className="text-center">Số tiền</div>
                                <div className="text-center">Thao tác</div>
                            </div>

                            {groupByArtisan(cartItems).map((group, groupIndex) => (
                                <div
                                    key={groupIndex}
                                    className="border border-gray-300 rounded-md p-4 mb-6"
                                >
                                    <label className="flex items-center gap-2 pb-2 mb-4 border-b border-gray-200 font-semibold cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={group.items.every((item) => selectedItems.includes(item.id))}
                                            onChange={() => toggleGroup(group)}
                                            className="form-checkbox accent-[#5e3a1e]"
                                        />
                                        {group.artisanAvatar ? (
                                            <img
                                                src={group.artisanAvatar}
                                                alt={group.artisanName}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center">
                                                {group.artisanName?.charAt(0)}
                                            </div>
                                        )}
                                        <span>{group.artisanName}</span>
                                    </label>


                                    {group.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`grid grid-cols-[minmax(0,1fr)_120px_140px_120px_60px] items-center py-4 gap-4 ${index !== 0 ? "border-t border-gray-200" : ""
                                                }`}
                                        >
                                            {/* Cột: Ảnh + Tên sản phẩm */}
                                            <div className="flex items-center gap-4 min-w-0 overflow-hidden">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => toggleItem(item.id)}
                                                    className="form-checkbox accent-[#5e3a1e]"
                                                />
                                                <img
                                                    src={item.productImages?.[0]?.imageUrl}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover rounded-md border flex-shrink-0"
                                                />
                                                <div className="font-semibold leading-snug text-[#5e3a1e] break-words min-w-0">
                                                    {item.productName}
                                                </div>
                                            </div>

                                            {/* Cột: Đơn giá */}
                                            <div className="text-center text-[#5e3a1e] font-medium truncate">
                                                {(item?.unitPrice ?? 0).toLocaleString("vi-VN")}₫
                                            </div>

                                            {/* Cột: Số lượng */}
                                            <div className="flex justify-center">
                                                <div className="flex items-center h-10 w-[120px] rounded-md border border-gray-300 overflow-hidden bg-white shadow-sm">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                Math.max(1, item.quantity - 1)
                                                            )
                                                        }
                                                        className="w-10 h-full flex items-center justify-center text-lg font-bold text-[#5e3a1e] hover:bg-[#f0ece3] transition"
                                                    >
                                                        −
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateQuantity(
                                                                item.id,
                                                                Math.max(1, parseInt(e.target.value))
                                                            )
                                                        }
                                                        min={1}
                                                        className="w-12 text-center h-full border-x border-gray-200 text-[#5e3a1e] font-medium focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity + 1)
                                                        }
                                                        className="w-10 h-full flex items-center justify-center text-lg font-bold text-[#5e3a1e] hover:bg-[#f0ece3] transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Cột: Số tiền */}
                                            <div className="text-center text-red-600 font-semibold">
                                                {(item?.totalPrice ?? 0).toLocaleString("vi-VN")}₫
                                            </div>

                                            {/* Cột: Xoá */}
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-[#5e3a1e] hover:text-red-600 text-lg transition-transform duration-200"
                                                    title="Xoá sản phẩm"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* chi tiet */}
                        <div className="sticky top-24 self-start">
                            <div className="p-6 border border-gray-200 rounded shadow-sm bg-white">
                                <div className="mb-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Tạm tính</span>
                                        <span className="text-red-600 font-semibold">
                                            {getSelectedTotal().toLocaleString("vi-VN")} ₫
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Giảm giá</span>
                                        <span className="text-green-600">
                                            − {discount?.toLocaleString("vi-VN") || "0"} ₫
                                        </span>
                                    </div>

                                    <div className="flex justify-between font-bold text-2xl border-t border-gray-500 pt-3">
                                        <span>Thành tiền</span>
                                        <div className="text-right text-red-600 font-semibold">
                                            <p>
                                                {(getSelectedTotal() - (discount || 0)).toLocaleString("vi-VN")} ₫
                                            </p>
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
                                            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none"
                                        />
                                        <button
                                            onClick={handleApplyVoucher}
                                            className="px-4 py-2 bg-[#5e3a1e] hover:bg-[#4a2f15] text-white rounded transition"
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                    {voucherError && (
                                        <p className="text-sm text-red-500 mt-1">{voucherError}</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        if (selectedItems.length === 0) return; // Không chọn => không làm gì cả
                                        navigate("/checkout", { state: { selectedItems } });
                                    }}
                                    className="w-full py-3 bg-[#5e3a1e] hover:bg-[#4a2f15] text-white rounded flex justify-center items-center gap-2 transition text-[15px]"
                                >
                                    <FaLock /> Thanh toán
                                </button>
                            </div>

                            <Link
                                to="/products"
                                className="block text-center mt-4 text-[#5e3a1e] text-[15px] font-medium transition"
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
