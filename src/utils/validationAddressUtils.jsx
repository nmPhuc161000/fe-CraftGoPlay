export const validateAddressForm = (formData) => {
  const errors = {};

  if (!formData.recipientName?.trim()) {
    errors.recipientName = "Vui lòng nhập họ và tên";
  }

  if (!formData.phoneNumber?.trim()) {
    errors.phoneNumber = "Vui lòng nhập số điện thoại";
  } else if (!/^\d{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
    errors.phoneNumber = "Số điện thoại không hợp lệ";
  }

  if (!formData.province) {
    errors.province = "Vui lòng chọn tỉnh/thành phố";
  }

  if (!formData.district) {
    errors.district = "Vui lòng chọn quận/huyện";
  }

  if (!formData.ward) {
    errors.ward = "Vui lòng chọn phường/xã";
  }

  if (!formData.street?.trim()) {
    errors.street = "Vui lòng nhập địa chỉ cụ thể";
  }

  if (!formData.provinceId) {
    errors.province = "Vui lòng chọn tỉnh/thành phố";
  }

  if (!formData.districtId) {
    errors.district = "Vui lòng chọn quận/huyện";
  }

  if (!formData.wardCode) {
    errors.ward = "Vui lòng chọn phường/xã";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Có thể thêm các hàm validate khác ở đây