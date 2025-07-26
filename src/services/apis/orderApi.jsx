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
  return performApiRequest(API_ENDPOINTS_ORDER.GET_VNPAY_URL(orderId), {
    method: "get",
  });
};

export const createOrderDirect = (userId, formData) =>
  performApiRequest(API_ENDPOINTS_ORDER.CREATE_DIRECT(userId), {
    method: "post",
    data: formData,
    isFormData: true,
  });

const orderService = {
  async getOrderByUserId(userId) {
    return performApiRequest(API_ENDPOINTS_ORDER.GET_ORDERSBYUSERID(userId), {
      method: "get",
    });
  },
  async getOrderByArtisanId(artisanId) {
    return performApiRequest(
      API_ENDPOINTS_ORDER.GET_ORDERSBYARTISANID(artisanId),
      {
        method: "get",
      }
    );
  },
  async getOrderByOrderId(orderId) {
    return performApiRequest(API_ENDPOINTS_ORDER.GET_ORDERBYORDERID(orderId), {
      method: "get",
    });
  },
  async updateStatusOrder(orderId, status) {
    const formData = new FormData();
    formData.append("Status", status);
    return performApiRequest(API_ENDPOINTS_ORDER.UPDATE_STATUS_ORDER(orderId), {
      method: "put",
      data: formData,
    });
  },
};
export default orderService;
