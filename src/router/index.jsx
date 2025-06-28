import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ==================== Pages ====================
// Public pages
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgetPassword from "../pages/ForgetPassword/ForgetPassword";
import VerifyOtp from "../pages/Register/VerifyOtp";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Product from "../pages/Product/Product";
import Cart from "../pages/Cart/Cart";

// Protected pages
import ProfileUser from "../pages/Profile/ProfileUser";
import Admin from "../pages/Admin/Admin";

// ==================== Routes ====================
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* ========== Public Routes ========== */}
        {/* Core pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Product pages */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Product />} />

        {/* ========== Protected Routes ========== */}
        {/* User profile routes */}
        <Route
          path="/profile-user/*"
          element={
            <ProtectedRoute>
              <ProfileUser />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route path="/admin" element={<Admin />} />

        {/* ========== Special Home Route ========== */}
        {/* Giữ nguyên route Home đặc biệt của bạn */}
        <Route
          path="/"
          element={
            <ProtectedRoute isPublic={true}>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
