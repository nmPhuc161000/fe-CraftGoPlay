import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/AdminAndStaff/Sidebar";
import Dashboard from "./components/Dashboard";
import ArtisanAccount from "./components/ArtisanAccount";
import UserAccount from "./components/UserAccount";
import StaffAccount from "./components/StaffAccount";
import WalletSystem from "./components/WalletSystem";

const Admin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const [selected, setSelected] = useState(tabFromUrl || "dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  // Cập nhật URL khi selected thay đổi
  useEffect(() => {
    if (selected !== "dashboard") {
      setSearchParams({ tab: selected });
    } else {
      setSearchParams({});
    }
  }, [selected, setSearchParams]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        selected={selected}
        setSelected={setSelected}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktop={() => setIsDesktopSidebarCollapsed((v) => !v)}
        userRole="admin"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto bg-gradient-to-br from-amber-50 to-brown-100">
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
