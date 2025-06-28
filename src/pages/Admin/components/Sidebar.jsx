import React, { useState, useRef } from "react";
import logo from "../../../assets/images/loginimg.jpg";
import StaffAccount from "./StaffAccount";

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
    value: "dashboard",
  },
];

const managerAccountSubMenu = [
  { label: "Staff Account", value: "staff" },
  { label: "Artisan Account", value: "artisan" },
  { label: "Customer Account", value: "customer" },
];

const managerIcon = (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="text-primary">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2c0-2.66-5.33-4-8-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const orderIcon = (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="text-primary">
    <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const Sidebar = ({ selected, setSelected, isMobileOpen, onCloseMobile, isDesktopCollapsed, onToggleDesktop }) => {
  const [openManager, setOpenManager] = useState(true);
  const [hoverManager, setHoverManager] = useState(false);
  const isOpen = !isDesktopCollapsed;
  const managerBtnRef = useRef(null);
  const hoverTimeout = useRef();

  const handleMouseEnterManager = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoverManager(true);
  };

  const handleMouseLeaveManager = () => {
    hoverTimeout.current = setTimeout(() => setHoverManager(false), 200);
  };

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
          {/* Dashboard */}
          <button
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition text-base font-bold ${selected === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => setSelected('dashboard')}
            style={{ minHeight: 40 }}
          >
            {menu[0].icon}
            {isOpen && <span>Dashboard</span>}
          </button>
          {/* Order History */}
          <button
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition text-base font-bold ${selected === 'order-history' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => setSelected('order-history')}
            style={{ minHeight: 40 }}
          >
            {orderIcon}
            {isOpen && <span>Order History</span>}
          </button>
          {/* Manager Account group */}
          <div className="relative"
            onMouseEnter={handleMouseEnterManager}
            onMouseLeave={handleMouseLeaveManager}
          >
            <button
              ref={managerBtnRef}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition text-base font-bold ${['staff','artisan','customer','manager'].includes(selected) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
              style={{ minHeight: 40 }}
              onClick={() => setOpenManager((v) => !v)}
            >
              {React.cloneElement(managerIcon, { className: ['staff','artisan','customer','manager'].includes(selected) ? 'text-blue-600' : 'text-primary' })}
              {isOpen && <span>Manager Account</span>}
              <span className="ml-auto">{openManager ? '▾' : '▸'}</span>
            </button>
            {/* Popover submenu khi thu gọn */}
            {isDesktopCollapsed && hoverManager && (
              <div
                className="absolute left-full top-0 mt-0 ml-2 bg-white rounded-xl shadow-xl py-2 px-2 min-w-[180px] z-50 flex flex-col gap-1"
              >
                {managerAccountSubMenu.map((item) => (
                  <button
                    key={item.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-left text-base font-medium whitespace-nowrap ${selected === item.value ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'}`}
                    onClick={() => {
                      setSelected(item.value);
                      setHoverManager(false);
                    }}
                  >
                    <span>≡</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
            {/* Submenu khi sidebar mở rộng */}
            {!isDesktopCollapsed && openManager && (
              <div className="pl-7 flex flex-col gap-1 mt-1">
                {managerAccountSubMenu.map((item) => (
                  <button
                    key={item.value}
                    className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50 text-left text-base font-medium ${selected === item.value ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'}`}
                    onClick={() => setSelected(item.value)}
                  >
                    <span>≡</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar; 