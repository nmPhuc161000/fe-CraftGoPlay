import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaClinicMedical } from "react-icons/fa";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const onFinish = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("user", JSON.stringify(form));
      alert("Đăng nhập thành công!");
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="bg-white shadow-2xl rounded-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Bên trái - Banner */}
        <div className="bg-blue-700 text-white flex flex-col justify-center items-center p-8 space-y-4">
          <FaClinicMedical className="text-6xl" />
          <h2 className="text-2xl font-bold text-center">
            Phần mềm quản lý & theo dõi điều trị hiếm muộn
          </h2>
          <p className="text-center text-sm opacity-90">
            Đồng hành cùng bạn trên hành trình làm cha mẹ
          </p>
        </div>

        {/* Bên phải - Form */}
        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
          <p className="text-sm text-gray-500 mb-6">Vui lòng đăng nhập để tiếp tục</p>

          <form onSubmit={onFinish} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-blue-600">
              <Link to="/ReqPass" className="hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
                loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <div className="relative text-center my-4">
              <hr className="border-t border-gray-200" />
              <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-white px-3 text-gray-400 text-sm">
                Hoặc
              </span>
            </div>

            <p className="text-sm text-center text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </form>

          <p className="mt-8 text-xs text-center text-gray-400">
            © 2025 Phần mềm quản lý & theo dõi điều trị hiếm muộn
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
