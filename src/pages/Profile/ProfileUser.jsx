import React, { useContext } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileRoutes from "../../router/ProfileRoutes";
import { AuthContext } from "../../contexts/AuthContext";
import SidebarNavigation from "../../components/profile/SidebarNavigation";

export default function ProfileUser() {
  const { user, saveProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // Lấy role từ localStorage

  const handleRegisterArtisan = () => {
    localStorage.setItem("role", "artisan"); // Cập nhật localStorage
    saveProfile({ ...user, role: "artisan" }); // Cập nhật context
    navigate("/profile-user/profile");
  };

  const location = useLocation();
  const currentTab = location.pathname.split("/").pop() || "profile";

  const isActive = (tabName) => currentTab === tabName;

  return (
    <MainLayout>
      <div className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-lg shadow-lg h-fit md:sticky md:top-6">
            {/* Profile Summary */}
            <div className="p-4 border-b">
              <div className="flex flex-col items-center text-center">
                <img
                  className="w-24 h-24 rounded-full border-2 border-[#5e3a1e] object-cover mb-3"
                  src={
                    user?.thumbnail ||
                    "https://th.bing.com/th/id/OIP.PwEh4SGekpMaWT2d5GWw0wHaHt?rs=1&pid=ImgDetMain"
                  }
                  alt="User avatar"
                />
                <h3 className="font-bold text-lg">
                  {user?.userName || "Khách"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {user?.email || "Email"}
                </p>
                {role === "Artisan" ? (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full mt-1">
                    🎨 Nghệ nhân
                  </span>
                ) : (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-1">
                    🛒 Khách hàng
                  </span>
                )}
              </div>
            </div>

            {/* Sidebar Navigation */}
            <SidebarNavigation
              role={role}
              isActive={isActive}
              handleRegisterArtisan={handleRegisterArtisan}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-[#4a2d16] to-[#6e4b2a]"></div>

            {/* Tab Content */}
            <div className="p-6">
              <ProfileRoutes role={role} user={user} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
