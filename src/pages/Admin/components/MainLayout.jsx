import React from "react";

const MainLayout = ({ sidebar, children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {sidebar}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default MainLayout; 