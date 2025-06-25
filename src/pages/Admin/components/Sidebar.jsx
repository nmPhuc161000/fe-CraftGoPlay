import React from "react";
import logo from "../../../assets/images/loginimg.jpg";

const menu = [
  {
    label: "Dashboard",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="2" fill="none" stroke="currentColor" />
        <rect x="14" y="3" width="7" height="7" rx="2" fill="none" stroke="currentColor" />
        <rect x="14" y="14" width="7" height="7" rx="2" fill="none" stroke="currentColor" />
        <rect x="3" y="14" width="7" height="7" rx="2" fill="none" stroke="currentColor" />
      </svg>
    ),
  },
  {
    label: "Manager Account",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="text-primary">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2c0-2.66-5.33-4-8-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const Sidebar = ({ selected, setSelected, isMobileOpen, onCloseMobile, isDesktopCollapsed, onToggleDesktop }) => {
  const isOpen = !isDesktopCollapsed;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 bg-white shadow-xl z-40 flex flex-col transition-transform duration-300
                  md:relative md:translate-x-0
                  ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                  ${isDesktopCollapsed ? 'md:w-20' : 'md:w-64'}`}
        style={{ minHeight: '100vh' }}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center gap-2 px-4 pt-6 pb-4">
          <img src={logo} alt="CraftGoPlay Logo" className={`transition-all rounded-full object-cover ${isDesktopCollapsed ? 'h-8 w-8' : 'h-10 w-10'}`} />
          {!isDesktopCollapsed && <span className="text-lg font-bold tracking-wide">CraftGoPlay</span>}
          <button
            className="ml-auto hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-indigo-50 transition"
            onClick={onToggleDesktop}
            aria-label="Toggle sidebar"
          >
            <span className="text-xl">{isOpen ? "«" : "»"}</span>
          </button>
        </div>
        {/* Menu */}
        <nav className="flex flex-col gap-1 px-2">
          {menu.map((item) => (
            <button
              key={item.label}
              className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium text-left hover:bg-indigo-50 ${selected === item.label.toLowerCase() ? "bg-indigo-100 text-indigo-700" : "text-gray-700"}`}
              onClick={() => {
                setSelected(item.label.toLowerCase());
                onCloseMobile();
              }}
            >
              <span className="flex items-center justify-center w-6 h-6">{item.icon}</span>
              {!isDesktopCollapsed && <span className="flex-1">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar; 