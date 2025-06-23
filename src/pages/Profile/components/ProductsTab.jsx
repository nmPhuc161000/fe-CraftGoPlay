import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProductsTab({ artisanId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // Lấy danh sách sản phẩm
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        // Giả lập API call
        setTimeout(() => {
          if (isMounted) {
            setProducts([
              {
                id: 1,
                name: "Tranh thêu tay Hạ Long",
                price: 1200000,
                image:
                  "https://i.pinimg.com/originals/a8/ed/06/a8ed06111498d09daa5d3931a3c1db8d.jpg",
                stock: 5,
                sold: 12,
                status: "active",
              },
              {
                id: 2,
                name: "Gốm Bát Tràng",
                price: 850000,
                image:
                  "https://static-images.vnncdn.net/files/publish/2023/5/18/w-z4355000189193-d7e2441483d443e8f8575221260c40a1-3-830.jpg",
                stock: 5,
                sold: 8,
                status: "active",
              },
              {
                id: 3,
                name: "Tranh đông hồ",
                price: 120000,
                image:
                  "https://th.bing.com/th/id/OIP.tgpteL8lE6GN66AH4hdLJAHaFW?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
                stock: 0,
                sold: 5,
                status: "out_of_stock",
              },
              {
                id: 4,
                name: "Tranh đông hồ",
                price: 120000,
                image:
                  "https://th.bing.com/th/id/OIP.tgpteL8lE6GN66AH4hdLJAHaFW?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
                stock: 0,
                sold: 5,
                status: "out_of_stock",
              },
            ]);
            setLoading(false);
          }
        }, 800);
      } catch (error) {
        if (isMounted) {
          setLoading(false);
          console.error("Lỗi khi tải sản phẩm:", error);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [artisanId]);

  // Xử lý xóa sản phẩm
  const handleDelete = (productId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      // Gọi API xóa thực tế ở đây
    }
  };

  // Lọc sản phẩm theo trạng thái
  const filteredProducts = products.filter((product) => {
    if (filter === "out_of_stock") return product.stock <= 0;
    if (filter === "active") return product.stock > 0;
    return true;
  });

  if (loading)
    return <div className="text-center py-8">Đang tải sản phẩm...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-xl font-bold text-[#5e3a1e]">Sản phẩm của tôi</h3>

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
            Đang bán ({products.filter((p) => p.stock > 0).length})
          </button>
          <button
            onClick={() => setFilter("out_of_stock")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "out_of_stock"
                ? "bg-[#5e3a1e] text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Hết hàng ({products.filter((p) => p.stock <= 0).length})
          </button>

          <Link
            to="/products/new"
            className="px-4 py-1 bg-[#5e3a1e] text-white rounded hover:bg-[#7a4b28] text-sm"
          >
            + Thêm sản phẩm
          </Link>
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
          {filter === "active" && (
            <Link
              to="/products/new"
              className="mt-4 inline-block px-4 py-2 bg-[#5e3a1e] text-white rounded hover:bg-[#7a4b28] text-sm"
            >
              Đăng sản phẩm mới
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
              onEdit={() => navigate(`/products/edit/${product.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onDelete, onEdit }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {product.status === "out_of_stock" && (
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
          {product.price.toLocaleString()} VND
        </p>
        <div className="mt-2 text-sm space-y-1">
          <p className="text-gray-600">Tồn kho: {product.stock}</p>
          <p className="text-gray-600">Đã bán: {product.sold}</p>
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
