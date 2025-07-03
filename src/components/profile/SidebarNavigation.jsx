// components/profile/SidebarNavigation.js
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";

const SidebarNavigation = ({ role, isActive }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    logout();
    navigate("/login"); // Chuyển hướng về trang login sau khi đăng xuất
  };
  return (
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
          role === "Artisan" ? "/profile-user/products" : "/profile-user/orders"
        }
        className={`flex items-center px-4 py-3 rounded-lg mb-1 ${
          isActive(role === "Artisan" ? "products" : "orders")
            ? "bg-[#5e3a1e] text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span className="w-6 text-center">
          {role === "Artisan" ? "🎨" : "🛒"}
        </span>
        <span className="ml-3">
          {role === "Artisan" ? "Sản phẩm" : "Đơn hàng"}
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
          role === "Artisan"
            ? "/profile-user/customers"
            : "/profile-user/favorites"
        }
        className={`flex items-center px-4 py-3 rounded-lg mb-1 ${
          isActive(role === "Artisan" ? "customers" : "favorites")
            ? "bg-[#5e3a1e] text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span className="w-6 text-center">
          {role === "Artisan" ? "👥" : "❤️"}
        </span>
        <span className="ml-3">
          {role === "Artisan" ? "Khách hàng" : "Yêu thích"}
        </span>
      </Link>

      {role === "User" && (
        <Link
          to="/profile-user/addresses"
          className={`flex items-center px-4 py-3 rounded-lg mb-1 ${
            isActive("addresses")
              ? "bg-[#5e3a1e] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span className="w-6 text-center">🏠</span>
          <span className="ml-3">Địa chỉ</span>
        </Link>
      )}

      {role === "Artisan" ? (
        <>
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

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg mb-1 text-gray-700 hover:bg-gray-100"
          >
            <span className="w-6 text-center">🚪</span>
            <span className="ml-3">Đăng xuất</span>
          </button>
        </>
      ) : (
        <Link
          to="/profile-user/upgradeArtisan"
          className={`flex items-center px-4 py-3 rounded-lg mb-1 ${
            isActive("upgradeArtisan")
              ? "bg-[#5e3a1e] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span className="w-6 text-center">✨</span>
          <span className="ml-3">Đăng ký Nghệ nhân</span>
        </Link>
      )}
    </nav>
  );
};

export default SidebarNavigation;
