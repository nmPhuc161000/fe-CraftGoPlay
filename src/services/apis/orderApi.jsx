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
  async getOrderByUserId(userId, pageIndex = 1, pageSize = 10, status = "") {
    return performApiRequest(
      API_ENDPOINTS_ORDER.GET_ORDERSBYUSERID(
        userId,
        pageIndex,
        pageSize,
        status
      ),
      {
        method: "get",
      }
    );
  },

  async getOrderByArtisanId(
    artisanId,
    pageIndex = 1,
    pageSize = 10,
    status = ""
  ) {
    return performApiRequest(
      API_ENDPOINTS_ORDER.GET_ORDERSBYARTISANID(
        artisanId,
        pageIndex,
        pageSize,
        status
      ),
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
    formData.append("statusDto", status);
    return performApiRequest(API_ENDPOINTS_ORDER.UPDATE_STATUS_ORDER(orderId), {
      method: "put",
      data: formData,
    });
  },

  async countOrderByUserId(userId) {
    return performApiRequest(
      API_ENDPOINTS_ORDER.COUNT_ORDER_BY_USER(userId),
      {
        method: "get",
      }
    );
  },

  async countOrderByArtisanId(artisanId) {
    return performApiRequest(
      API_ENDPOINTS_ORDER.COUNT_ORDER_BY_ARTISAN(artisanId),
      {
        method: "get",
      }
    );
  },
};
export default orderService;
