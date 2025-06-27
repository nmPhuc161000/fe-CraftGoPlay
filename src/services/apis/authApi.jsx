import { performApiRequest, validateEmail } from "../../utils/apiUtils";
import { API_ENDPOINTS_AUTH } from "../../constants/apiEndPoint";

// Service API cho authentication
const authService = {
  /**
   * Đăng nhập
   * @param {Object} credentials - { email, passwordHash }
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async login(credentials) {
    if (!credentials || !credentials.email || !credentials.passwordHash) {
      return {
        success: false,
        error: "Email và mật khẩu là bắt buộc",
        status: 400,
      };
    }
    if (!validateEmail(credentials.email)) {
      return {
        success: false,
        error: "Email không hợp lệ",
        status: 400,
      };
    }
    console.log("Data: ", credentials);

    return performApiRequest(API_ENDPOINTS_AUTH.LOGIN, {
      data: credentials,
      method: "post",
    });
  },

  async loginGoogle(idToken) {
    if (!idToken) {
      return {
        success: false,
        error: "ID Token là bắt buộc",
        status: 400,
      };
    }
    return performApiRequest(API_ENDPOINTS_AUTH.GOOGLE_LOGIN, {
      method: "post",
      data: { idToken },
    });
  },

  /**
   * Đăng ký tài khoản
   * @param {Object} userData - Thông tin người dùng
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async register(userData) {
    if (!userData || !userData.email || !userData.passwordHash) {
      return {
        success: false,
        error: "Email và mật khẩu là bắt buộc",
        status: 400,
      };
    }
    if (!validateEmail(userData.email)) {
      return {
        success: false,
        error: "Email không hợp lệ",
        status: 400,
      };
    }
    return performApiRequest(API_ENDPOINTS_AUTH.REGISTER, userData);
  },

  async registerGoogle(idToken) {
    if (!idToken) {
      return {
        success: false,
        error: "ID Token là bắt buộc",
        status: 400,
      };
    }
    return performApiRequest(API_ENDPOINTS_AUTH.REGISTER_GOOGLE, {
      method: "post",
      data: { idToken },
    });
  },

  /**
   * Đăng xuất
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async logout() {
    return performApiRequest(API_ENDPOINTS_AUTH.LOGOUT, {}, "post");
  },
};

export default authService;
