import { API_ENDPOINTS_ORDER } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

// Tạo đơn hàng từ giỏ hàng
export const createOrderFromCart = (formData) =>
    performApiRequest(API_ENDPOINTS_ORDER.CREATE_FROM_CART, {
        method: "post",
        data: formData,
        isFormData: true,
    });
//vnpay   
export const getVnpayUrl = async (orderId) => {
    return performApiRequest(`/api/Order/vnpay-url/${orderId}`, {
        method: "get",
    });
};