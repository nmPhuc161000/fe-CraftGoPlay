import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaKey } from "react-icons/fa";
import loginImg from "../../assets/images/loginimg.jpg";
import backgroundImg from "../../assets/images/background.jpg";
import authService from "../../services/apis/authApi";
import { MESSAGES } from "../../constants/messages";

const ForgetPassword = () => {
    const [emailOrPhoneNumber, setEmailOrPhoneNumber] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSendToken = async () => {
        if (!emailOrPhoneNumber) {
            alert(MESSAGES.AUTH.FORGET_FAILED);
            return;
        }

        setSending(true);
        try {
            // const data = {
            //     EmailOrPhoneNumber: emailOrPhoneNumber
            // }
            const res = await authService.forgotPassword(emailOrPhoneNumber);
            if (res.success) {
                alert("Mã xác nhận đã được gửi đến email.");
            } else {
                alert(res.error || MESSAGES.COMMON.SERVER_ERROR);
            }
        } catch (err) {
            console.error("Send token error:", err);
            alert(MESSAGES.COMMON.SERVER_ERROR);
        } finally {
            setSending(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmNewPassword) {
            alert("Mật khẩu xác nhận không trùng khớp.");
            setLoading(false);
            return;
        }

        try {
            const res = await authService.resetPassword(token, newPassword);
            if (res.success) {
                alert("Đặt lại mật khẩu thành công!");
            } else {
                alert(res.error || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            alert("Lỗi hệ thống. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4">
            <img
                src={backgroundImg}
                alt="background"
                className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 z-[-1]"
                crossOrigin="anonymous"
            />
            <div className="bg-[#fffdf8] shadow-2xl rounded-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                <div className="bg-[#f2e8dc] text-[#5e3a1e] flex flex-col justify-center items-center p-8 space-y-4">
                    <Link to="/">
                        <img
                            src={loginImg}
                            alt="CraftGoPlay Logo"
                            className="w-40 h-40 object-contain rounded-full shadow-md"
                            crossOrigin="anonymous"
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
                    <h2 className="text-2xl font-bold text-[#6b4c3b]">Quên mật khẩu</h2>
                    <p className="text-sm text-[#a0846f] mb-6">
                        Nhập thông tin để đặt lại mật khẩu
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm text-[#7a5a3a] mb-1">Email</label>
                            <div className="relative flex items-center">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Email"
                                    className="w-full pl-10 pr-24 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
                                    value={emailOrPhoneNumber}
                                    onChange={(e) => setEmailOrPhoneNumber(e.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={handleSendToken}
                                    disabled={sending}
                                    className="absolute right-2 text-xs px-3 py-1 rounded bg-[#b28940] hover:bg-[#9e7635] text-white font-medium"
                                >
                                    {sending ? "Đang gửi..." : "Gửi mã"}
                                </button>
                            </div>
                        </div>

                        {/* Token */}
                        <div>
                            <label className="block text-sm text-[#7a5a3a] mb-1">Token</label>
                            <div className="relative">
                                <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Mã xác nhận"
                                    className="w-full pl-10 pr-4 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Mật khẩu mới */}
                        <div>
                            <label className="block text-sm text-[#7a5a3a] mb-1">Mật khẩu mới</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Mật khẩu mới"
                                    className="w-full pl-10 pr-4 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div>
                            <label className="block text-sm text-[#7a5a3a] mb-1">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0846f]" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Nhập lại mật khẩu"
                                    className="w-full pl-10 pr-4 py-2 border border-[#cbb892] rounded-lg focus:ring-2 focus:ring-[#cbb892] outline-none bg-white text-[#5a3e1b]"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${loading ? "bg-[#d4b06b]" : "bg-[#b28940] hover:bg-[#9e7635]"
                                }`}
                        >
                            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </button>

                        <p className="text-sm text-center text-[#7a5a3a]">
                            Quay lại{" "}
                            <Link to="/login" className="text-[#b28940] font-medium hover:underline">
                                Đăng nhập
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

export default ForgetPassword;
