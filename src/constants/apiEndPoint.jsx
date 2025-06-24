export const API_BASE_URL = "https://localhost:7254";

export const API_ENDPOINTS_AUTH = {
  LOGIN: "/api/Auth/user/login",
  REGISTER: "/auth/register",
  VERIFY_EMAIL: "/auth/verify-email",
  LOGOUT: "/auth/logout",
  CHANGE_PASSWORD: "/auth/change-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  // Thêm các endpoint khác
};

export const API_ENDPOINTS_PRODUCT = {
  GET_PRODUCTS: "/products",
  GET_PRODUCT_BY_ID: (id) => `/products/${id}`,
  ADD_PRODUCT: "/products/add",
};

export const API_ENDPOINTS_CART = {
  GET_CART: "/cart",
  ADD_TO_CART: "/cart/add",
  REMOVE_FROM_CART: "/cart/remove",
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
