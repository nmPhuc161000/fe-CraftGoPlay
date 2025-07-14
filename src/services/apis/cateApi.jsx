import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_CATEGORY } from "../../constants/apiEndPoint";

const validateStatus = (status) => {
  // Chỉ chấp nhận "Actived" hoặc "Inactived"
  return status === "Actived" || status === "Inactived" ? status : "Actived";
};

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
    formData.append("CategoryStatus", validateStatus(categoryStatus));

    // Log data trước khi gửi
    console.log("Create Category Data:", {
      CategoryName: categoryName,
      Image: imageFile?.name,
      CategoryStatus: validateStatus(categoryStatus)
    });
  
    return performApiRequest(API_ENDPOINTS_CATEGORY.CREATE_CATEGORY, {
      method: "post",
      data: formData,
    });
  },

  async updateCategory(categoryId, { categoryName, imageFile, image, categoryStatus }) {
    if (!categoryId) {
      throw new Error("CategoryId là bắt buộc");
    }

    const formData = new FormData();
    
    // Validate và thêm các trường bắt buộc
    if (!categoryName?.trim()) {
      throw new Error("CategoryName là bắt buộc");
    }
    formData.append("CategoryName", categoryName.trim());
    
    // Xử lý image: ưu tiên imageFile nếu có, nếu không thì dùng image URL
    if (imageFile) {
      formData.append("Image", imageFile);
    } else if (image) {
      // Nếu có image URL nhưng không có file mới, gửi URL hiện tại
      formData.append("Image", image);
    }
    
    // Validate và thêm CategoryStatus
    const validatedStatus = validateStatus(categoryStatus);
    formData.append("CategoryStatus", validatedStatus);

    // Log data trước khi gửi
    console.log("Update Category Data:", {
      CategoryId: categoryId,
      CategoryName: categoryName.trim(),
      Image: imageFile ? imageFile.name : image,
      CategoryStatus: validatedStatus
    });

    return performApiRequest(API_ENDPOINTS_CATEGORY.UPDATE_CATEGORY(categoryId), {
      method: "put",
      data: formData,
    });
  },

  async deleteCategory(categoryId) {
    if (!categoryId) {
      throw new Error("CategoryId là bắt buộc");
    }

    // Log trước khi xóa
    console.log("Delete Category ID:", categoryId);
    
    return performApiRequest(API_ENDPOINTS_CATEGORY.DELETE_CATEGORY(categoryId), {
      method: "delete"
    });
  }
};

export default categoryService;
