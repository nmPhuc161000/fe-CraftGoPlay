import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import DropdownSection from "./components/DropdownSection";

const Product = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [isProductOpen, setIsProductOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isArtistOpen, setIsArtistOpen] = useState(false);

  const location = useLocation();
  useEffect(() => {
    if (location.state?.openCategory) {
      setIsCategoryOpen(true);
    }
  }, [location.state]);


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
      {
        id: 5,
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

        <div className="flex justify-end mb-4">
          {/* sap xep ben phai */}
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


        <div className="flex gap-6 px-4 sm:px-6 lg:px-0">
          {/* Sidebar */}
          <div className="w-[18%] min-w-[180px]">
            <div className="bg-white shadow-md rounded-lg p-4 sticky top-20">
              {/* icon */}
              <div className="flex items-center mb-3">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
              <div className="border-t border-gray-300 my-3" />

              {/* danh muc loai sp */}

              <DropdownSection
                title="Loại sản phẩm"
                isOpen={isCategoryOpen}
                toggle={() => setIsCategoryOpen(!isCategoryOpen)}
                items={[
                  {
                    label: "Đồ chơi",
                    children: ["Bộ cờ", "Xếp hình"],
                  },
                  {
                    label: "Trang trí",
                    children: ["Đèn", "Tượng"],
                  },
                ]}
                expandable={true}
              />

              <DropdownSection
                title="Nghệ nhân"
                isOpen={isArtistOpen}
                toggle={() => setIsArtistOpen(!isArtistOpen)}
                items={["Nguyễn Văn A", "Trần Thị B", "Phạm Văn C"]}
              />
            </div>
          </div>


          {/* Danh sách sản phẩm */}
          <div className="w-[82%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="w-full max-w-sm bg-white shadow rounded-lg overflow-hidden relative text-center mx-auto transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                >
                  {product.tag && (
                    <span
                      className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded shadow 
              ${product.tag === "Pre-order" ? "bg-yellow-400 text-black" : "bg-red-600 text-white"}`}
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

      </div>
    </MainLayout>
  );
};

export default Product;
