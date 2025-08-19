import React, { useState } from "react";
import Sidebar from "../../components/AdminAndStaff/Sidebar";
import ManageProduct from "./components/ManageProduct";
import ManageCategory from "./components/ManageCategory";
import ManageSubCategory from "./components/ManageSubCategory";
import ArtisanRequestList from './components/ArtisanRequestList';
import ManageSkill from "./components/ManageSkill";
import ManageVillage from "./components/ManageVillage";
import OrderHistory from "./components/OrderHistory";
import ManageVoucher from "./components/ManageVoucher";

const Staff = () => {
  const [selected, setSelected] = useState("product");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        selected={selected}
        setSelected={setSelected}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktop={() => setIsDesktopSidebarCollapsed(v => !v)}
        userRole="staff"
      />
      <div className="flex flex-col flex-1 min-h-0">
        <main className="flex-1 overflow-y-scroll p-2 md:p-4 bg-white max-h-[calc(100vh-68px)]">
          {selected === "product" && <ManageProduct />}
          {selected === "category" && <ManageCategory />}
          {selected === "subcategory" && <ManageSubCategory />}
          {selected === 'request' && <ArtisanRequestList />}
          {selected === 'skill' && <ManageSkill />}
          {selected === 'craftVilage' && <ManageVillage />}
          {selected === 'history' && <OrderHistory />}
          {selected === 'voucher' && <ManageVoucher />}
        </main>
      </div>
    </div>
  );
};

export default Staff; 