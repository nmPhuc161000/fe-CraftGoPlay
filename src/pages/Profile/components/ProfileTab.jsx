import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

const ProfileTab = () => {
  const { user } = useContext(AuthContext);
  const role = localStorage.getItem("role") || "Customer"; // Mặc định là Customer nếu không có role
  const [formData, setFormData] = useState({
    ...user,
    phone: user.phoneNumber || "",
    address: user.address || "",
    gender: user.gender || "other",
    birthday: user.dateOfBirth || "",
    website: user.website || "",
    socials: {
      facebook: user.socials?.facebook || "",
      instagram: user.socials?.instagram || "",
      tiktok: user.socials?.tiktok || "",
    },
    // Thêm trường riêng cho Artisan
    workshopName: user.workshopName || "",
    craftSkills: user.craftSkills || [],
    yearsOfExperience: user.yearsOfExperience || 0,
    // Thêm trường riêng cho Customer
    preferences: user.preferences || [],
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      avatar: avatarPreview, // Thêm avatar vào dữ liệu sẽ lưu
    };
    // onSave(dataToSave);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Chỉnh sửa thông tin cá nhân
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

      {/* Phần Avatar */}
      <div className="flex flex-col items-center">
        <div className="relative group">
          <img
            src={
              avatarPreview ||
              "https://th.bing.com/th/id/OIP.PwEh4SGekpMaWT2d5GWw0wHaHt?rs=1&pid=ImgDetMain"
            }
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-2 border-[#5e3a1e] cursor-pointer"
            onClick={triggerFileInput}
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
            onClick={triggerFileInput}
          >
            <span className="text-white text-sm font-medium">Đổi ảnh</span>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Cột 1 - Thông tin chung */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên*
            </label>
            <input
              type="text"
              name="name"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e]"
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
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e]"
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
                value="Hội An"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e]"
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
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e]"
              pattern="[0-9]{10,11}"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e]"
            />
          </div>
        </div>

        {/* Phần mở rộng - 2 cột */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới thiệu
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e]"
              placeholder={
                role === "Artisan"
                  ? "Giới thiệu về phong cách làm nghề, chất liệu yêu thích..."
                  : "Mô tả sở thích về đồ thủ công..."
              }
            ></textarea>
          </div>

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
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e]"
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
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5e3a1e]"
                />
              </div>
            </>
          )}
        </div>

        <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#5e3a1e] text-white rounded-md hover:bg-[#7a4b28] transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
