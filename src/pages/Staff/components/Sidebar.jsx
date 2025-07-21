import React from "react";
import logo from "../../../assets/images/loginimg.jpg";
import { MdCategory, MdViewList, MdInventory2, MdHistory, MdOutlineHolidayVillage, MdBolt } from "react-icons/md";
import { MdAssignment } from "react-icons/md";

const menu = [
  { label: "Quản lý sản phẩm", value: "product", icon: <MdInventory2 size={22} /> },
  { label: "Quản lý danh mục", value: "category", icon: <MdCategory size={22} /> },
  { label: "Quản lý danh mục con", value: "subcategory", icon: <MdViewList size={22} /> },
  { label: "Quản lý yêu cầu", value: "request", icon: <MdAssignment size={22} /> },
  { label: "Quản lý làng thủ công", value: "craftVilage", icon: <MdOutlineHolidayVillage size={22} /> },
  { label: "Quản lý kĩ năng", value: "skill", icon: <MdBolt size={22} /> },
  { label: "Lịch sử đơn hàng", value: "history", icon: <MdHistory size={22} /> },
];

const Sidebar = ({ selected, setSelected, isMobileOpen, onCloseMobile, isDesktopCollapsed, onToggleDesktop }) => {
  const isOpen = !isDesktopCollapsed;

  return (
    <>
      {/* Mobile overlay with smooth fade */}
      <div
        className={`md:hidden fixed inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/40 z-30 transition-all duration-300 ${isMobileOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onCloseMobile}
      />

      {/* Main sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-gradient-to-b from-[#5e3a1e] to-[#704524] shadow-2xl z-40 flex flex-col transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isDesktopCollapsed ? 'md:w-20' : 'md:w-72'}`}
        style={{ minHeight: '100vh' }}
      >
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5e3a1e] to-[#704524] pointer-events-none" />

        {/* Header section */}
        <div className="relative flex items-center gap-3 px-4 pt-6 pb-6 border-b border-[#3e2612]/50">
          <div className="relative group">
            <img
              src={logo}
              alt="CraftGoPlay Logo"
              className={`transition-all duration-300 rounded-full object-cover ring-2 ring-indigo-400/30 group-hover:ring-indigo-400/60 shadow-lg ${isDesktopCollapsed ? 'h-10 w-10' : 'h-12 w-12'
                }`}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300" />
          </div>

          {!isDesktopCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-[#f8e4c3] to-[#ffe9b3] bg-clip-text text-transparent tracking-wide">
                CraftGoPlay
              </span>

              <span className="text-xs text-slate-400 font-medium">Admin Dashboard</span>
            </div>
          )}

          <button
            className="ml-auto hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 group"
            onClick={onToggleDesktop}
            aria-label="Toggle sidebar"
          >
            <span className="text-lg text-slate-300 group-hover:text-white transition-colors duration-200">
              {isOpen ? "«" : "»"}
            </span>
          </button>
        </div>

        {/* Navigation section */}
        <nav className="flex flex-col gap-2 px-3 pt-4 flex-1">
          {menu.map((item, index) => (
            <button
              key={item.value}
              className={`group relative flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium overflow-hidden ${selected === item.value
                ? 'bg-gradient-to-r from-[#c7903f] to-[#8b3f1d] text-white shadow-lg shadow-[#3e2612]/25 '
                : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                }`}
              onClick={() => setSelected(item.value)}
              style={{
                minHeight: 48,
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Background gradient for selected item */}
              {selected === item.value && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#c7903f] to-[#8b3f1d] rounded-xl" />
              )}

              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#c7903f]/10 to-[#8b3f1d]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Icon container */}
              <div className={`relative z-10 flex items-center justify-center transition-all duration-200 ${selected === item.value
                ? 'text-white'
                : 'text-orange-300 group-hover:text-yellow-400'}`}>
                {item.icon}
              </div>

              {/* Label with slide animation */}
              {isOpen && (
                <span className="relative z-10 transition-all duration-200 group-hover:translate-x-1">
                  {item.label}
                </span>
              )}

              {/* Active indicator */}
              {selected === item.value && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer section */}
        {/* <div className="relative px-4 pb-4 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm text-slate-300 font-medium">System Status</span>
                <span className="text-xs text-green-400">Online</span>
              </div>
            )}
          </div>
        </div> */}

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </aside>
    </>
  );
};

export default Sidebar;