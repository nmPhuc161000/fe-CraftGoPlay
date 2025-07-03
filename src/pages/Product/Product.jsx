import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import DropdownSection from "./components/DropdownSection";
import categoryService from "../../services/apis/cateApi";
import productService from "../../services/apis/productApi"

const Product = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isArtistOpen, setIsArtistOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const location = useLocation();
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedArtisan, setSelectedArtisan] = useState("");
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    if (location.state?.openCategory) {
      setIsCategoryOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res?.data?.data || []);
      } catch (err) {
        console.error("Lỗi khi fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // load products
  const fetchProducts = async () => {
    try {
      const res = await productService.searchProducts({
        search: searchTerm,
        pageIndex: 1,
        pageSize: 20,
        from: 0,
        to: 1000000,
        sortOrder,
        subCategoryName: selectedSubCategories.join(","),
        artisanName: selectedArtisan,
      });
      setProducts(res?.data?.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    console.log("subCategories đã chọn:", selectedSubCategories);
  }, [searchTerm, sortOrder, selectedSubCategories, selectedArtisan]);


  const formatVND = (number) => {
    return number?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "";
  };

  const filteredProducts = products.filter((product) => {
    const matchesSubCategory =
      selectedSubCategories.length === 0 ||
      selectedSubCategories.includes(product.subCategoryName);

    const matchesArtisan =
      !selectedArtisan || product.artisanName === selectedArtisan;

    return matchesSubCategory && matchesArtisan;
  });

  return (
    <MainLayout>
      {/* Danh sách sản phẩm */}
      <div className="w-full px-12 py-15 text-[#5e3a1e]">

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
                items={categories.map((cate) => ({
                  label: cate.categoryName,
                  children: (cate.subCategories || []).map((sub) => ({
                    label: sub.subName,
                    value: sub.subName,
                  })),
                }))}
                expandable={true}
                onSelect={(subName) => {
                  setSelectedSubCategories([subName]);
                  setSelectedArtisan("");
                }}
                onParentSelect={(subNames) => {
                  setSelectedSubCategories(subNames);
                  setSelectedArtisan("");
                }}
              />

              <DropdownSection
                title="Nghệ nhân"
                isOpen={isArtistOpen}
                toggle={() => setIsArtistOpen(!isArtistOpen)}
                items={[
                  { label: "Nguyễn Văn A", value: "Nguyễn Văn A" },
                  { label: "Trần Thị B", value: "Trần Thị B" },
                  { label: "Phạm Văn C", value: "Phạm Văn C" },
                ]}
                onSelect={(name) => {
                  setSelectedArtisan(name);
                  setSelectedSubCategory("");
                }}
              />

              <div className="mt-6">
                <label htmlFor="sort" className="block text-sm font-medium mb-2">
                  Sắp xếp theo
                </label>
                <select
                  id="sort"
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#5e3a1e]"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">Mặc định</option>
                  <option value="asc">Giá tăng dần</option>
                  <option value="desc">Giá giảm dần</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="w-[82%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="w-full max-w-sm bg-white shadow rounded-lg overflow-hidden relative text-center mx-auto transition-transform duration-300 hover:scale-105 hover:shadow-lg"
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

      </div>
    </MainLayout>
  );
};

export default Product;
