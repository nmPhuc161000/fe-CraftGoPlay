// src/pages/VerifyOtp/VerifyOtp.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaArrowLeft } from "react-icons/fa";
import authService from "../../services/apis/authApi";
import { MESSAGES } from "../../constants/messages";
import backgroundImg from "../../assets/images/background.jpg";
import { useNotification } from "../../contexts/NotificationContext"; // dùng context mới

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification(); // dùng context mới

  useEffect(() => {
    // Lấy email từ state navigation hoặc localStorage
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem("registerEmail");

    if (!emailFromState && !emailFromStorage) {
      navigate("/register");
      return;
    }

    setEmail(emailFromState || emailFromStorage);
  }, [location, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.verifyOtp({
        email: email,
        otp: otp,
      });

      if (response.success) {
        localStorage.removeItem("registerEmail");
        showNotification(MESSAGES.AUTH.VERIFY_EMAIL_SUCCESS, "success");
        navigate("/login");
      } else {
        setError(response.error || MESSAGES.AUTH.OTP_VERIFICATION_FAILED);
      }
    } catch (err) {
      setError(MESSAGES.AUTH.OTP_VERIFICATION_FAILED);
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await authService.resendOtp({ email });
      if (response.success) {
        setCountdown(60);
        showNotification(MESSAGES.AUTH.OTP_RESENT, "success");
      } else {
        setError(response.error || MESSAGES.AUTH.OTP_RESEND_FAILED);
      }
    } catch (err) {
      setError(MESSAGES.AUTH.OTP_RESEND_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background image với các lớp điều chỉnh */}
      <div className="fixed inset-0 w-full h-full z-[-1]">
        <img
          src={backgroundImg}
          alt="background"
          className="w-full h-full object-cover"
          style={{
            filter: "blur(8px) brightness(0.75)",
          }}
          crossOrigin="anonymous"
        />
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#b28940] mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Quay lại
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#6b4c3b]">Xác thực OTP</h2>
          <p className="text-sm text-gray-600 mt-2">
            Mã OTP đã được gửi đến <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm text-[#7a5a3a] mb-1">Mã OTP</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
              <input
                type="text"
                placeholder="Nhập mã OTP 6 chữ số"
                className="w-full pl-10 pr-4 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
              loading ? "bg-[#d4b06b]" : "bg-[#b28940] hover:bg-[#9e7635]"
            } transition-colors`}
          >
            {loading ? "Đang xác thực..." : "Xác thực"}
          </button>

          <div className="text-center text-sm text-gray-600">
            {countdown > 0 ? (
              <p>Gửi lại mã sau {countdown} giây</p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-[#b28940] hover:underline cursor-pointer"
              >
                Gửi lại mã OTP
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
