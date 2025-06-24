import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.jpg";

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
          className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-indigo-200 text-2xl hover:bg-indigo-50 transition cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open settings"
        >
          ⚙️
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg py-2 z-50">
            <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 