import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ManageProduct from "./components/ManageProduct";
import ManageCategory from "./components/ManageCategory";
import ManageSubCategory from "./components/ManageSubCategory";
import categoryService from "../../services/apis/cateApi";

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
      />
      <div className="flex flex-col flex-1 min-h-screen">
        <Header onToggleMobileMenu={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-2 md:p-4 overflow-auto bg-white">
          {selected === "product" && <ManageProduct />}
          {selected === "category" && <ManageCategory />}
          {selected === "subcategory" && <ManageSubCategory />}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Staff; 