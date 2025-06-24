import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import subCategoryService from "../../../services/apis/subCateApi";

export default function AddProductTab() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Price: "",
    SubCategoryId: "",
    Status: "Active",
    Artisan_id: user?.id, // Lấy từ localStorage hoặc context
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [subCate, setSubCate] = useState([]);
  const subCateData = subCate.data?.data || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file) => {
    if (file && file.type.match("image.*")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        // Lưu file vào formData để gửi lên API
        setFormData((prev) => ({ ...prev, Image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchSubCategories = async () => {
      const subcategories = await subCategoryService.getAllSubCategories();
      setSubCate(subcategories.data);
    };
    fetchSubCategories();
  }, []);

  console.log("Subcategories:", subCate.data.data);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        formPayload.append(key, formData[key]);
      });

      try {
        // Gọi API ở đây
        // const response = await fetch('/api/products', {
        //   method: 'POST',
        //   body: formPayload
        // });

        // Giả lập thành công
        console.log("Form data:", Object.fromEntries(formPayload));
        alert("Thêm sản phẩm thành công!");
        navigate("/profile-user/products");
      } catch (error) {
        console.error("Error:", error);
        alert("Có lỗi xảy ra khi thêm sản phẩm");
      }
    },
    [formData, navigate]
  );

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
            isDragging
              ? "border-[#5e3a1e] bg-[#f8f4ed]"
              : "border-gray-300 hover:border-[#cbb892]"
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
            >
              {subCateData.map((sub) => (
                <option key={sub.subId} value={sub.subId}>
                  {sub.subName}
                </option>
              ))}
            </select>
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
            disabled={!formData.Image}
          >
            Lưu sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}
