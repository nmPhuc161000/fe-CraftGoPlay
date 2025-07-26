import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import subCategoryService from "../../../services/apis/subCateApi";
import categoryService from "../../../services/apis/cateApi";
import { toast } from 'react-toastify';
import SubCategoryTable from "./SubCategoryTable";
import SubCategoryModal from "./SubCategoryModal";
import SubCategoryViewModal from "./SubCategoryViewModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import artisanRequestService from "../../../services/apis/artisanrequestApi";

const ManageSubCategory = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [artisanRequests, setArtisanRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({
    subName: "",
    image: "",
    status: "Actived",
    categoryId: "" // Khởi tạo là string rỗng
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formError, setFormError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewIdx, setViewIdx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 10;

  // Fetch categories data with better error handling
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        const apiData = response.data.data || response.data;
        const categories = Array.isArray(apiData) ? apiData : [];
        setCategories(categories);
      } else {
        console.error("Failed to load categories:", response.error);
        setFormError("Không thể tải danh sách danh mục");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setFormError("Không thể tải danh sách danh mục");
    }
  };


  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subCategoryService.getAllSubCategories();
      console.log("Full API Response:", response); // Log toàn bộ response
      if (response.success && response.data) {
        const apiData = response.data.data || response.data;
        console.log("API Data:", apiData); // Log dữ liệu thô
        const subCategories = Array.isArray(apiData) ? apiData.map(sc => ({
          ...sc,
          categoryId: sc.category?.id || sc.categoryId
        })) : [];
        setData(subCategories);
        toast.success("Đã tải danh sách danh mục con");
      } else {
        const errorMessage = response.error || "Có lỗi xảy ra khi tải danh sách danh mục con";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || "Không thể kết nối đến server";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const getCategoryNameById = (categoryId) => {
    if (!categoryId) return "Chưa có";
    const category = categories.find(cat => cat.categoryId === categoryId);
    console.log(categories)
    return category ? category.categoryName : "Chưa có";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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

  const filtered = Array.isArray(data)
    ? data.filter(c => c?.subName?.toLowerCase().includes(search.toLowerCase()))
    : [];
  const totalPage = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset form with safeguards
  const resetForm = () => {
    if (categories.length > 0) {
      setForm({
        subName: "",
        image: "",
        status: "Actived",
        categoryId: categories[0]?.id || ""
      });
      console.log("Form reset with categoryId:", categories[0]?.id);
    } else {
      setForm({
        subName: "",
        image: "",
        status: "Actived",
        categoryId: ""
      });
      console.log("Form reset without categoryId (no categories available)");
    }
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
    console.log(subcategory)
    setForm({
      subName: subcategory.subName,
      image: subcategory.image,
      status: subcategory.status,
      categoryId: subcategory.categoryId
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

  // Handle form submission with proper categoryId handling
  const handleAddEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const formData = new FormData();

      console.log("Current form state:", form);
      console.log("Selected categoryId:", form.categoryId);

      formData.append("SubName", form.subName.trim());
      formData.append("Status", form.status);

      let categoryId = form.categoryId;
      if (!categoryId || categoryId === "") {
        throw new Error("Vui lòng chọn danh mục cha");
      }
      categoryId = categoryId.toString(); // Đảm bảo là chuỗi
      formData.append("CategoryId", categoryId);

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key + ":", value);
      }

      if (imageFile) {
        formData.append("Image", imageFile);
      } else if (form.image) {
        formData.append("Image", form.image);
      }

      let response;
      if (editIdx === null) {
        response = await subCategoryService.createSubCategory(formData);
        console.log("Create response:", response); // Log toàn bộ response
        if (response.success) {
          toast.success("Thêm danh mục con thành công!");
          await fetchSubCategories();
          setShowModal(false);
          resetForm();
        } else {
          throw new Error(response.error || "Có lỗi xảy ra khi thêm danh mục con");
        }
      } else {
        response = await subCategoryService.updateSubCategory(filtered[editIdx].subId, formData);
        console.log("Update response:", response); // Log toàn bộ response
        if (response.success) {
          toast.success("Cập nhật danh mục con thành công!");
          await fetchSubCategories();
          setShowModal(false);
          resetForm();
          setEditIdx(null);
        } else {
          throw new Error(response.error || "Có lỗi xảy ra khi cập nhật danh mục con");
        }
      }
    } catch (error) {
      console.error("Error in handleAddEdit:", error.response?.data || error);
      let errorMessage = error.response?.data && typeof error.response.data === 'object'
        ? Object.entries(error.response.data).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ')
        : error.message || "Có lỗi xảy ra khi xử lý yêu cầu";
      setFormError(errorMessage);
      toast.error(errorMessage);
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
        toast.success("Xóa danh mục con thành công!");
        await fetchSubCategories();
        setShowDeleteModal(false);
        setDeleteId(null);
      } else {
        throw new Error(response.error || "Xóa thất bại!");
      }
    } catch (error) {
      const errorMessage = error.message || "Lỗi khi xóa danh mục con";
      toast.error(errorMessage);
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
          className="px-6 py-2.5 bg-gradient-to-r from-[#8b5e3c] to-[#c7903f] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          onClick={openAdd}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Thêm danh mục con</span>
        </motion.button>
      </div>

      <SubCategoryTable
        paged={paged}
        currentPage={currentPage}
        pageSize={pageSize}
        filtered={filtered}
        totalPage={totalPage}
        getCategoryNameById={getCategoryNameById}
        openView={openView}
        openEdit={openEdit}
        openDelete={openDelete}
        setCurrentPage={setCurrentPage}
      />

      <SubCategoryModal
        showModal={showModal}
        setShowModal={setShowModal}
        editIdx={editIdx}
        setEditIdx={setEditIdx}
        form={form}
        setForm={setForm}
        categories={categories}
        imagePreview={imagePreview}
        handleImageChange={handleImageChange}
        imageFile={imageFile}
        setImageFile={setImageFile}
        setImagePreview={setImagePreview}
        formError={formError}
        setFormError={setFormError}
        handleAddEdit={handleAddEdit}
        loading={loading}
      />

      <SubCategoryViewModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        viewIdx={viewIdx}
        setViewIdx={setViewIdx}
        filtered={filtered}
        getCategoryNameById={getCategoryNameById}
      />

      <DeleteConfirmModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDelete={handleDelete}
        loading={loading}
      />
    </motion.div>
  );
};

export default ManageSubCategory;