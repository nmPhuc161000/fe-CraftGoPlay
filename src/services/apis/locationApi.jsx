// src/services/api/locationApi.jsx
import axios from "axios";

const ghnApi = axios.create({
  baseURL: "https://online-gateway.ghn.vn/shiip/public-api",
  headers: {
    "Content-Type": "application/json",
    Token: import.meta.env.VITE_TOKEN_GHN, // Nhớ thay token thực
  },
});

const locationService = {
  // Không cần try/catch khi chỉ throw error
  getProvince: () =>
    ghnApi.get("/master-data/province").then((res) => res.data),

  getDistrict: (provinceId) =>
    ghnApi
      .post("/master-data/district", { province_id: provinceId })
      .then((res) => res.data),

  getWard: (districtId) =>
    ghnApi
      .post("/master-data/ward", { district_id: districtId })
      .then((res) => res.data),

  getFeeShip: (data) => {
    return ghnApi.post("/v2/shipping-order/fee", data, {
      headers: {
        ShopId: import.meta.env.VITE_SHOPID_GHN,
      }
    })
    .then(res => res.data)
    .catch(error => {
      throw error.response ? error.response.data : error;
    });
  }
};

export default locationService;
