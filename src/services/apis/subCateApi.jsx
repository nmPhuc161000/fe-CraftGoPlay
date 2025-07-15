import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_SUBCATEGORY } from "../../constants/apiEndPoint";

const subCategoryService = {
  /**
   * Lấy danh sách tất cả các danh mục con
   * @return {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async getAllSubCategories() {
    try {
      const response = await performApiRequest(API_ENDPOINTS_SUBCATEGORY.GET_SUBCATEGORIES, {
        method: "get",
      });
      return response;
    } catch (error) {
      console.error('Error in getAllSubCategories:', error);
      return {
        success: false,
        error: error.message || "Không thể kết nối đến server",
        status: error.status || 500
      };
    }
  },

  /**
   * Tạo danh mục con mới
   * @param {FormData} formData - FormData chứa thông tin danh mục con
   * @return {Promise<{success: boolean, data?: any, error?: string, status?: number, message?: string}>}
   */
  async createSubCategory(formData) {
    try {
      if (!formData) {
        return {
          success: false,
          error: "Dữ liệu không hợp lệ",
          status: 400,
        };
      }

      // Kiểm tra các trường bắt buộc
      const requiredFields = ['CategoryId', 'SubName', 'Status'];
      for (let field of requiredFields) {
        if (!formData.get(field)) {
          return {
            success: false,
            error: `Trường ${field} là bắt buộc`,
            status: 400,
          };
        }
      }

      // Đảm bảo CategoryId là string (theo API yêu cầu)
      const categoryId = formData.get('CategoryId');
      formData.delete('CategoryId'); // Xóa khỏi form vì không cần trong body

      const response = await performApiRequest(
        `${API_ENDPOINTS_SUBCATEGORY.CREATE_SUBCATEGORY}?CategoryId=${categoryId}`,
        {
          method: "post",
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );


      // Chuẩn hóa kết quả trả về dựa trên response thực tế từ API
      if (response && (response.error === 0 || response.success)) {
        return {
          success: true,
          data: response.data,
          message: response.message || "Tạo danh mục con thành công",
          status: 200
        };
      } else {
        return {
          success: false,
          error: response?.message || response?.error || "Tạo danh mục con thất bại",
          status: response?.status || 500
        };
      }
    } catch (error) {
      console.error('Error in createSubCategory:', error);
      return {
        success: false,
        error: error.message || "Không thể kết nối đến server",
        status: error.status || 500
      };
    }
  },

  /**
   * Cập nhật danh mục con
   * @param {string} id - ID của danh mục con
   * @param {FormData} formData - FormData chứa thông tin cập nhật
   * @return {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async updateSubCategory(id, formData) {
    try {
      if (!id || !formData) {
        return {
          success: false,
          error: "ID và dữ liệu cập nhật là bắt buộc",
          status: 400,
        };
      }

      // Log FormData content for debugging
      console.log('FormData content for update:');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value);
      }

      // Ensure CategoryId is a string
      const categoryId = formData.get('CategoryId');
      if (categoryId) {
        formData.delete('CategoryId');
        formData.append('CategoryId', categoryId.toString());
      }

      const response = await performApiRequest(API_ENDPOINTS_SUBCATEGORY.UPDATE_SUBCATEGORY(id), {
        method: "put",
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response;
    } catch (error) {
      console.error('Error in updateSubCategory:', error);
      return {
        success: false,
        error: error.message || "Không thể kết nối đến server",
        status: error.status || 500
      };
    }
  },

  /**
   * Xóa danh mục con
   * @param {string} id - ID của danh mục con
   * @return {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async deleteSubCategory(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID là bắt buộc",
          status: 400,
        };
      }

      const response = await performApiRequest(API_ENDPOINTS_SUBCATEGORY.DELETE_SUBCATEGORY(id), {
        method: "delete"
      });

      return response;
    } catch (error) {
      console.error('Error in deleteSubCategory:', error);
      return {
        success: false,
        error: error.message || "Không thể kết nối đến server",
        status: error.status || 500
      };
    }
  }
};

export default subCategoryService;

