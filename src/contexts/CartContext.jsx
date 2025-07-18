import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
    getCart,
    addToCart as addToCartApi,
    removeFromCart as removeFromCartApi,
    updateCartItem as updateCartItemApi,
} from "../services/apis/cartApi";
import { useNotification } from "./NotificationContext";


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { isAuthenticated, user } = useContext(AuthContext);
    const { showNotification } = useNotification();

    // 1. Lấy giỏ hàng từ API
    const fetchCart = async () => {
        if (isAuthenticated && user?.id && user?.roleId === 4) {
            const res = await getCart(user.id);
            if (res.success) {
                const items = res.data?.data?.items || [];
                setCartItems(items);
            } else {
                console.error("Lỗi khi tải giỏ hàng:", res.error);
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user?.id && user?.roleId === 4) {
            fetchCart();
        }
    }, [isAuthenticated, user?.id, user?.roleId]);


    // 2. Thêm sản phẩm vào giỏ hàng
    const addToCart = async (product) => {
        if (!isAuthenticated || !user?.id || !product || product.quantity <= 0)
            return;

        const res = await addToCartApi(user.id, product.id, product.quantity);
        if (res.success) {
            await fetchCart();
        } else {
            console.error("Lỗi khi thêm vào giỏ hàng:", res.error);
        }
    };

    // 3. Xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = async (cartItemId) => {
        if (!isAuthenticated || !cartItemId) return;

        const res = await removeFromCartApi(cartItemId);
        if (res.success) {
            await fetchCart();
        } else {
            console.error("Lỗi khi xoá sản phẩm:", res.error);
        }
    };

    //xoa sau khi thanh toan
    const removeMultipleItems = async (cartItemIds = []) => {
        if (!isAuthenticated || !cartItemIds.length) return;

        // Dùng Promise.all để xoá song song các item
        await Promise.all(cartItemIds.map((id) => removeFromCartApi(id)));
        await fetchCart();
    };

    // 4. Cập nhật số lượng
    const updateQuantity = async (cartItemId, quantity) => {
        if (!isAuthenticated || !cartItemId || quantity < 1) return;

        try {
            const res = await updateCartItemApi(cartItemId, quantity);
            if (res.success) {
                await fetchCart();
            } else {
                showNotification(res.error || "Lỗi khi cập nhật số lượng", "error");
                console.error("Lỗi khi cập nhật số lượng:", res.error);
            }
        } catch (error) {
            showNotification(error?.response?.data?.message || "Lỗi khi cập nhật số lượng", "error");
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    };

    const clearCart = async () => {
        if (!isAuthenticated || !cartItems.length) return;
        for (const item of cartItems) {
            await removeFromCartApi(item.id);
        }

        await fetchCart();
    };

    const cartCount = Array.isArray(cartItems)
        ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
        : 0;

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                removeMultipleItems,
                updateQuantity,
                cartCount,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
