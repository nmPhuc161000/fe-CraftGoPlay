import { API_ENDPOINTS_RATING } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

const ratingService = {
    async rateProduct(data) {
        return performApiRequest(API_ENDPOINTS_RATING.RATE_PRODUCT, {
            method: "post",
            data,
        });
    },
};

export default ratingService;
