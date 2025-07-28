import { Routes, Route } from "react-router-dom";
import ProductsTab from "../pages/Profile/components/artisan/ProductsTab";
import OrdersTab from "../pages/Profile/components/user/OrdersTab";
import ArtisanReviewsTab from "../pages/Profile/components/artisan/ArtisanReviewsTab";
import FavoritesTab from "../pages/Profile/components/user/FavoritesTab";
import CustomersTab from "../pages/Profile/components/user/CustomersTab";
import RevenueTab from "../pages/Profile/components/artisan/RevenueTab";
import ProfileTab from "../pages/Profile/components/ProfileTab";
import AddProductTab from "../pages/Profile/components/artisan/AddProductTab";
import ProductDetailTab from "../pages/Profile/components/artisan/ProductDetailtab";
import AddressTab from "../pages/Profile/components/user/AddressTab";
import UpgradeArtisanTab from "../pages/Profile/components/user/UpgradeArtisanTab";
import CustomerReviewsTab from "../pages/Profile/components/user/CustomerReviewsTab";
import CoinTab from "../pages/Profile/components/user/CointTab";
import VoucherTab from "../pages/Profile/components/user/VoucherTab";
import ArtisanOrdersTab from "../pages/Profile/components/artisan/ArtisanOrdersTab";
import RefundWalletTab from "../pages/Profile/components/user/RefundWalletTab";

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
          <Route
            path="artisanReviews"
            element={
              <ArtisanReviewsTab
                userId={user.id}
                isArtisan={role === "Artisan"}
              />
            }
          />
          <Route path="artisanOrders" element={<ArtisanOrdersTab />} />
        </>
      )}

      {/* Route chỉ dành cho Customer */}
      {role === "User" && (
        <>
          <Route path="orders" element={<OrdersTab userId={user.id} />} />
          <Route path="favorites" element={<FavoritesTab userId={user.id} />} />
          <Route path="addresses" element={<AddressTab userId={user.id} />} />
          <Route
            path="upgradeArtisan"
            element={<UpgradeArtisanTab userId={user.id} />}
          />
          <Route
            path="userReviews"
            element={<CustomerReviewsTab userId={user.id} />}
          />
          <Route path="coins" element={<CoinTab userId={user.id} />} />
          <Route path="vouchers" element={<VoucherTab userId={user.id} />} />
          <Route path="refundWallet" element={<RefundWalletTab />} />
        </>
      )}

      {/* Route chung (nhưng có logic khác nhau theo role) */}

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
