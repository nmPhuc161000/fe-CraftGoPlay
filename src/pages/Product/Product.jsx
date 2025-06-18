import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";

const Product = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  useEffect(() => {
    // Giả lập dữ liệu sản phẩm
    const fakeProducts = [
      {
        id: 1,
        name: "Majestic Mahjong Set",
        image:
          "https://kinhtevadubao.vn/stores/news_dataimages/kinhtevadubaovn/082018/09/22/hang-thu-cong-voi-suc-hut-rieng-cua-no-13-.1314.jpg",
        price: 13990000,
        originalPrice: null,
        tag: null,
      },
      {
        id: 2,
        name: "Colorburst Wooden Domino Set",
        image:
          "https://kinhtevadubao.vn/stores/news_dataimages/kinhtevadubaovn/082018/09/22/hang-thu-cong-voi-suc-hut-rieng-cua-no-13-.1314.jpg",
        price: 1079000,
        originalPrice: null,
        tag: "Pre-order",
      },
      {
        id: 3,
        name: "Nomad_The Portable Chess Set",
        image:
          "https://kinhtevadubao.vn/stores/news_dataimages/kinhtevadubaovn/082018/09/22/hang-thu-cong-voi-suc-hut-rieng-cua-no-13-.1314.jpg",
        price: 3440000,
        originalPrice: 4300000,
        tag: "20% OFF",
      },
      {
        id: 4,
        name: "Nomad_The Portable Chess Set",
        image:
          "https://kinhtevadubao.vn/stores/news_dataimages/kinhtevadubaovn/082018/09/22/hang-thu-cong-voi-suc-hut-rieng-cua-no-13-.1314.jpg",
        price: 3440000,
        originalPrice: 4300000,
        tag: "20% OFF",
      },
    ];
    setProducts(fakeProducts);
  }, []);

  const formatVND = (number) => {
    return number.toLocaleString("vi-VN") + "₫";
  };

  return (
    <MainLayout>
      {/* Danh sách sản phẩm */}
      <div className="w-full px-12 py-15 text-[#5e3a1e]">

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.447.832l-4 2.5A1 1 0 019 21.5V13.414L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
            <span className="font-semibold text-lg">Bộ lọc</span>
          </div>

          {/* Sắp xếp (bên phải cuối dòng) */}
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm font-medium">
              Sắp xếp:
            </label>
            <select
              id="sort"
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#5e3a1e]"
            >
              <option value="default">Mặc định</option>
              <option value="name-asc">Theo tên</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* sidebar */}
          <div className="w-1/4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="border-t border-gray-300 my-3" />

              <div
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="font-bold text-base">Sản phẩm</span>
                <div
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f3e7db] text-[#5e3a1e] hover:bg-[#e4cdb5] 
             transition-colors duration-300"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* sidebar danh sách sản phẩm */}
              {isDropdownOpen && (
                <ul className="pl-2 mt-2 space-y-2">
                  <li className="cursor-pointer hover:text-[#5e3a1e]">
                    Tất cả
                  </li>
                  <li className="cursor-pointer hover:text-[#5e3a1e]">
                    Board Game
                  </li>
                  <li className="cursor-pointer hover:text-[#5e3a1e]">
                    Domino
                  </li>
                  <li className="cursor-pointer hover:text-[#5e3a1e]">
                    Cờ vua
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* danh sach san pham */}
          <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white shadow rounded-lg overflow-hidden relative text-center cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                {product.tag && (
                  <span
                    className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded shadow 
                    ${
                      product.tag === "Pre-order"
                        ? "bg-yellow-400 text-black"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {product.tag}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <div className="mt-2 text-base">
                    <span className="text-red-600 font-semibold">
                      {formatVND(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 line-through text-gray-500">
                        {formatVND(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Product;
