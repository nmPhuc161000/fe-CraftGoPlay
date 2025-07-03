// src/components/UpgradeArtisanTab.jsx
import { useCallback, useState } from "react";
import userService from "../../../services/apis/userApi";
import { useNotification } from "../../../contexts/NotificationContext";
import { FiUpload, FiX } from "react-icons/fi";

export default function UpgradeArtisanTab({ userId }) {
  const [formData, setFormData] = useState({
    Image: null,
    CraftVillageId: "",
    YearsOfExperience: 0,
    Description: "",
  });
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // chỉ 1 ảnh
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      if (formData.Image) {
        formDataToSend.append("Image", formData.Image);
      }
      formDataToSend.append("CraftVillageId", formData.CraftVillageId);
      formDataToSend.append(
        "YearsOfExperience",
        formData.YearsOfExperience.toString()
      );
      formDataToSend.append("Description", formData.Description);
      formDataToSend.append("UserId", userId);

      const response = await userService.upgradeToArtisan(formDataToSend);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit request");
      }

      setSuccess(true);
      // Reset form sau khi gửi thành công
      setFormData({
        Image: null,
        CraftVillageId: "",
        YearsOfExperience: 0,
        Description: "",
      });
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý chọn ảnh (nhiều ảnh)
  const handleImageChange = useCallback((files) => {
    if (!files || files.length === 0) {
      showNotification("Vui lòng chọn một file!");
      return;
    }

    const file = files[0];

    if (!file.type.match("image.*")) {
      showNotification(`File ${file.name} không phải là ảnh!`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification(`File ${file.name} vượt quá 5MB!`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      setFormData((prev) => ({
        ...prev,
        Image: file,
      }));
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
      const files = e.dataTransfer.files;
      handleImageChange(files);
    },
    [handleImageChange]
  );

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upgrade to Artisan
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Your request has been submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          />

          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewImage(null);
                  setFormData((prev) => ({ ...prev, Image: null }));
                }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <FiX className="w-4 h-4 text-red-500" />
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

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="CraftVillageId">
            Craft Village
          </label>
          <select
            id="CraftVillageId"
            name="CraftVillageId"
            value={formData.CraftVillageId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a craft village</option>
            <option value="1">Village 1</option>
            <option value="2">Village 2</option>
            {/* Thêm các tùy chọn khác nếu cần */}
          </select>
        </div>

        <div>
          <label
            className="block text-gray-700 mb-2"
            htmlFor="YearsOfExperience"
          >
            Years of Experience
          </label>
          <input
            type="number"
            id="YearsOfExperience"
            name="YearsOfExperience"
            min="0"
            value={formData.YearsOfExperience}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="Description">
            Description
          </label>
          <textarea
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isLoading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
