import React from "react";
import { motion } from "framer-motion";

const SubCategoryViewModal = ({
  showViewModal,
  setShowViewModal,
  viewIdx,
  setViewIdx,
  filtered,
  getCategoryNameById
}) => {
  return (
    <>
      {showViewModal && viewIdx !== null && filtered[viewIdx] && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-30"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative"
          >
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Chi tiết danh mục con</h2>
                  <div className="mt-1 text-sm text-gray-500">
                    Ngày tạo: {filtered[viewIdx].creationDate ? new Date(filtered[viewIdx].creationDate).toLocaleDateString('vi-VN') : "Chưa có"}
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => {
                    setShowViewModal(false);
                    setViewIdx(null);
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="relative group rounded-xl overflow-hidden bg-gray-50 aspect-square flex items-center justify-center">
                    <motion.img 
                      whileHover={{ scale: 1.02 }}
                      src={filtered[viewIdx].image} 
                      alt={filtered[viewIdx].subName}
                      className="w-full h-full object-cover shadow-lg transition-transform"
                      onError={(e) => {
                        e.target.src = "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="text-center">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      filtered[viewIdx].status?.toLowerCase() === 'actived'
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        filtered[viewIdx].status?.toLowerCase() === 'actived' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {filtered[viewIdx].status?.toLowerCase() === 'actived' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                    <div className="text-sm text-blue-600 font-medium mb-1">Tên danh mục con</div>
                    <div className="text-xl font-bold text-gray-900">{filtered[viewIdx].subName}</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                    <div className="text-sm text-purple-600 font-medium mb-1">Danh mục cha</div>
                    <div className="text-xl font-bold text-gray-900">{getCategoryNameById(filtered[viewIdx].categoryId)}</div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
                    <div className="text-sm text-amber-600 font-medium mb-4">Thống kê</div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{filtered[viewIdx].totalProducts || 0}</div>
                        <div className="text-sm text-gray-500 mt-1">Sản phẩm</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                    <div className="text-sm text-green-600 font-medium mb-1">Thông tin tạo</div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-500">Ngày tạo:</span>
                        <span className="ml-2 font-medium">
                          {filtered[viewIdx].creationDate 
                            ? new Date(filtered[viewIdx].creationDate).toLocaleDateString('vi-VN')
                            : "Chưa có"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Người tạo:</span>
                        <span className="ml-2 font-medium">{filtered[viewIdx].createdBy || "Không có thông tin"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default SubCategoryViewModal;