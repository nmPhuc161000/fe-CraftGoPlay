import React from "react";
import logo from "../../../assets/images/loginimg.jpg";
import { MdCategory, MdViewList, MdInventory2 } from "react-icons/md";
import { MdAssignment } from "react-icons/md";

const menu = [
  { label: "Quản lý sản phẩm", value: "product", icon: <MdInventory2 size={22} /> },
  { label: "Quản lý danh mục", value: "category", icon: <MdCategory size={22} /> },
  { label: "Quản lý danh mục con", value: "subcategory", icon: <MdViewList size={22} /> },
  { label: "Quản lý yêu cầu", value: "request", icon: <MdAssignment size={22} /> },
];

const Sidebar = ({ selected, setSelected, isMobileOpen, onCloseMobile, isDesktopCollapsed, onToggleDesktop }) => {
  const isOpen = !isDesktopCollapsed;
  return (
    <>
      <div className={`md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onCloseMobile}></div>
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-xl z-40 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} ${isDesktopCollapsed ? 'md:w-20' : 'md:w-64'}`} style={{ minHeight: '100vh' }}>
        <div className="flex items-center gap-2 px-4 pt-6 pb-4">
          <img src={logo} alt="CraftGoPlay Logo" className={`transition-all rounded-full object-cover ${isDesktopCollapsed ? 'h-8 w-8' : 'h-10 w-10'}`} />
          {!isDesktopCollapsed && <span className="text-lg font-bold tracking-wide">CraftGoPlay</span>}
          <button className="ml-auto hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-indigo-50 transition" onClick={onToggleDesktop} aria-label="Toggle sidebar">
            <span className="text-xl">{isOpen ? "«" : "»"}</span>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-2">
          {menu.map(item => (
            <button
              key={item.value}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition text-base font-bold ${selected === item.value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
              onClick={() => setSelected(item.value)}
              style={{ minHeight: 40 }}
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar; 