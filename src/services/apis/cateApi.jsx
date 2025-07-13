import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_CATEGORY } from "../../constants/apiEndPoint";

const categoryService = {
  async getAllCategories() {
    return performApiRequest(API_ENDPOINTS_CATEGORY.GET_CATEGORIES, {
      method: "get",
    });
  },
  async createCategory({ categoryName, imageFile, categoryStatus }) {
    const formData = new FormData();
    formData.append("CategoryName", categoryName);
    formData.append("Image", imageFile);
    formData.append("CategoryStatus", categoryStatus);
  
    return performApiRequest(API_ENDPOINTS_CATEGORY.CREATE_CATEGORY, {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
  },
  async updateCategory(categoryId, { categoryName, imageFile, categoryStatus }) {
    const formData = new FormData();
    formData.append("CategoryName", categoryName);
    if (imageFile) {
      formData.append("Image", imageFile);
    }
    formData.append("CategoryStatus", categoryStatus);

    return performApiRequest(API_ENDPOINTS_CATEGORY.UPDATE_CATEGORY(categoryId), {
      method: "put", 
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
  },
  async deleteCategory(categoryId) {
    return performApiRequest(API_ENDPOINTS_CATEGORY.DELETE_CATEGORY(categoryId), {
      method: "delete",
    });
  }
};

export default categoryService;
