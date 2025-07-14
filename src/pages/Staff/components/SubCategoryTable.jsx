import React from "react";
import { motion } from "framer-motion";

const SubCategoryTable = ({
  paged,
  currentPage,
  pageSize,
  filtered,
  totalPage,
  getCategoryNameById,
  openView,
  openEdit,
  openDelete,
  setCurrentPage
}) => {
  return (
    <>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">STT</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Hình ảnh</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tên danh mục con</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Danh mục cha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ngày tạo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paged.map((row, idx) => (
              <motion.tr 
                key={row.subId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    src={row.image} 
                    alt={row.subName} 
                    className="w-12 h-12 object-cover rounded-lg shadow"
                    onError={(e) => {
                      e.target.src = "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg";
                    }}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{row.subName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{getCategoryNameById(row.categoryId)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    row.status?.toLowerCase() === 'actived' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {row.status?.toLowerCase() === 'actived' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                  {new Date(row.creationDate).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-green-600 hover:text-green-800" 
                      onClick={() => openView((currentPage-1)*pageSize+idx)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openEdit((currentPage-1)*pageSize+idx)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-600 hover:text-red-800"
                      onClick={() => openDelete( row.subId)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
    </>
  );
};

export default SubCategoryTable;