import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_METERIAL } from "../../constants/apiEndPoint";

// Service API cho meterial
const meterialService = {
  /**
   * Lấy danh sách meterials
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async getMeterials() {
    return performApiRequest(API_ENDPOINTS_METERIAL.GET_METERIALS, {
      method: "get",
    });
  },

  /**
   * Tạo mới một meterial
   * @param {Object} meterialData - Dữ liệu của meterial
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async createMeterial(meterialData) {
    if (!meterialData || !meterialData.name) {
      return {
        success: false,
        error: "Tên meterial là bắt buộc",
        status: 400,
      };
    }
    return performApiRequest(API_ENDPOINTS_METERIAL.CREATE_METERIAL, {
      method: "post",
      data: meterialData,
    });
  },

  /**
   * Cập nhật một meterial
   * @param {string} id - ID của meterial
   * @param {Object} meterialData - Dữ liệu cập nhật
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async updateMeterial(id, meterialData) {
    if (!id || !meterialData || !meterialData.name) {
      return {
        success: false,
        error: "ID và tên meterial là bắt buộc",
        status: 400,
      };
    }
    return performApiRequest(API_ENDPOINTS_METERIAL.UPDATE_METERIAL(id), {
      method: "put",
      data: meterialData,
    });
  },

  /**
   * Xóa một meterial
   * @param {string} id - ID của meterial
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async deleteMeterial(id) {
    if (!id) {
      return {
        success: false,
        error: "ID là bắt buộc",
        status: 400,
      };
    }
    return performApiRequest(API_ENDPOINTS_METERIAL.DELETE_METERIAL(id), {
      method: "delete",
    });
  },
};
export default meterialService;
