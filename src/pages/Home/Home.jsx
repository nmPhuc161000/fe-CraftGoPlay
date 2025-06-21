import React, { useEffect, useState } from "react";
//import { homeApi } from "../../services";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import loginImg from "../../assets/images/background1.jpg";

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   homeApi.getProducts().then((res) => setProducts(res.data));
  // }, []);

  useEffect(() => {
    // Fake API tạm
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

  const categories = [
    {
      name: "Tre",
      image:
        "https://i.vnbusiness.vn/2020/08/26/may-tre-2476-1598430768_860x0.jpg",
      description: "Bộ cờ vua thủ công cao cấp, thiết kế tinh xảo.",
    },
    {
      name: "Mây",
      image:
        "https://vungdecor.com/wp-content/uploads/2023/08/do-thu-cong-my-nghe3.png",
      description: "Cờ tướng truyền thống với chất liệu gỗ bền vững.",
    },
    {
      name: "Gốm sứ",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqj6shKMOGiRR5Y1noawJEa1CuE3PnXPwyPw&s",
      description: "Bộ domino độc đáo với màu sắc bắt mắt.",
    },
  ];

  return (
    <MainLayout>
      <div className="w-full mt-0">
        <div className="w-full h-180 relative">
          <img
            src={loginImg}
            alt="Header Banner"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* san pham noi bat */}
      <div className="w-full px-12 py-20">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 flex-col lg:flex-row">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-5xl font-bold text-[#5e3a1e]">
              Sản phẩm nổi bật
            </h2>
            <p className="text-[#5e3a1e] mt-2 max-w-2xl">
              Khám phá những sản phẩm board games được yêu thích nhất, nổi tiếng
              với thiết kế tinh tế, chế tác thủ công và chất liệu bền vững.
              Maztermind mang đến một trải nghiệm chơi cao cấp, khác biệt.
            </p>
          </div>
          <div>
            <a
              href="/products"
              className="text-sm text-[#5e3a1e] hover:no-underline font-bold inline-flex items-center"
            >
              Xem tất cả
              <span className="ml-1">➜</span>
            </a>
          </div>
        </div>
      </div>

      <div className="w-full px-0 py-4">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
            {products.map((product, index) => (
              <div
                key={index}
                onClick={() => navigate(`/product/${product.id}`)}
                className="w-full max-w-sm bg-white shadow rounded-lg overflow-hidden relative text-center mx-auto transition-transform duration-300 hover:scale-105 hover:shadow-lg"
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

      {/* loai san pham*/}
      <div className="w-full px-12 py-20">
        <div className="flex justify-between items-center mb-6 flex-col lg:flex-row">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-5xl font-bold text-[#5e3a1e]">Loại sản phẩm</h2>
          </div>
          <div>
            <a
              href="/products"
              className="text-sm text-[#5e3a1e] hover:no-underline font-bold inline-flex items-center"
            >
              Xem tất cả
              <span className="ml-1">➜</span>
            </a>
          </div>
        </div>
        <div className="w-full px-0 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold text-[#5e3a1e]">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mt-2">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*ve craftgoplay*/}
      <div className="w-full px-12 py-5 mb-20">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-[#5e3a1e] mb-6">
            Về Craftgoplay
          </h2>
          <p className="text-[#5e3a1e] text-lg max-w-2xl mx-auto mb-8">
            CRAFTGOPLAY là nền tảng mua bán trực tuyến, kết nối các nghệ nhân
            thủ công với người dùng yêu thích board game. Mỗi sản phẩm là một
            tác phẩm thủ công tinh xảo, kết hợp nghệ thuật truyền thống và thiết
            kế hiện đại, mang đến trải nghiệm chơi độc đáo và ý nghĩa cho mọi
            gia đình.
          </p>
          <a
            href="/about"
            className="text-sm text-[#5e3a1e] hover:no-underline font-bold inline-flex items-center border border-[#5e3a1e] px-4 py-2 rounded-md hover:bg-[#5e3a1e] hover:text-white transition-colors duration-300"
          >
            Tìm hiểu thêm
            <span className="ml-1">➜</span>
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
