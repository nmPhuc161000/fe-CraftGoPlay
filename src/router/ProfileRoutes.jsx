// src/router/ProfileRoutes.jsx
import { Routes, Route } from "react-router-dom";
// src/router/ProfileRoutes.jsx
import ProductsTab from "../pages/Profile/components/ProductsTab";
import OrdersTab from "../pages/Profile/components/OrdersTab";
import ReviewsTab from "../pages/Profile/components/ReviewsTab";
import FavoritesTab from "../pages/Profile/components/FavoritesTab";
import CustomersTab from "../pages/Profile/components/CustomersTab";
import RevenueTab from "../pages/Profile/components/RevenueTab";
import ProfileTab from "../pages/Profile/components/ProfileTab";

const ProfileRoutes = ({ user, onSaveProfile }) => {
  return (
    <Routes>
      <Route
        path="profile"
        element={<ProfileTab user={user} onSave={onSaveProfile} />}
      />
      <Route path="products" element={<ProductsTab artisanId={user.id} />} />
      <Route path="orders" element={<OrdersTab userId={user.id} />} />
      <Route
        path="reviews"
        element={<ReviewsTab userId={user.id} isArtisan={user.isArtisan} />}
      />
      <Route path="favorites" element={<FavoritesTab userId={user.id} />} />
      <Route path="customers" element={<CustomersTab artisanId={user.id} />} />
      <Route path="revenue" element={<RevenueTab artisanId={user.id} />} />
      <Route
        index
        element={
          user.isArtisan ? (
            <ProductsTab artisanId={user.id} />
          ) : (
            <OrdersTab userId={user.id} />
          )
        }
      />
    </Routes>
  );
};

export default ProfileRoutes;
