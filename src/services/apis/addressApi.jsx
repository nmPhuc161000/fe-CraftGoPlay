// /src/services/apis/addressApi.jsx
import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_ADDRESS } from "../../constants/apiEndPoint";

const addressService = {
  async getUserAddresses(userId) {
    return performApiRequest(API_ENDPOINTS_ADDRESS.GET_ADDRESS(userId), {
      method: "get",
    });
  },

  async addNewAddress(addressData) {
    const formData = new FormData();
    
    // Thêm các field vào formData
    Object.keys(addressData).forEach(key => {
      formData.append(key, addressData[key]);
    });

    return performApiRequest(API_ENDPOINTS_ADDRESS.ADD_ADDRESS, {
      method: "post",
      data: formData,
    });
  },
};

export default addressService;
