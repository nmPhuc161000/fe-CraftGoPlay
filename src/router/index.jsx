import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgetPassword from "../pages/ForgetPassword/ForgetPassword";
import Home from "../pages/Home/Home";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Cart from "../pages/Cart/Cart";
import Product from "../pages/Product/Product";
import ProfileUser from "../pages/Profile/ProfileUser";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute
import ProfileRoutes from "./ProfileRoutes"; // Import ProfileRoutes
import Admin from "../pages/Admin/Admin";
import VerifyOtp from "../pages/Register/VerifyOtp";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Product />} />
        <Route
          path="/profile-user/*"
          element={
            <ProtectedRoute>
              <ProfileUser />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
