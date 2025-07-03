import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import productService from "../../../services/apis/productApi";
import meterialService from "../../../services/apis/meterialApi";
import {
  FiArrowLeft,
  FiEdit,
  FiSave,
  FiX,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";
import { useNotification } from "../../../contexts/NotificationContext";
import Loading from "../../../components/loading/Loading";
import subCategoryService from "../../../services/apis/subCateApi";

export default function ProductDetailTab() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState({
    Id: "",
    Name: "",
    Description: "",
    Price: 0,
    Quantity: 1,
    Status: "Active",
    SubCategoryId: "",
    Artisan_id: "",
    ImagesToAdd: [],
    ImagesToRemove: [],
    MeterialIdsToAdd: [],
    MeterialIdsToRemove: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Fetch product and materials data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch product data
        const productResponse = await productService.getProductById(productId);
        if (!productResponse.success) {
          throw new Error(productResponse.error || "Failed to load product");
        }

        // Fetch materials data
        const materialsResponse = await meterialService.getMeterials();
        const materialsData = Array.isArray(materialsResponse.data)
          ? materialsResponse.data
          : materialsResponse.data?.data || [];

        // Fetch subcate data
        const subCateResponse = await subCategoryService.getAllSubCategories();
        const subCateData = Array.isArray(subCateResponse.data)
          ? subCateResponse.data
          : subCateResponse.data?.data || [];

        setProduct(productResponse.data.data);
        setMaterials(materialsData);
        setSubCategories(subCateData);

        // Initialize form data
        const productData = productResponse.data.data;
        const firstImg =
          productData.productImages?.[0]?.imageUrl || "/default-product.jpg";
        setMainImage(firstImg);

        setFormData({
          Id: productData.id,
          Name: productData.name,
          Description: productData.description,
          Price: productData.price,
          Quantity: productData.quantity,
          Status: productData.status,
          SubCategoryId: productData.subCategoryId,
          Artisan_id: productData.artisan_id,
          ImagesToAdd: [],
          ImagesToRemove: [],
          MeterialIdsToAdd: [],
          MeterialIdsToRemove: [],
        });

        setPreviewImages(
          productData.productImages?.map((img) => img.imageUrl) || []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        showNotification("Failed to load product data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, showNotification]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach((img) => {
        if (img.startsWith("blob:")) {
          URL.revokeObjectURL(img);
        }
      });
    };
  }, [previewImages]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaterialChange = useCallback(
    (materialId, isChecked) => {
      const isCurrent = product.meterials?.some((m) => m.id === materialId);

      setFormData((prev) => {
        if (isCurrent) {
          // Material currently exists - toggle in remove list
          return {
            ...prev,
            MeterialIdsToRemove: isChecked
              ? prev.MeterialIdsToRemove.filter((id) => id !== materialId)
              : [...prev.MeterialIdsToRemove, materialId],
            MeterialIdsToAdd: prev.MeterialIdsToAdd.filter(
              (id) => id !== materialId
            ),
          };
        } else {
          // New material - toggle in add list
          return {
            ...prev,
            MeterialIdsToAdd: isChecked
              ? [...prev.MeterialIdsToAdd, materialId]
              : prev.MeterialIdsToAdd.filter((id) => id !== materialId),
            MeterialIdsToRemove: prev.MeterialIdsToRemove.filter(
              (id) => id !== materialId
            ),
          };
        }
      });
    },
    [product]
  );

  const handleImageChange = (e) => {
    if (!e.target.files.length) return;

    const files = Array.from(e.target.files);
    // Limit to 5 images max
    if (previewImages.length + files.length > 5) {
      showNotification("Tối đa 5 ảnh cho mỗi sản phẩm", "error");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        showNotification(`Ảnh ${file.name} vượt quá 2MB`, "warning");
        return false;
      }
      return true;
    });

    const newPreviewImages = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setFormData((prev) => ({
      ...prev,
      ImagesToAdd: [...prev.ImagesToAdd, ...validFiles],
    }));

    setPreviewImages((prev) => [...prev, ...newPreviewImages]);
  };

  const removeImage = useCallback(
    (imageUrl, imageId) => {
      if (imageId) {
        // Existing image - mark for removal
        setFormData((prev) => ({
          ...prev,
          ImagesToRemove: [...prev.ImagesToRemove, imageId],
        }));
      } else {
        // New image - remove from ImagesToAdd
        setFormData((prev) => ({
          ...prev,
          ImagesToAdd: prev.ImagesToAdd.filter(
            (file) => URL.createObjectURL(file) !== imageUrl
          ),
        }));
      }

      setPreviewImages((prev) => prev.filter((img) => img !== imageUrl));

      // Update main image if needed
      if (mainImage === imageUrl) {
        const remainingImages = previewImages.filter((img) => img !== imageUrl);
        setMainImage(remainingImages[0] || "/default-product.jpg");
      }
    },
    [mainImage, previewImages]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.Name ||
      !formData.Price ||
      !formData.Quantity ||
      !formData.SubCategoryId
    ) {
      showNotification("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    if (previewImages.length === 0) {
      showNotification("Vui lòng thêm ít nhất 1 ảnh", "error");
      return;
    }

    try {
      const formPayload = new FormData();

      // Thêm các field cơ bản
      formPayload.append("Id", formData.Id);
      formPayload.append("Name", formData.Name);
      formPayload.append("Description", formData.Description);
      formPayload.append("Price", formData.Price);
      formPayload.append("Quantity", formData.Quantity);
      formPayload.append("Status", formData.Status);
      formPayload.append("SubCategoryId", formData.SubCategoryId);
      formPayload.append("Artisan_id", formData.Artisan_id);

      // Xử lý MeterialIdsToAdd - thêm từng cái một
      formData.MeterialIdsToAdd.forEach((id) => {
        formPayload.append("MeterialIdsToAdd", id);
      });

      // Xử lý MeterialIdsToRemove - chỉ thêm nếu có giá trị
      formData.MeterialIdsToRemove.forEach((id) => {
        formPayload.append("MeterialIdsToRemove", id);
      });

      // Xử lý ảnh
      formData.ImagesToRemove.forEach((id) => {
        formPayload.append("ImagesToRemove", id);
      });

      formData.ImagesToAdd.forEach((file) => {
        formPayload.append("ImagesToAdd", file);
      });

      const response = await productService.updateProduct(formPayload);

      if (response.success) {
        showNotification("Cập nhật sản phẩm thành công", "success");
        setIsEditing(false);
        // Refresh product data
        const updatedProduct = await productService.getProductById(productId);
        setProduct(updatedProduct.data.data);
      } else {
        throw new Error(response.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      showNotification(error.message, "error");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error || "Product not found"}</p>
        <button
          onClick={() => navigate("/profile-user/products")}
          className="px-4 py-2 bg-[#5e3a1e] text-white rounded hover:bg-[#7a4b28]"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await productService.deleteProduct(productId);
        if (response.success) {
          showNotification("Xóa sản phẩm thành công", "success");
          navigate("/profile-user/products");
        } else {
          throw new Error(response.error || "Failed to delete product");
        }
      } catch (error) {
        console.error("Delete error:", error);
        showNotification(error.message, "error");
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-sm space-y-6">
      {/* Header with back button and edit/save controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/profile-user/products")}
          className="flex items-center gap-2 text-[#5e3a1e] hover:text-[#7a4b28] transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <FiSave className="w-4 h-4" />
                <span>Lưu</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                <FiX className="w-4 h-4" />
                <span>Hủy</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <FiEdit className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={handleDelete} // Bạn cần tạo hàm handleDelete
                className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />{" "}
                {/* Cần import FiTrash2 từ react-icons/fi */}
                <span>Xóa</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Product name */}
      <h1 className="text-3xl font-bold text-[#5e3a1e]">
        {isEditing ? (
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        ) : (
          product.name
        )}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-contain max-h-[400px]"
              onError={(e) => {
                e.target.src = "/default-product.jpg";
                e.target.className = "w-full h-full object-cover";
              }}
            />
          </div>

          <div className="mt-4">
            {isEditing && (
              <>
                <label className="block mb-2 font-medium">
                  Quản lý hình ảnh (Tối đa 5 ảnh)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#5e3a1e] file:text-white
                    hover:file:bg-[#7a4b28]"
                />
              </>
            )}

            <div className="flex gap-3 overflow-x-auto pb-2 mt-2">
              {previewImages.map((img, index) => {
                const isExistingImage = product.productImages?.some(
                  (productImg) => productImg.imageUrl === img
                );
                const imageId = isExistingImage
                  ? product.productImages.find(
                      (productImg) => productImg.imageUrl === img
                    )?.id
                  : null;

                return (
                  <div key={img} className="relative flex-shrink-0">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className={`w-16 h-16 object-cover rounded border-2 ${
                        isEditing &&
                        isExistingImage &&
                        formData.ImagesToRemove.includes(imageId)
                          ? "border-red-500 opacity-50"
                          : "border-gray-300"
                      }`}
                      onClick={() => setMainImage(img)}
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeImage(img, imageId)}
                        className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                      >
                        <FiX className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-5">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-[#5e3a1e] mb-3">
              Thông tin sản phẩm
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Giá:</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="Price"
                    value={formData.Price}
                    onChange={handleInputChange}
                    className="w-32 px-2 py-1 border rounded"
                    min="0"
                    step="1000"
                    required
                  />
                ) : (
                  <span className="font-medium">
                    {product.price?.toLocaleString()} VND
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Số lượng:</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="Quantity"
                    value={formData.Quantity}
                    onChange={handleInputChange}
                    className="w-32 px-2 py-1 border rounded"
                    min="1"
                    required
                  />
                ) : (
                  <span
                    className={`font-medium ${
                      product.quantity > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.quantity}
                  </span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Đã bán:</span>
                <span className="font-medium">{product.soldQuantity || 0}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Danh mục con:</span>
                {isEditing ? (
                  <select
                    name="SubCategoryId"
                    value={formData.SubCategoryId || ""}
                    onChange={handleInputChange}
                    className="w-48 px-2 py-1 border rounded"
                    required
                  >
                    <option value="">Chọn danh mục con</option>
                    {subCategories.map((sub) => (
                      <option key={sub.subId} value={sub.subId}>
                        {sub.subName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="font-medium">
                    {product.subCategoryName || "N/A"}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-start">
                <span className="text-gray-600">Chất liệu:</span>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {materials.map((material) => {
                      const isCurrent = product.meterials?.some(
                        (m) => m.id === material.id
                      );
                      const isSelected = isCurrent
                        ? !formData.MeterialIdsToRemove.includes(material.id)
                        : formData.MeterialIdsToAdd.includes(material.id);

                      return (
                        <div key={material.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`material-${material.id}`}
                            checked={isSelected}
                            onChange={(e) =>
                              handleMaterialChange(
                                material.id,
                                e.target.checked
                              )
                            }
                            className="mr-2"
                          />
                          <label htmlFor={`material-${material.id}`}>
                            {material.name}
                            {isCurrent && (
                              <span className="text-xs text-gray-500 ml-1">
                                (Đang chọn)
                              </span>
                            )}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-right">
                    {product.meterials?.length > 0 ? (
                      product.meterials.map((material, index) => (
                        <span key={material.id}>
                          {material.name}
                          {index < product.meterials.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : (
                      <span>N/A</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái:</span>
                {isEditing ? (
                  <select
                    name="Status"
                    value={formData.Status}
                    onChange={handleInputChange}
                    className="w-32 px-2 py-1 border rounded"
                  >
                    <option value="Active">Đang bán</option>
                    <option value="OutOfStock">Hết hàng</option>
                    <option value="Inactive">Ngừng bán</option>
                  </select>
                ) : (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : product.status === "OutOfStock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status === "Active"
                      ? "Đang bán"
                      : product.status === "OutOfStock"
                      ? "Hết hàng"
                      : "Ngừng bán"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-[#5e3a1e] mb-3">
              Mô tả sản phẩm
            </h3>
            {isEditing ? (
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border rounded"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line">
                {product.description || "Không có mô tả"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
