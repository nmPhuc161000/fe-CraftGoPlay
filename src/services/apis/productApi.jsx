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

  async getProductsByArtisanId(
    artisanId,
    pageIndex = 1,
    pageSize = 10,
    productStatus = "Active"
  ) {
    return performApiRequest(
      API_ENDPOINTS_PRODUCT.GET_PRODUCTS_BY_ARTISANID(
        artisanId,
        pageIndex,
        pageSize,
        productStatus
      ),
      {
        method: "get",
      }
    );
  },

  async getProductById(id) {
    return performApiRequest(API_ENDPOINTS_PRODUCT.GET_PRODUCT_BY_ID(id), {
      method: "get",
    });
  },

  async searchProducts({
    search = "",
    pageIndex = 1,
    pageSize = 10,
    from = 0,
    to = 1000000,
    sortOrder = "",
    subCategoryName = "",
    artisanName = "",
  } = {}) {
    const params = {
      search,
      pageIndex,
      pageSize,
      from,
      to,
    };

    if (sortOrder) params.sortOrder = sortOrder;
    if (subCategoryName) params.subCategoryName = subCategoryName;
    if (artisanName) params.artisanName = artisanName;
    return performApiRequest(API_ENDPOINTS_PRODUCT.GET_SEARCH_PRODUCTS, {
      method: "get",
      params,
    });
  },


  async createProduct(productData) {
    // Chuyển FormData thành object để kiểm tra
    const formDataObject = Object.fromEntries(productData.entries());
    console.log("Creating product with data:", formDataObject);

    // Gửi request tới API
    return performApiRequest(API_ENDPOINTS_PRODUCT.CREATE_PRODUCT, {
      data: productData,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data", // Đảm bảo gửi dữ liệu dưới dạng FormData
      },
    });
  },

  async updateProduct(productData) {
    // Kiểm tra xem FormData có chứa các trường cần thiết không
    const formDataObject = Object.fromEntries(productData.entries());
    console.log("Updating product with data:", formDataObject);

    return performApiRequest(API_ENDPOINTS_PRODUCT.UPDATE_PRODUCT, {
      data: productData,
      method: "patch",
      headers: {
        "Content-Type": "multipart/form-data", // Đảm bảo gửi dữ liệu dưới dạng FormData
      },
    });
  },

  async deleteProduct(id) {
    return performApiRequest(`${API_ENDPOINTS_PRODUCT.DELETE_PRODUCT(id)}`, {
      method: "delete",
    });
  },

  async getProductsByStatus({ status, pageIndex, pageSize }) {
    return performApiRequest(
      API_ENDPOINTS_PRODUCT.GET_PRODUCTS_BY_STATUS(status, pageIndex, pageSize),
      {
        method: "get",
      }
    );
  }
};

export default productService;
