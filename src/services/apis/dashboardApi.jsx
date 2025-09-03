import { API_ENDPOINTS_DASHBOARD } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

const dashBoardService = {
  async getDashBoardForAdmin(type, from, to) {
    return await performApiRequest(
      API_ENDPOINTS_DASHBOARD.GET_DASHBOARD_FOR_ADMIN(type, from, to),
      {
        method: "get",
      }
    );
  },

  async getDashBoardForArtisan(artisanId, type, from, to) {
    return await performApiRequest(
      API_ENDPOINTS_DASHBOARD.GET_DASHBOARD_FOR_ARTISAN(
        artisanId,
        type,
        from,
        to
      ),
      {
        method: "get",
      }
    );
  },
};

export default dashBoardService;
