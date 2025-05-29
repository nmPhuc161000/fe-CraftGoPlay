import React, { useState } from "react";
import { authApi } from "../../services";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await authApi.login({ email, password });
      console.log(res.data);
    } catch (err) {
      console.error("Đăng nhập thất bại", err);
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" />
      <button onClick={handleLogin}>Đăng nhập</button>
    </div>
  );
};

export default Login;
