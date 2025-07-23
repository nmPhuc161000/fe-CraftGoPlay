import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_CRAFT_SKILL } from "../../constants/apiEndPoint";

const craftskillService = {
    async getAllCraftSkills() {
        return performApiRequest(API_ENDPOINTS_CRAFT_SKILL.GET_ALL_CRAFT_SKILLS, {
            method: "get",
        });
    },
    async createCraftSkill(craftSkill) {
        return performApiRequest(API_ENDPOINTS_CRAFT_SKILL.CREATE_CRAFT_SKILL, {
            method: "post",
            data: craftSkill,
        });
    },
}
export default craftskillService;