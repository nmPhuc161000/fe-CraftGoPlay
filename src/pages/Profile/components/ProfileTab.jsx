import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import userService from "../../../services/apis/userApi";
import { useNotification } from "../../../contexts/NotificationContext";
import authService from "../../../services/apis/authApi";
import { useNavigate } from "react-router-dom";

const ProfileTab = () => {
  const { user, setIsUpdate, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "Customer";
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  const [formData, setFormData] = useState({
    ...user,
    userName: user.userName || "Nguyễn Văn A",
    phone: user.phoneNumber || "Chưa cập nhật",
    address: user.address || "Chưa cập nhật",
    gender: user.gender || "other",
    birthday: user.dateOfBirth || "Chưa cập nhật",
    workshopName: user.workshopName || "Hội An",
    yearsOfExperience: user.yearsOfExperience || 5,
    preferences: user.preferences || ["Đồ gốm", "Thủ công truyền thống"],
    bio: user.bio || "Đam mê nghệ thuật truyền thống và chế tác thủ công",
    thumbnail:
      user.thumbnail ||
      "https://th.bing.com/th/id/OIP.PwEh4SGekpMaWT2d5GWw0wHaHt?rs=1&pid=ImgDetMain",
  });

  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");
  const fileInputRef = useRef(null);
  const { showNotification } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("socials.")) {
      const socialField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socials: { ...prev.socials, [socialField]: value },
      }));
    } else if (name === "craftSkills") {
      const skills = value.split(",").map((skill) => skill.trim());
      setFormData((prev) => ({ ...prev, craftSkills: skills }));
    } else if (name === "preferences") {
      const prefs = value.split(",").map((pref) => pref.trim());
      setFormData((prev) => ({ ...prev, preferences: prefs }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file)); // dùng URL để preview
      setFormData((prev) => ({
        ...prev,
        thumbnailFile: file, // lưu file chứ không phải base64
      }));
    }
  };

  // Dùng để hiển thị ngày sinh theo định dạng DD-MM-YYYY
  const formatBirthdayForDisplay = (birthday) => {
    if (!birthday) return "Chưa cập nhật";
    const date = new Date(birthday);
    const day = `${date.getDate()}`.padStart(2, "0");
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // Dùng để format birthday trước khi gửi API dưới dạng MM-DD-YYYY
  const formatBirthdayForAPI = (birthday) => {
    if (!birthday) return null;
    const date = new Date(birthday);
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData = new FormData();
      const isArtisan = role === "Artisan";

      updateData.append("Id", user.id);
      updateData.append("UserName", formData.userName);
      updateData.append("Email", formData.email);
      updateData.append("DateOfBirth", formatBirthdayForAPI(formData.birthday));
      updateData.append("PhoneNumber", formData.phone);

      if (formData.thumbnailFile) {
        updateData.append("Thumbnail", formData.thumbnailFile);
      }

      if (isArtisan) {
        updateData.append("WorkshopName", formData.workshopName || "");
        updateData.append(
          "CraftSkills",
          JSON.stringify(formData.craftSkills || [])
        );
        updateData.append("YearsOfExperience", formData.yearsOfExperience || 0);
        updateData.append("Bio", formData.bio || "");
      }

      // Gọi API tương ứng
      const response = isArtisan
        ? await userService.updateArtisan(updateData)
        : await userService.updateUser(updateData);

      if (response.success) {
        setSuccess("Cập nhật thông tin thành công!");
        setIsUpdate(true);
        setIsEditing(false);
        showNotification("Cập nhật thông tin thành công!", "success");
      } else {
        setError(response.error || "Có lỗi xảy ra khi cập nhật thông tin");
        showNotification(
          response.error || "Có lỗi xảy ra khi cập nhật thông tin",
          "error"
        );
        setIsEditing(true);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi kết nối với server");
      showNotification("Có lỗi xảy ra khi kết nối với server", "error");
      console.error("Update profile error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error khi người dùng bắt đầu nhập
    if (passwordError) {
      setPasswordError(null);
    }
  };

  const handlePasswordSubmit = async () => {
    // Validate
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      const formData = new FormData();
      formData.append("OldPassword", passwordData.oldPassword);
      formData.append("NewPassword", passwordData.newPassword);

      const response = await authService.changePassword(formData);

      if (response.success) {
        setPasswordSuccess("Đổi mật khẩu thành công!");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false);
        showNotification("Đổi mật khẩu thành công!", "success");
        logout();
        navigate("/login");
      } else {
        setPasswordError(response.error || "Có lỗi xảy ra khi đổi mật khẩu");
        showNotification(
          response.error || "Có lỗi xảy ra khi đổi mật khẩu",
          "error"
        );
      }
    } catch (err) {
      setPasswordError("Có lỗi xảy ra khi kết nối với server");
      showNotification("Có lỗi xảy ra khi kết nối với server", "error");
      console.error("Change password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const InfoField = ({ label, value, isArray = false }) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
      <dd className="text-gray-900">
        {isArray ? (
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-900">{value}</span>
        )}
      </dd>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Thông tin cá nhân
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                role === "Artisan"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {role === "Artisan" ? "🎨 Nghệ nhân" : "🛒 Khách hàng"}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              isEditing
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-[#5e3a1e] text-white hover:bg-[#7a4b28]"
            }`}
            disabled={isLoading}
          >
            {isLoading
              ? "Đang xử lý..."
              : isEditing
              ? "Hủy chỉnh sửa"
              : "Chỉnh sửa hồ sơ"}
          </button>
        </div>
      </div>

      {/* Hiển thị thông báo lỗi/thành công */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          <p>{success}</p>
        </div>
      )}

      {/* Avatar Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={
                avatarPreview ||
                formData.thumbnail ||
                "https://th.bing.com/th/id/OIP.PwEh4SGekpMaWT2d5GWw0wHaHt?rs=1&pid=ImgDetMain"
              }
              alt="Avatar"
              className={`w-32 h-32 rounded-full object-cover border-4 ${
                role === "Artisan" ? "border-amber-200" : "border-blue-200"
              } ${isEditing ? "cursor-pointer" : ""}`}
              onClick={triggerFileInput}
              crossOrigin="anonymous"
            />
            {isEditing && (
              <div
                className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                onClick={triggerFileInput}
              >
                <span className="text-white text-sm font-medium">Đổi ảnh</span>
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
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            {formData.userName || "Nguyễn Văn A"}
          </h3>
          <p className="text-gray-600">
            {formData.email || "user@example.com"}
          </p>
        </div>
      </div>

      {/* Profile Content */}
      {!isEditing ? (
        // Display Mode
        <div className="grid grid-cols-1 gap-6">
          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-[#5e3a1e] rounded-full mr-3"></span>
              Thông tin cơ bản
            </h3>
            <dl className="space-y-1">
              <InfoField
                label="Họ và tên"
                value={formData.userName || "Nguyễn Văn A"}
              />
              <InfoField
                label="Email"
                value={formData.email || "user@example.com"}
              />
              <InfoField label="Số điện thoại" value={formData.phone} />
              <InfoField
                label="Ngày sinh"
                value={formatBirthdayForDisplay(formData.birthday)}
              />
              {role === "Artisan" && (
                <InfoField
                  label="Làng nghề"
                  value={formData.craftVillage.village_Name}
                />
              )}
            </dl>
          </div>
          {/* Phần Đổi mật khẩu - THÊM VÀO ĐÂY */}
          {user.provider !== "Google" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Đổi mật khẩu
                </h3>
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    isChangingPassword
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                      : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  {isChangingPassword ? "Hủy" : "Đổi mật khẩu"}
                </button>
              </div>

              {isChangingPassword ? (
                <div className="space-y-4">
                  {/* Hiển thị thông báo lỗi/thành công cho mật khẩu */}
                  {passwordError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                      <p>{passwordError}</p>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded">
                      <p>{passwordSuccess}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu cũ*
                      </label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập mật khẩu cũ"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu mới*
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập mật khẩu mới"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu mới*
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập lại mật khẩu mới"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setPasswordError(null);
                        setPasswordSuccess(null);
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                      disabled={isLoading}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handlePasswordSubmit}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
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
                          Đang xử lý...
                        </>
                      ) : (
                        "Đổi mật khẩu"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  Bấm vào nút "Đổi mật khẩu" để thay đổi mật khẩu của bạn.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        // Edit Mode
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cột 1 - Thông tin chung */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên*
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                  required
                />
              </div>

              {role === "Artisan" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Làng nghề
                  </label>
                  <input
                    type="text"
                    name="workshopName"
                    value={formData.workshopName || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
                  />
                </div>
              )}
            </div>

            {/* Cột 2 - Thông tin liên hệ */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={
                    formData.phone === "Chưa cập nhật" ? "" : formData.phone
                  }
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
                  pattern="[0-9]{10,11}"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={
                    formData.birthday === "Chưa cập nhật"
                      ? ""
                      : formData.birthday?.split("T")[0] || formData.birthday
                  }
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                disabled={isLoading}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#5e3a1e] text-white rounded-md hover:bg-[#7a4b28] transition flex items-center justify-center"
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
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
