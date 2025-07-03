import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_ADDRESS } from "../../constants/apiEndPoint";

const addressService = {
  async getUserAddresses(userId) {
    return performApiRequest(API_ENDPOINTS_ADDRESS.GET_ADDRESS(userId), {
      method: "get",
    });
  },
};

export default addressService;
