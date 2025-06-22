import React, { useState, useContext } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileRoutes from "../../router/ProfileRoutes";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProfileUser() {
  const { user, saveProfile } = useContext(AuthContext); // Lấy từ AuthContext
  const navigate = useNavigate();

  // Nếu user chưa được tải (trường hợp hiếm), sử dụng state tạm thời
  const initialUser = user || {
    id: 1,
    isArtisan: false,
    name: "Nguyễn Văn A",
    username: "@nguyenvana",
    bio: "Yêu thích đồ thủ công mỹ nghệ truyền thống",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    location: "Hà Nội, Việt Nam",
    address: "Số 1, ngõ 12, phố ABC",
    gender: "male",
    birthday: "1990-01-01",
    website: "",
    socials: {
      facebook: "nguyenvana",
      instagram: "nguyen_van_a",
      tiktok: "",
    },
    joinDate: "Tham gia từ tháng 3/2023",
    products: 12,
    orders: 5,
    avatar:
      "https://th.bing.com/th/id/OIP.PwEh4SGekpMaWT2d5GWw0wHaHt?rs=1&pid=ImgDetMain",
  };

  const [localUser, setLocalUser] = useState(initialUser);

  // Cập nhật localUser khi user từ AuthContext thay đổi
  React.useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  const handleRegisterArtisan = () => {
    saveProfile({ isArtisan: true }); // Cập nhật isArtisan qua AuthContext
    navigate("/profile-user/profile");
  };

  const location = useLocation();
  const currentTab = location.pathname.split("/").pop() || "profile";

  const isActive = (tabName) => currentTab === tabName;

  return (
    <MainLayout>
      <div className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 px-4">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-lg shadow-lg h-fit md:sticky md:top-6">
            {/* Profile Summary */}
            <div className="p-4 border-b">
              <div className="flex flex-col items-center text-center">
                <img
                  className="w-24 h-24 rounded-full border-2 border-[#5e3a1e] object-cover mb-3"
                  src={localUser.avatar}
                  alt="User avatar"
                />
                <h3 className="font-bold text-lg">{localUser.name}</h3>
                <p className="text-gray-600 text-sm">{localUser.username}</p>
                {localUser.isArtisan ? (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full mt-1">
                    🎨 Nghệ nhân
                  </span>
                ) : (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-1">
                    🛒 Khách hàng
                  </span>
                )}
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="p-2">
              <Link
                to="/profile-user/profile"
                className={`flex items-center px-4 py-3 rounded-lg mb-1 ${
                  isActive("profile")
                    ? "bg-[#5e3a1e] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="w-6 text-center">📝</span>
                <span className="ml-3">Hồ sơ cá nhân</span>
              </Link>

              <Link
                to={
                  localUser.isArtisan
                    ? "/profile-user/products"
                    : "/profile-user/orders"
                }
                className={`flex items-center px-4 py-3 rounded-lg mb-1 ${
                  isActive(localUser.isArtisan ? "products" : "orders")
                    ? "bg-[#5e3a1e] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="w-6 text-center">
                  {localUser.isArtisan ? "🎨" : "🛒"}
                </span>
                <span className="ml-3">
                  {localUser.isArtisan ? "Sản phẩm" : "Đơn hàng"}
                </span>
              </Link>

              <Link
                to="/profile-user/reviews"
                className={`flex items-center px-4 py-3 rounded-lg mb-1 ${
                  isActive("reviews")
                    ? "bg-[#5e3a1e] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="w-6 text-center">⭐</span>
                <span className="ml-3">Đánh giá</span>
              </Link>

              <Link
                to={
                  localUser.isArtisan
                    ? "/profile-user/customers"
                    : "/profile-user/favorites"
                }
                className={`flex items-center px-4 py-3 rounded-lg mb-1 ${
                  isActive(localUser.isArtisan ? "customers" : "favorites")
                    ? "bg-[#5e3a1e] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="w-6 text-center">
                  {localUser.isArtisan ? "👥" : "❤️"}
                </span>
                <span className="ml-3">
                  {localUser.isArtisan ? "Khách hàng" : "Yêu thích"}
                </span>
              </Link>

              {localUser.isArtisan ? (
                <Link
                  to="/profile-user/revenue"
                  className={`flex items-center px-4 py-3 rounded-lg mb-1 ${
                    isActive("revenue")
                      ? "bg-[#5e3a1e] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="w-6 text-center">💰</span>
                  <span className="ml-3">Doanh thu</span>
                </Link>
              ) : (
                <button
                  onClick={handleRegisterArtisan}
                  className={`flex items-center w-full px-4 py-3 rounded-lg mb-1 ${
                    isActive("register-artisan")
                      ? "bg-[#5e3a1e] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="w-6 text-center">✨</span>
                  <span className="ml-3">Đăng ký Nghệ nhân</span>
                </button>
              )}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-[#4a2d16] to-[#6e4b2a]"></div>

            {/* Tab Content */}
            <div className="p-6">
              <ProfileRoutes />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}