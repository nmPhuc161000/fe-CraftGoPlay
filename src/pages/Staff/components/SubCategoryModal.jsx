import React, { useRef } from "react";
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
    loading,
    dragActive,
    setDragActive
}) => {
    const inputRef = useRef(null);

    // Handle drag and drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
                setForm({ ...form, image: URL.createObjectURL(file) });
            } else {
                setFormError("Vui lòng chọn file ảnh (JPG, PNG)");
            }
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("");
        setForm({ ...form, image: "" });
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <>
            {showModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25"
                    style={{ background: "rgba(0, 0, 0, 0.5)" }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden relative"
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
mediaprop
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
                                    <div
                                        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragOver={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            ref={inputRef}
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="subcategory-image-upload"
                                        />
                                        {!imagePreview ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V8m0 0L3 12m4-4l4 4m6 4V8m0 0l-4 4m4-4l4 4" />
                                                </svg>
                                                <p className="text-sm text-gray-500">
                                                    Kéo và thả hình ảnh vào đây hoặc{' '}
                                                    <label
                                                        htmlFor="subcategory-image-upload"
                                                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    >
                                                        chọn từ máy tính
                                                    </label>
                                                </p>
                                                <p className="text-xs text-gray-400">Chỉ chấp nhận file JPG, PNG (tối đa 5MB)</p>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <motion.img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-h-48 mx-auto rounded-lg object-cover"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    crossorigin="anonymous"
                                                />
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    type="button"
                                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5"
                                                    onClick={handleRemoveImage}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                                            <span>{typeof formError === 'string' ? formError : 'Đã có lỗi xảy ra'}</span>
                                        </div>
                                    </motion.div>
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
                                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#8b5e3c] to-[#c7903f] hover:from-[#875d3d] hover:to-[#c78d37] text-white font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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