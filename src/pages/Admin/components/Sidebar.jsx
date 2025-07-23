import React, { useState, useRef } from "react";
import logo from "../../../assets/images/loginimg.jpg";

// Chủ đạo: #5e3a1e (nâu đất), phối sáng hơn: #7a4a22, #c7903f, #f5e7d6
const MAIN_COLOR = "#7a4a22";
const MAIN_COLOR_DARK = "#5e3a1e";
const MAIN_COLOR_LIGHT = "#c7903f";
const MAIN_BG_GRADIENT = "bg-gradient-to-b from-[#f5e7d6] to-[#fff8f2]";
const MAIN_BORDER = "border-[#e2c9b0]";
const MAIN_SHADOW = "shadow-[0_4px_24px_0_rgba(126,74,34,0.08)]";

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
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2c0-2.66-5.33-4-8-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const orderIcon = (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="2" />
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
      {/* Mobile Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-gradient-to-r from-[#5e3a1e]/70 to-[#c7903f]/60 z-30 transition-all duration-300 ${isMobileOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 ${MAIN_BG_GRADIENT} ${MAIN_SHADOW} z-40 flex flex-col transition-all duration-300 ease-in-out border-r ${MAIN_BORDER}
                  md:relative md:translate-x-0
                  ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                  ${isDesktopCollapsed ? 'md:w-20' : 'md:w-72'}`}
        style={{ minHeight: '100vh' }}
      >
        {/* Logo & Toggle */}
        <div className={`flex items-center gap-3 px-5 pt-6 pb-6 border-b ${MAIN_BORDER} bg-[#fff8f2]/90 backdrop-blur-sm transition-all duration-300 ${isDesktopCollapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <img
              src={logo}
              alt="CraftGoPlay Logo"
              className={`transition-all duration-300 rounded-full object-cover ring-2 ring-[${MAIN_COLOR_LIGHT}] shadow-lg hover:ring-[${MAIN_COLOR}] ${isDesktopCollapsed ? 'h-10 w-10' : 'h-12 w-12'}`}
              style={{ border: `2px solid ${MAIN_COLOR_LIGHT}` }}
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
          </div>
          {!isDesktopCollapsed && (
            <div className="flex flex-col">
              <span
                className="text-xl font-bold tracking-wide bg-gradient-to-r from-[#7a4a22] to-[#c7903f] bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, #7a4a22 0%, #c7903f 100%)"
                }}
              >
                CraftGoPlay
              </span>
              <span className="text-xs text-[#a67c52] font-medium">Admin Panel</span>
            </div>
          )}
          <button
            className="ml-auto hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#f5e7d6] transition-all duration-200 hover:scale-110 text-[#7a4a22] hover:text-[#c7903f] shadow-sm border border-[#e2c9b0]"
            onClick={onToggleDesktop}
            aria-label="Toggle sidebar"
          >
            <span className="text-lg font-bold transition-transform duration-300">{isOpen ? "«" : "»"}</span>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2 px-4 py-6 flex-1 overflow-y-auto">
          {/* Dashboard */}
          <button
            className={`group flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-base font-semibold relative overflow-hidden ${
              selected === 'dashboard'
                ? 'bg-gradient-to-r from-[#7a4a22] to-[#c7903f] text-white shadow-lg shadow-[#c7903f]/30 scale-105'
                : 'hover:bg-gradient-to-r hover:from-[#f5e7d6] hover:to-[#fff8f2] text-[#7a4a22] hover:text-[#c7903f] hover:shadow-md hover:scale-102'
            }`}
            onClick={() => setSelected('dashboard')}
            style={{ minHeight: 48 }}
          >
            <div className={`transition-all duration-200 ${selected === 'dashboard' ? 'scale-110' : 'group-hover:scale-110'}`}>
              {React.cloneElement(menu[0].icon, {
                className: selected === 'dashboard'
                  ? 'text-white'
                  : 'text-[#7a4a22] group-hover:text-[#c7903f]'
              })}
            </div>
            {isOpen && (
              <span className="transition-all duration-200 group-hover:translate-x-1">Bảng điều khiển</span>
            )}
            {selected === 'dashboard' && (
              <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>

          {/* Manager Account group */}
          <div className="relative"
            onMouseEnter={handleMouseEnterManager}
            onMouseLeave={handleMouseLeaveManager}
          >
            <button
              ref={managerBtnRef}
              className={`group flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-base font-semibold relative overflow-hidden ${
                managerSelectedList.includes(selected)
                  ? 'bg-gradient-to-r from-[#c7903f] to-[#7a4a22] text-white shadow-lg shadow-[#c7903f]/30 scale-105'
                  : 'hover:bg-gradient-to-r hover:from-[#f5e7d6] hover:to-[#fff8f2] text-[#7a4a22] hover:text-[#c7903f] hover:shadow-md hover:scale-102'
              }`}
              style={{ minHeight: 48 }}
              onClick={() => setOpenManager((v) => !v)}
            >
              <div className={`transition-all duration-200 ${managerSelectedList.includes(selected) ? 'scale-110' : 'group-hover:scale-110'}`}>
                {React.cloneElement(managerIcon, {
                  className: managerSelectedList.includes(selected)
                    ? 'text-white'
                    : 'text-[#7a4a22] group-hover:text-[#c7903f]'
                })}
              </div>
              {isOpen && (
                <span className="transition-all duration-200 group-hover:translate-x-1">Quản lý tài khoản</span>
              )}
              <div className={`ml-auto transition-all duration-300 ${openManager ? 'rotate-180' : 'rotate-0'}`}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>
              {managerSelectedList.includes(selected) && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>

            {/* Popover submenu khi thu gọn */}
            {isDesktopCollapsed && hoverManager && (
              <div
                className="absolute left-full top-0 mt-0 ml-3 bg-[#fff8f2] rounded-2xl shadow-2xl py-3 px-2 min-w-[200px] z-50 flex flex-col gap-1 border border-[#e2c9b0] backdrop-blur-sm animate-in slide-in-from-left-2 duration-200"
              >
                <div className="px-3 py-2 text-xs font-bold text-[#a67c52] uppercase tracking-wider border-b border-[#f5e7d6]">
                  Quản lý tài khoản
                </div>
                {managerAccountSubMenu.map((item, index) => (
                  <button
                    key={item.value}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r text-left text-base font-medium whitespace-nowrap transition-all duration-200 hover:scale-102 ${
                      selected === item.value
                        ? 'bg-gradient-to-r from-[#c7903f] to-[#7a4a22] text-white shadow-lg'
                        : 'text-[#7a4a22] hover:from-[#f5e7d6] hover:to-[#fff8f2] hover:text-[#c7903f]'
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

            {/* Submenu khi sidebar mở rộng */}
            {!isDesktopCollapsed && (
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openManager ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}>
                <div className="pl-8 flex flex-col gap-1 py-2">
                  {managerAccountSubMenu.map((item, index) => (
                    <button
                      key={item.value}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-base font-medium transition-all duration-200 hover:scale-102 ${
                        selected === item.value
                          ? 'bg-gradient-to-r from-[#f5e7d6] to-[#fff8f2] text-[#7a4a22] shadow-md font-semibold'
                          : 'text-[#7a4a22] hover:bg-gradient-to-r hover:from-[#f5e7d6] hover:to-[#fff8f2] hover:text-[#c7903f]'
                      }`}
                      onClick={() => setSelected(item.value)}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        transform: `translateX(${openManager ? '0' : '-20px'})`,
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full transition-all duration-200 ${selected === item.value ? 'bg-[#c7903f]' : 'bg-[#e2c9b0]'
                        }`}></div>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[#e2c9b0] bg-[#fff8f2]/90 backdrop-blur-sm">
          {!isDesktopCollapsed && (
            <div className="flex items-center gap-2 text-xs text-[#a67c52]">
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