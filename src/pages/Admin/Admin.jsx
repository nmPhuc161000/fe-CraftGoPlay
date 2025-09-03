import React, { useState } from "react";
import Sidebar from "../../components/AdminAndStaff/Sidebar";
import Dashboard from "./components/Dashboard";
import ArtisanAccount from "./components/ArtisanAccount";
import UserAccount from "./components/UserAccount";
import StaffAccount from "./components/StaffAccount";
import WalletSystem from "./components/WalletSystem";

const Admin = () => {
  const [selected, setSelected] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false); // For desktop

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar takes full viewport height */}
      <Sidebar
        selected={selected}
        setSelected={setSelected}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktop={() => setIsDesktopSidebarCollapsed((v) => !v)}
        userRole="admin"
      />
      {/* Main content takes remaining width and full height */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto bg-white">
          {selected === "dashboard" && <Dashboard />}
          {selected === "artisan" && <ArtisanAccount />}
          {selected === "customer" && <UserAccount />}
          {selected === "staff" && <StaffAccount />}
          {selected === "walletSystem" && <WalletSystem />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
