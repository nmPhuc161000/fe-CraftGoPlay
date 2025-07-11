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
  UPDATE_PRODUCT: `/api/Product/UpdateProduct`,
  DELETE_PRODUCT: (id) => `/api/Product/DeleteProduct/${id}`,
  GET_PRODUCTS_BY_STATUS: (status, pageIndex, pageSize) =>
    `/api/Product/GetProductsByStatus?pageIndex=${pageIndex}&pageSize=${pageSize}&productStatus=${status}`,
};

export const API_ENDPOINTS_CART = {
  GET_CART: (userId) => `/api/Cart/GetAllItemCart/${userId}`,
  ADD_TO_CART: (userId) => `/api/Cart/AddToCart/${userId}`,
  UPDATE_ITEM: "/api/Cart/UpdateCart",
  REMOVE_FROM_CART: (cartItemId) => `/api/Cart/Delete/${cartItemId}`,
};

export const API_ENDPOINTS_CRAFTVILLAGE = {
  GET_CRAFTVILLAGES: "/api/CraftVillage/GetAllCraftVillages",
  GET_CRAFTVILLAGE_BY_ID: (id) => `/api/CraftVillage/GetCraftVillageById/${id}`,
  CREATE_NEW_CRAFTVILLAGE: "/api/CraftVillage/CreateNewCraftVillage",
  UPDATE_CRAFTVILLAGE: (id) => `/api/CraftVillage/UpdateCraftVillage/${id}`,
  DELETE_CRAFTVILLAGE: (id) => `/api/CraftVillage/DeleteCraftVillage/${id}`,
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
  SEND_REQUEST_UPGRADE_ARTISAN: "/api/User/SendRequestUpgradeToArtisan",
  GET_SEND_REQUEST_UPGRADE_ARTISAN: (userId) => `/api/User/GetSentRequestByUserId/${userId}`,
  CHECK_SEND_REQUEST_UPGRADE_ARTISAN: (userId) => `/api/User/CheckRequestSent/${userId}`,
  CANCEL_REQUEST_UPGRADE_ARTISAN: (userId) => `/api/User/CancelRequest/${userId}`,
  RESEND_SEND_REQUEST_UPGRADE_ARTISAN: (userId, requestId) => `/api/User/ResendRequest?userId=${userId}&requestId=${requestId}`,
  UPDATE_INFORMATION_USER: "/api/User/UpdateInfoUser",
};

export const API_ENDPOINTS_FAVORITE = {
  GET_FAVORITE: (id) => `/api/Favourite/GetFavourites/${id}`,
  GET_CHECKFAVORITE: (userId, productId) =>
    `/api/Favourite/CheckFavourite?userId=${userId}&productId=${productId}`,
  ADD_FAVORITE: "/api/Favourite/AddFavourite",
  DELETE_FAVORITE: (userId, productId) => `/api/Favourite/DeleteFavourite?userId=${userId}&productId=${productId}`,
};

export const API_ENDPOINTS_ADDRESS = {
  GET_ADDRESS: (userId) => `/api/UserAddress/GetAddress/${userId}`,
  ADD_ADDRESS: "/api/UserAddress/AddNewAddress",
  UPDATE_ADDRESS: (addressId) => `/api/UserAddress/UpdateAddress/${addressId}`,
  DELTE_ADDRESS: (addressId) => `/api/UserAddress/DeleteAddress/${addressId}`,
};
