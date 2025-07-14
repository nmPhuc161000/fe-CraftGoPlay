import React from "react";
import { motion } from "framer-motion";

const DeleteConfirmModal = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDelete,
  loading
}) => {
  return (
    <>
      {showDeleteModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4">
                <svg className="w-full h-full text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-gray-500">Bạn có chắc chắn muốn xóa danh mục con này? Hành động này không thể hoàn tác.</p>
              <div className="flex justify-center gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={handleDelete}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    'Xác nhận xóa'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default DeleteConfirmModal;