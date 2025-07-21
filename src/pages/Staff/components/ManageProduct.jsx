import React, { useState, useEffect } from "react";
import { MdVisibility, MdShoppingBag } from 'react-icons/md';
import productService from "../../../services/apis/productApi";
import { motion } from "framer-motion";

const ManageProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusProduct, setStatusProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getProducts();

        // Kiểm tra response từ apiUtils
        if (!response?.success) {
          console.error('API Error:', response?.error);
          setError(response?.error || 'Lỗi kết nối API. Vui lòng kiểm tra cấu hình server.');
          setData([]);
          return;
        }

        // Kiểm tra và xử lý dữ liệu an toàn
        const responseData = response?.data?.data || [];
        if (Array.isArray(responseData)) {
          const transformedData = responseData.map(product => ({
            id: product?.id || 'N/A',
            name: product?.name || 'N/A',
            artisan: product?.artisanName || 'N/A',
            artisanId: product?.artisan_id || 'N/A',
            price: product?.price || 0,
            category: product?.subCategoryName || 'N/A',
            status: (product?.status || '').toLowerCase() === 'active' ? 'active' : 'inactive',
            image: product?.productImages?.[0]?.imageUrl || "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg",
            description: product?.description || "N/A",
            createdAt: product?.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            views: 0,
            orders: product?.quantitySold || 0
          }));
          setData(transformedData);
        } else {
          console.error('Invalid response data format:', responseData);
          setError('Dữ liệu API không đúng định dạng.');
          setData([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Xử lý tìm kiếm an toàn
  const filtered = data.filter(p => {
    const searchLower = (search || '').toLowerCase();
    const nameMatch = p?.name?.toLowerCase()?.includes(searchLower) || false;
    const artisanMatch = p?.artisan?.toLowerCase()?.includes(searchLower) || false;
    const categoryMatch = p?.category?.toLowerCase()?.includes(searchLower) || false;
    return nameMatch || artisanMatch || categoryMatch;
  });

  const totalPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openView = (product) => {
    if (product) {
      setViewProduct(product);
      setShowViewModal(true);
    }
  };

  const openStatusChange = (product) => {
    if (product) {
      setStatusProduct(product);
      setShowStatusModal(true);
    }
  };
  

  const handleStatusChange = async () => {
    if (statusProduct?.id) {
      // Giữ lại toàn bộ field, chỉ chỉnh status
      const updatedStatus = statusProduct.status === 'active' ? 'inactive' : 'active';
      // Tạo FormData từ product hiện tại
      const formData = new FormData();
      Object.entries(statusProduct).forEach(([key, value]) => {
        // Nếu là status thì cập nhật, còn lại giữ nguyên
        if (key === 'status') {
          formData.append('status', updatedStatus);
        } else {
          formData.append(key, value);
        }
      });

      try {
        // Gọi API để update product
        await productService.updateProduct(formData);
        // Cập nhật lại state local
        setData(prev => prev.map(item =>
          item.id === statusProduct.id
            ? { ...item, status: updatedStatus }
            : item
        ));
      } catch (error) {
        console.error('Error updating product status:', error);
      } finally {
        setShowStatusModal(false);
        setStatusProduct(null);
      }
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-6 w-full"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-6 w-full"
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xl font-bold text-gray-900 mb-2">Lỗi tải dữ liệu</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#8b5e3c] to-[#c7903f] text-white rounded-lg hover:shadow-lg"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý sản phẩm thợ thủ công</h1>
          <div className="relative">
            <input
              className="w-full md:max-w-xs pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Tìm kiếm theo tên, thợ thủ công hoặc danh mục..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#8b5e3c] to-[#c7903f]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">STT</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Hình ảnh</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tên sản phẩm</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Thợ thủ công</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Danh mục</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Giá</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Lượt xem/Đơn hàng</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paged.map((row, idx) => (
              <motion.tr
                key={row?.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={row?.image || "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg"}
                    alt={row?.name || 'Product'}
                    className="w-14 h-14 object-cover rounded-lg shadow"
                    onError={(e) => {
                      e.target.src = "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg";
                    }}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{row?.name || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium">{row?.artisan || 'N/A'}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row?.category || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-blue-700 font-bold">
                  {typeof row?.price === 'number' ? row.price.toLocaleString() : '0'}đ
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row?.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {row?.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-amber-600">
                      <MdVisibility className="text-lg" />
                      <span>{row?.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <MdShoppingBag className="text-lg" />
                      <span>{row?.orders || 0}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-green-600 hover:text-green-800"
                      onClick={() => openView(row)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`${row?.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                        }`}
                      onClick={() => openStatusChange(row)}
                    >
                      {row?.status === 'active' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          {(filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1)} đến {Math.min(currentPage * pageSize, filtered.length)} trên tổng số {filtered.length}
        </span>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <span className="px-4 py-2 rounded-lg bg-blue-50 font-medium text-blue-600">{currentPage}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === totalPage || totalPage === 0}
            onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Modal View Product */}
      {showViewModal && viewProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-30"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative"
          >
            {/* Header with sticky position */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Chi tiết sản phẩm</h2>
                  <div className="mt-1 text-sm text-gray-500">
                    Ngày tạo: {new Date(viewProduct?.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => {
                    setShowViewModal(false);
                    setViewProduct(null);
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Image and Stats */}
                <div className="lg:col-span-1">
                  <div className="sticky top-4 space-y-6">
                    {/* Image */}
                    <div className="relative group rounded-xl overflow-hidden">
                      <motion.img
                        whileHover={{ scale: 1.02 }}
                        src={viewProduct?.image || "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg"}
                        alt={viewProduct?.name || 'Product'}
                        className="w-full aspect-square object-cover shadow-lg transition-transform"
                        onError={(e) => {
                          e.target.src = "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <MdVisibility className="text-2xl text-amber-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-800">{viewProduct?.views || 0}</div>
                          <div className="text-sm text-gray-500">Lượt xem</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <MdShoppingBag className="text-2xl text-blue-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-800">{viewProduct?.orders || 0}</div>
                          <div className="text-sm text-gray-500">Đơn hàng</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details and Description */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Basic Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                      <div className="text-sm text-blue-600 font-medium mb-1">Tên sản phẩm</div>
                      <div className="text-xl font-bold text-gray-900">{viewProduct?.name || 'N/A'}</div>
                    </div>

                    {/* Price */}
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
                      <div className="text-sm text-amber-600 font-medium mb-1">Giá bán</div>
                      <div className="text-xl font-bold text-blue-700">
                        {typeof viewProduct?.price === 'number' ? viewProduct.price.toLocaleString() : '0'}đ
                      </div>
                    </div>

                    {/* Artisan Info */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                      <div className="text-sm text-purple-600 font-medium mb-1">Thông tin thợ thủ công</div>
                      <div className="text-xl font-bold text-gray-900">{viewProduct?.artisan || 'N/A'}</div>
                    </div>

                    {/* Category */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                      <div className="text-sm text-green-600 font-medium mb-1">Danh mục</div>
                      <div className="text-xl font-bold text-gray-900">{viewProduct?.category || 'N/A'}</div>
                    </div>
                  </div>
                  {/* Status Badge */}
                  <div className="text-left">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${viewProduct?.status === 'active'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${viewProduct?.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                      {viewProduct?.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </div>

                  {/* Description Section */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                      <h3 className="text-lg font-semibold text-gray-900">Mô tả sản phẩm</h3>
                    </div>
                    <div className="p-6">
                      <div className="prose prose-sm max-w-none">
                        {viewProduct?.description ? (
                          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {viewProduct.description}
                          </div>
                        ) : (
                          <div className="text-gray-500 italic">Chưa có mô tả cho sản phẩm này</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Confirm Status Change */}
      {showStatusModal && statusProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4">
                {statusProduct.status === 'active' ? (
                  <svg className="w-full h-full text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-full h-full text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {statusProduct.status === 'active' ? 'Ngừng hoạt động sản phẩm?' : 'Kích hoạt sản phẩm?'}
              </h3>
              <p className="text-gray-500">
                Bạn có chắc chắn muốn {statusProduct.status === 'active' ? 'ngừng hoạt động' : 'kích hoạt'} sản phẩm này?
              </p>

              <div className="flex justify-center gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusProduct(null);
                  }}
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2 text-white rounded-lg ${statusProduct.status === 'active'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                    }`}
                  onClick={handleStatusChange}
                >
                  Xác nhận
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageProduct; 