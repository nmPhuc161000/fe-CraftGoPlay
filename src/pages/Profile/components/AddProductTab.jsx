import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import subCategoryService from "../../../services/apis/subCateApi";
import productService from "../../../services/apis/productApi";

export default function AddProductTab() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Price: 0,
    SubCategoryId: "",
    Status: "Active",
    Artisan_id: user?.id,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [subCate, setSubCate] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách danh mục con
  useEffect(() => {
    const fetchSubCategories = async () => {
      setIsLoading(true);
      try {
        const response = await subCategoryService.getAllSubCategories();
        const subCategories = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        setSubCate(subCategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setError("Không thể tải danh mục con. Vui lòng thử lại sau.");
        setSubCate([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubCategories();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn ảnh
  const handleImageChange = useCallback((file) => {
    if (!file) {
      alert("Vui lòng chọn một file!");
      return;
    }
    if (!file.type.match("image.*")) {
      alert("Vui lòng chọn file ảnh (JPG, PNG)!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file vượt quá 5MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      setFormData((prev) => ({ ...prev, Image: file }));
    };
    reader.readAsDataURL(file);
  }, []);

  // Xử lý sự kiện kéo thả
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleImageChange(file);
    },
    [handleImageChange]
  );

  // Hàm validate dữ liệu
  const validateProductData = (productData) => {
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
    return {
      success: true,
    };
  };

  // Xử lý gửi form
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate dữ liệu
      const validationResult = validateProductData(formData);
      if (!validationResult.success) {
        alert(validationResult.error);
        setIsSubmitting(false);
        return;
      }

      if (!formData.Image) {
        alert("Vui lòng chọn hình ảnh sản phẩm!");
        setIsSubmitting(false);
        return;
      }

      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        formPayload.append(key, formData[key]);
      });   

      try {
        const response = await productService.createProduct(formPayload);
        if (!response.success) {
          throw new Error(response.error || "Lỗi không xác định");
        }
        alert("Thêm sản phẩm thành công!");
        navigate("/profile-user/products");
      } catch (error) {
        console.error("Error creating product:", error);
        alert(`Có lỗi xảy ra khi thêm sản phẩm: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate]
  );

  // Kiểm tra user sau khi khai báo hooks
  if (!user?.id) {
    return <div>Vui lòng đăng nhập để thêm sản phẩm!</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/profile-user/products")}
          className="flex items-center justify-center w-8 h-8 bg-gray-100 text-[#5e3a1e] rounded-full hover:bg-gray-200 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-[#5e3a1e]">Thêm sản phẩm mới</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vùng upload ảnh */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput").click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? "border-[#5e3a1e] bg-[#f8f4ed]" : "border-gray-300 hover:border-[#cbb892]"
          }`}
        >
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e.target.files[0])}
          />

          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="mx-auto max-h-64 rounded-md object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewImage(null);
                  setFormData((prev) => ({ ...prev, Image: null }));
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <FiX className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <FiUpload className="mx-auto w-12 h-12 text-gray-400" />
              <p className="text-sm text-gray-600">
                Kéo thả ảnh vào đây hoặc click để chọn
              </p>
              <p className="text-xs text-gray-500">
                Định dạng hỗ trợ: JPG, PNG (tối đa 5MB)
              </p>
            </div>
          )}
        </div>

        {/* Các trường thông tin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="Name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên sản phẩm*
            </label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="Price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Giá bán (VND)*
            </label>
            <input
              type="number"
              id="Price"
              name="Price"
              value={formData.Price}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="Description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mô tả sản phẩm*
            </label>
            <textarea
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="SubCategoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Danh mục con*
            </label>
            <select
              id="SubCategoryId"
              name="SubCategoryId"
              value={formData.SubCategoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
              required
              disabled={isLoading || error}
            >
              <option value="">Chọn danh mục con</option>
              {isLoading ? (
                <option value="" disabled>
                  Đang tải...
                </option>
              ) : error ? (
                <option value="" disabled>
                  Lỗi tải danh mục
                </option>
              ) : (
                subCate.map((sub) => (
                  <option key={sub.subId} value={sub.subId}>
                    {sub.subName}
                  </option>
                ))
              )}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label
              htmlFor="Status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Trạng thái
            </label>
            <select
              id="Status"
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
            >
              <option value="Active">Đang bán</option>
              <option value="Inactive">Ngừng bán</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/profile-user/products")}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#5e3a1e] text-white rounded-md hover:bg-[#7a4b28] disabled:opacity-50"
            disabled={!formData.Image || isSubmitting || isLoading}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}