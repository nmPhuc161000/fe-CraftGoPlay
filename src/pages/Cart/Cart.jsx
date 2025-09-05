import React, { useState, useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import MainLayout from "../../components/layout/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import { useNotification } from "../../contexts/NotificationContext";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getStock } = useContext(CartContext);
    const [selectedItems, setSelectedItems] = useState([]);
    const { showNotification } = useNotification();

    const getSelectedTotal = () =>
        cartItems
            .filter((item) => selectedItems.includes(item.id))
            .reduce((total, item) => total + (item?.totalPrice ?? 0), 0);

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
                                            className="form-checkbox accent-[#5e3a1e] w-4 h-4"
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
                                                        onClick={() => {
                                                            const newQty = item.quantity - 1;
                                                            if (newQty >= 1) {
                                                                updateQuantity(item.id, newQty);
                                                            }
                                                        }}
                                                        className="w-10 h-full flex items-center justify-center text-lg font-bold text-[#5e3a1e] hover:bg-[#f0ece3] transition"
                                                    >
                                                        −
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const newQty = Math.max(1, parseInt(e.target.value) || 1);
                                                            const stock = getStock(item.product);
                                                            if (newQty > stock) {
                                                                showNotification(`Chỉ còn ${stock} sản phẩm trong kho`, "error");
                                                                return;
                                                            }
                                                            updateQuantity(item.id, newQty);
                                                        }}
                                                        min={1}
                                                        className="w-12 text-center h-full border-x border-gray-200 text-[#5e3a1e] font-medium focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newQty = item.quantity + 1;
                                                            const stock = getStock(item.product);
                                                            if (newQty > stock) {
                                                                showNotification(`Chỉ còn ${stock} sản phẩm trong kho`, "error");
                                                                return;
                                                            }
                                                            updateQuantity(item.id, newQty);
                                                        }}
                                                        className="w-10 h-full flex items-center justify-center text-lg font-bold text-[#5e3a1e] hover:bg-[#f0ece3] transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Cột: Số tiền */}
                                            < div className="text-center text-red-600 font-semibold" >
                                                {(item?.totalPrice ?? 0).toLocaleString("vi-VN")}₫
                                            </div>

                                            {/* Cột: Xoá */}
                                            < div className="flex justify-center" >
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
                            <div className="p-6 border border-gray-200 rounded-2xl shadow-lg bg-gradient-to-br from-white to-gray-50">
                                {/* Tiêu đề */}
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaShoppingCart className="text-[#8b5e34]" /> Tóm tắt đơn hàng
                                </h2>

                                {/* Nội dung */}
                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tạm tính ({cartItems
                                            .filter((item) => selectedItems.includes(item.id))
                                            .reduce((total, item) => total + (item.quantity || 1), 0)} sản phẩm)</span>
                                        <span className="text-red-600 font-medium">
                                            {getSelectedTotal().toLocaleString("vi-VN")} ₫
                                        </span>
                                    </div>

                                    <div className="flex justify-between font-bold text-xl border-t border-gray-300 pt-3">
                                        <span>Thành tiền</span>
                                        <span className="text-red-600 font-extrabold">
                                            {getSelectedTotal().toLocaleString("vi-VN")} ₫
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500 mt-2">
                                        Thuế và phí vận chuyển sẽ được tính ở bước tiếp theo
                                    </p>
                                </div>

                                {/* Button */}
                                <button
                                    onClick={() => {
                                        if (selectedItems.length === 0) return;
                                        navigate("/checkout", { state: { selectedItems } });
                                    }}
                                    className="w-full mt-5 py-3 bg-gradient-to-r from-[#5e3a1e] to-[#8b5e34] hover:scale-[1.02] transition-transform duration-200 text-white rounded-xl flex justify-center items-center gap-2 text-[15px] font-semibold shadow-md"
                                >
                                    <FaLock /> Thanh toán
                                </button>
                            </div>

                            <Link
                                to="/products"
                                className="block text-center mt-4 text-[#5e3a1e] hover:underline text-[15px] font-medium"
                            >
                                ← Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div >
                )}
            </div >
        </MainLayout >
    );

};

export default Cart;
