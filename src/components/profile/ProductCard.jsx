import React, { useState } from "react";
import { FaHeart, FaEye, FaShoppingCart, FaStar, FaRegStar } from "react-icons/fa";

export default function ProductCard({ product }) {
  const role = localStorage.getItem("role");
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isOutOfStock = product.quantity <= 0;
  const isInactive = product.status === "InActive";
  const discountPercentage = product.discountPercentage || 0;
  const hasDiscount = discountPercentage > 0;
  const discountedPrice = hasDiscount 
    ? product.price * (1 - discountPercentage / 100) 
    : product.price;

  return (
    <div 
      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-white transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className="relative h-56 bg-gray-100">
          <img
            src={product.productImages?.[0]?.imageUrl}
            alt={product.name || "Ảnh sản phẩm"}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = "/default-product-image.jpg";
            }}
            crossOrigin="anonymous"
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="animate-pulse rounded-full h-12 w-12 bg-gray-300"></div>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
              -{discountPercentage}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
              MỚI
            </span>
          )}
        </div>
        
        {/* Overlay for inactive or out of stock */}
        {(isInactive || isOutOfStock) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${isInactive ? 'bg-red-600 text-white' : 'bg-white text-gray-800'}`}>
              {isInactive ? 'ĐÃ ẨN' : 'HẾT HÀNG'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h4 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
          {product.name}
        </h4>
        
        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-center">
            {hasDiscount ? (
              <>
                <p className="text-red-600 font-bold text-lg">
                  {discountedPrice.toLocaleString()} VND
                </p>
                <p className="text-gray-400 line-through text-sm ml-2">
                  {product.price.toLocaleString()} VND
                </p>
              </>
            ) : (
              <p className="text-[#5e3a1e] font-bold text-lg">
                {product.price?.toLocaleString() || "0"} VND
              </p>
            )}
          </div>

          {role !== "User" && (
            <div className="mt-3 pt-3 border-t border-gray-100 text-sm space-y-1">
              <p className="text-gray-600 flex justify-between">
                <span>Tồn kho:</span>
                <span className="font-medium">{product.quantity || 0}</span>
              </p>
              <p className="text-gray-600 flex justify-between">
                <span>Đã bán:</span>
                <span className="font-medium">{product.quantitySold || 0}</span>
              </p>
              <p className="text-gray-600 flex justify-between">
                <span>Trạng thái:</span>
                <span className={`font-medium ${
                  product.status === "Active" ? "text-green-600" : 
                  product.status === "Inactive" ? "text-red-600" : "text-gray-600"
                }`}>
                  {product.status === "Active" ? "Đang bán" : 
                   product.status === "Inactive" ? "Đã ẩn" : "Ngừng bán"}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}