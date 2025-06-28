import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";
import loginImg from "../../assets/images/loginimg.jpg";
import backgroundImg from "../../assets/images/background.jpg";
import authService from "../../services/apis/authApi";
import { MESSAGES } from "../../constants/messages";
import { decodeToken } from "../../utils/tokenUtils";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({ email: "", passwordHash: "" });

  const handleAuthSuccess = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    alert(MESSAGES.AUTH.LOGIN_SUCCESS);

    const redirectPaths = {
      Admin: "/admin",
      Staff: "/staff",
      Artisan: "/profile-user/profile",
      default: "/",
    };

    window.location.href = redirectPaths[role] || redirectPaths.default;
  };

  const validateToken = (token) => {
    const tokenInfo = decodeToken(token);
    if (!tokenInfo) {
      alert("Token không hợp lệ");
      return null;
    }

    const currentTime = Date.now() / 1000;
    if (tokenInfo.exp < currentTime) {
      alert("Token đã hết hạn");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return null;
    }

    return tokenInfo;
  };

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const result = await authService.login(form);
        if (!result.success) {
          throw new Error(result.error || MESSAGES.AUTH.LOGIN_FAILED);
        }

        const tokenInfo = validateToken(result.data.data.accessToken);
        if (!tokenInfo) return;

        handleAuthSuccess(result.data.data.accessToken, tokenInfo.role);
      } catch (error) {
        console.error("Login error:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      const response = await authService.loginGoogle(
        credentialResponse.credential
      );
      if (!response.success) {
        throw new Error(response.error || MESSAGES.AUTH.GOOGLE_LOGIN_FAILED);
      }

      const tokenInfo = validateToken(response.data.data.accessToken);
      if (!tokenInfo) return;

      handleAuthSuccess(response.data.data.accessToken, tokenInfo.role);
    } catch (error) {
      console.error("Google login error:", error);
      alert(error.message);
    } finally {
      setGoogleLoading(false);
    }
  }, []);

  const handleGoogleError = useCallback(() => {
    console.log("Google login failed");
    alert(MESSAGES.AUTH.GOOGLE_LOGIN_FAILED);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <BackgroundImage />

      <div className="bg-[#fffdf8] shadow-2xl rounded-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <LoginBanner />

        <div className="p-8 md:p-12 bg-[#faf5ef]">
          <LoginHeader />

          <form onSubmit={handleLogin} className="space-y-4">
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              icon={<FaUser />}
              placeholder="Email"
              autoComplete="username"
            />

            <FormInput
              label="Mật khẩu"
              type="password"
              name="passwordHash"
              value={form.passwordHash}
              onChange={handleInputChange}
              icon={<FaLock />}
              placeholder="Mật khẩu"
              autoComplete="current-password"
            />

            <div className="flex justify-between text-sm text-[#7a5a3a] font-bold">
              <Link to="/forgetpassword" className="hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <SubmitButton loading={loading} text="Đăng nhập" />

            <Divider text="Hoặc Tiếp Tục với" />

            <GoogleLoginButton
              loading={googleLoading}
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            <RegisterLink />
          </form>

          <Footer />
        </div>
      </div>
    </div>
  );
};

// Extracted Components
const BackgroundImage = () => (
  <img
    src={backgroundImg}
    alt="background"
    className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 z-[-1]"
  />
);

const LoginBanner = () => (
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
);

const LoginHeader = () => (
  <>
    <h2 className="text-2xl font-bold text-[#6b4c3b]">Đăng nhập</h2>
    <p className="text-sm text-[#a0846f] mb-6">
      Vui lòng đăng nhập để tiếp tục
    </p>
  </>
);

const FormInput = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm text-[#7a5a3a] mb-1">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]">
        {icon}
      </span>
      <input
        className="w-full pl-10 pr-4 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
        required
        {...props}
      />
    </div>
  </div>
);

const SubmitButton = ({ loading, text }) => (
  <button
    type="submit"
    disabled={loading}
    className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
      loading ? "bg-[#d4b06b]" : "bg-[#b28940] hover:bg-[#9e7635]"
    }`}
  >
    {loading ? "Đang xử lý..." : text}
  </button>
);

const Divider = ({ text }) => (
  <div className="relative text-center my-4">
    <hr className="border-t border-[#d8c3a5]" />
    <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-[#faf5ef] px-3 text-[#b59c7c] text-sm">
      {text}
    </span>
  </div>
);

const GoogleLoginButton = ({ loading, onSuccess, onError }) => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      render={({ onClick }) => (
        <button
          onClick={onClick}
          disabled={loading}
          className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg border border-[#d8c3a5] bg-white text-[#5a3e1b] font-medium hover:bg-gray-50 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <FaGoogle className="text-[#DB4437]" />
          {loading ? "Đang xử lý..." : "Đăng nhập với Google"}
        </button>
      )}
    />
  </GoogleOAuthProvider>
);

const RegisterLink = () => (
  <p className="text-sm text-center text-[#7a5a3a]">
    Bạn chưa có tài khoản?{" "}
    <Link to="/register" className="text-[#b28940] font-medium hover:underline">
      Đăng ký ngay
    </Link>
  </p>
);

const Footer = () => (
  <p className="mt-8 text-xs text-center text-gray-400">
    © 2025 Nền tảng kết nối nghệ nhân thủ công với người tiêu dùng
  </p>
);

export default Login;
