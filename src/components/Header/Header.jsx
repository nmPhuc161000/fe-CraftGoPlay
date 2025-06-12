import { Link } from "react-router-dom";
import { FaSearch, FaShoppingBag, FaGlobe } from "react-icons/fa";

const Header = ({ isAuthenticated, user }) => {
  return (
    <header>
      {/* banner day*/}
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

      {/*main head */}
      <div className="bg-white text-[#5e3a1e] shadow-md sticky top-0 z-50 w-full">
        <div className="px-12 py-5 flex justify-between items-center">
          <div className="flex space-x-10 text-base font-medium items-center">
            <Link
              to="/products"
              className="hover:no-underline hover:text-gray-500 transition-colors duration-200 font-extrabold tracking-wider"
            >
              Sản Phẩm
            </Link>

            <div className="relative group">
              <button className="flex items-center space-x-1 hover:no-underline hover:text-gray-700 focus:outline-none transition-colors duration-200 font-extrabold tracking-wider">
                <span>Bộ Sưu Tập</span>
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className="
                  absolute left-0 mt-2 w-48
                  bg-white bg-opacity-90 backdrop-blur-sm
                  border border-gray-200 rounded-lg
                  shadow-lg
                  opacity-0 scale-95
                  group-hover:opacity-100 group-hover:scale-100
                  transform transition-all duration-200
                  origin-top-left
                  z-10
                "
              >
                <Link
                  to="/collections/1"
                  className="block px-5 py-3 hover:bg-gray-100 hover:no-underline hover:text-gray-700 transition-colors duration-200 rounded-md tracking-wider"
                >
                  Collection 1
                </Link>
                <Link
                  to="/collections/2"
                  className="block px-5 py-3 hover:bg-gray-100 hover:no-underline hover:text-gray-700 transition-colors duration-200 rounded-md tracking-wider"
                >
                  Collection 2
                </Link>
              </div>
            </div>

            <Link
              to="/about"
              className="hover:no-underline hover:text-gray-500 transition-colors duration-200 font-extrabold tracking-wider"
            >
              Giới thiệu
            </Link>
          </div>

          {/* Logo trung tâm */}
          <Link
            to="/"
            className="text-3xl font-extrabold text-[#5e3a1e] font-nunito tracking-wider"
          >
            CraftGoPlay
          </Link>

          <div className="flex space-x-8 items-center text-base font-medium">
            <Link
              to="/contact"
              className="hover:no-underline hover:text-gray-500 transition-colors duration-200 font-extrabold tracking-wider"
            >
              Liên hệ
            </Link>
            <FaSearch
              className="cursor-pointer hover:text-gray-500 tracking-wider"
              title="Tìm kiếm"
            />
            <FaShoppingBag
              className="cursor-pointer hover:text-gray-500 tracking-wider"
              title="Giỏ hàng"
            />

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs">Hi, {user?.name}</span>
                <button className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
                  Đăng xuất
                </button>
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
      </div>
    </header>
  );
};

export default Header;
