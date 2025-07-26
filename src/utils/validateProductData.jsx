// src/utils/validators/productValidator.js

export const validateProductData = (productData) => {
  if (!productData.Name) {
    return {
      success: false,
      error: "Tên sản phẩm là bắt buộc",
      status: 400,
    };
  }
  if (!productData.Price) {
    return {
      success: false,
      error: "Giá sản phẩm là bắt buộc",
      status: 400,
    };
  }
  if (!productData.Quantity || productData.Quantity <= 0) {
    return {
      success: false,
      error: "Số lượng phải lớn hơn 0",
      status: 400,
    };
  }
  if (!productData.Description) {
    return {
      success: false,
      error: "Mô tả sản phẩm là bắt buộc",
      status: 400,
    };
  }
  if (!productData.SubCategoryId) {
    return {
      success: false,
      error: "Danh mục con là bắt buộc",
      status: 400,
    };
  }
  if (parseFloat(productData.Price) <= 0) {
    return {
      success: false,
      error: "Giá bán phải lớn hơn 0",
      status: 400,
    };
  }
  // if (!productData.MeterialIds || productData.MeterialIds.length === 0) {
  //   return {
  //     success: false,
  //     error: "Vui lòng chọn ít nhất một chất liệu",
  //     status: 400,
  //   };
  // }
  if (!productData.Images || productData.Images.length === 0) {
    return {
      success: false,
      error: "Vui lòng chọn ít nhất một hình ảnh",
      status: 400,
    };
  }
  return {
    success: true,
  };
};
