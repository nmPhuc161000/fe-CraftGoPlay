import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// ==================== Pages ====================
// Public pages
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgetPassword from "../pages/ForgetPassword/ForgetPassword";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Product from "../pages/Product/Product";
import VerifyOtp from "../pages/VerifyOtp/VerifyOtp";

// Protected pages
import ProfileUser from "../pages/Profile/ProfileUser";
import Admin from "../pages/Admin/Admin";
import Staff from "../pages/Staff/Staff";

// ==================== Routes ====================
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <Router>
      <AnimatePresence mode="wait">
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
          <Route path="/staff" element={<Staff />} />

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
      </AnimatePresence>
    </Router>
  );
};

export default AppRouter;
