// src/utils/validationUtils.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUserName = (userName) => {
  if (userName.length < 6) {
    return "Tên người dùng phải có ít nhất 6 ký tự";
  }
  // Có thể thêm các validate khác cho userName nếu cần
  return "";
};

export const validatePhoneNumber = (phoneNo) => {
  if (phoneNo.length < 10) {
    return "Số điện thoại phải có ít nhất 10 số";
  }
  if (!/^\d*$/.test(phoneNo)) {
    return "Chỉ được nhập số";
  }
  return "";
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    return "Mật khẩu phải có ít nhất 8 ký tự";
  }
  // Bạn có thể thêm các validate phức tạp hơn cho password ở đây nếu cần
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Mật khẩu không khớp";
  }
  return "";
};

export const validateRequiredFields = (userData) => {
  if (!userData || !userData.Email || !userData.PasswordHash) {
    return "Email và mật khẩu là bắt buộc";
  }
  return "";
};

export const validateUserEmail = (email) => {
  if (!validateEmail(email)) {
    return "Email không hợp lệ";
  }
  return "";
};

// Thêm vào hàm validateRegisterForm tổng hợp
export const validateRegisterForm = (form, confirmPassword) => {
  const errors = {
    userName: validateUserName(form.UserName),
    email: validateUserEmail(form.Email),
    phoneNo: validatePhoneNumber(form.PhoneNo),
    passwordHash: validatePassword(form.PasswordHash),
    confirmPassword: validateConfirmPassword(
      form.PasswordHash,
      confirmPassword
    ),
    requiredFields: validateRequiredFields(form),
  };

  const isValid = !Object.values(errors).some((error) => error !== "");
  return { errors, isValid };
};

// Hàm validate trước khi gọi API
export const validateBeforeApiCall = (userData) => {
  const requiredError = validateRequiredFields(userData);
  if (requiredError) {
    return { isValid: false, error: requiredError, status: 400 };
  }

  const emailError = validateUserEmail(userData.Email);
  if (emailError) {
    return { isValid: false, error: emailError, status: 400 };
  }

  return { isValid: true };
};
