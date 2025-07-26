import React from "react";
import { motion } from "framer-motion";

const SubCategoryModal = ({
    showModal,
    setShowModal,
    editIdx,
    setEditIdx,
    form,
    setForm,
    categories,
    imagePreview,
    handleImageChange,
    imageFile,
    setImageFile,
    setImagePreview,
    formError,
    setFormError,
    handleAddEdit,
    loading
}) => {
    return (
        <>
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
                        <div className="p-8">
                            <form onSubmit={handleAddEdit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Danh mục cha
                                    </label>
                                    <div className="relative">
                                        <motion.div
                                            initial={{ boxShadow: "0 0 0 0 rgba(59,130,246,0)" }}
                                            whileFocus={{ boxShadow: "0 0 0 3px rgba(59,130,246,0.25)" }}
                                            whileHover={{ scale: 1.01, boxShadow: "0 2px 8px 0 rgba(59,130,246,0.10)" }}
                                            className="w-full"
                                        >
                                            <select
                                                value={form.categoryId}
                                                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white appearance-none text-gray-700 font-medium shadow-sm hover:border-blue-300"
                                            >
                                                <option value="" disabled>
                                                    -- Chọn danh mục cha --
                                                </option>
                                                {categories.map((cat) => (
                                                    <option key={cat.categoryId} value={cat.categoryId}>
                                                        {cat.categoryName}
                                                    </option>
                                                ))}
                                            </select>
                                            <motion.div
                                                initial={{ rotate: 0 }}
                                                animate={{ rotate: form.categoryId ? 180 : 0 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
                                            >
                                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                    {formError && typeof formError === 'string' && formError.toLowerCase().includes('danh mục') && (
                                        <p className="mt-1 text-sm text-red-600">{formError}</p>
                                    )}
                                </div>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hình ảnh danh mục con
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                {formError && (
                                    <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">
                                        {typeof formError === 'string' ? formError : 'Đã có lỗi xảy ra'}
                                    </div>
                                )}
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
        </>
    );
};

export default SubCategoryModal;