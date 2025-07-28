// components/profile/SidebarNavigation.js
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SidebarNavigation = ({ role, isActive }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Auto mở dropdown nếu đang ở trang con trong accountItems
  useEffect(() => {
    if (role === "User" && accountItems.some((item) => isActive(item.id))) {
      setIsAccountOpen(true);
    }
  }, [role, isActive]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  useEffect(() => {
    if (
      isAccountOpen &&
      !accountItems.some((item) => location.pathname.startsWith(item.to))
    ) {
      setIsAccountOpen(false);
    }
  }, [location.pathname]);

  const getItemClass = (active) =>
    `flex items-center px-4 py-3 rounded-lg mb-1 transition-all duration-150 ${active
      ? "bg-[#8f693b] text-white"
      : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
    }`;

  const navItems = [
    {
      id: role === "Artisan" ? "products" : "orders",
      to:
        role === "Artisan" ? "/profile-user/products" : "/profile-user/orders",
      icon: role === "Artisan" ? "🎨" : "🛒",
      label: role === "Artisan" ? "Sản phẩm" : "Đơn hàng",
      show: true,
    },
    {
      id: "artisanOrders",
      to: "/profile-user/artisanOrders",
      icon: "📦",
      label: "Quản lý đơn hàng",
      show: role === "Artisan",
    },
    {
      id: role === "Artisan" ? "artisanReviews" : "userReviews",
      to:
        role === "Artisan"
          ? "/profile-user/artisanReviews"
          : "/profile-user/userReviews",
      icon: "⭐",
      label: role === "Artisan" ? "Đánh giá từ khách hàng" : "Đánh giá của bạn",
      show: true,
    },
    {
      id: role === "Artisan" ? "customers" : "favorites",
      to:
        role === "Artisan"
          ? "/profile-user/customers"
          : "/profile-user/favorites",
      icon: role === "Artisan" ? "👥" : "❤️",
      label: role === "Artisan" ? "Khách hàng" : "Yêu thích",
      show: true,
    },
    {
      id: role === "Artisan" ? "revenue" : "coins",
      to: role === "Artisan" ? "/profile-user/revenue" : "/profile-user/coins",
      icon: role === "Artisan" ? "📊" : "🪙",
      label: role === "Artisan" ? "Doanh thu" : "Kho xu",
      show: true,
    },
    {
      id: "vouchers",
      to: "/profile-user/vouchers",
      icon: "🎟️",
      label: "Kho voucher",
      show: role === "User",
    },
    {
      id: "refundWallet",
      to: "/profile-user/refundWallet",
      icon: "💰",
      label: "Ví hoàn tiền",
      show: role === "User",
    },
  ];

  const accountItems = [
    {
      id: "profile",
      to: "/profile-user/profile",
      icon: "📝",
      label: "Hồ sơ cá nhân",
    },
    {
      id: "addresses",
      to: "/profile-user/addresses",
      icon: "🏠",
      label: "Địa chỉ",
      show: role === "User",
    },
    {
      id: "upgradeArtisan",
      to: "/profile-user/upgradeArtisan",
      icon: "✨",
      label: "Đăng ký Nghệ nhân",
      show: role !== "Artisan",
    },
  ];

  return (
    <nav className="p-2">
      {/* Dropdown - Tài khoản của tôi (chỉ với User) */}
      {role === "User" && (
        <div className="mb-1">
          <button
            onClick={() => {
              setIsAccountOpen(true);
              if (location.pathname !== "/profile-user/profile") {
                navigate("/profile-user/profile");
              }
            }}
            className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-150 text-gray-700 hover:bg-gray-100 active:bg-gray-200"
          >
            <div className="flex items-center">
              <span className="w-6 text-center">👤</span>
              <span className="ml-3">Tài khoản của tôi</span>
            </div>
            <span
              className={`ml-2 text-sm transition-transform duration-200 ${isAccountOpen ? "rotate-180" : ""
                }`}
            >
              ▼
            </span>
          </button>

          {/* Dropdown animation */}
          <AnimatePresence>
            {isAccountOpen && (
              <motion.div
                className="ml-6 mt-1 space-y-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {accountItems.map(
                  (item) =>
                    item.show !== false && (
                      <Link
                        key={item.id}
                        to={item.to}
                        className={getItemClass(isActive(item.id))}
                      >
                        <span className="w-6 text-center">{item.icon}</span>
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Nếu là Artisan thì hiển thị thẳng các account item */}
      {role === "Artisan" &&
        accountItems.map(
          (item) =>
            item.show !== false && (
              <Link
                key={item.id}
                to={item.to}
                className={getItemClass(isActive(item.id))}
              >
                <span className="w-6 text-center">{item.icon}</span>
                <span className="ml-3">{item.label}</span>
              </Link>
            )
        )}

      {/* Các mục navigation */}
      {navItems.map(
        (item) =>
          item.show && (
            <Link
              key={item.id}
              to={item.to}
              className={getItemClass(isActive(item.id))}
            >
              <span className="w-6 text-center">{item.icon}</span>
              <span className="ml-3">{item.label}</span>
            </Link>
          )
      )}

      {/* Nút đăng xuất */}
      {role === "Artisan" && (
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg mb-1 text-gray-700 hover:bg-red-100 active:bg-red-200 transition-all duration-150"
        >
          <span className="w-6 text-center">🚪</span>
          <span className="ml-3">Đăng xuất</span>
        </button>
      )}
    </nav>
  );
};

export default SidebarNavigation;
