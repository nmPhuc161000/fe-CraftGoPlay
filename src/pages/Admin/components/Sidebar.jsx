import React, { useState, useRef } from "react";
import logo from "../../../assets/images/loginimg.jpg";

const menu = [
  {
    label: "Bảng điều khiển",
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
  { label: "Thợ thủ công", value: "artisan" },
  { label: "Khách hàng", value: "customer" },
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

  const managerSelectedList = ['artisan', 'customer', 'manager'];

  return (
    <>
      {/* Mobile Overlay with enhanced animation */}
      <div 
        className={`md:hidden fixed inset-0 bg-gradient-to-r from-black/60 to-black/40 z-30 transition-all duration-300 ${isMobileOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 bg-gradient-to-b from-slate-50 to-white shadow-2xl z-40 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-200/60
                  md:relative md:translate-x-0
                  ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                  ${isDesktopCollapsed ? 'md:w-20' : 'md:w-72'}`}
        style={{ minHeight: '100vh' }}
      >
        {/* Logo & Toggle with enhanced styling */}
        <div className={`flex items-center gap-3 px-5 pt-6 pb-6 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm transition-all duration-300 ${isDesktopCollapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <img 
              src={logo} 
              alt="CraftGoPlay Logo" 
              className={`transition-all duration-300 rounded-full object-cover ring-2 ring-blue-100 shadow-lg hover:ring-blue-200 ${isDesktopCollapsed ? 'h-10 w-10' : 'h-12 w-12'}`} 
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
          </div>
          {!isDesktopCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CraftGoPlay</span>
              <span className="text-xs text-slate-500 font-medium">Admin Panel</span>
            </div>
          )}
          <button
            className="ml-auto hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 transition-all duration-200 hover:scale-110 text-slate-600 hover:text-blue-600 shadow-sm border border-slate-200/50"
            onClick={onToggleDesktop}
            aria-label="Toggle sidebar"
          >
            <span className="text-lg font-bold transition-transform duration-300">{isOpen ? "«" : "»"}</span>
          </button>
        </div>

        {/* Menu with enhanced spacing and effects */}
        <nav className="flex flex-col gap-2 px-4 py-6 flex-1 overflow-y-auto">
          {/* Dashboard */}
          <button
            className={`group flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-base font-semibold relative overflow-hidden ${
              selected === 'dashboard' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-slate-700 hover:text-blue-600 hover:shadow-md hover:scale-102'
            }`}
            onClick={() => setSelected('dashboard')}
            style={{ minHeight: 48 }}
          >
            <div className={`transition-all duration-200 ${selected === 'dashboard' ? 'scale-110' : 'group-hover:scale-110'}`}>
              {React.cloneElement(menu[0].icon, { 
                className: selected === 'dashboard' ? 'text-white' : 'text-slate-600 group-hover:text-blue-600' 
              })}
            </div>
            {isOpen && (
              <span className="transition-all duration-200 group-hover:translate-x-1">Bảng điều khiển</span>
            )}
            {selected === 'dashboard' && (
              <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>

          {/* Order History */}
          <button
            className={`group flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-base font-semibold relative overflow-hidden ${
              selected === 'order-history' 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105' 
                : 'hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-slate-700 hover:text-emerald-600 hover:shadow-md hover:scale-102'
            }`}
            onClick={() => setSelected('order-history')}
            style={{ minHeight: 48 }}
          >
            <div className={`transition-all duration-200 ${selected === 'order-history' ? 'scale-110' : 'group-hover:scale-110'}`}>
              {React.cloneElement(orderIcon, { 
                className: selected === 'order-history' ? 'text-white' : 'text-slate-600 group-hover:text-emerald-600' 
              })}
            </div>
            {isOpen && (
              <span className="transition-all duration-200 group-hover:translate-x-1">Lịch sử đơn hàng</span>
            )}
            {selected === 'order-history' && (
              <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>

          {/* Manager Account group with enhanced styling */}
          <div className="relative"
            onMouseEnter={handleMouseEnterManager}
            onMouseLeave={handleMouseLeaveManager}
          >
            <button
              ref={managerBtnRef}
              className={`group flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-base font-semibold relative overflow-hidden ${
                managerSelectedList.includes(selected) 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105' 
                  : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-slate-700 hover:text-purple-600 hover:shadow-md hover:scale-102'
              }`}
              style={{ minHeight: 48 }}
              onClick={() => setOpenManager((v) => !v)}
            >
              <div className={`transition-all duration-200 ${managerSelectedList.includes(selected) ? 'scale-110' : 'group-hover:scale-110'}`}>
                {React.cloneElement(managerIcon, { 
                  className: managerSelectedList.includes(selected) ? 'text-white' : 'text-slate-600 group-hover:text-purple-600' 
                })}
              </div>
              {isOpen && (
                <span className="transition-all duration-200 group-hover:translate-x-1">Quản lý tài khoản</span>
              )}
              <div className={`ml-auto transition-all duration-300 ${openManager ? 'rotate-180' : 'rotate-0'}`}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
              {managerSelectedList.includes(selected) && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>

            {/* Popover submenu khi thu gọn với enhanced animation */}
            {isDesktopCollapsed && hoverManager && (
              <div
                className="absolute left-full top-0 mt-0 ml-3 bg-white rounded-2xl shadow-2xl py-3 px-2 min-w-[200px] z-50 flex flex-col gap-1 border border-slate-200/60 backdrop-blur-sm animate-in slide-in-from-left-2 duration-200"
              >
                <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  Quản lý tài khoản
                </div>
                {managerAccountSubMenu.map((item, index) => (
                  <button
                    key={item.value}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r text-left text-base font-medium whitespace-nowrap transition-all duration-200 hover:scale-102 ${
                      selected === item.value 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                        : 'text-slate-700 hover:from-purple-50 hover:to-pink-50 hover:text-purple-600'
                    }`}
                    onClick={() => {
                      setSelected(item.value);
                      setHoverManager(false);
                    }}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Submenu khi sidebar mở rộng với enhanced animation */}
            {!isDesktopCollapsed && (
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openManager ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
              }`}>
                <div className="pl-8 flex flex-col gap-1 py-2">
                  {managerAccountSubMenu.map((item, index) => (
                    <button
                      key={item.value}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-base font-medium transition-all duration-200 hover:scale-102 ${
                        selected === item.value 
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-md font-semibold' 
                          : 'text-slate-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600'
                      }`}
                      onClick={() => setSelected(item.value)}
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        transform: `translateX(${openManager ? '0' : '-20px'})`,
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        selected === item.value ? 'bg-purple-500' : 'bg-slate-400'
                      }`}></div>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Footer with additional info */}
        <div className="px-4 py-4 border-t border-slate-200/50 bg-white/80 backdrop-blur-sm">
          {!isDesktopCollapsed && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Đang hoạt động</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;