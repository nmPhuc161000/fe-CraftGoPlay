import { createContext, useState, useEffect } from "react";
import { decodeToken } from "../utils/tokenUtils"; // Giả định bạn đã có file này

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const tokenInfo = decodeToken(token);
        if (tokenInfo && tokenInfo.exp > Date.now() / 1000) {
          setUser(tokenInfo); // Sử dụng tokenInfo làm user nếu cần
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token"); // Xóa token hết hạn
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []); // Chỉ chạy một lần khi component mount

  const login = (userData, token) => {
    if (!userData || !token) {
      console.error("Invalid userData or token");
      return;
    }

    const tokenInfo = decodeToken(token);
    if (!tokenInfo || tokenInfo.exp <= Date.now() / 1000) {
      alert("Token không hợp lệ hoặc đã hết hạn");
      return;
    }

    localStorage.setItem("token", token);
    setUser(userData); // Sử dụng userData từ login response
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
  localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};