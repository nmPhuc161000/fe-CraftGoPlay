import React, { useState, useRef, useContext } from "react";
import logo from "../../assets/images/loginimg.jpg";
import {
  MdCategory,
  MdViewList,
  MdInventory2,
  MdHistory,
  MdOutlineHolidayVillage,
  MdBolt,
  MdAssignment,
  MdLogout,
  MdLocalOffer
} from "react-icons/md";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Color constants (using staff theme)
const MAIN_COLOR = "#c7903f";
const MAIN_COLOR_DARK = "#8b3f1d";
const MAIN_BG_GRADIENT = "bg-gradient-to-b from-[#5e3a1e] to-[#704524]";
const MAIN_BORDER = "border-[#3e2612]/50";
const MAIN_SHADOW = "shadow-[0_4px_24px_0_rgba(62,38,18,0.2)]";

// Menu configurations
const adminMenu = [
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

const staffMenu = [
  {
    label: "Quản lý sản phẩm",
    value: "product",
    icon: <MdInventory2 size={22} />,
  },
  {
    label: "Quản lý danh mục",
    value: "category",
    icon: <MdCategory size={22} />,
  },
  {
    label: "Quản lý danh mục con",
    value: "subcategory",
    icon: <MdViewList size={22} />,
  },
  {
    label: "Quản lý yêu cầu",
    value: "request",
    icon: <MdAssignment size={22} />,
  },
  {
    label: "Quản lý làng thủ công",
    value: "craftVilage",
    icon: <MdOutlineHolidayVillage size={22} />,
  },
  { label: "Quản lý kĩ năng", value: "skill", icon: <MdBolt size={22} /> },
  {
    label: "Lịch sử đơn hàng",
    value: "history",
    icon: <MdHistory size={22} />,
  },
  {
    label: "Quản lý mã giảm giá", // Thêm mục mới
    value: "voucher",
    icon: <MdLocalOffer size={22} />,
  },
];

const managerAccountSubMenu = [
  { label: "Thợ thủ công", value: "artisan" },
  { label: "Khách hàng", value: "customer" },
  { label: "Nhân viên", value: "staff" },
];

const managerIcon = (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2c0-2.66-5.33-4-8-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Sidebar = ({ 
  selected, 
  setSelected, 
  isMobileOpen, 
  onCloseMobile, 
  isDesktopCollapsed, 
  onToggleDesktop,
  userRole = 'admin' // Default to admin, can be 'staff'
}) => {
  const [openManager, setOpenManager] = useState(true);
  const [hoverManager, setHoverManager] = useState(false);
  const isOpen = !isDesktopCollapsed;
  const managerBtnRef = useRef(null);
  const hoverTimeout = useRef();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMouseEnterManager = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoverManager(true);
  };

  const handleMouseLeaveManager = () => {
    hoverTimeout.current = setTimeout(() => setHoverManager(false), 200);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const managerSelectedList = ['artisan', 'customer', 'manager', 'staff'];
  const isAdmin = userRole === 'admin';
  const menuItems = isAdmin ? adminMenu : staffMenu;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-gradient-to-r from-[#5e3a1e]/70 to-[#c7903f]/60 z-30 transition-all duration-300 ${
          isMobileOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
      />

      <aside
        className={`fixed inset-y-0 left-0 ${MAIN_BG_GRADIENT} ${MAIN_SHADOW} z-40 flex flex-col transition-all duration-300 ease-in-out border-r ${MAIN_BORDER} md:relative md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDesktopCollapsed ? 'md:w-20' : 'md:w-72'}`}
        style={{ minHeight: '100vh' }}
      >
        {/* Logo & Toggle */}
        <div className={`flex items-center gap-3 px-5 pt-6 pb-6 border-b ${MAIN_BORDER} bg-[#5e3a1e]/90 backdrop-blur-sm transition-all duration-300 ${
          isDesktopCollapsed ? 'justify-center' : ''
        }`}>
          <div className="relative group">
            <img
              src={logo}
              alt="CraftGoPlay Logo"
              className={`transition-all duration-300 rounded-full object-cover ring-2 ring-indigo-400/30 group-hover:ring-indigo-400/60 shadow-lg ${isDesktopCollapsed ? 'h-10 w-10' : 'h-12 w-12'}`}
              style={{ border: '2px solid #3e2612' }}
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
          </div>
          {!isDesktopCollapsed && (
            <div className="flex flex-col">
              <span
                className="text-xl font-bold tracking-wide"
                style={{
                  backgroundImage: "linear-gradient(90deg, #f8e4c3 0%, #ffe9b3 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent"
                }}
              >
                CraftGoPlay
              </span>
              <span className="text-xs font-medium text-slate-400">
                {isAdmin ? 'Admin Panel' : 'Staff Dashboard'}
              </span>
            </div>
          )}
          <button
            className="ml-auto hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 text-slate-300 hover:text-white transition-all duration-200 hover:scale-110"
            onClick={onToggleDesktop}
            aria-label="Toggle sidebar"
          >
            <span className="text-lg font-bold transition-transform duration-300">{isOpen ? "«" : "»"}</span>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2 px-4 py-6 flex-1 overflow-y-auto">
          {/* Admin specific menu */}
          {isAdmin && (
            <>
              {/* Dashboard */}
              <button
                className={`group relative flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium overflow-hidden ${
                  selected === 'dashboard'
                    ? "bg-gradient-to-r from-[#c7903f] to-[#8b3f1d] text-white shadow-lg shadow-[#3e2612]/25"
                    : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
                }`}
                onClick={() => setSelected('dashboard')}
                style={{ minHeight: 48 }}
              >
                <div className={`relative z-10 flex items-center justify-center transition-all duration-200 ${
                  selected === 'dashboard'
                    ? "text-white"
                    : "text-orange-300 group-hover:text-yellow-400"
                }`}>
                  {React.cloneElement(adminMenu[0].icon, {
                    className: selected === 'dashboard'
                      ? 'text-white'
                      : 'text-orange-300 group-hover:text-yellow-400'
                  })}
                </div>
                {isOpen && (
                  <span className="relative z-10 transition-all duration-200 group-hover:translate-x-1">Bảng điều khiển</span>
                )}
                {selected === 'dashboard' && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
                )}
              </button>

              {/* Manager Account group */}
              <div className="relative"
                onMouseEnter={handleMouseEnterManager}
                onMouseLeave={handleMouseLeaveManager}
              >
                <button
                  ref={managerBtnRef}
                  className={`group relative flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium overflow-hidden ${
                    managerSelectedList.includes(selected)
                      ? "bg-gradient-to-r from-[#c7903f] to-[#8b3f1d] text-white shadow-lg shadow-[#3e2612]/25"
                      : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
                  }`}
                  style={{ minHeight: 48 }}
                  onClick={() => setOpenManager((v) => !v)}
                >
                  <div className={`relative z-10 flex items-center justify-center transition-all duration-200 ${
                    managerSelectedList.includes(selected)
                      ? "text-white"
                      : "text-orange-300 group-hover:text-yellow-400"
                  }`}>
                    {React.cloneElement(managerIcon, {
                      className: managerSelectedList.includes(selected)
                        ? 'text-white'
                        : 'text-orange-300 group-hover:text-yellow-400'
                    })}
                  </div>
                  {isOpen && (
                    <span className="relative z-10 transition-all duration-200 group-hover:translate-x-1">Quản lý tài khoản</span>
                  )}
                  <div className={`ml-auto transition-all duration-300 ${openManager ? 'rotate-180' : 'rotate-0'}`}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                  {managerSelectedList.includes(selected) && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
                  )}
                </button>

                {/* Popover submenu when collapsed */}
                {isDesktopCollapsed && hoverManager && (
                  <div
                    className="absolute left-full top-0 mt-0 ml-3 bg-[#5e3a1e]/90 rounded-2xl shadow-2xl py-3 px-2 min-w-[200px] z-50 flex flex-col gap-1 border ${MAIN_BORDER} backdrop-blur-sm animate-in slide-in-from-left-2 duration-200"
                  >
                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b ${MAIN_BORDER}">
                      Quản lý tài khoản
                    </div>
                    {managerAccountSubMenu.map((item, index) => (
                      <button
                        key={item.value}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-700/50 text-left text-base font-medium whitespace-nowrap transition-all duration-200 hover:scale-102 ${
                          selected === item.value
                            ? "bg-gradient-to-r from-[#c7903f] to-[#8b3f1d] text-white shadow-lg"
                            : "text-slate-300 hover:text-white"
                        }`}
                        onClick={() => {
                          setSelected(item.value);
                          setHoverManager(false);
                        }}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {!item.icon && <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Submenu when sidebar expanded */}
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
                              ? "bg-gradient-to-r from-[#c7903f] to-[#8b3f1d] text-white shadow-md"
                              : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                          }`}
                          onClick={() => setSelected(item.value)}
                          style={{
                            animationDelay: `${index * 50}ms`,
                            transform: `translateX(${openManager ? '0' : '-20px'})`,
                            transition: 'all 0.3s ease-in-out'
                          }}
                        >
                          {!item.icon && <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            selected === item.value ? 'bg-white' : 'bg-slate-600'
                          }`}></div>}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet System */}
              <button
                className={`group relative flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium overflow-hidden ${
                  selected === 'walletSystem'
                    ? "bg-gradient-to-r from-[#c7903f] to-[#8b3f1d] text-white shadow-lg shadow-[#3e2612]/25"
                    : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
                }`}
                onClick={() => setSelected('walletSystem')}
                style={{ minHeight: 48 }}
              >
                <div className={`relative z-10 flex items-center justify-center transition-all duration-200 ${
                  selected === 'walletSystem'
                    ? "text-white"
                    : "text-orange-300 group-hover:text-yellow-400"
                }`}>
                  {React.cloneElement(adminMenu[0].icon, {
                    className: selected === 'walletSystem'
                      ? 'text-white'
                      : 'text-orange-300 group-hover:text-yellow-400'
                  })}
                </div>
                {isOpen && (
                  <span className="relative z-10 transition-all duration-200 group-hover:translate-x-1">Ví hệ thống</span>
                )}
                {selected === 'walletSystem' && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
                )}
              </button>
            </>
          )}

          {/* Staff specific menu */}
          {!isAdmin && staffMenu.map((item, index) => (
            <button
              key={item.value}
              className={`group relative flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium overflow-hidden ${
                selected === item.value
                  ? "bg-gradient-to-r from-[#c7903f] to-[#8b3f1d] text-white shadow-lg shadow-[#3e2612]/25"
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
              }`}
              onClick={() => setSelected(item.value)}
              style={{
                minHeight: 48,
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#c7903f]/10 to-[#8b3f1d]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div
                className={`relative z-10 flex items-center justify-center transition-all duration-200 ${
                  selected === item.value
                    ? "text-white"
                    : "text-orange-300 group-hover:text-yellow-400"
                }`}
              >
                {item.icon}
              </div>
              {isOpen && (
                <span className="relative z-10 transition-all duration-200 group-hover:translate-x-1">
                  {item.label}
                </span>
              )}
              {selected === item.value && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer with logout button */}
        <div className={`mt-auto px-4 py-4 border-t ${MAIN_BORDER} bg-[#5e3a1e]/90 backdrop-blur-sm flex flex-col gap-2`}>
          <button
            onClick={handleLogout}
            className="group relative flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium overflow-hidden hover:bg-red-900/50 text-slate-300 hover:text-white"
            style={{ minHeight: 48 }}
          >
            <div className="transition-all duration-200 group-hover:scale-110 text-red-300 group-hover:text-red-400">
              <MdLogout size={22} />
            </div>
            {isOpen && (
              <span className="transition-all duration-200 group-hover:translate-x-1">Đăng xuất</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;