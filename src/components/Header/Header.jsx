import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaUser,
  FaSignOutAlt,
  FaBoxOpen,
} from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";

const Header = () => {
  const { user, isAuthenticated, logout, hasCheckedIn } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { cartItems } = useContext(CartContext);

  const totalCartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="bg-[#5e3a1e] text-[#f2e8dc] text-xs py-4 overflow-hidden whitespace-nowrap relative border-y border-[#cbb892]">
        <div className="flex animate-marquee min-w-max font-semibold">
          <div className="flex space-x-8">
            {Array(10)
              .fill(
                "🌟 Mỗi món hàng là một câu chuyện – Mỗi đơn hàng là một hành động ủng hộ văn hóa!"
              )
              .map((msg, i) => (
                <span key={`msg1-${i}`} className="mx-4">
                  {msg}
                </span>
              ))}
          </div>
          <div className="flex space-x-8" aria-hidden="true">
            {Array(10)
              .fill(
                "🎁 Tham gia CraftGoPlay – Nhận quà tặng khi hoàn thành nhiệm vụ mua sắm!"
              )
              .map((msg, i) => (
                <span key={`msg2-${i}`} className="mx-4">
                  {msg}
                </span>
              ))}
          </div>
        </div>
      </div>

      <header className="bg-white text-[#5e3a1e] shadow-md sticky top-0 z-50 w-full relative">
        <div className="px-12 py-5 flex justify-between items-center">
          <div className="flex space-x-10 text-base font-medium items-center">
            <Link
              to="/#products"
              className="hover:no-underline hover:text-gray-500 transition-colors duration-200 font-extrabold tracking-wider"
            >
              Sản Phẩm
            </Link>
            <Link
              to="/about"
              className="hover:no-underline hover:text-gray-500 transition-colors duration-200 font-extrabold tracking-wider"
            >
              Giới thiệu
            </Link>
            <div className="relative">
              <Link
                to="/profile-user/daily-checkin"
                className="hover:no-underline hover:text-gray-500 transition-colors duration-200 font-extrabold tracking-wider"
              >
                Điểm danh
              </Link>
              {!hasCheckedIn && isAuthenticated && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-3 h-3 flex items-center justify-center"></span>
              )}
            </div>
          </div>

          <Link
            to="/"
            className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-extrabold text-[#5e3a1e] font-nunito tracking-wider"
          >
            CraftGoPlay
          </Link>

          <div className="flex space-x-10 items-center text-base font-medium">
            <div className="relative">
              <FaSearch
                onClick={() => setShowSearchInput((prev) => !prev)}
                className="cursor-pointer hover:text-gray-500 tracking-wider"
                title="Tìm kiếm"
              />
              {showSearchInput && (
                <div className="absolute top-1/2 -translate-y-1/2 right-[20px] flex items-center z-50 bg-white border border-gray-300 rounded-full px-3 py-1 shadow w-64 transition-transform">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    autoFocus
                    className="w-full text-sm text-black outline-none bg-transparent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        navigate(
                          `/products?search=${encodeURIComponent(searchTerm)}`
                        );
                        setShowSearchInput(false);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <FaShoppingBag
                className="text-xl hover:text-gray-500 tracking-wider"
                title="Giỏ hàng"
              />
              {totalCartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {totalCartQuantity}
                </span>
              )}
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center space-x-2 text-sm bg-[#f2e8dc] px-3 py-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  {user?.thumbnail ? (
                    <img
                      src={user.thumbnail}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full object-cover"
                      crossorigin="anonymous"
                    />
                  ) : (
                    <FaUser />
                  )}
                  <span>Hi, {user?.userName || "User"}</span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        navigate("/profile-user/profile");
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-5 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors duration-200 rounded-md"
                    >
                      <FaUser className="mr-2" />
                      Xem thông tin
                    </button>
                    <button
                      onClick={() => {
                        navigate("/profile-user/orders");
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-5 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors duration-200 rounded-md"
                    >
                      <FaBoxOpen className="mr-2" />
                      Đơn hàng
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-5 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200 rounded-md"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-8">
                <Link
                  to="/login"
                  className="hover:no-underline hover:text-gray-500 transition-colors duration-200 font-extrabold tracking-wider"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="hover:no-underline hover:text-gray-500 transition-colors duration-200 font-extrabold tracking-wider"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
