import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
    getCart,
    addToCart as addToCartApi,
    removeFromCart as removeFromCartApi,
    updateCartItem as updateCartItemApi,
} from "../services/apis/cartApi";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { isAuthenticated, user } = useContext(AuthContext);

    // 1. Lấy giỏ hàng từ API
    const fetchCart = async () => {
        if (isAuthenticated && user?.id) {
            const res = await getCart(user.id);
            if (res.success) {
                const items = res.data?.data?.items || [];
                setCartItems(items);
            } else {
                console.error("Lỗi khi tải giỏ hàng:", res.error);
            }
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated, user?.id]);

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

        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

        const res = await removeFromCartApi(cartItemId);
        if (!res.success) {
            console.error("Lỗi khi xoá sản phẩm:", res.error);
        }
    };

    // 4. Cập nhật số lượng
    const updateQuantity = async (cartItemId, quantity) => {
        if (!isAuthenticated || !cartItemId || quantity < 1) return;

        setCartItems((prev) =>
            prev.map((item) =>
                item.id === cartItemId ? { ...item, quantity } : item
            )
        );

        const res = await updateCartItemApi(cartItemId, quantity);
        if (!res.success) {
            console.error("Lỗi khi cập nhật số lượng:", res.error);
        }
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
