import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ onToggleMobileMenu }) => {
  const [open, setOpen] = useState(false);
  const iconRef = useRef(null);
  const navigate = useNavigate();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (iconRef.current && !iconRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleLogout = () => {
    // Xử lý logout nếu cần (xóa token, context, ...)
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between md:justify-end px-4 md:px-8 py-4 bg-white shadow-sm sticky top-0 z-10 relative">
      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden text-2xl"
        onClick={onToggleMobileMenu}
        aria-label="Open menu"
      >
        ☰
      </button>
      {/* Logo ở giữa */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <span className="font-bold text-xl" style={{ color: 'var(--primary)' }}>CraftGoPlay</span>
      </div>
      {/* Settings Icon */}
      <div className="relative" ref={iconRef}>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full text-2xl hover:bg-orange-100 transition cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open settings"
          style={{ border: 'none', boxShadow: 'none' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" stroke="var(--primary)" strokeWidth="2" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15 8.6a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15Z" stroke="var(--primary)" strokeWidth="2" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg py-2 z-50">
            <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50" onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 