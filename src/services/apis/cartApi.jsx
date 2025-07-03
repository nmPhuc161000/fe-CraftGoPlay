import { API_ENDPOINTS_CART } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

export const getCart = (userId) =>
    performApiRequest(API_ENDPOINTS_CART.GET_CART(userId), {
        method: "get",
    });

export const addToCart = (userId, productId, quantity) =>
    performApiRequest(API_ENDPOINTS_CART.ADD_TO_CART(userId), {
        method: "post",
        data: { productId, quantity },
    });

export const removeFromCart = (cartItemId) =>
    performApiRequest(API_ENDPOINTS_CART.REMOVE_FROM_CART(cartItemId), {
        method: "delete",
    });

export const updateCartItem = (cartItemId, quantity) =>
    performApiRequest(API_ENDPOINTS_CART.UPDATE_ITEM, {
        method: "put",
        data: { cartItemId, quantity },
    });
