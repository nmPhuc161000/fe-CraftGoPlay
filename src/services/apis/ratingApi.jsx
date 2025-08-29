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
    const url = API_ENDPOINTS_RATING.GET_RATINGS_BY_USER_ID(
      userId,
      pageIndex,
      pageSize
    );
    return performApiRequest(url, {
      method: "get",
    });
  },
  async getRatingsByProductId(productId, pageIndex = 0, pageSize = 10) {
    const url = API_ENDPOINTS_RATING.GET_RATINGS_BY_PRODUCT_ID(
      productId,
      pageIndex,
      pageSize
    );
    return performApiRequest(url, {
      method: "get",
    });
  },
  async getRatingsByArtisanId(artisanId, pageIndex = 0, pageSize = 10) {
    const url = API_ENDPOINTS_RATING.GET_RATINGS_BY_ARTISAN_ID(
      artisanId,
      pageIndex,
      pageSize
    );
    return performApiRequest(url, { method: "get" });
  },
  async checkRated(data) {
    return performApiRequest(API_ENDPOINTS_RATING.CHECK_RATED, {
      method: "post",
      data,
    });
  },
};

export default ratingService;
