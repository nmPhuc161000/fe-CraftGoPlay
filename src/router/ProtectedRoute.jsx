import { useContext, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../components/loading/Loading";

const ProtectedRoute = ({
  children,
  redirectTo = "/login",
  isPublic = false,
}) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && role === "Artisan") {
      // Chỉ chuyển hướng nếu đang ở trang chủ hoặc trang public
      if (isPublic && location.pathname === "/") {
        navigate("/profile-user/products", { replace: true });
      }
    }
  }, [isAuthenticated, loading, role, location, navigate, isPublic]);

  if (loading) {
    return <Loading />;
  }

  // Nếu route không public và chưa đăng nhập
  if (!isPublic && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
