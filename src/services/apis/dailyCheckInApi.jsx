import { API_ENDPOINTS_DAILY_CHECKIN } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

const DailyCheckInService = {
  async hasCheckedIn(userId) {
    return performApiRequest(API_ENDPOINTS_DAILY_CHECKIN.HASCHECKEDIN(userId), {
      method: "get",
    });
  },
  async getCurrentStreak(userId) {
    return performApiRequest(
      API_ENDPOINTS_DAILY_CHECKIN.GET_CURRENT_STREAK(userId),
      {
        method: "get",
      }
    );
  },
  async checkIn(data) {
    return performApiRequest(API_ENDPOINTS_DAILY_CHECKIN.CHECK_IN, {
      method: "post",
      data: data,
    });
  },
  async updateStreak(userId) {
    return performApiRequest(
      API_ENDPOINTS_DAILY_CHECKIN.UPDATE_STREAK(userId),
      {
        method: "post",
      }
    );
  },
};
export default DailyCheckInService;
