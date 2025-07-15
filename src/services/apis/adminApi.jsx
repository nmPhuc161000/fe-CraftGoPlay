import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_ADMIN } from "../../constants/apiEndPoint";

// Service cho admin
const adminService = {
    /**
     * Lấy danh sách tài khoản theo trạng thái
     * @param {Object} params - Tham số truy vấn (pageIndex, pageSize, status)
     * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
     */
    async getAccountsByStatus({ pageIndex = 1, pageSize = 10, status }) {
        console.log(">>> Gọi API getAccountsByStatus");
        const query = `?pageIndex=${pageIndex}&pageSize=${pageSize}${status !== undefined ? `&status=${status}` : ''}`;
        return performApiRequest(
            `${API_ENDPOINTS_ADMIN.GET_ACCOUNTS_BY_STATUS}${query}`,
            {
                method: "get",
            }
        );
    },

    /**
     * Tạo mới tài khoản (Admin)
     * @param {Object} accountData - Dữ liệu tài khoản mới
     * @param {string} accountData.UserName - Tên đăng nhập (bắt buộc)
     * @param {string} accountData.PasswordHash - Mật khẩu (bắt buộc)
     * @param {string} accountData.DateOfBirth - Ngày sinh (định dạng yyyy-MM-dd)
     * @param {string} accountData.PhoneNumber - Số điện thoại
     * @param {string} accountData.Thumbnail - Ảnh đại diện
     * @param {string} accountData.Email - Email
     * @param {string} accountData.Status - Trạng thái
     * @param {string} accountData.RoleId - Mã vai trò
     * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
     */
    async createAccount(accountData) {
        if (!accountData.get("UserName") || !accountData.get("PasswordHash")) {
            return { success: false, error: "UserName và PasswordHash là bắt buộc", status: 400 };
        }
        return performApiRequest(API_ENDPOINTS_ADMIN.CREATE_ACCOUNT, {
            method: "post",
            data: accountData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

  /**
   * Cập nhật tài khoản (Admin)
   * @param {string} id - ID tài khoản cần cập nhật
   * @param {Object} accountData - Dữ liệu cập nhật tài khoản
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async updateAccount(id, accountData) {
        if (!id || !accountData) {
            return {
                success: false,
                error: "ID và dữ liệu cập nhật là bắt buộc",
                status: 400,
            };
        }
        return performApiRequest(API_ENDPOINTS_ADMIN.UPDATE_ACCOUNT, {
            method: "put",
            data: { id, ...accountData },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    /**
     * Xóa tài khoản (Admin)
     * @param {string} id - ID tài khoản cần xóa
     * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
     */
    async deleteAccount(id) {
        if (!id) {
            return {
                success: false,
                error: "ID là bắt buộc",
                status: 400,
            };
        }
        return performApiRequest(API_ENDPOINTS_ADMIN.DELETE_ACCOUNT(id), {
            method: "delete",
        });
    },
};

export default adminService;
