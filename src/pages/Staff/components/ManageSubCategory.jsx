import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const FAKE_SUBCATEGORIES = [
  { id: 1, name: "Bàn tre mini", desc: "Bàn nhỏ cho trẻ em", parent: "Đồ gia dụng" },
  { id: 2, name: "Đèn lồng đỏ", desc: "Đèn lồng màu đỏ", parent: "Đèn lồng" },
  { id: 3, name: "Bình hoa tre", desc: "Bình hoa thủ công", parent: "Đồ trang trí" },
];

// Lấy danh sách Category từ localStorage
const getCategoriesFromStorage = () => {
  try {
    const savedCategories = localStorage.getItem('staff_categories');
    if (savedCategories) {
      const categories = JSON.parse(savedCategories);
      return categories.map(cat => cat.name);
    }
  } catch (error) {
    console.error("Error reading categories from localStorage:", error);
  }
  // Fallback categories nếu chưa có dữ liệu hoặc có lỗi
  return ["Đồ gia dụng", "Đồ trang trí", "Đèn lồng"];
};

const ManageSubCategory = () => {
  // Khôi phục dữ liệu từ localStorage hoặc sử dụng fake data ban đầu
  const getInitialData = () => {
    try {
      const savedData = localStorage.getItem('staff_subcategories');
      return savedData ? JSON.parse(savedData) : FAKE_SUBCATEGORIES;
    } catch (error) {
      console.error("Error reading subcategories from localStorage:", error);
      return FAKE_SUBCATEGORIES;
    }
  };

  const [data, setData] = useState(getInitialData);
  const [categories, setCategories] = useState(getCategoriesFromStorage());
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({ name: "", desc: "", parent: categories[0] || "" });
  const [formError, setFormError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewIdx, setViewIdx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tắt loading sau khi component mount và data đã được load
    setLoading(false);
  }, []);

  // Cập nhật danh sách categories khi localStorage thay đổi
  useEffect(() => {
    const updateCategories = () => {
      const newCategories = getCategoriesFromStorage();
      setCategories(newCategories);
      // Cập nhật form parent nếu category hiện tại không còn tồn tại
      if (form.parent && !newCategories.includes(form.parent)) {
        setForm(prev => ({ ...prev, parent: newCategories[0] || "" }));
      }
    };

    // Lắng nghe sự kiện storage change
    const handleStorageChange = (e) => {
      if (e.key === 'staff_categories') {
        updateCategories();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cập nhật categories mỗi khi component mount hoặc khi cần
    updateCategories();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [form.parent]); // Thêm form.parent vào dependencies

  // Lưu dữ liệu vào localStorage mỗi khi data thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('staff_subcategories', JSON.stringify(data));
    } catch (error) {
      console.error("Error saving subcategories to localStorage:", error);
    }
  }, [data]);

  const filtered = data.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const totalPage = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openAdd = () => {
    setEditIdx(null);
    const currentCategories = getCategoriesFromStorage();
    setForm({ name: "", desc: "", parent: currentCategories[0] || "" });
    setShowModal(true);
    setFormError("");
  };

  const openEdit = idx => {
    const actualIndex = (currentPage - 1) * pageSize + idx;
    if (actualIndex >= 0 && actualIndex < filtered.length) {
      setEditIdx(actualIndex);
      setForm(filtered[actualIndex]);
      setShowModal(true);
      setFormError("");
    }
  };

  const openView = idx => {
    const actualIndex = (currentPage - 1) * pageSize + idx;
    if (actualIndex >= 0 && actualIndex < filtered.length) {
      setViewIdx(actualIndex);
      setShowViewModal(true);
    }
  };
  const handleAddEdit = e => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Tên danh mục con không được để trống!");
      return;
    }
    if (!form.desc || form.desc.length < 5) {
      setFormError("Mô tả phải từ 5 ký tự trở lên!");
      return;
    }
    if (editIdx === null) {
      // Tạo ID mới bằng cách tìm ID lớn nhất + 1
      setData(prev => {
        const maxId = prev.length > 0 ? Math.max(...prev.map(item => item.id)) : 0;
        const newItem = { id: maxId + 1, ...form };
        return [newItem, ...prev];
      });
    } else {
      setData(prev => prev.map((item, i) => i === editIdx ? { ...item, ...form } : item));
    }
    setShowModal(false);
    const currentCategories = getCategoriesFromStorage();
    setForm({ name: "", desc: "", parent: currentCategories[0] || "" });
    setEditIdx(null);
    setFormError("");
  };
  const openDelete = id => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const handleDelete = () => {
    setData(prev => prev.filter(c => c.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Danh sách danh mục con</h1>
          <div className="relative">
            <input 
              className="w-full md:max-w-xs pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Tìm kiếm danh mục con..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          onClick={openAdd}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Thêm danh mục con</span>
        </motion.button>
      </div>
      
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tên danh mục con</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Danh mục cha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Mô tả</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paged.map((row, idx) => (
              <motion.tr 
                key={row.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">{row.id}</td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{row.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.parent}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.desc}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
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
                      onClick={() => openDelete(row.id)}
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

      {/* Modal View SubCategory */}
      {showViewModal && viewIdx !== null && viewIdx < filtered.length && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowViewModal(false);
                setViewIdx(null);
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Chi tiết danh mục con</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">ID</div>
                  <div className="font-semibold mt-1">{filtered[viewIdx]?.id}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Tên danh mục con</div>
                  <div className="font-semibold mt-1">{filtered[viewIdx]?.name}</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Danh mục cha</div>
                  <div className="font-semibold mt-1">{filtered[viewIdx]?.parent}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Mô tả</div>
                  <div className="font-semibold mt-1">{filtered[viewIdx]?.desc}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Create/Edit SubCategory */}
      {showModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowModal(false);
                setEditIdx(null);
                setForm({ name: "", desc: "", parent: categories[0] || "" });
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-6">{editIdx === null ? 'Thêm danh mục con' : 'Sửa danh mục con'}</h2>
            
            <form className="space-y-6" onSubmit={handleAddEdit}>
              <div>
                <label className="block font-medium mb-2">Tên danh mục con</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Nhập tên danh mục con"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Danh mục cha</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={form.parent}
                  onChange={e => setForm(f => ({ ...f, parent: e.target.value }))}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block font-medium mb-2">Mô tả</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Nhập mô tả"
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                />
              </div>
              
              {formError && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formError}
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-8">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => {
                    setShowModal(false);
                    setEditIdx(null);
                    setForm({ name: "", desc: "", parent: categories[0] || "" });
                  }}
                >
                  Hủy
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg"
                >
                  {editIdx === null ? 'Thêm mới' : 'Cập nhật'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Confirm Delete */}
      {showDeleteModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25"
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
                  Xác nhận xóa
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageSubCategory; 