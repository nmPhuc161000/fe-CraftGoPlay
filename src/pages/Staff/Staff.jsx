import React, { useState } from "react";
import Sidebar from "../../components/AdminAndStaff/Sidebar";
import ManageProduct from "./components/ManageProduct";
import ManageCategory from "./components/ManageCategory";
import ManageSubCategory from "./components/ManageSubCategory";
import ArtisanRequestList from "./components/ArtisanRequestList";
import ManageSkill from "./components/ManageSkill";
import ManageVillage from "./components/ManageVillage";
import OrderHistory from "./components/OrderHistory";
import ManageVoucher from "./components/ManageVoucher";
import AccountStaff from "../../components/AdminAndStaff/AccountStaff";

const Staff = () => {
  const [selected, setSelected] = useState("product");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        selected={selected}
        setSelected={setSelected}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktop={() => setIsDesktopSidebarCollapsed((v) => !v)}
        userRole="staff"
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          {selected === "account" && <AccountStaff />}
          {selected === "product" && <ManageProduct />}
          {selected === "category" && <ManageCategory />}
          {selected === "subcategory" && <ManageSubCategory />}
          {selected === "request" && <ArtisanRequestList />}
          {selected === "skill" && <ManageSkill />}
          {selected === "craftVilage" && <ManageVillage />}
          {selected === "history" && <OrderHistory />}
          {selected === "voucher" && <ManageVoucher />}
        </main>
      </div>
    </div>
  );
};

export default Staff;
