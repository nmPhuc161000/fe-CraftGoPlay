import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import subCategoryService from "../../../services/apis/subCateApi";
import categoryService from "../../../services/apis/cateApi";

const ManageSubCategory = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({
    subName: "",
    image: "",
    status: "Actived",
    categoryId: categories[0]?.id || ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formError, setFormError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewIdx, setViewIdx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories data
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        const apiData = response.data.data || response.data;
        const categories = Array.isArray(apiData) ? apiData : [];
        console.log('Categories from API:', categories); // Debug log
        setCategories(categories);
        // Set initial categoryId if categories exist
        if (categories.length > 0) {
          const firstCategoryId = categories[0].categoryId;
          console.log('First category ID:', firstCategoryId); // Debug log
          setForm(prev => ({
            ...prev,
            categoryId: firstCategoryId
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories data
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subCategoryService.getAllSubCategories();
      
      if (response.success && response.data) {
        const apiData = response.data.data || response.data;
        const subCategories = Array.isArray(apiData) ? apiData.map(sc => ({
          ...sc,
          categoryId: sc.category?.id || sc.categoryId // Ensure we use the correct categoryId
        })) : [];
        setData(subCategories);
      } else {
        setError(response.error || "Có lỗi xảy ra khi tải danh sách danh mục con");
      }
    } catch (error) {
      setError(error.message || "Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  // Get category name by ID
  const getCategoryNameById = (categoryId) => {
    if (!categoryId) return "Chưa có";
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : "Chưa có";
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setFormError("Kích thước hình ảnh không được vượt quá 5MB!");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFormError("Vui lòng chọn file hình ảnh!");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Đảm bảo data là một mảng trước khi filter
  const filtered = Array.isArray(data) 
    ? data.filter(c => c?.subName?.toLowerCase().includes(search.toLowerCase()))
    : [];
  const totalPage = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetForm = () => {
    setForm({
      subName: "",
      image: "",
      status: "Actived",
      categoryId: categories[0]?.id || ""
    });
    setImageFile(null);
    setImagePreview("");
    setFormError("");
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = idx => {
    const subcategory = filtered[idx];
    setForm({
      subName: subcategory.subName,
      image: subcategory.image,
      status: subcategory.status,
      categoryId: typeof subcategory.categoryId === 'string' ? parseInt(subcategory.categoryId) : subcategory.categoryId
    });
    setImagePreview(subcategory.image);
    setEditIdx(idx);
    setShowModal(true);
  };

  const openView = idx => {
    const actualIndex = (currentPage - 1) * pageSize + idx;
    if (actualIndex >= 0 && actualIndex < filtered.length) {
      setViewIdx(actualIndex);
      setShowViewModal(true);
    }
  };

  const validateForm = () => {
    if (!form.subName.trim()) {
      setFormError("Vui lòng nhập tên danh mục con");
      return false;
    }

    if (!form.categoryId) {
      setFormError("Vui lòng chọn danh mục cha");
      return false;
    }

    if (!imageFile && !form.image) {
      setFormError("Vui lòng chọn hình ảnh cho danh mục con");
      return false;
    }

    setFormError("");
    return true;
  };

  const handleAddEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Debug logs
      console.log('Form state before submission:', form);
      console.log('Selected categoryId:', form.categoryId);
      
      // Ensure proper field names and values
      formData.append("SubName", form.subName.trim());
      formData.append("Status", form.status);
      
      // Validate and append CategoryId
      if (!form.categoryId && form.categoryId !== 0) {
        setFormError("Vui lòng chọn danh mục");
        setLoading(false);
        return;
      }
      
      // Ensure categoryId is a valid number
      let categoryIdNumber;
      if (typeof form.categoryId === 'string') {
        categoryIdNumber = parseInt(form.categoryId, 10);
      } else {
        categoryIdNumber = form.categoryId;
      }
      
      if (isNaN(categoryIdNumber)) {
        setFormError("CategoryId không hợp lệ");
        setLoading(false);
        return;
      }
      
      formData.append("CategoryId", categoryIdNumber);
      
      // Debug log FormData
      console.log('FormData after appending:', {
        SubName: formData.get('SubName'),
        Status: formData.get('Status'),
        CategoryId: formData.get('CategoryId')
      });
      
      if (imageFile) {
        formData.append("Image", imageFile);
      } else if (form.image) {
        formData.append("Image", form.image);
      }

      if (editIdx === null) {
        // Thêm mới
        const response = await subCategoryService.createSubCategory(formData);
        if (response.success) {
          await fetchSubCategories();
          setShowModal(false);
          resetForm();
        } else {
          setFormError(response.error || "Có lỗi xảy ra khi thêm danh mục con");
        }
      } else {
        // Cập nhật
        const response = await subCategoryService.updateSubCategory(filtered[editIdx].subId, formData);
        if (response.success) {
          await fetchSubCategories();
          setShowModal(false);
          resetForm();
          setEditIdx(null);
        } else {
          setFormError(response.error || "Có lỗi xảy ra khi cập nhật danh mục con");
        }
      }
    } catch (error) {
      console.error('Form data being sent:', {
        subName: form.subName,
        status: form.status,
        categoryId: form.categoryId,
        hasImage: !!imageFile || !!form.image
      });
      
      // Handle error object properly
      let errorMessage = "Không thể kết nối đến server";
      if (error.response?.data) {
        // Handle structured error response
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          errorMessage = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setFormError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openDelete = id => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await subCategoryService.deleteSubCategory(deleteId);
      if (response.success) {
        await fetchSubCategories();
        setShowDeleteModal(false);
        setDeleteId(null);
      } else {
        alert(response.error || "Xóa thất bại!");
      }
    } catch (error) {
      alert("Lỗi khi xóa!");
      console.error("Lỗi khi xóa danh mục con:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && data.length === 0) {
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
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold mb-2">Đã có lỗi xảy ra</p>
            <p>{error}</p>
            <button 
              onClick={fetchSubCategories}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý danh mục con</h1>
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
                      onClick={() => openDelete(row.subId)}
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

      {/* Add/Edit Modal */}
      {showModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editIdx === null ? 'Thêm danh mục con mới' : 'Chỉnh sửa danh mục con'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {editIdx === null 
                      ? 'Điền thông tin để tạo danh mục con mới' 
                      : 'Cập nhật thông tin danh mục con'}
                  </p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => {
                    setShowModal(false);
                    setEditIdx(null);
                    setForm({ 
                      subName: "", 
                      image: "",
                      status: "Actived",
                      categoryId: categories[0]?.id || "" 
                    });
                    setImageFile(null);
                    setImagePreview("");
                    setFormError("");
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleAddEdit} className="space-y-6">
                {/* Parent Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục cha
                  </label>
                  <select
                    value={form.categoryId || ''}
                    onChange={e => {
                      const value = e.target.value;
                      // Chuyển đổi giá trị sang số
                      const selectedId = value ? Number(value) : '';
                      console.log('Giá trị thô:', value);
                      console.log('CategoryId đã chọn:', selectedId);
                      setForm(prev => ({
                        ...prev,
                        categoryId: selectedId
                      }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    required
                  >
                    <option value="" key="default">Chọn danh mục cha</option>
                    {categories.map((category) => (
                      <option key={`category-${category.categoryId}`} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên danh mục con
                  </label>
                  <input
                    type="text"
                    value={form.subName}
                    onChange={e => setForm({ ...form, subName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Nhập tên danh mục con..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh danh mục con
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preview */}
                    <div className="relative group rounded-xl overflow-hidden bg-gray-50 aspect-square flex items-center justify-center border-2 border-dashed border-gray-300">
                      {imagePreview ? (
                        <motion.img
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="mt-1 text-sm text-gray-500">Chưa có ảnh</p>
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex flex-col justify-center space-y-4">
                      <motion.label
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer"
                      >
                        <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 transition-all text-center">
                          <div className="text-blue-600 font-medium">Tải ảnh lên</div>
                          <p className="mt-1 text-sm text-blue-500">Định dạng: JPG, PNG (Tối đa 5MB)</p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </div>
                      </motion.label>

                      {imageFile && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                        >
                          Xóa ảnh
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {formError && (
                  <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">
                    {typeof formError === 'string' ? formError : 'Đã có lỗi xảy ra'}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => {
                      setShowModal(false);
                      setEditIdx(null);
                      setForm({ 
                        subName: "", 
                        image: "",
                        status: "Actived",
                        categoryId: categories[0]?.id || "" 
                      });
                      setImageFile(null);
                      setImagePreview("");
                      setFormError("");
                    }}
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      <span>{editIdx === null ? 'Thêm danh mục con' : 'Cập nhật'}</span>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* View Modal */}
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
            {/* Header with sticky position */}
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

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Image */}
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

                  {/* Status Badge */}
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

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Subcategory Name */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                    <div className="text-sm text-blue-600 font-medium mb-1">Tên danh mục con</div>
                    <div className="text-xl font-bold text-gray-900">{filtered[viewIdx].subName}</div>
                  </div>

                  {/* Parent Category */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                    <div className="text-sm text-purple-600 font-medium mb-1">Danh mục cha</div>
                    <div className="text-xl font-bold text-gray-900">{getCategoryNameById(filtered[viewIdx].categoryId)}</div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
                    <div className="text-sm text-amber-600 font-medium mb-4">Thống kê</div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{filtered[viewIdx].totalProducts || 0}</div>
                        <div className="text-sm text-gray-500 mt-1">Sản phẩm</div>
                      </div>
                    </div>
                  </div>

                  {/* Creation Info */}
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

      {/* Delete Confirmation Modal */}
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
    </motion.div>
  );
};

export default ManageSubCategory; 