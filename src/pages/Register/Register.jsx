import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import registerImg from "../../assets/images/loginimg.jpg";
import backgroundImg from "../../assets/images/background.jpg";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onFinish = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("user", JSON.stringify(form));
      alert("Đăng ký thành công!");
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <img
        src={backgroundImg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 z-[-1]"
      />
      <div className="bg-[#fffdf8] shadow-2xl rounded-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="bg-[#f2e8dc] text-[#5e3a1e] flex flex-col justify-center items-center p-8 space-y-4">
          <img
            src={registerImg}
            alt="CraftGoPlay Logo"
            className="w-40 h-40 object-contain rounded-full shadow-md"
          />
          <h2 className="text-2xl font-bold text-center">
            Tôn vinh bàn tay và khối óc của nghệ sỹ, nghệ nhân Việt Nam
          </h2>
          <p className="text-center text-sm opacity-90">
            Lựa chọn hướng đi thẩm mỹ, bền vững
          </p>
        </div>
        {/* Bên phải - Form */}
        <div className="p-8 md:p-12 bg-[#faf5ef]">
          <h2 className="text-2xl font-bold text-[#6b4c3b]">Đăng ký</h2>
          <p className="text-sm text-[#a0846f] mb-6">
            Vui lòng điền thông tin để tạo tài khoản
          </p>

          <form onSubmit={onFinish} className="space-y-4">
            <div>
              <label className="block text-sm text-[#7a5a3a] mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
                <input
                  type="text"
                  required
                  placeholder="Họ và tên"
                  className="w-full pl-10 pr-4 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#7a5a3a] mb-1">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#7a5a3a] mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#7a5a3a] mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
                <input
                  type="password"
                  required
                  placeholder="Xác nhận mật khẩu"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
                loading ? "bg-[#d4b06b]" : "bg-[#b28940] hover:bg-[#9e7635]"
              }`}
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            <div className="relative text-center my-4">
              <hr className="border-t border-[#d8c3a5]" />
              <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-[#faf5ef] px-3 text-[#b59c7c] text-sm">
                Hoặc
              </span>
            </div>

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
    </div>
  );
};

export default Register;
