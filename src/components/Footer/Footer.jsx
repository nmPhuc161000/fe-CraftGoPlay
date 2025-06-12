import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#5e3a1e] text-[#f2e8dc] py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Logo & Giới thiệu */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">CRAFTGOPLAY</h3>
            <p className="mb-4">
              CRAFTGOPLAY là nền tảng kết nối các nghệ nhân thủ công với người yêu board game, mang đến những sản phẩm tinh xảo và trải nghiệm chơi độc đáo.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a href="/products" className=" hover:text-[#7f5539] transition-colors duration-300">
                  Sản phẩm
                </a>
              </li>
              <li>
                <a href="/about" className=" hover:text-[#7f5539] transition-colors duration-300">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="/blog" className=" hover:text-[#7f5539] transition-colors duration-300">
                  Blog
                </a>
              </li>
              <li>
                <a href="/faq" className=" hover:text-[#7f5539] transition-colors duration-300">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4">Liên hệ</h3>
            <p className=" mb-2">Email: contact@craftgoplay.com</p>
            <p className=" mb-2">Điện thoại: (+84) 123 456 789</p>
            <p className="">Địa chỉ: 123 Đường Thủ Công, TP. HCM</p>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a href="#" className="text-[#5e3a1e] hover:text-[#7f5539] transform hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.22-1.79L9 14v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </a>
              <a href="#" className="text-[#5e3a1e] hover:text-[#7f5539] transform hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.91 8-4.94 8-9.95z" />
                </svg>
              </a>
              <a href="#" className="text-[#5e3a1e] hover:text-[#7f5539] transform hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="mt-8 pt-8 border-t border-gray-300 text-center">
          <p className="">© 2025 CRAFTGOPLAY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;