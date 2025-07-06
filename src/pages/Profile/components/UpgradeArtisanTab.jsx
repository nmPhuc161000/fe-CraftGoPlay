// src/components/UpgradeArtisanTab.jsx
import { useCallback, useEffect, useState } from "react";
import userService from "../../../services/apis/userApi";
import { useNotification } from "../../../contexts/NotificationContext";
import { FiUpload, FiX } from "react-icons/fi";
import CraftVillageService from "../../../services/apis/craftvillageApi";

export default function UpgradeArtisanTab({ userId }) {
  const [formData, setFormData] = useState({
    Image: null,
    CraftVillageId: "",
    YearsOfExperience: 0,
    Description: "",
  });
  const [craftVillages, setCraftVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [checkRequest, setCheckRequest] = useState({
    isSent: false,
    message: "",
    status: "",
    requestId: null,
  });
  const [isSentSuccess, setIsSentSuccess] = useState(false);
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "CraftVillageId") {
      const village = craftVillages.find((v) => v.id === value);
      setSelectedVillage(village);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Lấy danh sách làng nghề
        const villagesResponse = await CraftVillageService.getCraftVillages();
        setCraftVillages(villagesResponse.data.data);

        // Kiểm tra yêu cầu đã gửi
        const requestResponse = await userService.getSentRequestByUserId(
          userId
        );
        console.log("data: ", requestResponse.data.data);

        if (requestResponse.data) {
          const requestData = requestResponse.data.data;
          setCheckRequest({
            isSent: requestData.status !== "Cancelled",
            message:
              requestData.status === "Pending"
                ? "Bạn đã gửi yêu cầu trước đó. Vui lòng chờ phê duyệt."
                : requestData.status === "Cancelled"
                ? "Yêu cầu trước đó của bạn đã bị hủy. Bạn có thể gửi lại."
                : "",
            status: requestData.status,
            requestId: requestData.id,
          });

          // Nếu status là Cancelled, điền lại thông tin cũ
          if (requestData.status === "Cancelled") {
            setFormData({
              Image: null, // Ảnh sẽ xử lý riêng
              CraftVillageId: requestData.craftVillageId || "",
              YearsOfExperience: requestData.yearsOfExperience || 0,
              Description: requestData.description || "",
            });

            if (requestData.image) {
              setPreviewImage(requestData.image);
            }
          }
        } else {
          setCheckRequest({
            isSent: false,
            message: "",
            status: "",
            requestId: null,
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        showNotification("Không tải được thông tin yêu cầu", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isSentSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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

      // Nếu là yêu cầu gửi lại sau khi hủy
      if (checkRequest.status === "Cancelled" && checkRequest.requestId) {
        formDataToSend.append("RequestId", checkRequest.requestId);
      }

      const response = await userService.upgradeToArtisan(formDataToSend);

      if (!response.success) {
        throw new Error(response.error || "Gửi yêu cầu thất bại");
      }

      showNotification("Yêu cầu của bạn đã được gửi thành công!", "success");

      // Reset form và cập nhật trạng thái
      setFormData({
        Image: null,
        CraftVillageId: "",
        YearsOfExperience: 0,
        Description: "",
      });
      setPreviewImage(null);
      setSelectedVillage(null);
      setIsSentSuccess(true);
    } catch (err) {
      console.error("Error: ", err);
      showNotification(err.message || "Đã xảy ra lỗi không xác định", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Các hàm xử lý ảnh giữ nguyên như cũ
  const handleImageChange = useCallback((files) => {
    if (!files || files.length === 0) {
      showNotification("Vui lòng chọn một file!", "error");
      return;
    }

    const file = files[0];

    if (!file.type.match("image.*")) {
      showNotification(`File ${file.name} không phải là ảnh!`, "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification(`File ${file.name} vượt quá 5MB!`, "error");
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

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleResendRequest = async () => {
    if (!checkRequest.requestId) return;

    setIsLoading(true);
    try {
      const response = await userService.resendRequest(
        userId,
        checkRequest.requestId
      );

      if (response.success) {
        showNotification("Đã gửi lại yêu cầu thành công!", "success");
        setCheckRequest({
          isSent: true,
          message: "Bạn đã gửi lại yêu cầu. Vui lòng chờ phê duyệt.",
          status: "Pending",
          requestId: checkRequest.requestId,
        });
        setIsSentSuccess(true);
      } else {
        throw new Error(response.error || "Gửi lại yêu cầu không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi gửi lại yêu cầu:", error);
      showNotification(
        error.message || "Có lỗi xảy ra khi gửi lại yêu cầu",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    try {
      setIsLoading(true);
      const response = await userService.cancelArtisanRequest(userId);

      if (response.success) {
        showNotification("Đã hủy yêu cầu thành công!", "success");
        setCheckRequest({
          isSent: false,
          message: "Yêu cầu của bạn đã bị hủy. Bạn có thể gửi lại.",
          status: "Cancelled",
          requestId: checkRequest.requestId,
        });
        setIsSentSuccess(true);
      } else {
        throw new Error(response.error || "Hủy yêu cầu không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi hủy yêu cầu:", error);
      showNotification(
        error.message || "Có lỗi xảy ra khi hủy yêu cầu",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Đăng ký nghệ nhân
      </h2>

      {checkRequest.status === "Pending" ? (
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {checkRequest.message ||
                    "Bạn đã gửi yêu cầu trước đó. Vui lòng chờ phê duyệt."}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCancelRequest}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Hủy yêu cầu"}
          </button>
        </div>
      ) : checkRequest.status === "Cancelled" ? (
        // Hiển thị khi yêu cầu đã bị hủy
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-blue-400 mr-3" /* ... */ />
              <p className="text-sm text-blue-700">{checkRequest.message}</p>
            </div>
          </div>
          <button
            onClick={handleResendRequest}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Gửi lại yêu cầu"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phần upload ảnh */}
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
              disabled={checkRequest.isSent}
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

          {/* Phần chọn làng nghề */}
          <div>
            <label
              className="block text-gray-700 mb-2"
              htmlFor="CraftVillageId"
            >
              Làng nghề thủ công
            </label>
            <select
              id="CraftVillageId"
              name="CraftVillageId"
              value={formData.CraftVillageId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={
                isLoading || craftVillages.length === 0 || checkRequest.isSent
              }
            >
              <option value="">Chọn làng nghề thủ công</option>
              {craftVillages.map((village) => (
                <option key={village.id} value={village.id}>
                  {village.village_Name}
                </option>
              ))}
            </select>
          </div>

          {/* Hiển thị thông tin chi tiết làng nghề khi được chọn */}
          {selectedVillage && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Thông tin làng nghề
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Tên làng nghề:</span>{" "}
                  {selectedVillage.village_Name}
                </p>
                <p>
                  <span className="font-medium">Mô tả:</span>{" "}
                  {selectedVillage.description}
                </p>
                <p>
                  <span className="font-medium">Địa điểm:</span>{" "}
                  {selectedVillage.location}
                </p>
                <p>
                  <span className="font-medium">Ngày thành lập:</span>{" "}
                  {formatDate(selectedVillage.establishedDate)}
                </p>
              </div>
            </div>
          )}

          <div>
            <label
              className="block text-gray-700 mb-2"
              htmlFor="YearsOfExperience"
            >
              Kinh nghiệm (năm)
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
              disabled={checkRequest.isSent}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="Description">
              Mô tả
            </label>
            <textarea
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Mô tả về kỹ năng và kinh nghiệm của bạn"
              disabled={checkRequest.isSent}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>
      )}
    </div>
  );
}
