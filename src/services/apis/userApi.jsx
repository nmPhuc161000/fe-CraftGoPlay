import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_USER } from "../../constants/apiEndPoint";

const userService = {
  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async getCurrentUser() {
    return performApiRequest(API_ENDPOINTS_USER.GET_USER, { method: "get" });
  },

  async upgradeToArtisan(formData) {
    return performApiRequest(API_ENDPOINTS_USER.SEND_REQUEST_UPGRADE_ARTISAN, {
      method: "post",
      data: formData
    })
  },

  /**
   * Cập nhật thông tin người dùng
   * @param {Object} userData - Dữ liệu người dùng cần cập nhật
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async updateUser(userData) {
    return performApiRequest(API_ENDPOINTS_USER.UPDATE_USER, {
      data: userData,
      method: "put",
    });
  },
};

export default userService;
