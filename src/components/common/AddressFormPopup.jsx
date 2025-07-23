import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FiX,
  FiUser,
  FiPhone,
  FiMapPin,
  FiHome,
  FiCheck,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import { validateAddressForm } from "../../utils/validationAddressUtils";

const defaultFormData = {
  recipientName: "",
  phoneNumber: "",
  province: "",
  provinceId: "",
  district: "",
  districtId: "",
  ward: "",
  wardCode: "",
  street: "",
  addressType: "Home",
  isDefault: false,
};

const AddressTypeButton = ({
  type,
  currentType,
  icon: Icon,
  label,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border ${
      currentType === type
        ? "border-[#8f693b] bg-gradient-to-br from-amber-50 to-yellow-50 text-[#8f693b] shadow-sm"
        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100"
    }`}
  >
    <Icon size={18} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const FormInput = ({
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
}) => (
  <div className="relative group">
    {Icon && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400 group-focus-within:text-[#8f693b]" />
      </div>
    )}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full ${
        Icon ? "pl-10" : "pl-3"
      } pr-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8f693b]/20 focus:border-[#8f693b] placeholder-gray-400 text-base ${
        error
          ? "border-red-500 bg-red-50"
          : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const FormSelect = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
}) => (
  <div className="relative group">
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 pr-8 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8f693b]/20 focus:border-[#8f693b] appearance-none cursor-pointer text-sm ${
        error
          ? "border-red-500 bg-red-50"
          : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <option value="">{placeholder}</option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
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
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const AddressFormPopup = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  provinces = [],
  districts = [],
  wards = [],
  onProvinceChange,
  onDistrictChange,
}) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(
      initialData
        ? {
            recipientName: initialData.fullName || "",
            phoneNumber: initialData.phoneNumber || "",
            province: initialData.province || "",
            provinceId: initialData.provinceId || "",
            district: initialData.district || "",
            districtId: initialData.districtId || "",
            ward: initialData.ward || "",
            wardCode: initialData.wardCode || "",
            street: initialData.street || "",
            addressType: initialData.addressType || "Home",
            isDefault: initialData.isDefault || false,
          }
        : defaultFormData
    );
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Fixed function - separate handlers for each location level
  const handleProvinceChange = (e) => {
    const value = e.target.value;
    const selected = provinces.find((item) => item.ProvinceName === value);
    
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        province: value,
        provinceId: selected.ProvinceID || "",
        district: "", // Reset district when province changes
        districtId: "",
        ward: "", // Reset ward when province changes  
        wardCode: "",
      }));
      onProvinceChange?.(value);
    }
    setErrors((prev) => ({ ...prev, province: "" }));
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    const selected = districts.find((item) => item.DistrictName === value);
    
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        district: value,
        districtId: selected.DistrictID || "",
        ward: "", // Reset ward when district changes
        wardCode: "",
      }));
      onDistrictChange?.(value);
    }
    setErrors((prev) => ({ ...prev, district: "" }));
  };

  const handleWardChange = (e) => {
    const value = e.target.value;
    const selected = wards.find((item) => item.WardName === value);
    
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        ward: value,
        wardCode: selected.WardCode || "",
      }));
    }
    setErrors((prev) => ({ ...prev, ward: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors } = validateAddressForm(formData);
    setErrors(errors);
    if (isValid) onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto">
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
            className="p-1 hover:bg-white/50 rounded-full"
          >
            <FiX size={18} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#8f693b] to-[#6b4f2a] rounded-full flex items-center justify-center">
                <FiUser className="text-white" size={12} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Thông tin người nhận
              </h3>
            </div>
            <FormInput
              icon={FiUser}
              name="recipientName"
              placeholder="Họ và tên"
              value={formData.recipientName}
              onChange={handleChange}
              error={errors.recipientName}
            />
            <FormInput
              icon={FiPhone}
              type="tel"
              name="phoneNumber"
              placeholder="Số điện thoại"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#a67c52] to-[#8f693b] rounded-full flex items-center justify-center">
                <FiMapPin className="text-white" size={12} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Địa chỉ giao hàng
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormSelect
                name="province"
                value={formData.province}
                onChange={handleProvinceChange}
                options={provinces.map((p) => ({
                  value: p.ProvinceName,
                  label: p.ProvinceName,
                }))}
                placeholder="Tỉnh/Thành"
                error={errors.province}
              />
              <FormSelect
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                options={districts.map((d) => ({
                  value: d.DistrictName,
                  label: d.DistrictName,
                }))}
                placeholder="Quận/Huyện"
                error={errors.district}
                disabled={!formData.province}
              />
              <FormSelect
                name="ward"
                value={formData.ward}
                onChange={handleWardChange}
                options={wards.map((w) => ({
                  value: w.WardName,
                  label: w.WardName,
                }))}
                placeholder="Phường/Xã"
                error={errors.ward}
                disabled={!formData.district}
              />
            </div>
            <FormInput
              name="street"
              placeholder="Số nhà, tên đường ..."
              value={formData.street}
              onChange={handleChange}
              error={errors.street}
            />
          </div>
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
              <AddressTypeButton
                type="Home"
                currentType={formData.addressType}
                icon={FiHome}
                label="Nhà riêng"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, addressType: "Home" }))
                }
              />
              <AddressTypeButton
                type="Office"
                currentType={formData.addressType}
                icon={FaBuilding}
                label="Văn phòng"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, addressType: "Office" }))
                }
              />
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
            <label className="relative flex items-center cursor-pointer space-x-3">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                  formData.isDefault
                    ? "bg-[#8f693b] border-[#8f693b]"
                    : "bg-white border-gray-300 hover:border-gray-400"
                }`}
              >
                {formData.isDefault && (
                  <FiCheck className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                Đặt làm địa chỉ mặc định
              </span>
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8f693b] to-[#6b4f2a] hover:from-[#a67c52] hover:to-[#8f693b] text-white rounded-xl font-medium text-sm"
            >
              {initialData ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddressFormPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  provinces: PropTypes.array,
  districts: PropTypes.array,
  wards: PropTypes.array,
  onProvinceChange: PropTypes.func,
  onDistrictChange: PropTypes.func,
};

export default AddressFormPopup;