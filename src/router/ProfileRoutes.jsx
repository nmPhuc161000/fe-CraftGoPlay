import { Routes, Route } from "react-router-dom";
import ProductsTab from "../pages/Profile/components/ProductsTab";
import OrdersTab from "../pages/Profile/components/OrdersTab";
import ReviewsTab from "../pages/Profile/components/ReviewsTab";
import FavoritesTab from "../pages/Profile/components/FavoritesTab";
import CustomersTab from "../pages/Profile/components/CustomersTab";
import RevenueTab from "../pages/Profile/components/RevenueTab";
import ProfileTab from "../pages/Profile/components/ProfileTab";
import AddProductTab from "../pages/Profile/components/AddProductTab";
import ProductDetailTab from "../pages/Profile/components/ProductDetailtabb";

const ProfileRoutes = ({ role, user }) => {
  if (!user) return <div>Error: User not found</div>;

  return (
    <Routes>
      {/* Route chung */}
      <Route path="profile" element={<ProfileTab role={role} user={user} />} />

      {/* Route chỉ dành cho Artisan */}
      {role === "Artisan" && (
        <>
          <Route
            path="products"
            element={<ProductsTab artisanId={user.id} />}
          />
          <Route
            path="customers"
            element={<CustomersTab artisanId={user.id} />}
          />
          <Route path="revenue" element={<RevenueTab artisanId={user.id} />} />
          <Route path="add-product" element={<AddProductTab />} />
          <Route path="/products/:productId" element={<ProductDetailTab />} />
        </>
      )}

      {/* Route chỉ dành cho Customer */}
      {role === "User" && (
        <>
          <Route path="orders" element={<OrdersTab userId={user.id} />} />
          <Route path="favorites" element={<FavoritesTab userId={user.id} />} />
        </>
      )}

      {/* Route chung (nhưng có logic khác nhau theo role) */}
      <Route
        path="reviews"
        element={<ReviewsTab userId={user.id} isArtisan={role === "Artisan"} />}
      />

      {/* Route mặc định */}
      <Route
        index
        element={
          role === "Artisan" ? (
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
