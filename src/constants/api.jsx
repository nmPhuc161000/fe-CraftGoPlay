export const API_BASE_URL = 'https://your-api-base-url.com/api';

export const API_ENDPOINTS_AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  LOGOUT: '/auth/logout',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  // Thêm các endpoint khác
};

export const API_ENDPOINTS_HOME = {
  GET_PRODUCTS: '/products',
  GET_PRODUCT_BY_ID: (id) => `/products/${id}`,
  GET_CATEGORIES: '/categories',
};

export const API_ENDPOINTS_CART = {
  GET_CART: '/cart',
  ADD_TO_CART: '/cart/add',
  REMOVE_FROM_CART: '/cart/remove',
};