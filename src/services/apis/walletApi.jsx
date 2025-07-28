import { API_ENDPOINTS_WALLET } from "../../constants/apiEndPoint";
import { performApiRequest } from "../../utils/apiUtils";

const walletService = {
    async getWalletByUserId(userId) {
        return performApiRequest(API_ENDPOINTS_WALLET.GET_WALLET_BY_USER_ID(userId), {
            method: "get",
        });
    },
};

export default walletService;
