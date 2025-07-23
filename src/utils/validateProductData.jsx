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
  if (productData.Weight <= 0 || productData.Weight > 1600000) {
    return {
      success: false,
      error: "Trọng lượng phải từ 1 đến 1,600,000 gram",
    };
  }

  if (productData.Length <= 0 || productData.Length > 200) {
    return {
      success: false,
      error: "Chiều dài phải từ 1 đến 200 cm",
    };
  }

  if (productData.Width <= 0 || productData.Width > 200) {
    return {
      success: false,
      error: "Chiều rộng phải từ 1 đến 200 cm",
    };
  }

  if (productData.Height <= 0 || productData.Height > 200) {
    return {
      success: false,
      error: "Chiều cao phải từ 1 đến 200 cm",
    };
  }
  
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
