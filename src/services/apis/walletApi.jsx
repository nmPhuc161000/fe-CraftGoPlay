import { API_ENDPOINTS_WALLET } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

const walletService = {
  async getWalletByUserId(userId) {
    return performApiRequest(
      API_ENDPOINTS_WALLET.GET_WALLET_BY_USER_ID(userId),
      {
        method: "get",
      }
    );
  },

  async getWalletByArtisanId(artisanId) {
    return performApiRequest(
      API_ENDPOINTS_WALLET.GET_WALLET_BY_ARTISAN_ID(artisanId),
      {
        method: "get",
      }
    );
  },

  async getWalletSystem() {
    return performApiRequest(API_ENDPOINTS_WALLET.GET_WALLET_SYSTEM, {
      method: "get",
    });
  },

  async withdrawal(amount) {
    return performApiRequest(API_ENDPOINTS_WALLET.WITHDRAWAL, {
      method: "post",
      data: amount,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default walletService;
