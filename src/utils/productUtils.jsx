export const formatPrice = (price) => {
  // if (typeof price !== "number") {
  //   return "0 đ";
  // }

  if (price < 0) {
    return "Giá không hợp lệ";
  }

  if (!price || isNaN(price)) {
    return "Phải nhập giá sản phẩm";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
