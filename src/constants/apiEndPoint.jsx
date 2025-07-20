export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Các endpoint cho xác thực
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

// Các endpoint cho sản phẩm
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

// Các endpoint cho giỏ hàng
export const API_ENDPOINTS_CART = {
  GET_CART: (userId) => `/api/Cart/GetAllItemCart/${userId}`,
  ADD_TO_CART: (userId) => `/api/Cart/AddToCart/${userId}`,
  UPDATE_ITEM: "/api/Cart/UpdateCart",
  REMOVE_FROM_CART: (cartItemId) => `/api/Cart/Delete/${cartItemId}`,
};

// Các endpoint cho làng nghề
export const API_ENDPOINTS_CRAFTVILLAGE = {
  GET_CRAFTVILLAGES: "/api/CraftVillage/GetAllCraftVillages",
  GET_CRAFTVILLAGE_BY_ID: (id) => `/api/CraftVillage/GetCraftVillageById/${id}`,
  CREATE_NEW_CRAFTVILLAGE: "/api/CraftVillage/CreateNewCraftVillage",
  UPDATE_CRAFTVILLAGE: (id) => `/api/CraftVillage/UpdateCraftVillage/${id}`,
  DELETE_CRAFTVILLAGE: (id) => `/api/CraftVillage/DeleteCraftVillage/${id}`,
};

// Các endpoint cho nguyên liệu
export const API_ENDPOINTS_METERIAL = {
  GET_METERIALS: "/api/Meterial/GetMeterials",
  CREATE_METERIAL: "/api/Meterial/CreateMeterial",
  UPDATE_METERIAL: (id) => `/api/Meterial/UpdateMeterial/${id}`,
  DELETE_METERIAL: (id) => `/api/Meterial/DeleteMeterial/${id}`,
};

// Các endpoint cho danh mục
export const API_ENDPOINTS_CATEGORY = {
  GET_CATEGORIES: "/api/Category/GetAllCategories",
  CREATE_CATEGORY: "/api/Category/CreateCategory",
  UPDATE_CATEGORY: (categoryId) => `/api/Category/UpdateCategory/${categoryId}`,
  DELETE_CATEGORY: (categoryId) =>
    `/api/Category/CategoryId/Delete?CategoryId=${categoryId}`,
};

// Các endpoint cho danh mục con
export const API_ENDPOINTS_SUBCATEGORY = {
  GET_SUBCATEGORIES: "/api/SubCategory/GetAllSubCategories",
  CREATE_SUBCATEGORY: "/api/SubCategory/CreateSubCategory",
  UPDATE_SUBCATEGORY: (id) => `/api/SubCategory/UpdateSubCategory/${id}`,
  DELETE_SUBCATEGORY: (id) => `/api/SubCategory/DeleteSubCategory/${id}`,
};

// Các endpoint cho user
export const API_ENDPOINTS_USER = {
  GET_USER: "/api/User/GetCurrentUser",
  SEND_REQUEST_UPGRADE_ARTISAN: "/api/User/SendRequestUpgradeToArtisan",
  GET_SEND_REQUEST_UPGRADE_ARTISAN: (userId) =>
    `/api/User/GetSentRequestByUserId/${userId}`,
  CHECK_SEND_REQUEST_UPGRADE_ARTISAN: (userId) =>
    `/api/User/CheckRequestSent/${userId}`,
  CANCEL_REQUEST_UPGRADE_ARTISAN: (userId) =>
    `/api/User/CancelRequest/${userId}`,
  RESEND_SEND_REQUEST_UPGRADE_ARTISAN: (userId, requestId) =>
    `/api/User/ResendRequest?userId=${userId}&requestId=${requestId}`,
  UPDATE_INFORMATION_USER: "/api/User/UpdateInfoUser",
  UPDATE_INFORMATION_ARTISAN: "/api/User/UpdateInfoUser",
};

// Các endpoint cho yêu thích
export const API_ENDPOINTS_FAVORITE = {
  GET_FAVORITE: (id) => `/api/Favourite/GetFavourites/${id}`,
  GET_CHECKFAVORITE: (userId, productId) =>
    `/api/Favourite/CheckFavourite?userId=${userId}&productId=${productId}`,
  ADD_FAVORITE: "/api/Favourite/AddFavourite",
  DELETE_FAVORITE: (userId, productId) =>
    `/api/Favourite/DeleteFavourite?userId=${userId}&productId=${productId}`,
};

// Các endpoint cho địa chỉ
export const API_ENDPOINTS_ADDRESS = {
  GET_ADDRESS: (userId) => `/api/UserAddress/GetAddress/${userId}`,
  ADD_ADDRESS: "/api/UserAddress/AddNewAddress",
  UPDATE_ADDRESS: (addressId) => `/api/UserAddress/UpdateAddress/${addressId}`,
  SET_DEFAULT_ADDRESS: (addressId) =>
    `/api/UserAddress/SetDefaultAddress/${addressId}`,
  DELETE_ADDRESS: (addressId) => `/api/UserAddress/DeleteAddress/${addressId}`,
};

export const API_ENDPOINTS_ORDER = {
  GET_ORDERSBYUSERID: (userId) => `/api/Order/GetOrdersByUserId/${userId}`,
  GET_ORDERSBYARTISANID: (artisanId) =>
    `/api/Order/GetOrdersByArtisanId/${artisanId}`,
  GET_ORDERBYORDERID: (orderId) => `/api/Order/GetOrderByOrderId/${orderId}`,
  GET_VNPAY_URL: (orderId) => `/api/Order/VnpayUrl/${orderId}`,
  VNPAY_RETURN: "/api/Order/vnpay-return",
  CREATE_FROM_CART: "/api/Order/CreateFromCart",
  CREATE_DIRECT: "/api/Order/CreateDirect",
  UPDATE_STATUS_ORDER: (orderId) => `/api/Order/status/${orderId}`,
};

// Các endpoint cho admin (theo hình ảnh bạn cung cấp)
export const API_ENDPOINTS_ADMIN = {
  GET_ACCOUNTS_BY_STATUS: "/api/Admin/GetAllAccountByStatus",
  CREATE_ACCOUNT: "/api/Admin/CreateNewAccount",
  UPDATE_ACCOUNT: "/api/Admin/UpdateAccount",
  DELETE_ACCOUNT: (id) => `/api/Admin/DeleteAccount/${id}`,
};
