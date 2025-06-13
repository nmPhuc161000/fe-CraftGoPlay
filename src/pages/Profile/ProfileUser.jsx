import React, { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";

export default function ProfileUser() {
  // Giả sử user có thể là customer hoặc artisan
  const [user, setUser] = useState({
    isArtisan: false, // Có thể thay đổi thành true để xem giao diện artisan
    name: "Nguyễn Văn A",
    username: "@nguyenvana",
    bio: "Yêu thích đồ thủ công mỹ nghệ truyền thống",
    email: "nguyenvana@example.com",
    location: "Hà Nội, Việt Nam",
    joinDate: "Tham gia từ tháng 3/2023",
    products: 12, // Số sản phẩm (nếu là artisan)
    orders: 5, // Số đơn hàng (nếu là customer)
  });

  return (
    <MainLayout>
      <div className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-[#4a2d16] to-[#6e4b2a]"></div>

          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Avatar và Role Badge */}
            <div className="absolute -top-16 left-6 flex items-end">
              <img
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
                src="https://th.bing.com/th/id/OIP.PwEh4SGekpMaWT2d5GWw0wHaHt?rs=1&pid=ImgDetMain"
                alt="User avatar"
              />
              <div className="ml-4 mb-2">
                {user.isArtisan ? (
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    🎨 Nghệ nhân
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    🛒 Khách hàng
                  </span>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="pt-20">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                  <p className="text-gray-600">{user.username}</p>
                  <p className="mt-2 text-gray-600">{user.bio}</p>
                </div>
                {!user.isArtisan && (
                  <button className="px-4 py-2 bg-[#5e3a1e] text-white rounded-md hover:bg-[#7a4b28] transition text-sm">
                    Đăng ký Nghệ nhân
                  </button>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Thông tin liên hệ</h2>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Địa chỉ: {user.location}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h2>
                <p className="text-gray-600">{user.joinDate}</p>
                {user.isArtisan ? (
                  <p className="text-gray-600">Sản phẩm: {user.products}</p>
                ) : (
                  <p className="text-gray-600">Đơn hàng: {user.orders}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-4">
              <button className="px-4 py-2 bg-[#5e3a1e] text-white rounded-md hover:bg-[#7a4b28] transition">
                Chỉnh sửa hồ sơ
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
                {user.isArtisan ? "Nhắn tin" : "Theo dõi"}
              </button>
            </div>

            {/* Tabs for Additional Sections */}
            <div className="mt-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button className="border-b-2 border-[#5e3a1e] px-1 pb-2 text-sm font-medium text-[#5e3a1e]">
                    {user.isArtisan ? "Sản phẩm" : "Đơn hàng"}
                  </button>
                  <button className="border-b-2 border-transparent px-1 pb-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    Đánh giá
                  </button>
                  <button className="border-b-2 border-transparent px-1 pb-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    {user.isArtisan ? "Khách hàng" : "Yêu thích"}
                  </button>
                  {user.isArtisan && (
                    <button className="border-b-2 border-transparent px-1 pb-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                      Doanh thu
                    </button>
                  )}
                </nav>
              </div>

              {/* Tab Content Placeholder */}
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                {user.isArtisan ? (
                  <p className="text-gray-600">Danh sách sản phẩm sẽ hiển thị ở đây</p>
                ) : (
                  <p className="text-gray-600">Lịch sử đơn hàng sẽ hiển thị ở đây</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}