/**
 * Định dạng số tiền theo định dạng tiền tệ
 * @param {number} amount - Số tiền cần định dạng
 * @param {string} currency - Loại tiền tệ (mặc định là 'VND')
 * @param {string} locale - Ngôn ngữ định dạng (mặc định là 'vi-VN')
 * @returns {string} Chuỗi số tiền đã được định dạng
 */
export function formatCurrencyUtils(amount, options = {}) {
  const {
    currency = 'VND',
    locale = 'vi-VN',
    showSymbol = true,
    decimalDigits = 0
  } = options;

  if (isNaN(amount)) {
    return showSymbol ? '0 ₫' : '0';
  }

  if (!showSymbol) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalDigits,
      maximumFractionDigits: decimalDigits
    }).format(amount);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits
  }).format(amount);
}