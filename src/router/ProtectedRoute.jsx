import { useContext, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../components/loading/Loading";
import Forbidden from "../pages/Forbidden/Forbidden";

const ProtectedRoute = ({
  children,
  redirectTo = "/login",
  isPublic = false,
  allowedRoles = [],
}) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    // Xử lý cho Artisan
    if (role === "Artisan" && !location.pathname.startsWith("/profile-user")) {
      navigate("/profile-user/products", { replace: true });
    }

    // Xử lý cho Staff
    if (role === "Staff" && location.pathname !== "/staff") {
      navigate("/staff", { replace: true });
    }

    // Xử lý cho Admin
    if (role === "Admin" && location.pathname !== "/admin") {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, loading, role, location, navigate]);

  if (loading) {
    return <Loading />;
  }

  // Nếu route không public và chưa đăng nhập
  if (!isPublic && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Kiểm tra role nếu có yêu cầu cụ thể
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Forbidden />;
  }

  // Ngăn User, Artisan, và Staff truy cập các trang không được phép
  if (
    (role === "User" || role === "Artisan") &&
    (location.pathname === "/admin" || location.pathname === "/staff")
  ) {
    return <Forbidden />;
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
};

export default ProtectedRoute;