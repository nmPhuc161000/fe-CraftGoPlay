import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import userService from "../../services/apis/userApi";

export default function AccountStaff() {
  const { user, setIsUpdate } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
    phoneNumber: user?.phoneNumber || "",
    thumbnail: user?.thumbnail || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.thumbnail || "");
  const fileInputRef = useRef(null);

  // Kiểm tra nếu user không tồn tại
  if (!user) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center text-red-500 font-medium">
            Không tìm thấy thông tin người dùng
          </div>
        </div>
      </div>
    );
  }

  // Lấy dữ liệu từ user
  const { email, status } = user;

  // Format ngày tháng năm sinh nếu có
  const formatBirthdayForDisplay = (birthday) => {
    if (!birthday || isNaN(new Date(birthday).getTime()))
      return "Chưa cập nhật";
    const date = new Date(birthday);
    const day = `${date.getDate()}`.padStart(2, "0");
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format ngày sinh cho API (MM-DD-YYYY)
  const formatBirthdayForAPI = (birthday) => {
    if (!birthday || isNaN(new Date(birthday).getTime())) return null;
    const date = new Date(birthday);
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Xác định màu sắc cho trạng thái
  const statusColor =
    status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi ảnh đại diện
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      const newPreview = URL.createObjectURL(file);
      setAvatarPreview(newPreview);
      setFormData((prev) => ({
        ...prev,
        thumbnailFile: file,
      }));
    } else {
      showNotification("Vui lòng chọn file ảnh hợp lệ", "error");
    }
  };

  // Kích hoạt input file
  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = new FormData();
      updateData.append("Id", user.id);
      updateData.append("UserName", formData.userName);
      updateData.append("Email", email);
      updateData.append(
        "DateOfBirth",
        formatBirthdayForAPI(formData.dateOfBirth)
      );
      updateData.append("PhoneNumber", formData.phoneNumber);

      if (formData.thumbnailFile) {
        updateData.append("Thumbnail", formData.thumbnailFile);
      }

      const response = await userService.updateUser(updateData);

      if (response.success) {
        showNotification("Cập nhật thông tin thành công!", "success");
        setIsUpdate(true);
        setIsEditing(false);
      } else {
        showNotification(
          response.error || "Có lỗi xảy ra khi cập nhật thông tin",
          "error"
        );
        setIsEditing(true);
      }
    } catch (error) {
      showNotification("Có lỗi xảy ra khi kết nối với server", "error");
      console.error("Update profile error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý hủy chỉnh sửa
  const handleCancel = () => {
    setFormData({
      userName: user.userName || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      phoneNumber: user.phoneNumber || "",
      thumbnail: user.thumbnail || "",
    });
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(user.thumbnail || "");
    setIsEditing(false);
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Thông tin tài khoản
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="md:flex">
          <div className="md:flex-shrink-0 p-6 flex flex-col items-center justify-center">
            <div className="relative h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-indigo-100 mb-4 group">
              {avatarPreview || formData.thumbnail ? (
                <img
                  src={avatarPreview || formData.thumbnail}
                  alt={formData.userName}
                  className="h-full w-full object-cover"
                  crossorigin="anonymous"
                />
              ) : (
                <span className="text-4xl text-gray-400 font-bold">
                  {formData.userName
                    ? formData.userName.charAt(0).toUpperCase()
                    : "U"}
                </span>
              )}
              {isEditing && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <span className="text-white text-sm font-medium">
                    Đổi ảnh
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={triggerFileInput}
              className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Thay đổi ảnh
            </button>
          </div>

          <div className="p-6 md:p-8 flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email || "Chưa cập nhật"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email không thể thay đổi
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập số điện thoại"
                    pattern="[0-9]{10,11}"
                  />
                </div>
              </form>
            ) : (
              <>
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  Thông tin nhân viên
                </div>
                <h1 className="block mt-1 text-xl font-medium text-gray-800">
                  {formData.userName || "Chưa cập nhật"}
                </h1>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="text-sm text-gray-900 md:col-span-2 break-words">
                        {email || "Chưa cập nhật"}
                      </dd>
                    </div>

                    <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Ngày sinh
                      </dt>
                      <dd className="text-sm text-gray-900 md:col-span-2">
                        {formatBirthdayForDisplay(formData.dateOfBirth)}
                      </dd>
                    </div>

                    <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Số điện thoại
                      </dt>
                      <dd className="text-sm text-gray-900 md:col-span-2">
                        {formData.phoneNumber || "Chưa cập nhật"}
                      </dd>
                    </div>

                    <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Trạng thái
                      </dt>
                      <dd className="text-sm md:col-span-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                        >
                          {status === "Active"
                            ? "Đang hoạt động"
                            : "Không hoạt động"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
