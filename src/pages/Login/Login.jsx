import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import loginImg from "../../assets/images/loginimg.jpg";
import backgroundImg from "../../assets/images/background.jpg";
import authService from "../../services/apis/authApi";
import { MESSAGES } from "../../constants/messages";
import { decodeToken } from "../../utils/tokenUtils";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", passwordHash: "" });
  const navigate = useNavigate();

  // Sử dụng useCallback để tối ưu hóa handleLogin tránh re-render không cần thiết
  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const result = await authService.login(form);

        if (!result.success) {
          alert(result.error || "Đăng nhập thất bại. Vui lòng thử lại.");
          return;
        }

        // Decode token và lấy thông tin
        const tokenInfo = decodeToken(result.data.data.accessToken);
        if (!tokenInfo) {
          alert("Token không hợp lệ");
          return;
        }

        const { email, role, userName, userId, exp } = tokenInfo;

        //Lưu thông tin trực tiếp vào localStorage
        const userData = {
          ...result.data.user,
          email,
          role,
          userName,
          userId,
          exp,
        };
        localStorage.setItem("token", result.data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(userData));

        // Kiểm tra token hết hạn
        const currentTime = Date.now() / 1000;
        if (exp < currentTime) {
          alert("Token đã hết hạn");
          localStorage.removeItem("token"); // Xóa token nếu hết hạn
          localStorage.removeItem("user");
          return;
        }

        alert(MESSAGES.AUTH.LOGIN_SUCCESS);

        // Điều hướng dựa trên role
        if (role === "Admin" || role === "Staff") {
          navigate("/admin/dashboard");
        } else if (role === "Artisan") {
          navigate("/profile-user/profile");
        } else {
          // navigate("/");
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Login error:", error);
        alert(
          error instanceof Error && error.message.includes("Invalid token")
            ? "Token không hợp lệ"
            : "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    },
    [form, navigate] // Chỉ re-create handleLogin khi form hoặc navigate thay đổi
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <img
        src={backgroundImg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 z-[-1]"
      />
      <div className="bg-[#fffdf8] shadow-2xl rounded-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Banner content left */}
        <div className="bg-[#f2e8dc] text-[#5e3a1e] flex flex-col justify-center items-center p-8 space-y-4">
          <Link to="/">
            <img
              src={loginImg}
              alt="CraftGoPlay Logo"
              className="w-40 h-40 object-contain rounded-full shadow-md"
            />
          </Link>
          <h2 className="text-2xl font-bold text-center">
            Tôn vinh bàn tay và khối óc của nghệ sỹ, nghệ nhân Việt Nam
          </h2>
          <p className="text-center text-sm opacity-90">
            Lựa chọn hướng đi thẩm mỹ, bền vững
          </p>
        </div>

        {/* Bên phải - Form */}
        <div className="p-8 md:p-12 bg-[#faf5ef]">
          <h2 className="text-2xl font-bold text-[#6b4c3b]">Đăng nhập</h2>
          <p className="text-sm text-[#a0846f] mb-6">
            Vui lòng đăng nhập để tiếp tục
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-[#7a5a3a] mb-1">Email</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#7a5a3a] mb-1">Mật khẩu</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
                  value={form.passwordHash}
                  onChange={(e) => setForm((prev) => ({ ...prev, passwordHash: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-[#7a5a3a] font-bold">
              <Link to="/ReqPass" className="hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
                loading ? "bg-[#d4b06b]" : "bg-[#b28940] hover:bg-[#9e7635]"
              }`}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <div className="relative text-center my-4">
              <hr className="border-t border-[#d8c3a5]" />
              <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-[#faf5ef] px-3 text-[#b59c7c] text-sm">
                Hoặc
              </span>
            </div>

            <p className="text-sm text-center text-[#7a5a3a]">
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="text-[#b28940] font-medium hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </form>

          <p className="mt-8 text-xs text-center text-gray-400">
            © 2025 Nền tảng kết nối nghệ nhân thủ công với người tiêu dùng
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;