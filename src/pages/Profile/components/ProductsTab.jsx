import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import productService from "../../../services/apis/productApi";

export default function ProductsTab({ artisanId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [productStatus, setProductStatus] = useState("Active");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Lấy danh sách sản phẩm
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productService.getProductsByArtisanId(
          artisanId,
          pageIndex,
          pageSize,
          productStatus
        );
        console.log("Fetched products:", response.data.data);

        if (!response.success) {
          throw new Error(response.error || "Không thể tải sản phẩm");
        }

        if (isMounted) {
          setProducts(response.data.data || []);
          setTotalItems(response.data.totalItems || 0);
          setTotalPages(response.data.totalPages || 1);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setLoading(false);
          console.error("Lỗi khi tải sản phẩm:", error);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [artisanId, pageIndex, pageSize, productStatus]);

  // Xử lý xóa sản phẩm
  const handleDelete = async (productId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await productService.deleteProduct(productId);
        if (response.success) {
          setProducts((prev) => prev.filter((p) => p.id !== productId));
          setTotalItems((prev) => prev - 1);
        } else {
          alert(response.error || "Xóa sản phẩm thất bại");
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm");
      }
    }
  };

  // Lọc sản phẩm theo trạng thái
  const filteredProducts = products.filter((product) => {
    if (filter === "out_of_stock") return product.quantity <= 0;
    if (filter === "active") return product.quantity > 0;
    return true;
  });

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageIndex(newPage);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5e3a1e]"></div>
        <p className="mt-2">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-[#5e3a1e]">Sản phẩm của tôi</h3>
          {totalItems > 0 && (
            <span className="text-sm text-gray-500">
              ({totalItems} sản phẩm)
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "all"
                ? "bg-[#5e3a1e] text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Tất cả ({products.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "active"
                ? "bg-[#5e3a1e] text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Đang bán ({products.filter((p) => p.quantity > 0).length})
          </button>
          <button
            onClick={() => setFilter("out_of_stock")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "out_of_stock"
                ? "bg-[#5e3a1e] text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Hết hàng ({products.filter((p) => p.quantity <= 0).length})
          </button>

          <Link
            to="/profile-user/add-product"
            className="px-4 py-1 bg-[#5e3a1e] text-white rounded hover:bg-[#7a4b28] text-sm"
          >
            + Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Dropdown chọn trạng thái và số lượng mỗi trang */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="status" className="text-sm text-gray-600">
            Trạng thái:
          </label>
          <select
            id="status"
            value={productStatus}
            onChange={(e) => {
              setProductStatus(e.target.value);
              setPageIndex(1); // Reset về trang đầu khi thay đổi trạng thái
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="Active">Đang bán</option>
            <option value="Inactive">Ngừng bán</option>
            <option value="All">Tất cả</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            Số lượng/trang:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(1); // Reset về trang đầu khi thay đổi số lượng
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {filter === "all"
              ? "Bạn chưa có sản phẩm nào"
              : filter === "active"
              ? "Không có sản phẩm đang bán"
              : "Không có sản phẩm hết hàng"}
          </p>
          {filter !== "out_of_stock" && (
            <Link
              to="/profile-user/add-product"
              className="mt-4 inline-block px-4 py-2 bg-[#5e3a1e] text-white rounded hover:bg-[#7a4b28] text-sm"
            >
              Thêm sản phẩm mới
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link
                to={`/profile-user/products/${product.id}`}
                className="block"
                key={product.id}
              >
                <ProductCard
                  product={product}
                  onDelete={handleDelete}
                  onEdit={() =>
                    navigate(`/profile-user/products/edit/${product.id}`)
                  }
                />
              </Link>
            ))}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pageIndex === 1}
                  className={`px-3 py-1 rounded ${
                    pageIndex === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#5e3a1e] hover:bg-gray-100"
                  }`}
                >
                  «
                </button>
                <button
                  onClick={() => handlePageChange(pageIndex - 1)}
                  disabled={pageIndex === 1}
                  className={`px-3 py-1 rounded ${
                    pageIndex === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#5e3a1e] hover:bg-gray-100"
                  }`}
                >
                  ‹
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pageIndex <= 3) {
                    pageNum = i + 1;
                  } else if (pageIndex >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = pageIndex - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded ${
                        pageIndex === pageNum
                          ? "bg-[#5e3a1e] text-white"
                          : "text-[#5e3a1e] hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pageIndex + 1)}
                  disabled={pageIndex === totalPages}
                  className={`px-3 py-1 rounded ${
                    pageIndex === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#5e3a1e] hover:bg-gray-100"
                  }`}
                >
                  ›
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={pageIndex === totalPages}
                  className={`px-3 py-1 rounded ${
                    pageIndex === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#5e3a1e] hover:bg-gray-100"
                  }`}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProductCard({ product, onDelete, onEdit }) {
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
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent flex items-center justify-center">
            <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium border border-gray-200 shadow-sm">
              HẾT HÀNG
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow">
        <h4 className="font-semibold text-lg line-clamp-2">{product.name}</h4>
        <p className="text-[#5e3a1e] font-medium mt-1">
          {product.price?.toLocaleString() || "0"} VND
        </p>
        <div className="mt-2 text-sm space-y-1">
          <p className="text-gray-600">Tồn kho: {product.quantity || 0}</p>
          <p className="text-gray-600">Đã bán: {product.soldQuantity || 0}</p>
          <p className="text-gray-600">
            Trạng thái: {product.status === "Active" ? "Đang bán" : "Ngừng bán"}
          </p>
        </div>
      </div>

      <div className="p-4 border-t flex space-x-2">
        <button
          onClick={onEdit}
          className="flex-1 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 text-sm"
        >
          Chỉnh sửa
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex-1 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
