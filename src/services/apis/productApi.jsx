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

    // Kiểm tra các trường bắt buộc
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

    if (!formDataObject.Quantity || parseInt(formDataObject.Quantity) <= 0) {
      return {
        success: false,
        error: "Số lượng sản phẩm không hợp lệ",
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

    // Kiểm tra ít nhất một ảnh được chọn
    const images = productData.getAll("Images");
    if (!images || images.length === 0) {
      return {
        success: false,
        error: "Vui lòng chọn ít nhất một hình ảnh sản phẩm",
        status: 400,
      };
    }

    // Kiểm tra ít nhất một chất liệu được chọn
    const materialIds = productData.getAll("MaterialIds");
    if (!materialIds || materialIds.length === 0) {
      return {
        success: false,
        error: "Vui lòng chọn ít nhất một chất liệu",
        status: 400,
      };
    }

    // Kiểm tra định dạng ảnh
    for (const image of images) {
      if (image instanceof File) {
        if (!image.type.match("image.*")) {
          return {
            success: false,
            error: `File ${image.name} không phải là hình ảnh hợp lệ`,
            status: 400,
          };
        }
        if (image.size > 5 * 1024 * 1024) {
          return {
            success: false,
            error: `File ${image.name} vượt quá kích thước cho phép (5MB)`,
            status: 400,
          };
        }
      }
    }

    // Gửi request tới API
    return performApiRequest(API_ENDPOINTS_PRODUCT.CREATE_PRODUCT, {
      data: productData,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async updateProduct(id, productData) {
    // Kiểm tra xem FormData có chứa các trường cần thiết không
    const formDataObject = Object.fromEntries(productData.entries());
    console.log("Updating product with data:", formDataObject);

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

    return performApiRequest(`${API_ENDPOINTS_PRODUCT.UPDATE_PRODUCT(id)}`, {
      data: productData,
      method: "put",
    });
  },

  async deleteProduct(id) {
    return performApiRequest(`${API_ENDPOINTS_PRODUCT.DELETE_PRODUCT(id)}`, {
      method: "delete",
    });
  },
};

export default productService;
