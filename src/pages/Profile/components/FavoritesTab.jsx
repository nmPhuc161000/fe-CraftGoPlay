import React from 'react';

export default function FavoritesTab({ userId }) {
  const favorites = [
    { id: 1, name: 'Tranh thêu tay Hạ Long', price: 1200000, artisan: 'Nghệ nhân A' },
    { id: 2, name: 'Gốm Bát Tràng', price: 850000, artisan: 'Nghệ nhân B' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#5e3a1e]">Sản phẩm yêu thích</h3>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Bạn chưa có sản phẩm yêu thích nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(item => (
            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-[#5e3a1e] font-medium mt-1">{item.price.toLocaleString()} VND</p>
              <p className="text-gray-500 text-sm mt-1">Nghệ nhân: {item.artisan}</p>
              <div className="mt-3 flex space-x-2">
                <button className="px-3 py-1 bg-[#5e3a1e] text-white rounded text-sm hover:bg-[#7a4b28]">
                  Mua ngay
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}