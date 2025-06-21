import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS_AUTH } from "../../constants/apiEndPoint";

// Hàm chung để thực hiện request API
const performApiRequest = async (endpoint, data = {}, method = "post") => {
  try {
    const response = await axiosInstance[method](endpoint, data);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return handleError(error);
  }
};

// Hàm xử lý lỗi tập trung
const handleError = (error) => {
  if (error.response) {
    console.error(`API Error [${error.response.status}]:`, error.response.data);
    const errorMessage = error.response.data?.errors
      ? Object.values(error.response.data.errors).join(", ")
      : error.response.data?.message || "Lỗi server";
    return {
      success: false,
      error: errorMessage,
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    console.error("Network Error:", error.message);
    return {
      success: false,
      error: "Không thể kết nối tới server",
      status: null,
    };
  } else {
    console.error("Request Error:", error.message);
    return {
      success: false,
      error: error.message || "Lỗi khi gửi yêu cầu",
      status: null,
    };
  }
};

// Hàm kiểm tra định dạng email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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
    return performApiRequest(API_ENDPOINTS_AUTH.LOGIN, credentials);
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

  /**
   * Đăng xuất
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async logout() {
    return performApiRequest(API_ENDPOINTS_AUTH.LOGOUT, {}, "post");
  },
};

export default authService;
