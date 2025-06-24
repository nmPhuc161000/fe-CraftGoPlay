import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_SUBCATEGORY } from "../../constants/apiEndPoint";

const subCategoryService = {
  /**
   * Lấy danh sách tất cả các danh mục con
   * @return {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   * */
  async getAllSubCategories() {
    return performApiRequest(API_ENDPOINTS_SUBCATEGORY.GET_SUBCATEGORIES, {
      method: "get",
    });
  },
  /**
   * Tạo danh mục con mới
   * @param {Object} subCategoryData - Dữ liệu danh mục con
   * @return {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   * */
  async createSubCategory(subCategoryData) {
    if (!subCategoryData || !subCategoryData.name) {
      return {
        success: false,
        error: "Tên danh mục con là bắt buộc",
        status: 400,
      };
    }
    return performApiRequest(API_ENDPOINTS_SUBCATEGORY.CREATE_SUBCATEGORY, {
      data: subCategoryData,
      method: "post",
    });
  },
};

export default subCategoryService;
