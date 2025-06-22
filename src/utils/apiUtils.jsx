import axiosInstance from "../services/axiosInstance";

export const performApiRequest = async (
  endpoint,
  { data = {}, method = "post", params } = {}
) => {
  try {
    let response;
    method = method.toLowerCase(); // Chuẩn hóa method

    if (method === "get" && params) {
      response = await axiosInstance.get(endpoint, { params });
    } else if (method === "put") {
      response = await axiosInstance.put(endpoint, data); // Sử dụng data cho PUT
    } else if (method === "delete") {
      // Cho phép cả data (nếu API yêu cầu) và params
      response = params
        ? await axiosInstance.delete(endpoint, { params })
        : await axiosInstance.delete(endpoint, data);
    } else {
      // Mặc định cho post và các phương thức khác
      response = await axiosInstance[method](endpoint, data);
    }

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return handleError(error);
  }
};

export const handleError = (error) => {
  if (error.response) {
    console.error(`API Error [${error.response.status}]:`, error.response.data);
    const errorMessage = error.response.data?.errors
      ? Object.values(error.response.data.errors).join(", ")
      : error.response.data?.message || "Lỗi server";
    return {
      success: false,
      error: errorMessage,
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    console.error("Network Error:", error.message);
    return {
      success: false,
      error: "Không thể kết nối tới server",
      status: null,
    };
  } else {
    console.error("Request Error:", error.message);
    return {
      success: false,
      error: error.message || "Lỗi khi gửi yêu cầu",
      status: null,
    };
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
