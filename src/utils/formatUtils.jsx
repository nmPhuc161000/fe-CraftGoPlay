// /src/utils/formatUtils.js
export const formatTransactionId = (id) => {
  if (!id) return '#';
  const parts = id.split('-');
  return `#${parts[0]}`;
};

// Hàm định dạng ngày tháng
  export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };