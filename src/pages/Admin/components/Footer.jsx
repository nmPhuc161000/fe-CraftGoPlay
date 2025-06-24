import React from "react";

const Footer = () => (
  <footer className="text-xs text-gray-400 py-4 px-8 flex flex-col md:flex-row items-center justify-between bg-white border-t mt-8">
    <div>
        © 2025 CRAFTGOPLAY. All rights reserved.    
    </div>
    <div className="flex gap-2 mt-2 md:mt-0">
      <a href="#" class     Name="hover:underline">License</a>
      <a href="#" className="hover:underline">More Themes</a>
      <a href="#" className="hover:underline">Documentation</a>
      <a href="#" className="hover:underline">Support</a>
    </div>
  </footer>
);

export default Footer; 