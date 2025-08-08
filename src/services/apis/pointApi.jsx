import { API_ENDPOINTS_POINT } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

const pointService = {
  async getPointByUserId(userId) {
    return performApiRequest(API_ENDPOINTS_POINT.GET_POINT_BY_USER_ID(userId), {
      method: "get",
    });
  },
};

export default pointService;
