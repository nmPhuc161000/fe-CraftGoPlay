import axios from "../axiosInstance";
import { API_ENDPOINTS_AUTH } from "../../constants/api";

const handleApiCall = async (apiFunc, fallback = null) => {
  try {
    const response = await apiFunc();
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.data.message || error.message);
    } else {
      console.error("Unexpected Error:", error.message);
    }
    return fallback;
  }
};

export const login = (data) =>
  handleApiCall(() => {
    axios.post(API_ENDPOINTS_AUTH.LOGIN, data);
    console.log(data);
  });

export const register = (data) =>
  handleApiCall(() => axios.post(API_ENDPOINTS_AUTH.REGISTER, data));

export const logout = () =>
  handleApiCall(() => axios.post(API_ENDPOINTS_AUTH.LOGOUT));

export const changePassword = (data) =>
  handleApiCall(() => axios.put(API_ENDPOINTS_AUTH.CHANGE_PASSWORD, data));

export const forgotPassword = (data) =>
  handleApiCall(() => axios.post(API_ENDPOINTS_AUTH.FORGOT_PASSWORD, data));

export const resetPassword = (data) =>
  handleApiCall(() => axios.post(API_ENDPOINTS_AUTH.RESET_PASSWORD, data));

export const verifyEmail = (data) =>
  handleApiCall(() => axios.post(API_ENDPOINTS_AUTH.VERIFY_EMAIL, data));
