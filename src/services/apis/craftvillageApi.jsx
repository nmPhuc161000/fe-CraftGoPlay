import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_CRAFTVILLAGE } from "../../constants/apiEndPoint";

const CraftVillageService = {
  async getCraftVillages() {
    return performApiRequest(API_ENDPOINTS_CRAFTVILLAGE.GET_CRAFTVILLAGES, {
      method: "get",
    });
  },

  async getCraftVillageById(id) {
    return performApiRequest(
      API_ENDPOINTS_CRAFTVILLAGE.GET_CRAFTVILLAGE_BY_ID(id),
      {
        method: "get",
      }
    );
  },

  async createCraftVillage(formData) {
    return performApiRequest(
      API_ENDPOINTS_CRAFTVILLAGE.CREATE_NEW_CRAFTVILLAGE,
      {
        method: "post",
        data: formData,
      }
    );
  },
};

export default CraftVillageService;
