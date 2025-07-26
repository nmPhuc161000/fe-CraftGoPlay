import React, { useState, useEffect } from "react";
import categoryService from "../../../services/apis/cateApi";
import { motion } from "framer-motion";

const ManageCategory = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({
    categoryName: "",
    imageFile: null,
    image: "",
    categoryStatus: "Actived"
  });
  const [formError, setFormError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewIdx, setViewIdx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAllCategories();
      if (res.success && res.data && res.data.data) {
        setData(res.data.data);
        console.log(res.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = data.filter(c =>
    c.categoryName?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPage = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openAdd = () => {
    setEditIdx(null);
    setForm({
      categoryName: "",
      imageFile: null,
      image: "",
      categoryStatus: "Actived"
    });
    setShowModal(true);
    setFormError("");
  };

  const openEdit = idx => {
    const actualIndex = (currentPage - 1) * pageSize + idx;
    if (actualIndex >= 0 && actualIndex < filtered.length) {
      setEditIdx(actualIndex);
      const category = filtered[actualIndex];
      setForm({
        categoryName: category.categoryName || "",
        image: category.image || "",
        imageFile: null,
        categoryStatus: category.categoryStatus || "Actived"
      });
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

  const handleAddEdit = async (e) => {
    e.preventDefault();
    if (!form.categoryName?.trim()) {
      setFormError("Tên danh mục không được để trống!");
      return;
    }

    if (editIdx === null && !form.imageFile) {
      setFormError("Vui lòng chọn ảnh!");
      return;
    }

    try {
      setLoading(true);
      // Log form data trước khi gửi
      console.log("Form Data:", form);

      if (editIdx === null) {
        // Tạo mới
        const res = await categoryService.createCategory({
          categoryName: form.categoryName.trim(),
          imageFile: form.imageFile,
          categoryStatus: "Actived" // Luôn set Actived khi tạo mới
        });

        if (res.success) {
          await fetchCategories();
          setShowModal(false);
          setForm({
            categoryName: "",
            imageFile: null,
            image: "",
            categoryStatus: "Actived"
          });
        } else {
          // Xử lý hiển thị lỗi
          let errorMessage = "Thêm mới thất bại!";
          if (res.error) {
            if (typeof res.error === 'string') {
              errorMessage = res.error;
            } else if (typeof res.error === 'object') {
              errorMessage = Object.values(res.error).flat().join(", ");
            }
          }
          console.error("Create Error:", res.error);
          setFormError(errorMessage);
        }
      } else {
        // Cập nhật
        const category = filtered[editIdx];
        if (!category || !category.categoryId) {
          setFormError("Không tìm thấy thông tin danh mục!");
          return;
        }

        const res = await categoryService.updateCategory(category.categoryId, {
          categoryName: form.categoryName.trim(),
          imageFile: form.imageFile,
          image: form.image,
          categoryStatus: form.categoryStatus
        });

        if (res.success) {
          await fetchCategories();
          setShowModal(false);
          setForm({
            categoryName: "",
            imageFile: null,
            image: "",
            categoryStatus: "Actived"
          });
          setEditIdx(null);
        } else {
          let errorMessage = "Cập nhật thất bại!";
          if (res.error) {
            if (typeof res.error === 'string') {
              errorMessage = res.error;
            } else if (typeof res.error === 'object') {
              errorMessage = Object.values(res.error).flat().join(", ");
            }
          }
          console.error("Update Error:", res.error);
          setFormError(errorMessage);
        }
      }
    } catch (err) {
      console.error("Error in handleAddEdit:", err);
      setFormError(err?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý hiển thị trạng thái
  const getStatusDisplay = (status) => {
    return status === "Actived" ? "Đang hoạt động" : "Ngừng hoạt động";
  };

  // Hàm xử lý style cho status badge
  const getStatusStyle = (status) => {
    return status === "Actived"
      ? 'bg-green-50 text-green-600'
      : 'bg-red-50 text-red-600';
  };

  const handleDelete = async () => {
    if (!deleteId) {
      alert("Không tìm thấy thông tin danh mục cần xóa!");
      setShowDeleteModal(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Deleting category:", deleteId);

      const res = await categoryService.deleteCategory(deleteId);

      if (res.success) {
        await fetchCategories();
        setShowDeleteModal(false);
        setDeleteId(null);
      } else {
        let errorMessage = "Xóa thất bại!";
        if (res.error) {
          if (typeof res.error === 'string') {
            errorMessage = res.error;
          } else if (typeof res.error === 'object') {
            errorMessage = Object.values(res.error).flat().join(", ");
          }
        }
        console.error("Delete Error:", res.error);
        alert(errorMessage);
      }
    } catch (err) {
      console.error("Error in handleDelete:", err);
      alert(err?.message || "Có lỗi xảy ra khi xóa danh mục!");
    } finally {
      setLoading(false);
    }
  };

  const openDelete = (categoryId) => {
    if (!categoryId) {
      alert("Không tìm thấy thông tin danh mục!");
      return;
    }
    console.log("Opening delete modal for category:", categoryId);
    setDeleteId(categoryId);
    setShowDeleteModal(true);
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý danh mục</h1>
          <div className="relative">
            <input
              className="w-full md:max-w-xs pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Tìm kiếm danh mục..."
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
          className="px-6 py-2.5 bg-gradient-to-r from-[#8b5e3c] to-[#c7903f] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          onClick={openAdd}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Thêm danh mục</span>
        </motion.button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#8b5e3c] to-[#c7903f]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">STT</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Hình ảnh</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tên danh mục</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ngày tạo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paged.map((row, idx) => (
              <motion.tr
                key={row.categoryId}
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
                    alt={row.categoryName}
                    className="w-12 h-12 object-cover rounded-lg shadow"
                    onError={(e) => {
                      e.target.src = "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg";
                    }}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{row.categoryName}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.categoryStatus === "Actived"
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                    }`}>
                    {getStatusDisplay(row.categoryStatus)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                  {row.creationDate ? new Date(row.creationDate).toLocaleDateString() : ""}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-green-600 hover:text-green-800"
                      onClick={() => openView((currentPage - 1) * pageSize + idx)}
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
                      onClick={() => openEdit((currentPage - 1) * pageSize + idx)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-600 hover:text-red-800"
                      onClick={() => openDelete(row.categoryId)}
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
                    {editIdx === null ? 'Thêm danh mục mới' : 'Chỉnh sửa danh mục'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {editIdx === null
                      ? 'Điền thông tin để tạo danh mục mới'
                      : 'Cập nhật thông tin danh mục'}
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
                      categoryName: "",
                      imageFile: null,
                      image: "",
                      categoryStatus: "Actived"
                    });
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
                {/* Category Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    value={form.categoryName}
                    onChange={e => setForm({ ...form, categoryName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Nhập tên danh mục..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh danh mục
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preview */}
                    <div className="relative group rounded-xl overflow-hidden bg-gray-50 aspect-square flex items-center justify-center border-2 border-dashed border-gray-300">
                      {(form.imageFile || form.image) ? (
                        <motion.img
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          src={form.imageFile ? URL.createObjectURL(form.imageFile) : form.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg";
                          }}
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
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setForm({ ...form, imageFile: file });
                              }
                            }}
                          />
                        </div>
                      </motion.label>

                      {(form.imageFile || form.image) && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                          onClick={() => setForm({ ...form, imageFile: null, image: "" })}
                        >
                          Xóa ảnh
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-red-50 text-red-600 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formError}</span>
                    </div>
                  </motion.div>
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
                        categoryName: "",
                        imageFile: null,
                        image: "",
                        categoryStatus: "Actived"
                      });
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
                      <span>{editIdx === null ? 'Thêm danh mục' : 'Cập nhật'}</span>
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
                  <h2 className="text-2xl font-bold text-gray-900">Chi tiết danh mục</h2>
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
                      alt={filtered[viewIdx].categoryName}
                      className="w-full h-full object-cover shadow-lg transition-transform"
                      onError={(e) => {
                        e.target.src = "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Status Badge */}
                  <div className="text-center">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${filtered[viewIdx].categoryStatus === "Actived"
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                      }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${filtered[viewIdx].categoryStatus === "Actived" ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                      {getStatusDisplay(filtered[viewIdx].categoryStatus)}
                    </span>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Category Name */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                    <div className="text-sm text-blue-600 font-medium mb-1">Tên danh mục</div>
                    <div className="text-xl font-bold text-gray-900">{filtered[viewIdx].categoryName}</div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                    <div className="text-sm text-purple-600 font-medium mb-4">Thống kê</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{filtered[viewIdx].totalProducts || 0}</div>
                        <div className="text-sm text-gray-500 mt-1">Sản phẩm</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{filtered[viewIdx].totalSubCategories || 0}</div>
                        <div className="text-sm text-gray-500 mt-1">Danh mục con</div>
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

                  {/* Last Update */}
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
                    <div className="text-sm text-amber-600 font-medium mb-1">Cập nhật gần nhất</div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-500">Thời gian:</span>
                        <span className="ml-2 font-medium">
                          {filtered[viewIdx].lastModifiedDate
                            ? new Date(filtered[viewIdx].lastModifiedDate).toLocaleDateString('vi-VN')
                            : "Chưa có cập nhật"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Người cập nhật:</span>
                        <span className="ml-2 font-medium">{filtered[viewIdx].lastModifiedBy || "Chưa có"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              <p className="text-gray-500">Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.</p>

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

export default ManageCategory; 