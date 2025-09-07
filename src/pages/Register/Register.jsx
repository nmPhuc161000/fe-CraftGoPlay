//src/pages/Register/Register.jsx
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaGoogle,
  FaQuestionCircle,
} from "react-icons/fa";
import registerImg from "../../assets/images/loginimg.jpg";
import backgroundImg from "../../assets/images/background.jpg";
import authService from "../../services/apis/authApi";
import { MESSAGES } from "../../constants/messages";
import { decodeToken } from "../../utils/tokenUtils";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNotification } from "../../contexts/NotificationContext"; // dùng context mới
import { motion } from "framer-motion";
import {
  validatePhoneNumber,
  validateRegisterForm,
} from "../../utils/validationUtils";

// Tách các thành phần nhỏ thành component riêng
const Tooltip = ({ content }) => (
  <span className="inline-flex items-center align-middle ml-1 group relative">
    <FaQuestionCircle className="text-[#a0846f] cursor-help text-sm align-middle" />
    <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-xs bg-[#5a3e1b] text-white rounded shadow-lg top-full left-0 mt-1">
      {content}
    </div>
  </span>
);

const InputField = ({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  tooltipContent,
  ...props
}) => (
  <div>
    <label className="block text-sm text-[#7a5a3a] mb-1">
      {props.label}
      {tooltipContent && <Tooltip content={tooltipContent} />}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2 border ${
          error ? "border-red-500" : "border-[#cbb892]"
        } rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]`}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    userName: "",
    phoneNo: "",
    passwordHash: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // dùng context mới

  const [form, setForm] = useState({
    UserName: "",
    Email: "",
    PhoneNo: "",
    PasswordHash: "",
  });

  // Các hàm xử lý sự kiện
  const handleAuthSuccess = useCallback((token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    showNotification(
      MESSAGES.AUTH.GOOGLE_REGISTER_AND_LOGIN_SUCCESS,
      "success"
    );

    const redirectPaths = {
      Artisan: "/profile-user/profile",
      default: "/",
    };

    window.location.href = redirectPaths[role] || redirectPaths.default;
  }, []);

  const validateToken = useCallback((token) => {
    const tokenInfo = decodeToken(token);
    if (!tokenInfo) {
      showNotification("Token không hợp lệ");
      return null;
    }

    const currentTime = Date.now() / 1000;
    if (tokenInfo.exp < currentTime) {
      showNotification("Token đã hết hạn");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return null;
    }

    return tokenInfo;
  }, []);

  // Hàm xác thực form
  const validateForm = useCallback(() => {
    const { errors, isValid } = validateRegisterForm(form, confirmPassword);
    setErrors(errors);
    return isValid;
  }, [form, confirmPassword]);

  // Hàm xử lý thay đổi số điện thoại
  const handlePhoneChange = useCallback((e) => {
    const value = e.target.value;
    setErrors((prev) => ({
      ...prev,
      PhoneNo: validatePhoneNumber(value),
    }));
    setForm((prev) => ({ ...prev, PhoneNo: value }));
  }, []);

  const handleRegister = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.register(form);

        if (response.success) {
          showNotification(MESSAGES.AUTH.REGISTER_SUCCESS, "success");
          // Lưu email vào localStorage để sử dụng ở trang OTP
          localStorage.setItem("registerEmail", form.Email);

          // Chuyển hướng đến trang OTP và gửi email qua state
          navigate("/verify-otp", { state: { Email: form.Email } });
        } else {
          showNotification(response.error || MESSAGES.AUTH.REGISTER_FAILED);
        }
      } catch (error) {
        console.error("Registration error:", error);
        showNotification(MESSAGES.AUTH.REGISTER_FAILED);
      } finally {
        setLoading(false);
      }
    },
    [form, confirmPassword, navigate, validateForm]
  );

  const handleGoogleSuccess = useCallback(
    async (credentialResponse) => {
      setGoogleLoading(true);
      try {
        const responseRegis = await authService.registerGoogle(
          credentialResponse.credential
        );

        if (!responseRegis.success) {
          throw new Error(
            responseRegis.error || MESSAGES.AUTH.GOOGLE_REGISTER_FAILED
          );
        }

        const responseLogin = await authService.loginGoogle(
          credentialResponse.credential
        );
        if (!responseLogin.success) {
          throw new Error(
            responseLogin.error || MESSAGES.AUTH.GOOGLE_LOGIN_FAILED
          );
        }

        const tokenInfo = validateToken(responseLogin.data.data.accessToken);
        if (!tokenInfo) return;

        handleAuthSuccess(responseLogin.data.data.accessToken, tokenInfo.role);
      } catch (error) {
        console.error("Google login error:", error);
        showNotification(error.message);
      } finally {
        setGoogleLoading(false);
      }
    },
    [handleAuthSuccess, validateToken]
  );

  const handleGoogleError = useCallback(() => {
    console.log("Google login failed");
    showNotification(MESSAGES.AUTH.GOOGLE_LOGIN_FAILED);
  }, []);

  // Tooltip content
  const tooltips = {
    userName: (
      <>
        Tên người dùng bao gồm:
        <ul className="list-disc pl-4 mt-1">
          <li>Ít nhất 6 ký tự.</li>
          <li>Không ký tự đặc biệt.</li>
        </ul>
      </>
    ),
    phone: (
      <>
        Số điện thoại bao gồm:
        <ul className="list-disc pl-4 mt-1">
          <li>10 chữ số.</li>
          <li>Không có chữ hoặc ký tự đặc biệt.</li>
          <li>Bắt đầu bằng số 0.</li>
          <li>Không chứa khoảng trắng hoặc ký tự khác ngoài số.</li>
        </ul>
      </>
    ),
    password: (
      <>
        Mật khẩu từ 8-20 ký tự, bao gồm:
        <ul className="list-disc pl-4 mt-1">
          <li>Chữ hoa (A-Z)</li>
          <li>Chữ thường (a-z)</li>
          <li>Số (0-9)</li>
          <li>Ký tự đặc biệt (!@#$%^&*)</li>
          <li>Ví dụ: Abc1234!</li>
        </ul>
      </>
    ),
  };

  return (
    <motion.main
      className="min-h-screen relative flex items-center justify-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={backgroundImg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 z-[-1]"
        crossorigin="anonymous"
      />

      <div className="bg-[#fffdf8] shadow-2xl rounded-2xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="bg-[#f2e8dc] text-[#5e3a1e] flex flex-col justify-center items-center p-8 space-y-4">
          <Link to="/">
            <img
              src={registerImg}
              alt="CraftGoPlay Logo"
              className="w-40 h-40 object-contain rounded-full shadow-md"
              crossorigin="anonymous"
            />
          </Link>
          <h2 className="text-2xl font-bold text-center">
            Tôn vinh bàn tay và khối óc của nghệ sỹ, nghệ nhân Việt Nam
          </h2>
          <p className="text-center text-sm opacity-90">
            Lựa chọn hướng đi thẩm mỹ, bền vững
          </p>
        </div>

        <div className="p-8 md:p-12 bg-[#faf5ef]">
          <h2 className="text-2xl font-bold text-[#6b4c3b]">Đăng ký</h2>
          <p className="text-sm text-[#a0846f] mb-6">
            Vui lòng điền thông tin để tạo tài khoản
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <InputField
              icon={FaUser}
              label="Tên người dùng"
              placeholder="Tên người dùng"
              value={form.UserName}
              onChange={(e) => setForm({ ...form, UserName: e.target.value })}
              error={errors.userName}
              tooltipContent={tooltips.userName}
            />

            <InputField
              icon={FaEnvelope}
              type="email"
              label="Email"
              placeholder="Email"
              autoComplete="username"
              value={form.Email}
              onChange={(e) => setForm({ ...form, Email: e.target.value })}
              error={errors.email}
            />

            <InputField
              icon={FaPhone}
              type="tel"
              label="Số điện thoại"
              placeholder="Số điện thoại ít nhất 10 số"
              value={form.PhoneNo}
              onChange={handlePhoneChange}
              error={errors.phoneNo}
              maxLength={10}
              tooltipContent={tooltips.phone}
            />

            <InputField
              icon={FaLock}
              type="password"
              label="Mật khẩu"
              placeholder="Mật khẩu"
              autoComplete="new-password"
              value={form.PasswordHash}
              onChange={(e) =>
                setForm({ ...form, PasswordHash: e.target.value })
              }
              error={errors.passwordHash}
              tooltipContent={tooltips.password}
            />

            <InputField
              icon={FaLock}
              type="password"
              label="Xác nhận mật khẩu"
              placeholder="Xác nhận mật khẩu"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
                loading ? "bg-[#d4b06b]" : "bg-[#b28940] hover:bg-[#9e7635]"
              } transition-colors`}
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            <div className="relative text-center my-4">
              <hr className="border-t border-[#d8c3a5]" />
              <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-[#faf5ef] px-3 text-[#b59c7c] text-sm">
                Hoặc
              </span>
            </div>

            <GoogleLoginButton
              loading={googleLoading}
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            <p className="text-sm text-center text-[#7a5a3a]">
              Bạn đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-[#b28940] font-medium hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </form>

          <p className="mt-8 text-xs text-center text-gray-400">
            © 2025 Nền tảng kết nối nghệ nhân thủ công với người tiêu dùng
          </p>
        </div>
      </div>
    </motion.main>
  );
};

export default Register;
