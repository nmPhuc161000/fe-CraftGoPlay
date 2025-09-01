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
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false); // For desktop

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar bên trái */}
      <Sidebar
        selected={selected}
        setSelected={setSelected}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktop={() => setIsDesktopSidebarCollapsed(v => !v)}
        userRole="admin"
      />
      <div className="flex flex-col flex-1 min-h-0">
        <main className="flex-1 p-4 md:p-8 overflow-y-scroll bg-white max-h-[calc(100vh-68px)]">
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