import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
    getCart,
    addToCart as addToCartApi,
    removeFromCart as removeFromCartApi,
    updateCartItem as updateCartItemApi,
} from "../services/apis/cartApi";
import { useNotification } from "./NotificationContext";
import { getProductById } from "../services/apis/productApi";


export const CartContext = createContext();

const getStock = (product) => {
    if (!product) return 0;
    const qty = Number(product.quantity) || 0;
    const sold = Number(product.quantitySold) || 0;
    return Math.max(0, qty - sold);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { isAuthenticated, user } = useContext(AuthContext);
    const { showNotification } = useNotification();

    // 1. Lấy giỏ hàng từ API
    const fetchCart = async () => {
        if (isAuthenticated && user?.id && user?.roleId === 4) {
            const res = await getCart(user.id);

            if (res.success) {
                const items = await Promise.all(
                    (res.data?.data?.items || []).map(async item => {
                        const productRes = await getProductById(item.productId);
                        const productData = productRes?.data?.data || {};

                        return {
                            ...item,
                            product: {
                                id: item.productId,
                                name: item.productName,
                                artisanId: productData.artisan_id,
                                quantity: productData.quantity,
                                quantitySold: productData.quantitySold,
                                productImages: item.productImages || [],
                                length: productData.length,
                                width: productData.width,
                                height: productData.height,
                                weight: productData.weight,
                            }
                        };
                    })
                );
                setCartItems(items);
            } else {
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
        if (!isAuthenticated || !user?.id || !product?.id || product.quantity <= 0) return;

        try {

            const productRes = await getProductById(product.id);
            const latestProduct = productRes?.data?.data;

            if (!latestProduct) {
                showNotification("Không tìm thấy sản phẩm", "error");
                return;
            }

            const stock = getStock(latestProduct); // số lượng còn trong kho mới nhất
            const existingQuantity = cartItems.find(item => item.product?.id === product.id)?.quantity || 0;
            const totalAfterAdd = existingQuantity + product.quantity;

            if (totalAfterAdd > stock) {
                const remaining = Math.max(0, stock - existingQuantity);
                showNotification(
                    `Chỉ còn ${remaining} sản phẩm trong kho. Bạn đã có ${existingQuantity} trong giỏ hàng.`,
                    "error"
                );
                return;
            }

            const res = await addToCartApi(user.id, product.id, product.quantity);
            if (res?.success) {
                await fetchCart();
                showNotification("Đã thêm sản phẩm vào giỏ hàng", "success");
            } else {
                console.error("Lỗi khi thêm vào giỏ hàng:", res?.error);
                showNotification("Lỗi khi thêm sản phẩm vào giỏ hàng", "error");
            }

        } catch (err) {
            console.error("Lỗi kết nối khi thêm vào giỏ hàng:", err);
            showNotification("Không thể kết nối tới máy chủ", "error");
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

    // 4. Cập nhật số lượng
    const updateQuantity = async (cartItemId, newQuantity) => {
        if (!isAuthenticated || !cartItemId || newQuantity < 1) return;

        const item = cartItems.find(item => item.id === cartItemId);

        if (!item) {
            showNotification("Không tìm thấy sản phẩm trong giỏ hàng", "error");
            return;
        }
        console.log("DEBUG product:", item.product);
        const stock = getStock(item.product);

        if (newQuantity > stock) {
            showNotification(
                `Chỉ còn ${stock} sản phẩm trong kho. Bạn không thể cập nhật vượt quá số lượng này.`,
                "error"
            );
            return;
        }

        try {
            const res = await updateCartItemApi(cartItemId, newQuantity);
            if (res.success) {
                await fetchCart();
            } else {
                showNotification(res.error || "Lỗi khi cập nhật số lượng", "error");
                console.error("Lỗi khi cập nhật số lượng:", res.error);
            }
        } catch (error) {
            showNotification(
                error?.response?.data?.message || "Lỗi khi cập nhật số lượng",
                "error"
            );
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
                updateQuantity,
                cartCount,
                clearCart,
                getStock,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
