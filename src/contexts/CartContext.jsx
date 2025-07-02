import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { isAuthenticated, user, token } = useContext(AuthContext);

    const API = {
        GET_CART: (userId) => `http://localhost:5000/api/Cart/${userId}`,
        ADD_TO_CART: (userId) => `http://localhost:5000/api/Cart/${userId}`,
        UPDATE_ITEM: "http://localhost:5000/api/Cart/item",
        DELETE_ITEM: (cartItemId) => `http://localhost:5000/api/Cart/item/${cartItemId}`,
    };

    // 1. Lấy giỏ hàng từ API
    const fetchCart = async () => {
        if (isAuthenticated && user?.id) {
            try {
                const res = await axios.get(API.GET_CART(user.id), {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const items = res.data?.data?.items || [];
                setCartItems(items);
            } catch (err) {
                console.error("Lỗi khi tải giỏ hàng:", err);
            }
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated, user?.id, token]);

    // 2. Thêm sản phẩm vào giỏ hàng
    const addToCart = async (product) => {
        if (!product || product.quantity <= 0) return;

        if (isAuthenticated && user?.id) {
            try {
                await axios.post(
                    API.ADD_TO_CART(user.id),
                    {
                        productId: product.id,
                        quantity: product.quantity,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                await fetchCart();
            } catch (err) {
                console.error("Lỗi khi thêm vào giỏ hàng:", err);
            }
        } else {
            // Nếu chưa đăng nhập, dùng local state
            setCartItems((prev) => {
                const exist = prev.find((item) => item.id === product.id);
                if (exist) {
                    return prev.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + product.quantity }
                            : item
                    );
                } else {
                    return [...prev, product];
                }
            });
        }
    };

    // 3. Xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = async (cartItemId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

        if (isAuthenticated && cartItemId) {
            try {
                await axios.delete(API.DELETE_ITEM(cartItemId), {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (err) {
                console.error("Lỗi khi xoá sản phẩm:", err);
            }
        }
    };

    // 4. Cập nhật số lượng
    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return;

        setCartItems((prev) =>
            prev.map((item) =>
                item.id === cartItemId ? { ...item, quantity } : item
            )
        );

        if (isAuthenticated && cartItemId) {
            try {
                await axios.put(
                    API.UPDATE_ITEM,
                    { cartItemId, quantity },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } catch (err) {
                console.error("Lỗi khi cập nhật số lượng:", err);
            }
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
