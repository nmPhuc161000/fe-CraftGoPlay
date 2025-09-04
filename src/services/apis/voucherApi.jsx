// services/apis/voucherService.js
import { performApiRequest } from "../../utils/apiUtils";
import { API_ENDPOINTS_VOUCHER } from "../../constants/apiEndPoint";

const validateStatus = (status) => {
    return typeof status === "boolean" ? status : true;
};
const toNumberOrNull = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    return Number(v);
};

const voucherService = {
    async getAllVouchers() {
        return performApiRequest(API_ENDPOINTS_VOUCHER.GET_VOUCHERS, {
            method: "get",
        });
    },

    async createVoucher({ code, name, description, type, discountType, paymentMethod, minOrderValue, maxDiscountAmount, pointChangeAmount, quantity, discount, startDate, endDate, isActive }) {
        if (!code?.trim()) {
            throw new Error("Code là bắt buộc");
        }
        if (!name?.trim()) {
            throw new Error("Name là bắt buộc");
        }
        if (!description?.trim()) {
            throw new Error("Description là bắt buộc");
        }
        if (!discount || isNaN(discount) || Number(discount) <= 0) {
            throw new Error("Discount phải là số lớn hơn 0");
        }
        if (!startDate) {
            throw new Error("StartDate là bắt buộc");
        }
        if (!endDate) {
            throw new Error("EndDate là bắt buộc");
        }
        if (new Date(startDate) >= new Date(endDate)) {
            throw new Error("EndDate phải sau StartDate");
        }
        if (!["Product", "Delivery"].includes(type)) {
            throw new Error("Type phải là Product hoặc Delivery");
        }
        if (!["Percentage", "FixedAmount"].includes(discountType)) {
            throw new Error("DiscountType phải là Percentage hoặc FixedAmount");
        }
        if (!["All", "Cash", "Online"].includes(paymentMethod)) {
            throw new Error("PaymentMethod phải là All, Cash hoặc Online");
        }
        if (minOrderValue && (isNaN(minOrderValue) || Number(minOrderValue) < 0)) {
            throw new Error("MinOrderValue phải là số không âm");
        }
        if (maxDiscountAmount && (isNaN(maxDiscountAmount) || Number(maxDiscountAmount) < 0)) {
            throw new Error("MaxDiscountAmount phải là số không âm");
        }
        if (quantity && (isNaN(quantity) || Number(quantity) < 0)) {
            throw new Error("Quantity phải là số không âm");
        }
        if (
            pointChangeAmount !== "" &&
            pointChangeAmount !== null &&
            pointChangeAmount !== undefined &&
            (isNaN(pointChangeAmount) || Number(pointChangeAmount) < 0)
        ) {
            throw new Error("PointChangeAmount phải là số không âm");
        }

        const formData = new FormData();
        formData.append("Code", code.trim());
        formData.append("Name", name.trim());
        formData.append("Description", description.trim());
        formData.append("Type", type);
        formData.append("DiscountType", discountType);
        formData.append("PaymentMethod", paymentMethod);
        formData.append("MinOrderValue", minOrderValue || "");
        formData.append("MaxDiscountAmount", maxDiscountAmount || "");
        formData.append(
            "PointChangeAmount",
            toNumberOrNull(pointChangeAmount) ?? ""
        );
        formData.append("Quantity", quantity || "");
        formData.append("Discount", discount);
        formData.append("StartDate", startDate);
        formData.append("EndDate", endDate);
        formData.append("IsActive", validateStatus(isActive));

        console.log("Create Voucher Data:", {
            Code: code.trim(),
            Name: name.trim(),
            Description: description.trim(),
            Type: type,
            DiscountType: discountType,
            PaymentMethod: paymentMethod,
            MinOrderValue: minOrderValue || "",
            MaxDiscountAmount: maxDiscountAmount || "",
            PointChangeAmount: toNumberOrNull(pointChangeAmount) ?? "",
            Quantity: quantity || "",
            Discount: discount,
            StartDate: startDate,
            EndDate: endDate,
            IsActive: validateStatus(isActive),
        });

        return performApiRequest(API_ENDPOINTS_VOUCHER.CREATE_VOUCHER, {
            method: "post",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    async updateVoucher(id, { code, name, description, type, discountType, paymentMethod, minOrderValue, maxDiscountAmount, usedCount, pointChangeAmount, quantity, discount, startDate, endDate, isActive }) {
        if (!id) {
            throw new Error("Id là bắt buộc");
        }
        if (!code?.trim()) {
            throw new Error("Code là bắt buộc");
        }
        if (!name?.trim()) {
            throw new Error("Name là bắt buộc");
        }
        if (!description?.trim()) {
            throw new Error("Description là bắt buộc");
        }
        if (!discount || isNaN(discount) || Number(discount) <= 0) {
            throw new Error("Discount phải là số lớn hơn 0");
        }
        if (!startDate) {
            throw new Error("StartDate là bắt buộc");
        }
        if (!endDate) {
            throw new Error("EndDate là bắt buộc");
        }
        if (new Date(startDate) >= new Date(endDate)) {
            throw new Error("EndDate phải sau StartDate");
        }
        if (!["Product", "Delivery"].includes(type)) {
            throw new Error("Type phải là Product hoặc Delivery");
        }
        if (!["Percentage", "FixedAmount"].includes(discountType)) {
            throw new Error("DiscountType phải là Percentage hoặc FixedAmount");
        }
        if (!["All", "Cash", "Online"].includes(paymentMethod)) {
            throw new Error("PaymentMethod phải là All, Cash hoặc Online");
        }
        if (minOrderValue && (isNaN(minOrderValue) || Number(minOrderValue) < 0)) {
            throw new Error("MinOrderValue phải là số không âm");
        }
        if (maxDiscountAmount && (isNaN(maxDiscountAmount) || Number(maxDiscountAmount) < 0)) {
            throw new Error("MaxDiscountAmount phải là số không âm");
        }
        if (quantity && (isNaN(quantity) || Number(quantity) < 0)) {
            throw new Error("Quantity phải là số không âm");
        }
        if (
            pointChangeAmount !== "" &&
            pointChangeAmount !== null &&
            pointChangeAmount !== undefined &&
            (isNaN(pointChangeAmount) || Number(pointChangeAmount) < 0)
        ) {
            throw new Error("PointChangeAmount phải là số không âm");
        }

        const formData = new FormData();
        formData.append("Id", id);
        formData.append("Code", code.trim());
        formData.append("Name", name.trim());
        formData.append("Description", description.trim());
        formData.append("Type", type);
        formData.append("DiscountType", discountType);
        formData.append("PaymentMethod", paymentMethod);
        formData.append("MinOrderValue", minOrderValue || "");
        formData.append("MaxDiscountAmount", maxDiscountAmount || "");
        formData.append(
            "PointChangeAmount",
            toNumberOrNull(pointChangeAmount) ?? ""
        );
        formData.append("UsedCount", usedCount || "0");
        formData.append("Quantity", quantity || "");
        formData.append("Discount", discount);
        formData.append("StartDate", startDate);
        formData.append("EndDate", endDate);
        formData.append("IsActive", validateStatus(isActive));

        console.log("Update Voucher Data:", {
            Id: id,
            Code: code.trim(),
            Name: name.trim(),
            Description: description.trim(),
            Type: type,
            DiscountType: discountType,
            PaymentMethod: paymentMethod,
            MinOrderValue: minOrderValue || "",
            MaxDiscountAmount: maxDiscountAmount || "",
            PointChangeAmount: toNumberOrNull(pointChangeAmount) ?? "",
            UsedCount: usedCount || "0",
            Quantity: quantity || "",
            Discount: discount,
            StartDate: startDate,
            EndDate: endDate,
            IsActive: validateStatus(isActive),
        });

        return performApiRequest(API_ENDPOINTS_VOUCHER.UPDATE_VOUCHER, {
            method: "put",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

export default voucherService;