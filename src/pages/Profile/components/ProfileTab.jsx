import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

const ProfileTab = () => {
  const { user } = useContext(AuthContext);
  const role = localStorage.getItem("role") || "Customer";
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    ...user,
    phone: user.phoneNumber || "Chưa cập nhật",
    address: user.address || "Chưa cập nhật",
    gender: user.gender || "other",
    birthday: user.dateOfBirth || "Chưa cập nhật",
    workshopName: user.workshopName || "Hội An",
    craftSkills: user.craftSkills || ["Gốm", "Thêu", "Mây tre"],
    yearsOfExperience: user.yearsOfExperience || 5,
    preferences: user.preferences || ["Đồ gốm", "Thủ công truyền thống"],
    bio: user.bio || "Đam mê nghệ thuật truyền thống và chế tác thủ công"
  });

  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");
  const fileInputRef = useRef(null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const dataToSave = {
      ...formData,
      avatar: avatarPreview,
    };
    // onSave(dataToSave);
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current.click();
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
          >
            {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
          </button>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={
                avatarPreview ||
                "https://th.bing.com/th/id/OIP.PwEh4SGekpMaWT2d5GWw0wHaHt?rs=1&pid=ImgDetMain"
              }
              alt="Avatar"
              className={`w-32 h-32 rounded-full object-cover border-4 ${
                role === "Artisan" ? "border-amber-200" : "border-blue-200"
              } ${isEditing ? "cursor-pointer" : ""}`}
              onClick={triggerFileInput}
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
          <p className="text-gray-600">{formData.email || "user@example.com"}</p>
        </div>
      </div>

      {/* Profile Content */}
      {!isEditing ? (
        // Display Mode
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-[#5e3a1e] rounded-full mr-3"></span>
              Thông tin cơ bản
            </h3>
            <dl className="space-y-1">
              <InfoField label="Họ và tên" value={formData.userName || "Nguyễn Văn A"} />
              <InfoField label="Email" value={formData.email || "user@example.com"} />
              <InfoField label="Số điện thoại" value={formData.phone} />
              <InfoField label="Ngày sinh" value={formData.birthday?.split("T")[0] || formData.birthday} />
              {role === "Artisan" && (
                <InfoField label="Làng nghề" value={formData.workshopName} />
              )}
            </dl>
          </div>

          {/* Thông tin chuyên môn */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-[#5e3a1e] rounded-full mr-3"></span>
              {role === "Artisan" ? "Thông tin nghề nghiệp" : "Sở thích"}
            </h3>
            <dl className="space-y-1">
              {role === "Artisan" ? (
                <>
                  <InfoField label="Kỹ năng chế tác" value={formData.craftSkills} isArray={true} />
                  <InfoField label="Số năm kinh nghiệm" value={`${formData.yearsOfExperience} năm`} />
                </>
              ) : (
                <InfoField label="Sở thích" value={formData.preferences} isArray={true} />
              )}
            </dl>
          </div>

          {/* Giới thiệu */}
          {role === "Artisan" && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-[#5e3a1e] rounded-full mr-3"></span>
                Giới thiệu
              </h3>
              <p className="text-gray-700 leading-relaxed">{formData.bio}</p>
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
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
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
                  value={formData.phone === "Chưa cập nhật" ? "" : formData.phone}
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
                  value={formData.birthday === "Chưa cập nhật" ? "" : formData.birthday?.split("T")[0] || formData.birthday}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
                />
              </div>
            </div>

            {/* Phần mở rộng */}
            <div className="md:col-span-2 space-y-4">
              {role === "Artisan" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới thiệu
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
                    placeholder="Giới thiệu về phong cách làm nghề, chất liệu yêu thích..."
                  />
                </div>
              )}

              {role === "Artisan" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kỹ năng chế tác (cách nhau bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      name="craftSkills"
                      value={formData.craftSkills.join(", ")}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
                      placeholder="Gốm, mây tre, thêu, ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số năm kinh nghiệm
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience || 0}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
                    />
                  </div>
                </>
              )}

              {role === "Customer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sở thích (cách nhau bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    name="preferences"
                    value={formData.preferences.join(", ")}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e] focus:border-[#5e3a1e]"
                    placeholder="Đồ gốm, thủ công truyền thống, ..."
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#5e3a1e] text-white rounded-md hover:bg-[#7a4b28] transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;