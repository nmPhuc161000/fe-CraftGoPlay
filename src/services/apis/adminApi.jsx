import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_ADMIN } from "../../constants/apiEndPoint";

// Service cho admin
const adminService = {
  async getAllAccount({ pageIndex = 1, pageSize = 10, status, role }) {
    return performApiRequest(
      API_ENDPOINTS_ADMIN.GET_ALL_ACCOUNT(pageIndex, pageSize, status, role),
      {
        method: "get",
      }
    );
  },

  async getCountUserByRole() {
    return performApiRequest(API_ENDPOINTS_ADMIN.COUNT_USER_BY_ROLE, {
        method: "get",
        }
    )
  },

  async getCountAllOrder() {
    return performApiRequest(API_ENDPOINTS_ADMIN.COUNT_ALL_ORDER, {
        method: "get",
        }
    )
  },

  async createStaff(staffData) {
    return performApiRequest(API_ENDPOINTS_ADMIN.CREATE_NEW_ACCOUNT_STAFF, {
      method: "post",
      data: staffData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default adminService;
