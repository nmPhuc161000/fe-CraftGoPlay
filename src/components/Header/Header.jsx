import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaUser,
  FaSignOutAlt,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaWarehouse,
  FaTicketAlt,
  FaWallet,
  FaHandsHelping,
  FaUserTie,
  FaHistory,
  FaStore,
} from "react-icons/fa";
import { useContext, useState, useRef, useEffect } from "react";
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

  const dropdownRef = useRef(null);
  const userButtonRef = useRef(null);

  const totalCartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownItemClick = (path = null) => {
    setShowDropdown(false);
    if (path) {
      navigate(path);
    }
  };

  // Menu items cho dropdown
  const menuItems = [
    {
      icon: FaUser,
      label: "Hồ sơ cá nhân",
      path: "/profile-user/profile",
      color: "text-blue-600",
    },
    {
      icon: FaBoxOpen,
      label: "Đơn hàng",
      path: "/profile-user/orders",
      color: "text-orange-600",
    },
    {
      icon: FaHistory,
      label: "Yêu cầu trả hàng",
      path: "/profile-user/returns",
      color: "text-red-600",
    },
    {
      icon: FaStar,
      label: "Đánh giá của bạn",
      path: "/profile-user/reviews",
      color: "text-yellow-600",
    },
    {
      icon: FaHeart,
      label: "Yêu thích",
      path: "/profile-user/wishlist",
      color: "text-pink-600",
    },
    {
      icon: FaWarehouse,
      label: "Kho xu",
      path: "/profile-user/coin-wallet",
      color: "text-amber-600",
    },
    {
      icon: FaTicketAlt,
      label: "Kho voucher",
      path: "/profile-user/vouchers",
      color: "text-teal-600",
    },
    {
      icon: FaWallet,
      label: "Số dư tài khoản",
      path: "/profile-user/balance",
      color: "text-emerald-600",
    },
  ];

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
                className="cursor-pointer hover:text-gray-500 tracking-wider text-xl"
                title="Tìm kiếm"
              />
              {showSearchInput && (
                <div className="absolute top-full right-0 mt-2 flex items-center z-50 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-lg w-80 transition-all duration-300">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm sản phẩm, nghệ nhân..."
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
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                  {totalCartQuantity}
                </span>
              )}
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  ref={userButtonRef}
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center space-x-3 text-sm bg-[#f2e8dc] px-4 py-2 rounded-full hover:bg-[#e8d9c8] transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {user?.thumbnail ? (
                    <img
                      src={user.thumbnail}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#5e3a1e]"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#5e3a1e] flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-[#5e3a1e]">
                      {user?.userName || "User"}
                    </span>
                    <span className="text-xs text-gray-600">
                      {user?.role === "artist" ? "Nghệ nhân" : "Khách hàng"}
                    </span>
                  </div>
                </button>

                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden backdrop-blur-sm bg-opacity-95"
                  >
                    {/* Header dropdown */}
                    <div className="bg-gradient-to-r from-[#5e3a1e] to-[#7a4f2e] text-white p-6">
                      <div className="flex items-center space-x-4">
                        {user?.thumbnail ? (
                          <img
                            src={user.thumbnail}
                            alt="User avatar"
                            className="w-14 h-14 rounded-full object-cover border-2 border-white"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                            <FaUser className="text-white text-xl" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">
                            {user?.userName || "User"}
                          </h3>
                          <p className="text-sm opacity-90">
                            {user?.email || "krmu1/zz1@gmail.com"}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-1">
                              🛒 Khách hàng
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-2">
                        {menuItems.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleDropdownItemClick(item.path)}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 rounded-lg group"
                          >
                            <item.icon
                              className={`mr-3 text-lg ${item.color} group-hover:scale-110 transition-transform`}
                            />
                            <span className="font-medium">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 p-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg group"
                      >
                        <FaSignOutAlt className="mr-3 text-lg group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-6">
                <Link
                  to="/login"
                  className="hover:no-underline hover:text-gray-500 transition-colors duration-200 font-extrabold tracking-wider px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="hover:no-underline bg-[#5e3a1e] text-white px-4 py-2 rounded-lg hover:bg-[#4a2e17] transition-colors duration-200 font-extrabold tracking-wider"
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
