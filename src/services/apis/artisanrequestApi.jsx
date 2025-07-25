import { API_ENDPOINTS_ARTISANREQUEST } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

const artisanRequestService = {
    async getAllRequest() {
        return performApiRequest(API_ENDPOINTS_ARTISANREQUEST.GET_ALL_REQUEST, {
            method: "get"
        })
    },
    async getRequestById(userId) {
        return performApiRequest(API_ENDPOINTS_ARTISANREQUEST.GET_REQUEST_BY_ID(userId), {
            method: "get"
        })
    },
    async approveRequest(id) {
        return performApiRequest(API_ENDPOINTS_ARTISANREQUEST.APRROVE_REQUEST(id), {
            method: "put"
        })
    },
    async rejectRequest(id, reason) {
        return performApiRequest(API_ENDPOINTS_ARTISANREQUEST.REJECT_REQUEST, {
            method: "put",
            data: { id, reason }
        })
    }
}

export default artisanRequestService;