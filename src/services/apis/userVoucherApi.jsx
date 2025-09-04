import { API_ENDPOINTS_USER_VOUCHER } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

const userVoucherService = {
  // Lấy tất cả voucher của user
  async getAllVouchersByUserId(userId, voucherType = "") {
    return performApiRequest(
      API_ENDPOINTS_USER_VOUCHER.GET_ALL_VOUCHERS_BY_USER_ID(userId, voucherType),
      {
        method: "get",
      }
    );
  },

  // Đổi xu lấy voucher
  async swapVoucher(userId, voucherId) {
    return performApiRequest(API_ENDPOINTS_USER_VOUCHER.SWAP_VOUCHER, {
      method: "post",
      params: { UserId: userId, VoucherId: voucherId }, 
    });
  },
};

export default userVoucherService;
