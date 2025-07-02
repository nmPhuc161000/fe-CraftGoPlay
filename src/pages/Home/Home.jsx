import React, { useEffect, useState, useRef } from "react";
//import { homeApi } from "../../services";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import loginImg from "../../assets/images/background2.png";
import categoryService from "../../services/apis/cateApi";
import productService from "../../services/apis/productApi";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const scrollToProductsRef = useRef(null);
  const location = useLocation();

  // useEffect(() => {
  //   const fakeProducts = Array.from({ length: 30 }, (_, i) => ({
  //     id: i + 1,
  //     name: `Sản phẩm thủ công ${i + 1}`,
  //     image:
  //       "https://kinhtevadubao.vn/stores/news_dataimages/kinhtevadubaovn/082018/09/22/hang-thu-cong-voi-suc-hut-rieng-cua-no-13-.1314.jpg",
  //     price: 1000000 + i * 100000,
  //     originalPrice: i % 3 === 0 ? 1200000 + i * 100000 : null,
  //     tag: i % 5 === 0 ? "Pre-order" : i % 4 === 0 ? "20% OFF" : null,
  //   }));

  //   setProducts(fakeProducts);
  // }, []);

  const formatVND = (number) => {
    return number?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "";
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.data?.data || []);
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await productService.getProducts();
      const data = res?.data?.data || [];
      console.log("Dữ liệu sản phẩm từ API:", data);
      setProducts(data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/" && window.location.hash) {
      navigate("/", { replace: true });
    }
  }, []);
  useEffect(() => {
    if (location.hash === "#products" && scrollToProductsRef.current) {
      setTimeout(() => {
        scrollToProductsRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  return (
    <MainLayout>
      <div className="w-full mt-0">
        <div className="w-full h-120 relative">
          <img
            src={loginImg}
            alt="Header Banner"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      <div className="w-full px-12 py-8 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[#5e3a1e]">
          {/* ô 1 */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition">
            <div>
              <h3 className="font-bold text-lg mb-1">CraftGoPlay</h3>
              <p className="text-sm">100% Hàng Thủ Công</p>
            </div>
            <img
              src="https://img.icons8.com/?size=100&id=36872&format=png&color=5e3a1e"
              alt="Craftgoplay"
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* ô 2 */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition">
            <div>
              <h3 className="font-bold text-lg mb-1">Voucher</h3>
              <p className="text-sm">Sử dụng ngay!</p>
            </div>
            <img
              src="https://img.icons8.com/?size=100&id=8851&format=png&color=5e3a1e"
              alt="Voucher"
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* ô 3 */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition">
            <div>
              <h3 className="font-bold text-lg mb-1">Trò chơi</h3>
              <p className="text-sm">Thu thập & tích lũy voucher!</p>
            </div>
            <img
              src="https://img.icons8.com/?size=100&id=GFDbOB2OqPWt&format=png&color=5e3a1e"
              alt="Top Up"
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </div>

      {/* loai san pham*/}
      <div className="w-full px-30 py-16">
        <h2 className="text-4xl font-bold text-[#5e3a1e] mb-4 text-center">
          Danh mục Loại sản phẩm
        </h2>
        <p className="text-center text-[#5e3a1e] max-w-3xl mx-auto mb-10 text-base md:text-lg">
          Khám phá các dòng sản phẩm thủ công đa dạng từ các nghệ nhân trên khắp
          Việt Nam — từ tre, mây, gốm sứ đến các chất liệu truyền thống khác.
          Mỗi sản phẩm đều mang dấu ấn văn hóa và sự tinh xảo trong từng chi
          tiết.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(
                  `/products?category=${encodeURIComponent(category.categoryName)}`
                )
              }
              className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md hover:scale-105 transition-transform cursor-pointer overflow-hidden"
            >
              <div className="w-full h-32">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.categoryName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    Không có ảnh
                  </div>
                )}
              </div>
              <div className="p-2 text-center">
                <span className="text-base font-medium text-[#5e3a1e] leading-tight block">
                  {category.categoryName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* san pham danh cho ban */}
      <div ref={scrollToProductsRef} id="products" className="w-full px-30">
        <div className="flex justify-between items-center mb-6 flex-col lg:flex-row">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-5xl font-bold text-[#5e3a1e]">
              Sản phẩm dành cho bạn
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

      <div className="w-full px-20 py-4">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 sm:px-6 lg:px-8">
            {products.map((product, index) => (
              <div
                key={index}
                onClick={() => navigate(`/product/${product.id}`)}
                className="w-full bg-white shadow rounded-lg overflow-hidden relative text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              >
                <img
                  src={product.productImages?.[0]?.imageUrl}
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

      {/*ve craftgoplay*/}
      <div className="w-full px-20 py-5 mb-20">
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
