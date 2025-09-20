// src/pages/Profile/components/user/UpgradeArtisanTab.jsx
import { useCallback, useEffect, useState } from "react";
import userService from "../../../../services/apis/userApi";
import { useNotification } from "../../../../contexts/NotificationContext";
import { FiUpload, FiX } from "react-icons/fi";
import CraftVillageService from "../../../../services/apis/craftvillageApi";
import locationService from "../../../../services/apis/locationApi";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

export default function UpgradeArtisanTab({ userId }) {
  const [formData, setFormData] = useState({
    Image: null,
    CraftVillageId: "",
    YearsOfExperience: 0,
    Description: "",
    province: "",
    provinceId: "",
    district: "",
    districtId: "",
    ward: "",
    wardCode: "",
    street: "",
    PhoneNumber: "", // Thêm field PhoneNumber
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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "CraftVillageId") {
      const village = craftVillages.find((v) => v.id === value);
      setSelectedVillage(village);
    }
  };

  const fetchProvinces = useCallback(async () => {
    try {
      setLoadingLocations(true);
      const response = await locationService.getProvince();
      setProvinces(response.data || []);
    } catch (error) {
      showNotification("Không tải được danh sách tỉnh/thành", "error");
      console.error("Error fetching provinces:", error);
    } finally {
      setLoadingLocations(false);
    }
  }, [showNotification]);

  const fetchDistricts = useCallback(
    async (provinceName) => {
      try {
        setLoadingLocations(true);
        const province = provinces.find((p) => p.ProvinceName === provinceName);
        if (!province) return;
        const response = await locationService.getDistrict(province.ProvinceID);
        setDistricts(response.data || []);
        setWards([]);
        setFormData((prev) => ({
          ...prev,
          district: "",
          districtId: "",
          ward: "",
          wardCode: "",
        }));
      } catch (error) {
        showNotification("Không tải được danh sách quận/huyện", "error");
        console.error("Error fetching districts:", error);
      } finally {
        setLoadingLocations(false);
      }
    },
    [provinces, showNotification]
  );

  const fetchWards = useCallback(
    async (districtName) => {
      try {
        setLoadingLocations(true);
        const district = districts.find((d) => d.DistrictName === districtName);
        if (!district) return;
        const response = await locationService.getWard(district.DistrictID);
        setWards(response.data || []);
        setFormData((prev) => ({
          ...prev,
          ward: "",
          wardCode: "",
        }));
      } catch (error) {
        showNotification("Không tải được danh sách phường/xã", "error");
        console.error("Error fetching wards:", error);
      } finally {
        setLoadingLocations(false);
      }
    },
    [districts, showNotification]
  );

  const handleProvinceChange = useCallback(
    (e) => {
      const value = e.target.value;
      const selected = provinces.find((p) => p.ProvinceName === value);
      setFormData((prev) => ({
        ...prev,
        province: value,
        provinceId: selected ? selected.ProvinceID : "",
        district: "",
        districtId: "",
        ward: "",
        wardCode: "",
      }));
      if (selected) fetchDistricts(value);
    },
    [provinces, fetchDistricts]
  );

  const handleDistrictChange = useCallback(
    (e) => {
      const value = e.target.value;
      const selected = districts.find((d) => d.DistrictName === value);
      setFormData((prev) => ({
        ...prev,
        district: value,
        districtId: selected ? selected.DistrictID : "",
        ward: "",
        wardCode: "",
      }));
      if (selected) fetchWards(value);
    },
    [districts, fetchWards]
  );

  const handleWardChange = useCallback(
    (e) => {
      const value = e.target.value;
      const selected = wards.find((w) => w.WardName === value);
      setFormData((prev) => ({
        ...prev,
        ward: value,
        wardCode: selected ? selected.WardCode : "",
      }));
    },
    [wards]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const villagesResponse = await CraftVillageService.getCraftVillages();
        setCraftVillages(villagesResponse.data.data);

        try {
          const requestResponse = await userService.getSentRequestByUserId(
            userId
          );
          if (requestResponse.data && requestResponse.data.data) {
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

            if (requestData.status === "Cancelled") {
              setFormData({
                Image: null,
                CraftVillageId: requestData.craftVillageId || "",
                YearsOfExperience: requestData.yearsOfExperience || 0,
                Description: requestData.description || "",
                province: requestData.province || "",
                provinceId: requestData.provinceId || "",
                district: requestData.district || "",
                districtId: requestData.districtId || "",
                ward: requestData.ward || "",
                wardCode: requestData.wardCode || "",
                street: requestData.street || "",
                PhoneNumber: requestData.phoneNumber || "", // Lấy từ requestData nếu có
              });
              if (requestData.image) setPreviewImage(requestData.image);
            }
          } else {
            setCheckRequest({
              isSent: false,
              message: "",
              status: "",
              requestId: null,
            });
          }
        } catch (requestError) {
          console.error("Lỗi khi tải thông tin yêu cầu:", requestError);
          if (requestError.response?.status !== 404) {
            showNotification("Không tải được thông tin yêu cầu", "error");
          }
        }
        await fetchProvinces();
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        if (!error.message.includes("cancel")) {
          showNotification("Không tải được thông tin làng nghề", "error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isSentSuccess, userId, showNotification, fetchProvinces]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      if (formData.Image) formDataToSend.append("Image", formData.Image);
      formDataToSend.append("CraftVillageId", formData.CraftVillageId);
      formDataToSend.append(
        "YearsOfExperience",
        formData.YearsOfExperience.toString()
      );
      formDataToSend.append("Description", formData.Description);
      formDataToSend.append("UserId", userId);
      formDataToSend.append("ProviceId", formData.provinceId);
      formDataToSend.append("DistrictId", formData.districtId);
      formDataToSend.append("WardCode", formData.wardCode);
      formDataToSend.append("ProviceName", formData.province);
      formDataToSend.append("DistrictName", formData.district);
      formDataToSend.append("WardName", formData.ward);
      formDataToSend.append("HomeNumber", formData.street);
      formDataToSend.append("PhoneNumber", formData.PhoneNumber); // Thêm PhoneNumber

      if (checkRequest.status === "Cancelled" && checkRequest.requestId) {
        formDataToSend.append("RequestId", checkRequest.requestId);
      }

      const response = await userService.upgradeToArtisan(formDataToSend);

      if (!response.success) {
        throw new Error(response.error || "Gửi yêu cầu thất bại");
      }

      showNotification("Yêu cầu của bạn đã được gửi thành công!", "success");
      setFormData({
        Image: null,
        CraftVillageId: "",
        YearsOfExperience: 0,
        Description: "",
        province: "",
        provinceId: "",
        district: "",
        districtId: "",
        ward: "",
        wardCode: "",
        street: "",
        PhoneNumber: "",
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

  // Các hàm xử lý ảnh giữ nguyên
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
      setFormData((prev) => ({ ...prev, Image: file }));
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
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-blue-400 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 7a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
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
                  crossOrigin="anonymous"
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

          {/* Phần chọn địa chỉ */}
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="province">
              Tỉnh/Thành
            </label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleProvinceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading || checkRequest.isSent || loadingLocations}
            >
              <option value="">Chọn tỉnh/thành</option>
              {provinces.map((province) => (
                <option key={province.ProvinceID} value={province.ProvinceName}>
                  {province.ProvinceName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="district">
              Quận/Huyện
            </label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleDistrictChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={
                isLoading ||
                checkRequest.isSent ||
                !formData.province ||
                loadingLocations
              }
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((district) => (
                <option key={district.DistrictID} value={district.DistrictName}>
                  {district.DistrictName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="ward">
              Phường/Xã
            </label>
            <select
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleWardChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={
                isLoading ||
                checkRequest.isSent ||
                !formData.district ||
                loadingLocations
              }
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((ward) => (
                <option key={ward.WardCode} value={ward.WardName}>
                  {ward.WardName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="street">
              Số nhà, tên đường
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số nhà, tên đường"
              required
              disabled={checkRequest.isSent}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="PhoneNumber">
              Số điện thoại
            </label>
            <input
              type="text"
              id="PhoneNumber"
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại"
              required
              disabled={checkRequest.isSent}
            />
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

          {loadingLocations && (
            <LoadingSpinner message="Đang tải dữ liệu địa chỉ..." />
          )}
        </form>
      )}
    </div>
  );
}
