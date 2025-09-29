import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FiX,
  FiUser,
  FiPhone,
  FiMapPin,
  FiHome,
  FiCheck,
  FiSearch,
  FiChevronDown,
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

// Component mới cho dropdown có tìm kiếm
const SearchableDropdown = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
  searchPlaceholder = "Tìm kiếm...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc options dựa trên search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`[data-dropdown="${name}"]`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [name]);

  const handleSelect = (option) => {
    onChange({
      target: {
        name,
        value: option.value,
      },
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
    }
  };

  const displayValue = options.find((opt) => opt.value === value)?.label || "";

  return (
    <div className="relative group" data-dropdown={name}>
      {/* Input hiển thị */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full px-3 py-2 pr-8 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8f693b]/20 focus:border-[#8f693b] text-left text-sm ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className={!displayValue ? "text-gray-400" : ""}>
          {displayValue || placeholder}
        </span>
      </button>

      {/* Icon mũi tên */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <FiChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
          {/* Thanh tìm kiếm */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8f693b]/20 focus:border-[#8f693b]"
                autoFocus
              />
            </div>
          </div>

          {/* Danh sách options */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Không tìm thấy kết quả
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                    value === option.value ? "bg-amber-50 text-[#8f693b]" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

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
  onAddressChanged,
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
            street: initialData.homeNumber || "",
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
    const selected = provinces.find((p) => p.ProvinceName === value);

    if (selected) {
      setFormData((prev) => ({
        ...prev,
        province: value,
        provinceId: selected.ProvinceID,
        district: "", // Reset district
        districtId: "", // Reset districtId
        ward: "", // Reset ward
        wardCode: "", // Reset wardCode
      }));

      // Gọi API fetch districts mới bằng ProvinceID
      onProvinceChange?.(selected.ProvinceID);
    }

    setErrors((prev) => ({
      ...prev,
      province: "",
      district: "", // Clear district error
      ward: "", // Clear ward error
    }));
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    const selected = districts.find((item) => item.DistrictName === value);

    if (selected) {
      setFormData((prev) => ({
        ...prev,
        district: value,
        districtId: selected.DistrictID || "",
        ward: "", // Reset ward khi district thay đổi
        wardCode: "", // Reset wardCode khi district thay đổi
      }));

      // Gọi API fetch wards mới
      onDistrictChange?.(selected.DistrictID); // Truyền DistrictID thay vì tên
    }

    setErrors((prev) => ({
      ...prev,
      district: "",
      ward: "", // Clear error của ward khi district thay đổi
    }));
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
    console.log("Submitting address form with data:", formData);

    const { isValid, errors } = validateAddressForm(formData);
    setErrors(errors);
    if (isValid) {
      onSubmit(formData)
        .then(() => {
          // Gọi callback sau khi submit thành công
          if (onAddressChanged && formData.isDefault) {
            onAddressChanged();
          }
        })
        .catch((error) => {
          console.error("Submit error:", error);
        });
    }
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
              <SearchableDropdown
                name="province"
                value={formData.province}
                onChange={handleProvinceChange}
                options={provinces.map((p) => ({
                  value: p.ProvinceName,
                  label: p.ProvinceName,
                }))}
                placeholder="Tỉnh/Thành"
                error={errors.province}
                searchPlaceholder="Tìm tỉnh/thành..."
              />
              <SearchableDropdown
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
                searchPlaceholder="Tìm quận/huyện..."
              />
              <SearchableDropdown
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
                searchPlaceholder="Tìm phường/xã..."
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
