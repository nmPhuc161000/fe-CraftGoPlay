import React from "react";

const Footer = () => (
  <footer className="text-xs text-gray-400 py-4 px-8 flex flex-col md:flex-row items-center justify-between bg-white border-t mt-8">
    <div>
        © 2025 CRAFTGOPLAY. Đã đăng ký bản quyền.    
    </div>
    <div className="flex gap-2 mt-2 md:mt-0">
      <a href="#" className="hover:underline">Giấy phép</a>
      <a href="#" className="hover:underline">Chủ đề khác</a>
      <a href="#" className="hover:underline">Tài liệu</a>
      <a href="#" className="hover:underline">Hỗ trợ</a>
    </div>
  </footer>
);

export default Footer; 