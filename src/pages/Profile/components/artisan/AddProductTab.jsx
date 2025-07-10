import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import subCategoryService from "../../../../services/apis/subCateApi";
import meterialService from "../../../../services/apis/meterialApi"; // Thêm service cho material
import productService from "../../../../services/apis/productApi";
import { useNotification } from "../../../../contexts/NotificationContext";
import { validateProductData } from "../../../../utils/validateProductData";

export default function AddProductTab() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Price: 0,
    Quantity: 1, // Thêm field Quantity
    SubCategoryId: "",
    Status: "Active",
    Artisan_id: user?.id,
    MeterialIds: [], // Thay đổi từ string sang array
  });
  const [previewImages, setPreviewImages] = useState([]); // Thay đổi từ single image sang array
  const [isDragging, setIsDragging] = useState(false);
  const [subCate, setSubCate] = useState([]);
  const [materials, setMaterials] = useState([]); // Thêm state cho materials
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  // Lấy danh sách danh mục con và materials
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Lấy danh sách subcategories
        const subCateResponse = await subCategoryService.getAllSubCategories();
        const subCategories = Array.isArray(subCateResponse.data)
          ? subCateResponse.data
          : subCateResponse.data?.data || [];
        setSubCate(subCategories);

        // Lấy danh sách materials
        const materialResponse = await meterialService.getMeterials();
        console.log("Material Response:", materialResponse.data.data);

        const materialsData = Array.isArray(materialResponse.data)
          ? materialResponse.data
          : materialResponse.data?.data || [];
        setMaterials(materialsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn material
  const handleMaterialChange = (materialId) => {
    setFormData((prev) => {
      const newMeterialIds = prev.MeterialIds.includes(materialId)
        ? prev.MeterialIds.filter((id) => id !== materialId)
        : [...prev.MeterialIds, materialId];
      return { ...prev, MeterialIds: newMeterialIds };
    });
  };

  // Xử lý chọn ảnh (nhiều ảnh)
  const handleImageChange = useCallback((files) => {
    if (!files || files.length === 0) {
      showNotification("Vui lòng chọn ít nhất một file!");
      return;
    }

    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.match("image.*")) {
        showNotification(`File ${file.name} không phải là ảnh!`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification(`File ${file.name} vượt quá 5MB!`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Giới hạn số lượng ảnh tối đa (ví dụ 5 ảnh)
    const filesToProcess = validFiles.slice(0, 5);

    const readers = filesToProcess.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({ file, preview: e.target.result });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      setPreviewImages((prev) => [...prev, ...results.map((r) => r.preview)]);
      setFormData((prev) => ({
        ...prev,
        Images: [...(prev.Images || []), ...results.map((r) => r.file)],
      }));
    });
  }, []);

  // Xóa ảnh đã chọn
  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => {
      const newImages = [...prev.Images];
      newImages.splice(index, 1);
      return { ...prev, Images: newImages };
    });
  };

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
      const files = e.dataTransfer.files;
      handleImageChange(files);
    },
    [handleImageChange]
  );

  // Xử lý gửi form
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate dữ liệu
      const validationResult = validateProductData(formData);
      if (!validationResult.success) {
        showNotification(validationResult.error);
        setIsSubmitting(false);
        return;
      }

      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "MeterialIds") {
          // Xử lý mảng MeterialIds
          formData.MeterialIds.forEach((id) => {
            formPayload.append("MeterialIds", id);
          });
        } else if (key === "Images") {
          // Xử lý mảng Images
          formData.Images.forEach((image) => {
            formPayload.append("Images", image);
          });
        } else {
          formPayload.append(key, formData[key]);
        }
      });

      try {
        const response = await productService.createProduct(formPayload);
        if (!response.success) {
          throw new Error(response.error || "Lỗi không xác định");
        }
        showNotification("Thêm sản phẩm thành công!", "success");
        navigate("/profile-user/products");
      } catch (error) {
        console.error("Error creating product:", error);
        showNotification(`Có lỗi xảy ra khi thêm sản phẩm: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate, showNotification]
  );

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
        {/* Vùng upload ảnh (nhiều ảnh) */}
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
            onChange={(e) => handleImageChange(e.target.files)}
            multiple // Cho phép chọn nhiều file
          />

          {previewImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <FiX className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <FiUpload className="mx-auto w-12 h-12 text-gray-400" />
              <p className="text-sm text-gray-600">
                Kéo thả ảnh vào đây hoặc click để chọn
              </p>
              <p className="text-xs text-gray-500">
                Định dạng hỗ trợ: JPG, PNG (tối đa 5MB mỗi ảnh, tối đa 5 ảnh)
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

          <div>
            <label
              htmlFor="Quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số lượng*
            </label>
            <input
              type="number"
              id="Quantity"
              name="Quantity"
              value={formData.Quantity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chất liệu*
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {materials.map((material) => (
                <div key={material.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`material-${material.id}`}
                    checked={formData.MeterialIds.includes(material.id)}
                    onChange={() => handleMaterialChange(material.id)}
                    className="h-4 w-4 text-[#5e3a1e] focus:ring-[#5e3a1e] border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`material-${material.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {material.name}
                  </label>
                </div>
              ))}
            </div>
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
            disabled={
              !formData.Images ||
              formData.Images.length === 0 ||
              isSubmitting ||
              isLoading
            }
          >
            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}
