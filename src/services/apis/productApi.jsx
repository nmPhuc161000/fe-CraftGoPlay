import axios from "../axiosInstance";
import { API_ENDPOINTS_PRODUCT } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

export const getProducts = () => axios.get(API_ENDPOINTS_PRODUCT.GET_PRODUCTS);
export const getProductById = (id) =>
  axios.get(`${API_ENDPOINTS_PRODUCT.GET_PRODUCT_BY_ID}/${id}`);

const productService = {
  async getProducts() {
    return performApiRequest(API_ENDPOINTS_PRODUCT.GET_PRODUCTS, {
      method: "get",
    });
  },

  async getProductById(id) {
    return performApiRequest(
      `${API_ENDPOINTS_PRODUCT.GET_PRODUCT_BY_ID}/${id}`,
      {
        method: "get",
      }
    );
  },

  async createProduct(productData) {
    // Kiểm tra xem FormData có chứa các trường cần thiết không
    const formDataObject = Object.fromEntries(productData.entries());
    console.log("Creating product with data:", formDataObject);

    if (!formDataObject.Name) {
      return {
        success: false,
        error: "Tên sản phẩm là bắt buộc",
        status: 400,
      };
    }

    if (
      !formDataObject.Price ||
      isNaN(formDataObject.Price) ||
      parseFloat(formDataObject.Price) <= 0
    ) {
      return {
        success: false,
        error: "Giá sản phẩm không hợp lệ",
        status: 400,
      };
    }

    if (!formDataObject.Description) {
      return {
        success: false,
        error: "Mô tả sản phẩm là bắt buộc",
        status: 400,
      };
    }

    if (!formDataObject.SubCategoryId) {
      return {
        success: false,
        error: "Danh mục con là bắt buộc",
        status: 400,
      };
    }

    if (!productData.get("Image")) {
      return {
        success: false,
        error: "Hình ảnh sản phẩm là bắt buộc",
        status: 400,
      };
    }

    return performApiRequest(API_ENDPOINTS_PRODUCT.CREATE_PRODUCT, {
      data: productData,
      method: "post",
    });
  },
};

export default productService;
