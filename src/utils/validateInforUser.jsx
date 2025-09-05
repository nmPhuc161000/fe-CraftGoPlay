// src/utils/validationUtils.js

/**
 * Validate số điện thoại Việt Nam
 * @param {string} phoneNumber - Số điện thoại cần validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return {
      isValid: false,
      message: "Số điện thoại không được để trống"
    };
  }

  // Kiểm tra bắt đầu bằng số 0
  if (!phoneNumber.startsWith('0')) {
    return {
      isValid: false,
      message: "Số điện thoại phải bắt đầu bằng số 0"
    };
  }

  // Kiểm tra độ dài chính xác 10 số
  if (phoneNumber.length !== 10) {
    return {
      isValid: false,
      message: "Số điện thoại phải có đúng 10 chữ số"
    };
  }

  // Kiểm tra chỉ chứa số
  if (!/^\d+$/.test(phoneNumber)) {
    return {
      isValid: false,
      message: "Số điện thoại chỉ được chứa các chữ số"
    };
  }

  return {
    isValid: true,
    message: "Số điện thoại hợp lệ"
  };
};

/**
 * Format số điện thoại để hiển thị
 * @param {string} phoneNumber - Số điện thoại cần format
 * @returns {string} - Số điện thoại đã được format
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Xóa tất cả ký tự không phải số
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format theo pattern: 0123 456 789
  if (cleaned.length >= 4 && cleaned.length <= 10) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 10)}`.trim();
  }
  
  return cleaned;
};