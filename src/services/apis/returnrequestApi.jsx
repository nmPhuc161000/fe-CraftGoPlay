import { API_ENDPOINTS_RETURN_REQUEST } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

const returnRequestService = {
  async createReturnRequest(data) {
    return performApiRequest(
      API_ENDPOINTS_RETURN_REQUEST.CREATE_RETURN_REQUEST,
      {
        method: "post",
        data,
      }
    );
  },

  async getReturnRequestByUserId(userId, pageIndex, pageSize, status) {
    return performApiRequest(
      API_ENDPOINTS_RETURN_REQUEST.GET_RETURN_REQUEST_BY_USER_ID(
        userId,
        pageIndex,
        pageSize,
        status
      ),
      {
        method: "get",
      }
    );
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

  async getListEscalated(pageIndex, pageSize) {
    return performApiRequest(
      API_ENDPOINTS_RETURN_REQUEST.GET_LIST_ESCALATED(pageIndex, pageSize),
      {
        method: "get",
      }
    );
  },

  async updateStatusReturnRequest(
    returnRequestId,
    status,
    rejectReturnReasonEnum
  ) {
    return performApiRequest(
      API_ENDPOINTS_RETURN_REQUEST.UPDATE_STATUS_RETURN_REQUEST(
        returnRequestId,
        status,
        rejectReturnReasonEnum
      ),
      { method: "put" }
    );
  },

  async escalatedReturnRequest(returnRequestId, reason) {
    return performApiRequest(
      API_ENDPOINTS_RETURN_REQUEST.ESCALATED_RETURN_REQUEST(
        returnRequestId,
        reason
      ),
      {
        method: "put",
      }
    );
  },

  async resolveEscalatedRequest(returnRequestId, acceptRefund) {
    return performApiRequest(
      API_ENDPOINTS_RETURN_REQUEST.RESOLVE_ESCALATED_REQUEST(
        returnRequestId,
        acceptRefund
      ),
      {
        method: "put",
      }
    );
  },
};

export default returnRequestService;
