import React from "react";
import { FaHeart } from "react-icons/fa";

export default function ProductCard({ product }) {
  const role = localStorage.getItem("role");

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="relative">
        <img
          src={product.productImages?.[0]?.imageUrl}
          alt={product.name || "Ảnh sản phẩm"}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/default-product-image.jpg";
          }}
        />
        {product.quantity <= 0 && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent flex items-center justify-center">
            <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium border border-gray-200 shadow-sm">
              HẾT HÀNG
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow relative">
        <h4 className="font-semibold text-lg line-clamp-2">{product.name}</h4>
        <p className="text-[#5e3a1e] font-medium mt-1">
          {product.price?.toLocaleString() || "0"} VND
        </p>

        {role !== "User" && (
          <div className="mt-2 text-sm space-y-1">
            <p className="text-gray-600">Tồn kho: {product.quantity || 0}</p>
            <p className="text-gray-600">Đã bán: {product.soldQuantity || 0}</p>
            <p className="text-gray-600">
              Trạng thái:{" "}
              {product.status === "Active" ? "Đang bán" : "Ngừng bán"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
