import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_CATEGORY } from "../../constants/apiEndPoint";

const categoryService = {
  async getAllCategories() {
    performApiRequest(API_ENDPOINTS_CATEGORY.GET_CATEGORIES, {
      method: "get",
    });
  },
};

export default categoryService;
