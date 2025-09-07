import React, { useEffect, useState, useRef } from "react";
//import { homeApi } from "../../services";
import { useNavigate, useLocation, Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import loginImg from "../../assets/images/background2.png";
import categoryService from "../../services/apis/cateApi";
import productService from "../../services/apis/productApi";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const scrollToProductsRef = useRef(null);
  const location = useLocation();

  const formatVND = (number) => {
    return (
      number?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) ||
      ""
    );
  };
  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.data?.data || []);
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await productService.getProductsByStatus({
        productStatus: "Active",
        pageIndex: page,
        pageSize: 50,
      });
      const productList = res.data?.data || [];
      const count = res.data?.count || 0;

      const filteredProducts = productList.filter(p => p.quantity > 0);

      setProducts(filteredProducts);

      setHasMorePages(count === 50);

      if (Array.isArray(filteredProducts)) {
        console.log(
          "Sản phẩm lấy về (trang",
          page,
          "):",
          filteredProducts.length,
          filteredProducts
        );
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(currentPage);
  }, [currentPage]);

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

  const handlePageChange = (direction) => {
    if (direction === "next" && hasMorePages && !loading) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && currentPage > 1 && !loading) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
    if (scrollToProductsRef.current) {
      scrollToProductsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <MainLayout>
      <div className="w-full mt-0">
        <div className="w-full h-120 relative">
          <img
            src={loginImg}
            alt="Header Banner"
            className="w-full h-full object-cover object-center"
            crossorigin="anonymous"
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
              crossorigin="anonymous"
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
              crossorigin="anonymous"
            />
          </div>

          {/* ô 3 */}
          <Link
            to="/game"
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div>
              <h3 className="font-bold text-lg mb-1">Trò chơi</h3>
              <p className="text-sm">Thu thập & tích lũy voucher!</p>
            </div>
            <img
              src="https://img.icons8.com/?size=100&id=GFDbOB2OqPWt&format=png&color=5e3a1e"
              alt="Top Up"
              className="w-16 h-16 object-contain"
              crossorigin="anonymous"
            />
          </Link>
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
          {categories.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              Không có danh mục sản phẩm nào.
            </div>
          ) : (
            categories.map((category, index) => (
              <div
                key={index}
                onClick={() =>
                  navigate(`/products?categoryId=${category.categoryId}`)
                }
                className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md hover:scale-105 transition-transform cursor-pointer overflow-hidden"
              >
                <div className="w-full h-32">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.categoryName}
                      className="w-full h-full object-cover"
                      crossorigin="anonymous"
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
            ))
          )}
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
              Khám phá những sản phẩm được yêu thích nhất, nổi tiếng với thiết
              kế tinh tế, chế tác thủ công và chất liệu bền vững. Crafgoplay
              mang đến một trải nghiệm cao cấp, khác biệt.
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
            {products.length === 0 && !loading ? (
              <div className="col-span-full text-center text-gray-500">
                Hiện chưa có sản phẩm nào.
              </div>
            ) : loading ? (
              <div className="col-span-full text-center text-gray-500">
                Đang tải sản phẩm...
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group w-full bg-white shadow rounded-lg overflow-hidden relative text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                >
                  <div className="relative w-full h-64">
                    <img
                      src={product.productImages[0].imageUrl}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                      crossorigin="anonymous"
                    />
                    <img
                      src={
                        product.productImages[1]?.imageUrl ||
                        product.productImages[0].imageUrl
                      }
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                      crossorigin="anonymous"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {product.name}
                    </h3>
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
              ))
            )}
          </div>

          {/* Phân trang */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1 || loading}
              className={`px-4 py-2 rounded-md ${currentPage === 1 || loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#5e3a1e] text-white hover:bg-[#4a2e15]"
                }`}
            >
              Trước
            </button>
            <span className="text-[#5e3a1e] font-semibold">
              Trang {currentPage}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={!hasMorePages || loading}
              className={`px-4 py-2 rounded-md ${!hasMorePages || loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#5e3a1e] text-white hover:bg-[#4a2e15]"
                }`}
            >
              Tiếp
            </button>
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
