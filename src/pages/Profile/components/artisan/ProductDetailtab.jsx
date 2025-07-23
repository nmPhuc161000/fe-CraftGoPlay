import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import productService from "../../../../services/apis/productApi";
import meterialService from "../../../../services/apis/meterialApi";
import {
  FiArrowLeft,
  FiEdit,
  FiSave,
  FiX,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";
import { useNotification } from "../../../../contexts/NotificationContext";
import Loading from "../../../../components/loading/Loading";
import subCategoryService from "../../../../services/apis/subCateApi";
import { useConfirm } from "../../../../components/ConfirmForm/ConfirmForm";

export default function ProductDetailTab() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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
    Weight: 0, // Thêm trường mới
    Length: 0, // Thêm trường mới
    Width: 0, // Thêm trường mới
    Height: 0, // Thêm trường mới
  });
  const [previewImages, setPreviewImages] = useState([]);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { confirm, ConfirmComponent } = useConfirm();

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
          Weight: productData.weight || 0, // Thêm dòng này
          Length: productData.length || 0, // Thêm dòng này
          Width: productData.width || 0, // Thêm dòng này
          Height: productData.height || 0, // Thêm dòng này
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
      setIsLoading(true);
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
      formPayload.append("Weight", formData.Weight);
      formPayload.append("Length", formData.Length);
      formPayload.append("Width", formData.Width);
      formPayload.append("Height", formData.Height);

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
    } finally {
      setIsLoading(false);
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
    const confirmed = await confirm({
      title: "Xóa sản phẩm",
      message: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      confirmText: "Xóa",
      cancelText: "Hủy",
      type: "danger",
    });

    if (confirmed) {
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-amber-100">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/profile-user/products")}
              className="flex items-center gap-3 px-4 py-2 text-amber-800 hover:text-amber-900 hover:bg-amber-50 rounded-xl transition-all duration-200 font-medium"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Quay lại danh sách</span>
            </button>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 font-medium"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                    <span>{isLoading ? "Đang lưu..." : "Lưu thay đổi"}</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Hủy</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <FiEdit className="w-4 h-4" />
                    <span>Chỉnh sửa</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Xóa sản phẩm</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Product Title */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-amber-100">
          {isEditing ? (
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              className="w-full text-3xl font-bold text-amber-800 bg-transparent border-none outline-none placeholder-amber-300"
              placeholder="Tên sản phẩm..."
              required
            />
          ) : (
            <h1 className="text-3xl font-bold text-amber-800 mb-2">
              {product.name}
            </h1>
          )}
          <p className="text-amber-600 text-sm">ID: {product.id}</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Image Gallery Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <h2 className="text-xl font-semibold text-amber-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Hình ảnh sản phẩm
            </h2>

            {/* Main Image */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center mb-6 border-2 border-dashed border-gray-200">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain max-h-[400px] rounded-2xl"
                onError={(e) => {
                  e.target.src = "/default-product.jpg";
                  e.target.className = "w-full h-full object-cover rounded-2xl";
                }}
              />
            </div>

            {/* Image Upload (Edit Mode) */}
            {isEditing && (
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <label className="block mb-3 font-semibold text-amber-800">
                  <FiUpload className="inline w-4 h-4 mr-2" />
                  Thêm hình ảnh (Tối đa 5 ảnh)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-600
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-amber-600 file:text-white
                    hover:file:bg-amber-700 file:transition-colors file:duration-200
                    file:shadow-lg"
                />
              </div>
            )}

            {/* Image Thumbnails */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Hình ảnh đã chọn:</h3>
              <div className="flex gap-3 overflow-x-auto pb-3">
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
                    <div key={img} className="relative flex-shrink-0 group">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded-xl border-3 cursor-pointer transition-all duration-200 ${
                          mainImage === img
                            ? "border-amber-500 ring-2 ring-amber-200"
                            : "border-gray-200 hover:border-amber-300"
                        } ${
                          isEditing &&
                          isExistingImage &&
                          formData.ImagesToRemove.includes(imageId)
                            ? "opacity-50 grayscale"
                            : ""
                        }`}
                        onClick={() => setMainImage(img)}
                      />
                      {isEditing && (
                        <button
                          onClick={() => removeImage(img, imageId)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                Thông tin cơ bản
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Giá bán:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      name="Price"
                      value={formData.Price}
                      onChange={handleInputChange}
                      className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      min="0"
                      step="1000"
                      required
                    />
                  ) : (
                    <span className="font-bold text-lg text-amber-600">
                      {product.price?.toLocaleString()} VND
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">
                    Số lượng kho:
                  </span>
                  {isEditing ? (
                    <input
                      type="number"
                      name="Quantity"
                      value={formData.Quantity}
                      onChange={handleInputChange}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  ) : (
                    <span
                      className={`font-bold px-3 py-1 rounded-full text-sm ${
                        product.quantity > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.quantity}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Đã bán:</span>
                  <span className="font-bold text-blue-600">
                    {product.soldQuantity || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Danh mục:</span>
                  {isEditing ? (
                    <select
                      name="SubCategoryId"
                      value={formData.SubCategoryId || ""}
                      onChange={handleInputChange}
                      className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                    <span className="font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-sm">
                      {product.subCategoryName || "N/A"}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Trạng thái:</span>
                  {isEditing ? (
                    <select
                      name="Status"
                      value={formData.Status}
                      onChange={handleInputChange}
                      className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="Active">Đang bán</option>
                      <option value="OutOfStock">Hết hàng</option>
                      <option value="InActive">Ngừng bán</option>
                    </select>
                  ) : (
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
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

            {/* Materials Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                Chất liệu sản phẩm
              </h2>

              {isEditing ? (
                <div className="grid grid-cols-2 gap-3">
                  {materials.map((material) => {
                    const isCurrent = product.meterials?.some(
                      (m) => m.id === material.id
                    );
                    const isSelected = isCurrent
                      ? !formData.MeterialIdsToRemove.includes(material.id)
                      : formData.MeterialIdsToAdd.includes(material.id);

                    return (
                      <label
                        key={material.id}
                        className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-amber-300 bg-amber-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleMaterialChange(material.id, e.target.checked)
                          }
                          className="mr-3 w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <span
                          className={`font-medium ${
                            isSelected ? "text-amber-800" : "text-gray-700"
                          }`}
                        >
                          {material.name}
                          {isCurrent && (
                            <span className="text-xs text-amber-600 ml-2 bg-amber-100 px-2 py-0.5 rounded-full">
                              Hiện tại
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {product.meterials?.length > 0 ? (
                    product.meterials.map((material) => (
                      <span
                        key={material.id}
                        className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                      >
                        {material.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">
                      Chưa có chất liệu
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Technical Specifications */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                Thông số kỹ thuật
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <label className="block text-sm text-gray-600 mb-2 font-medium">
                    Trọng lượng (gram)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="Weight"
                      value={formData.Weight}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      min="0"
                      max="1600000"
                    />
                  ) : (
                    <p className="font-bold text-gray-800">
                      {product.weight || 0} gram
                    </p>
                  )}
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <label className="block text-sm text-gray-600 mb-2 font-medium">
                    Chiều dài (cm)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="Length"
                      value={formData.Length}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      min="0"
                      max="200"
                    />
                  ) : (
                    <p className="font-bold text-gray-800">
                      {product.length || 0} cm
                    </p>
                  )}
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <label className="block text-sm text-gray-600 mb-2 font-medium">
                    Chiều rộng (cm)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="Width"
                      value={formData.Width}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      min="0"
                      max="200"
                    />
                  ) : (
                    <p className="font-bold text-gray-800">
                      {product.width || 0} cm
                    </p>
                  )}
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <label className="block text-sm text-gray-600 mb-2 font-medium">
                    Chiều cao (cm)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="Height"
                      value={formData.Height}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      min="0"
                      max="200"
                    />
                  ) : (
                    <p className="font-bold text-gray-800">
                      {product.height || 0} cm
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100 mt-8">
          <h2 className="text-xl font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            Mô tả sản phẩm
          </h2>
          {isEditing ? (
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
            />
          ) : (
            <div className="prose prose-amber max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl">
                {product.description ||
                  "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>
          )}
        </div>
      </div>
      <ConfirmComponent />
    </div>
  );
}
