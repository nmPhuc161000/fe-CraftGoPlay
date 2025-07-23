// /src/services/apis/addressApi.jsx
import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_ADDRESS } from "../../constants/apiEndPoint";

const addressService = {
  async getUserAddresses(userId) {
    return performApiRequest(API_ENDPOINTS_ADDRESS.GET_ADDRESS(userId), {
      method: "get",
    });
  },

    async getDefaultAddress(userId) {
    return performApiRequest(API_ENDPOINTS_ADDRESS.GET_DEFAULT_ADDRESS(userId), {
      method: "get",
    });
  },

  async addNewAddress(addressData) {
    const formData = new FormData();

    // Thêm các field vào formData
    Object.keys(addressData).forEach((key) => {
      formData.append(key, addressData[key]);
    });

    return performApiRequest(API_ENDPOINTS_ADDRESS.ADD_ADDRESS, {
      method: "post",
      data: formData,
    });
  },

  async updateAddress(addressId, addressData) {
    const formData = new FormData();
    // Thêm các field vào formData
    Object.keys(addressData).forEach((key) => {
      formData.append(key, addressData[key]);
    });
    return performApiRequest(API_ENDPOINTS_ADDRESS.UPDATE_ADDRESS(addressId), {
      method: "patch",
      data: formData,
    });
  },

  async setDefaultAddress(addressId) {
    return performApiRequest(
      API_ENDPOINTS_ADDRESS.SET_DEFAULT_ADDRESS(addressId),
      {
        method: "patch",
      }
    );
  },
  async deleteAddress(addressId) {
    return performApiRequest(API_ENDPOINTS_ADDRESS.DELETE_ADDRESS(addressId), {
      method: "delete",
    });
  },
};

export default addressService;
