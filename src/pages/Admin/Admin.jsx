import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StaffAccount from "./components/StaffAccount";
import ArtisanAccount from "./components/ArtisanAccount";
import CustomerAccount from "./components/CustomerAccount";
import OrderHistory from "./components/OrderHistory";

const Admin = () => {
  const [selected, setSelected] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false); // For desktop

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar bên trái */}
      <Sidebar
        selected={selected}
        setSelected={setSelected}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktop={() => setIsDesktopSidebarCollapsed(v => !v)}
      />
      {/* Phần phải: header, body, footer */}
      <div className="flex flex-col flex-1 min-h-screen">
        <Header onToggleMobileMenu={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-gray-100">
          {selected === "dashboard" && <Dashboard />}
          {selected === "staff" && <StaffAccount />}
          {selected === "artisan" && <ArtisanAccount />}
          {selected === "customer" && <CustomerAccount />}
          {selected === "order-history" && <OrderHistory />}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Admin; 