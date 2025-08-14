import { API_ENDPOINTS_RETURN_REQUEST } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

const returnRequestService = {
    async createReturnRequest(data) {
        return performApiRequest(API_ENDPOINTS_RETURN_REQUEST.CREATE_RETURN_REQUEST, {
            method: "post",
            data,
        });
    },

    async getReturnRequestByArtisanId(artisanId, pageIndex, pageSize, status) {
    return performApiRequest(
      API_ENDPOINTS_RETURN_REQUEST.GET_RETURN_REQUEST_BY_ARTISAN_ID(
        artisanId,
        pageIndex,
        pageSize,
        status
      ),
      {
        method: "get",
      }
    );
  },
  
  async updateStatusReturnRequest(returnRequestId, status) {
    return performApiRequest(
      API_ENDPOINTS_RETURN_REQUEST.UPDATE_STATUS_RETURN_REQUEST(returnRequestId, status),
      {
        method: "put",
      }
    );
  },
};

export default returnRequestService;