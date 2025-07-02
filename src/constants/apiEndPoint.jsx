export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const API_ENDPOINTS_AUTH = {
  LOGIN: "/api/Auth/user/login",
  GOOGLE_LOGIN: "/api/Auth/google-login",
  REGISTER: "/api/Auth/user/register/user",
  REGISTER_GOOGLE: "/api/Auth/register-google",
  VERIFY_EMAIL: "/api/Auth/user/otp/verify",
  LOGOUT: "/auth/logout",
  CHANGE_PASSWORD: "/auth/change-password",
  FORGOT_PASSWORD: "/api/Auth/user/password/forgot",
  RESET_PASSWORD: "/api/Auth/user/password/reset",
  // Thêm các endpoint khác
};

export const API_ENDPOINTS_PRODUCT = {
  GET_PRODUCTS: "/api/Product/GetProducts",
  GET_PRODUCTS_BY_ARTISANID: (
    artisanId,
    pageIndex = 1,
    pageSize = 10,
    productStatus = "Active"
  ) =>
    `/api/Product/GetProductsByArtisanId/${artisanId}?pageIndex=${pageIndex}&pageSize=${pageSize}&productStatus=${productStatus}`,
  GET_PRODUCT_BY_ID: (id) => `/api/Product/GetProductByProductId/${id}`,
  GET_SEARCH_PRODUCTS: "/api/Product/SearchProducts",
  CREATE_PRODUCT: "/api/Product/CreateProduct",
  UPDATE_PRODUCT: (id) => `/api/Product/UpdateProduct/${id}`,
  DELETE_PRODUCT: (id) => `/api/Product/DeleteProduct/${id}`,
};

export const API_ENDPOINTS_CART = {
  GET_CART: "/cart",
  ADD_TO_CART: "/cart/add",
  REMOVE_FROM_CART: "/cart/remove",
};

export const API_ENDPOINTS_METERIAL = {
  GET_METERIALS: "/api/Meterial/GetMeterials",
  CREATE_METERIAL: "/api/Meterial/CreateMeterial",
  UPDATE_METERIAL: (id) => `/api/Meterial/UpdateMeterial/${id}`,
  DELETE_METERIAL: (id) => `/api/Meterial/DeleteMeterial/${id}`,
};

export const API_ENDPOINTS_CATEGORY = {
  GET_CATEGORIES: "/api/Category/GetAllCategories",
  CREATE_CATEGORY: "/api/Category/CreateCategory",
};

export const API_ENDPOINTS_SUBCATEGORY = {
  GET_SUBCATEGORIES: "/api/SubCategory/GetAllSubCategories",
  CREATE_SUBCATEGORY: "/api/SubCategory/CreateSubCategory",
};

export const API_ENDPOINTS_USER = {
  GET_USER: "/api/User/get-current-user",
};
