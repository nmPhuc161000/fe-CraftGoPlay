import { API_ENDPOINTS_RATING } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

const ratingService = {
    async rateProduct(data) {
        return performApiRequest(API_ENDPOINTS_RATING.RATE_PRODUCT, {
            method: "post",
            data,
        });
    },
    async getRatingsByUserId(userId, pageIndex = 0, pageSize = 10) {
        const url = API_ENDPOINTS_RATING.GET_RATINGS_BY_USER_ID(userId, pageIndex, pageSize);
        return performApiRequest(url, {
            method: "get",
        });
    },
};

export default ratingService;
