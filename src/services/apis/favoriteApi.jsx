import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_FAVORITE } from "../../constants/apiEndPoint";

const favoriteService = {
  //   getAllCategories: () =>
  //     performApiRequest(API_ENDPOINTS_CATEGORY.GET_CATEGORIES, {
  //       method: "get",
  //     }),

  async getFavorite(userId) {
    return performApiRequest(API_ENDPOINTS_FAVORITE.GET_FAVORITE(userId), {
      method: "get",
    });
  },

  async getCheckFavorite(userId, productId) {
    return performApiRequest(
      API_ENDPOINTS_FAVORITE.GET_CHECKFAVORITE(userId, productId),
      {
        method: "get",
      }
    );
  },

  async addFavorite(favoriteData) {
    return performApiRequest(API_ENDPOINTS_FAVORITE.ADD_FAVORITE, {
      method: "post",
      data: favoriteData,
    });
  },

  async deleteFavorite(id) {
    return performApiRequest(API_ENDPOINTS_FAVORITE.DELETE_FAVORITE(id), {
      method: "delete",
    });
  },
};

export default favoriteService;
