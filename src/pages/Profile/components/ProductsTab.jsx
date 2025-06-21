import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductsTab({ artisanId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Tranh thêu tay Hạ Long', price: 1200000, image: 'https://via.placeholder.com/300', stock: 5 },
        { id: 2, name: 'Gốm Bát Tràng', price: 850000, image: 'https://via.placeholder.com/300', stock: 3 },
      ]);
      setLoading(false);
    }, 800);
  }, [artisanId]);

  if (loading) return <div className="text-center py-8">Đang tải sản phẩm...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#5e3a1e]">Sản phẩm của tôi</h3>
        <Link 
          to="/products/new" 
          className="px-4 py-2 bg-[#5e3a1e] text-white rounded hover:bg-[#7a4b28]"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Bạn chưa có sản phẩm nào</p>
          <Link 
            to="/products/new" 
            className="mt-4 inline-block px-4 py-2 bg-[#5e3a1e] text-white rounded hover:bg-[#7a4b28]"
          >
            Đăng sản phẩm đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h4 className="font-semibold text-lg">{product.name}</h4>
        <p className="text-[#5e3a1e] font-medium mt-1">{product.price.toLocaleString()} VND</p>
        <p className="text-gray-500 text-sm mt-1">Tồn kho: {product.stock}</p>
        <div className="mt-3 flex space-x-2">
          <button className="px-3 py-1 bg-amber-100 text-amber-800 rounded text-sm">
            Chỉnh sửa
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}