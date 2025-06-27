import React, { useState } from "react";

// Fake data cho sản phẩm của Artisan
const FAKE_ARTISAN_PRODUCTS = [
  {
    id: 1,
    name: "Bình gốm sứ Bát Tràng",
    artisan: "Nguyễn Văn A",
    artisanId: "ART001",
    price: 1500000,
    category: "Gốm sứ",
    status: "active",
    image: "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg",
    description: "Bình gốm sứ truyền thống Bát Tràng, được làm thủ công với kỹ thuật nung truyền thống",
    createdAt: "2024-01-15",
    views: 245,
    orders: 12
  },
  {
    id: 2,
    name: "Tranh Đông Hồ - Gà trống",
    artisan: "Trần Thị B",
    artisanId: "ART002", 
    price: 850000,
    category: "Tranh dân gian",
    status: "inactive",
    image: "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg",
    description: "Tranh Đông Hồ truyền thống với hình ảnh gà trống, được in bằng kỹ thuật mộc bản",
    createdAt: "2024-01-10",
    views: 189,
    orders: 8
  },
  {
    id: 3,
    name: "Túi thổ cẩm Tây Nguyên",
    artisan: "Lê Văn C",
    artisanId: "ART003",
    price: 650000,
    category: "Thổ cẩm",
    status: "active",
    image: "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg",
    description: "Túi thổ cẩm được dệt thủ công với hoa văn truyền thống của người Tây Nguyên",
    createdAt: "2024-01-20",
    views: 312,
    orders: 15
  },
  {
    id: 4,
    name: "Đồng hồ tre nứa",
    artisan: "Phạm Thị D",
    artisanId: "ART004",
    price: 450000,
    category: "Tre nứa",
    status: "active",
    image: "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg",
    description: "Đồng hồ được đan bằng tre nứa với thiết kế độc đáo, thân thiện môi trường",
    createdAt: "2024-01-12",
    views: 178,
    orders: 6
  },
  {
    id: 5,
    name: "Bộ ấm chén gốm Chu Đậu",
    artisan: "Hoàng Văn E",
    artisanId: "ART005",
    price: 1200000,
    category: "Gốm sứ",
    status: "inactive",
    image: "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg",
    description: "Bộ ấm chén gốm Chu Đậu với hoa văn tinh xảo, được làm theo kỹ thuật truyền thống",
    createdAt: "2024-01-08",
    views: 156,
    orders: 4
  }
];

const ManageProduct = () => {
  const [data, setData] = useState(FAKE_ARTISAN_PRODUCTS);
  const [search, setSearch] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusProduct, setStatusProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = data.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.artisan.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  const totalPage = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openView = (product) => {
    setViewProduct(product);
    setShowViewModal(true);
  };

  const openStatusChange = (product) => {
    setStatusProduct(product);
    setShowStatusModal(true);
  };

  const handleStatusChange = () => {
    setData(prev => prev.map(item => 
      item.id === statusProduct.id 
        ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
        : item
    ));
    setShowStatusModal(false);
    setStatusProduct(null);
  };

  return (
    <div className="bg-amber-25 rounded-2xl shadow p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="font-bold text-xl">Artisan Products Management</div>
          <div className="text-sm font-medium text-gray-700 mt-1">Search by product name, artisan, or category</div>
          <div className="mt-1 flex w-full max-w-xs border rounded overflow-hidden bg-white">
            <input 
              className="flex-1 px-2 py-1.5 text-sm outline-none bg-transparent" 
              placeholder="input search text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold rounded-tl-lg">ID</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Image</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Product Name</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Artisan</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Category</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Price</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Status</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Views/Orders</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, idx) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="px-3 py-2">{row.id}</td>
                <td className="px-3 py-2">
                  <img src={row.image} alt={row.name} className="w-14 h-14 object-cover rounded border" />
                </td>
                <td className="px-3 py-2 font-semibold">{row.name}</td>
                <td className="px-3 py-2">
                  <div>
                    <div className="font-medium">{row.artisan}</div>
                    <div className="text-xs text-gray-500">ID: {row.artisanId}</div>
                  </div>
                </td>
                <td className="px-3 py-2">{row.category}</td>
                <td className="px-3 py-2 text-blue-700 font-bold">{row.price.toLocaleString()}đ</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {row.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs">
                  <div>👁 {row.views}</div>
                  <div>📦 {row.orders}</div>
                </td>
                <td className="px-3 py-2 flex gap-2">
                  <button 
                    className="text-green-500 hover:underline" 
                    onClick={() => openView(row)}
                  >
                    View
                  </button>
                  <button 
                    className={`hover:underline ${
                      row.status === 'active' ? 'text-red-500' : 'text-green-500'
                    }`}
                    onClick={() => openStatusChange(row)}
                  >
                    {row.status === 'active' ? 'Inactive' : 'Active'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>
          {(filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1)} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-2">
          <button 
            className="border rounded px-2 py-1" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            &lt;
          </button>
          <span className="border rounded px-2 py-1 bg-white">{currentPage}</span>
          <button 
            className="border rounded px-2 py-1" 
            disabled={currentPage === totalPage || totalPage === 0} 
            onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))}
          >
            &gt;
          </button>
          <select className="border rounded px-2 py-1 ml-2" value={pageSize} disabled>
            <option>10 / page</option>
          </select>
        </div>
      </div>

      {/* Modal xem chi tiết sản phẩm */}
      {showViewModal && viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative animate-fadeIn">
            <button 
              className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-600" 
              onClick={() => setShowViewModal(false)} 
              aria-label="Close"
            >
              ×
            </button>
            <div className="text-xl font-bold mb-4">Product Detail</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={viewProduct.image} 
                  alt={viewProduct.name} 
                  className="w-full h-64 object-cover rounded-lg border"
                />
              </div>
              <div className="space-y-3">
                <div><span className="font-semibold">Product Name:</span> {viewProduct.name}</div>
                <div><span className="font-semibold">Artisan:</span> {viewProduct.artisan} (ID: {viewProduct.artisanId})</div>
                <div><span className="font-semibold">Category:</span> {viewProduct.category}</div>
                <div><span className="font-semibold">Price:</span> {viewProduct.price.toLocaleString()}đ</div>
                <div><span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    viewProduct.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {viewProduct.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div><span className="font-semibold">Created:</span> {viewProduct.createdAt}</div>
                <div><span className="font-semibold">Views:</span> {viewProduct.views}</div>
                <div><span className="font-semibold">Orders:</span> {viewProduct.orders}</div>
                <div><span className="font-semibold">Description:</span> {viewProduct.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận thay đổi status */}
      {showStatusModal && statusProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 relative animate-fadeIn">
            <div className="text-lg font-bold mb-2 text-center">
              Xác nhận thay đổi trạng thái?
            </div>
            <div className="text-center mb-4 text-gray-600">
              Bạn có chắc chắn muốn {statusProduct.status === 'active' ? 'vô hiệu hóa' : 'kích hoạt'} sản phẩm "{statusProduct.name}"?
            </div>
            <div className="flex justify-center gap-3">
              <button 
                className="px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100" 
                onClick={() => setShowStatusModal(false)}
              >
                Hủy
              </button>
              <button 
                className={`px-4 py-2 rounded text-white font-semibold ${
                  statusProduct.status === 'active' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`} 
                onClick={handleStatusChange}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct; 