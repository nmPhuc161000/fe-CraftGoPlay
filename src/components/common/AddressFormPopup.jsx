import React, { useEffect, useState } from "react";
import {
  FiX,
  FiUser,
  FiPhone,
  FiMapPin,
  FiHome,
  FiCheck,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

export default function AddressFormPopup({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  provinces = [],
  districts = [],
  wards = [],
  onProvinceChange,
  onDistrictChange,
}) {
  const [formData, setFormData] = useState({
    recipientName: "",
    phoneNumber: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    addressType: "HOME", // "HOME" | "OFFICE"
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        recipientName: initialData.recipientName || "",
        phoneNumber: initialData.phoneNumber || "",
        province: initialData.province || "",
        district: initialData.district || "",
        ward: initialData.ward || "",
        street: initialData.street || "",
        addressType: initialData.addressType || "HOME",
        isDefault: initialData.isDefault || false,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Vui lòng nhập họ và tên";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (!formData.province) {
      newErrors.province = "Vui lòng chọn tỉnh/thành phố";
    }

    if (!formData.district) {
      newErrors.district = "Vui lòng chọn quận/huyện";
    }

    if (!formData.ward) {
      newErrors.ward = "Vui lòng chọn phường/xã";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Vui lòng nhập địa chỉ cụ thể";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "province") {
      onProvinceChange?.(value);
      setFormData((prev) => ({
        ...prev,
        district: "",
        ward: "",
      }));
    }
    if (name === "district") {
      onDistrictChange?.(value);
      setFormData((prev) => ({
        ...prev,
        ward: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Thay đổi chính: giảm max-w-4xl xuống max-w-md và bỏ overflow-y-auto */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto transform transition-all duration-300">
        {/* Header - giảm padding và kích thước */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8f693b] to-[#6b4f2a] rounded-full flex items-center justify-center">
              <FiMapPin className="text-white" size={16} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/50 rounded-full transition-all duration-200"
          >
            <FiX size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Form - giảm padding và kích thước các phần tử */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#8f693b] to-[#6b4f2a] rounded-full flex items-center justify-center">
                <FiUser className="text-white" size={12} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Thông tin người nhận
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 text-gray-400 group-focus-within:text-[#8f693b]" />
                </div>
                <input
                  type="text"
                  name="recipientName"
                  placeholder="Họ và tên"
                  value={formData.recipientName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8f693b]/20 focus:border-[#8f693b] transition-all placeholder-gray-400 text-base ${
                    errors.recipientName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
                  }`}
                />
                {errors.recipientName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.recipientName}
                  </p>
                )}
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-4 w-4 text-gray-400 group-focus-within:text-[#8f693b]" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Số điện thoại"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8f693b]/20 focus:border-[#8f693b] transition-all placeholder-gray-400 text-base ${
                    errors.phoneNumber
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information - Đã điều chỉnh độ rộng */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#a67c52] to-[#8f693b] rounded-full flex items-center justify-center">
                <FiMapPin className="text-white" size={12} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Địa chỉ giao hàng
              </h3>
            </div>

            <div className="space-y-4">
              {/* Tăng gap từ 2 lên 3 và điều chỉnh padding */}
              <div className="grid grid-cols-3 gap-4">
                <div className="relative group">
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-8 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8f693b]/20 focus:border-[#8f693b] transition-all appearance-none cursor-pointer text-sm ${
                      errors.province
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
                    }`}
                  >
                    <option value="">Tỉnh/Thành</option>
                    {provinces.map((p) => (
                      <option key={p.ProvinceID} value={p.ProvinceName}>
                        {p.ProvinceName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {errors.province && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.province}
                    </p>
                  )}
                </div>

                <div className="relative group">
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-8 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8f693b]/20 focus:border-[#8f693b] transition-all appearance-none cursor-pointer text-sm ${
                      errors.district
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
                    } ${
                      !formData.province ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!formData.province}
                  >
                    <option value="">Quận/Huyện</option>
                    {districts.map((d) => (
                      <option key={d.DistrictID} value={d.DistrictName}>
                        {d.DistrictName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {errors.district && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.district}
                    </p>
                  )}
                </div>

                <div className="relative group">
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-8 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8f693b]/20 focus:border-[#8f693b] transition-all appearance-none cursor-pointer text-sm ${
                      errors.ward
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
                    } ${
                      !formData.district ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!formData.district}
                  >
                    <option value="">Phường/Xã</option>
                    {wards.map((w) => (
                      <option key={w.WardCode} value={w.WardName}>
                        {w.WardName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {errors.ward && (
                    <p className="mt-1 text-xs text-red-500">{errors.ward}</p>
                  )}
                </div>
              </div>

              {/* Phần địa chỉ chi tiết - giữ nguyên */}
              <div className="relative group">
                <input
                  type="text"
                  name="street"
                  placeholder="Số nhà, tên đường..."
                  value={formData.street}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8f693b]/20 focus:border-[#8f693b] transition-all placeholder-gray-400 text-sm ${
                    errors.street
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
                  }`}
                />
                {errors.street && (
                  <p className="mt-1 text-xs text-red-500">{errors.street}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Type */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#c49b61] to-[#8f693b] rounded-full flex items-center justify-center">
                <FiHome className="text-white" size={12} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Loại địa chỉ
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, addressType: "HOME" })
                }
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  formData.addressType === "HOME"
                    ? "border-[#8f693b] bg-gradient-to-br from-amber-50 to-yellow-50 text-[#8f693b] shadow-sm"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <FiHome size={18} />
                <span className="font-medium text-sm">Nhà riêng</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, addressType: "OFFICE" })
                }
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  formData.addressType === "OFFICE"
                    ? "border-[#8f693b] bg-gradient-to-br from-amber-50 to-yellow-50 text-[#8f693b] shadow-sm"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <FaBuilding size={18} />
                <span className="font-medium text-sm">Văn phòng</span>
              </button>
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="relative">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                id="isDefault"
                className="w-5 h-5 text-[#8f693b] bg-white border-2 border-gray-300 rounded-md focus:ring-[#8f693b] focus:ring-1 transition-all opacity-0"
              />
              <div
                className={`absolute inset-0 w-5 h-5 rounded-md border-2 transition-all ${
                  formData.isDefault
                    ? "bg-[#8f693b] border-[#8f693b]"
                    : "bg-white border-gray-300 hover:border-gray-400"
                }`}
              >
                {formData.isDefault && (
                  <FiCheck className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                )}
              </div>
            </div>
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all text-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8f693b] to-[#6b4f2a] hover:from-[#a67c52] hover:to-[#8f693b] text-white rounded-xl font-medium transition-all shadow-sm hover:shadow text-sm"
            >
              {initialData ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
