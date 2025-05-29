import axios from "../axiosInstance";
import { API_ENDPOINTS_HOME } from "../../constants/api";

export const getProducts = () => axios.get(API_ENDPOINTS_HOME.GET_PRODUCTS);
export const getProductById = (id) => axios.get(`${API_ENDPOINTS_HOME.GET_PRODUCT_BY_ID}/${id}`);
export const getCategories = () => axios.get(API_ENDPOINTS_HOME.GET_CATEGORIES);