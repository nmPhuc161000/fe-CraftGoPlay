import React, { useState, useEffect } from "react";
import categoryService from "../../../services/apis/cateApi";

const ManageCategory = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({ name: "", desc: "" });
  const [formError, setFormError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewIdx, setViewIdx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await categoryService.getAllCategories();
      if (res.success && res.data && res.data.data) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    };
    fetchCategories();
  }, []);

  const filtered = data.filter(c => c.categoryName.toLowerCase().includes(search.toLowerCase()));
  const totalPage = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openAdd = () => {
    setEditIdx(null);
    setForm({ name: "", desc: "" });
    setShowModal(true);
    setFormError("");
  };
  const openEdit = idx => {
    setEditIdx(idx);
    setForm(data[idx]);
    setShowModal(true);
    setFormError("");
  };
  const openView = idx => {
    setViewIdx(idx);
    setShowViewModal(true);
  };
  const handleAddEdit = e => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Tên danh mục không được để trống!");
      return;
    }
    if (!form.desc || form.desc.length < 5) {
      setFormError("Mô tả phải từ 5 ký tự trở lên!");
      return;
    }
    if (editIdx === null) {
      // Tạo ID mới bằng cách tìm ID lớn nhất + 1
      setData(prev => {
        const maxId = prev.length > 0 ? Math.max(...prev.map(item => item.categoryId)) : 0;
        const newItem = { categoryId: maxId + 1, ...form };
        return [newItem, ...prev];
      });
    } else {
      setData(prev => prev.map((item, i) => i === editIdx ? { ...item, ...form } : item));
    }
    setShowModal(false);
    setForm({ name: "", desc: "" });
    setEditIdx(null);
    setFormError("");
  };
  const openDelete = id => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const handleDelete = async () => {
    try {
      const res = await categoryService.deleteCategory(deleteId);
      if (res.success) {
        // Fetch lại danh sách
        const fetchRes = await categoryService.getAllCategories();
        if (fetchRes.success && fetchRes.data && fetchRes.data.data) {
          setData(fetchRes.data.data);
        }
        setShowDeleteModal(false);
        setDeleteId(null);
      } else {
        alert(res.error || "Xóa thất bại!");
      }
    } catch (err) {
      alert("Lỗi khi xóa!");
    }
  };

  return (
    <div className="bg-amber-25 rounded-2xl shadow p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="font-bold text-xl">Danh sách danh mục</div>
          <div className="text-sm font-medium text-gray-700 mt-1">Tìm kiếm theo tên</div>
          <div className="mt-1 flex w-full max-w-xs border rounded overflow-hidden bg-white">
            <input className="flex-1 px-2 py-1.5 text-sm outline-none bg-transparent" placeholder="Nhập từ khóa tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <button className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm font-semibold hover:bg-gray-50 flex items-center gap-2" onClick={openAdd}>
          + Thêm danh mục
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold rounded-tl-lg">STT</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Hình ảnh</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Tên danh mục</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Trạng thái</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Ngày tạo</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold rounded-tr-lg">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, idx) => (
              <tr key={row.categoryId} className="border-b last:border-0">
                <td className="px-3 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-3 py-2">
                  <img src={row.image} alt={row.categoryName} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="px-3 py-2 font-semibold">{row.categoryName}</td>
                <td className="px-3 py-2">{row.categoryStatus}</td>
                <td className="px-3 py-2">{row.creationDate ? new Date(row.creationDate).toLocaleDateString() : ""}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button className="text-green-500 hover:underline" onClick={() => openView((currentPage-1)*pageSize+idx)}>Xem</button>
                  <button className="text-blue-500 hover:underline" onClick={() => openEdit((currentPage-1)*pageSize+idx)}>Sửa</button>
                  <button className="text-red-500 hover:underline" onClick={() => openDelete(row.categoryId)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>{(filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1)} đến {Math.min(currentPage * pageSize, filtered.length)} trên tổng số {filtered.length}</span>
        <div className="flex items-center gap-2">
          <button className="border rounded px-2 py-1" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>&lt;</button>
          <span className="border rounded px-2 py-1 bg-white">{currentPage}</span>
          <button className="border rounded px-2 py-1" disabled={currentPage === totalPage || totalPage === 0} onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))}>&gt;</button>
          <select className="border rounded px-2 py-1 ml-2" value={pageSize} disabled>
            <option>10 / page</option>
          </select>
        </div>
      </div>
      {/* Modal Create/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
            <button className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-600" onClick={() => { setShowModal(false); setEditIdx(null); }} aria-label="Close">×</button>
            <div className="text-xl font-bold mb-4">{editIdx === null ? 'Thêm danh mục' : 'Sửa danh mục'}</div>
            
            
            <form className="space-y-4" onSubmit={async e => {
              e.preventDefault();
              if (!form.categoryName || !form.categoryName.trim()) {
                setFormError("Tên loại không được để trống!");
                return;
              }
              if (!form.imageFile) {
                setFormError("Vui lòng chọn ảnh!");
                return;
              }
              if (editIdx === null) {
                // Gọi API tạo mới category
                try {
                  const res = await categoryService.createCategory({
                    categoryName: form.categoryName,
                    imageFile: form.imageFile,
                    categoryStatus: "Actived"
                  });
                  if (res.success) {
                    // Fetch lại danh sách
                    const fetchRes = await categoryService.getAllCategories();
                    if (fetchRes.success && fetchRes.data && fetchRes.data.data) {
                      setData(fetchRes.data.data);
                    }
                    setShowModal(false);
                    setForm({ categoryName: "", image: "", imageFile: null });
                    setEditIdx(null);
                    setFormError("");
                  } else {
                    setFormError(res.error || "Thêm mới thất bại!");
                  }
                } catch (err) {
                  setFormError("Lỗi khi thêm mới!");
                }
              } else {
                // Edit local (nếu cần gọi API update thì bổ sung sau)
                setData(prev => prev.map((item, i) => i === editIdx ? { ...item, categoryName: form.categoryName, image: form.image } : item));
                setShowModal(false);
                setForm({ categoryName: "", image: "", imageFile: null });
                setEditIdx(null);
                setFormError("");
              }
            }}>
              <div>
                <label className="block font-medium mb-1">Tên loại</label>
                <input type="text" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Nhập tên loại" value={form.categoryName || ''} onChange={e => setForm({ ...form, categoryName: e.target.value })} />
              </div>
              <div>
                <label className="block font-medium mb-1">Hình ảnh</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer inline-block px-4 py-2 border border-gray-400 text-gray-800 rounded hover:bg-gray-100 transition font-medium shadow-sm">
                    Chọn ảnh
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        setForm(f => ({ ...f, imageFile: file }));
                        const reader = new FileReader();
                        reader.onload = ev => setForm(f => ({ ...f, image: ev.target.result }));
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                  {(form.image || form.imageFile) && (
                    <img src={form.image || (form.imageFile && URL.createObjectURL(form.imageFile))} alt="preview" className="w-12 h-12 object-cover rounded border" />
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">Chỉ chấp nhận ảnh PNG, JPG, JPEG. Dung lượng &lt; 2MB.</div>
                {form.imageFile && <div className="text-xs text-green-600 mt-1">{form.imageFile.name}</div>}
              </div>
              {formError && <div className="text-red-500 text-sm font-medium mt-1">{formError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100" onClick={() => { setShowModal(false); setForm({ categoryName: '', image: '', imageFile: null }); setEditIdx(null); }}>
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow">
                  Lưu
                </button>
              </div>
            </form>

            
          </div>
        </div>
      )}
      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 relative animate-fadeIn">
            <div className="text-lg font-bold mb-2 text-center">Xác nhận xóa danh mục?</div>
            <div className="text-center mb-4 text-gray-600">Bạn có chắc chắn muốn xóa danh mục này?</div>
            <div className="flex justify-center gap-3">
              <button className="px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100" onClick={() => setShowDeleteModal(false)}>Hủy</button>
              <button className="px-4 py-2 rounded text-white font-semibold bg-red-600 hover:bg-red-700" onClick={handleDelete}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal xem chi tiết */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
            <button className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-600" onClick={() => setShowViewModal(false)} aria-label="Close">×</button>
            <div className="text-xl font-bold mb-4">Category Detail</div>
            {viewIdx !== null && (
              <div className="space-y-3">
                <div><span className="font-semibold">Tên loại:</span> {data[viewIdx].categoryName}</div>
                <div><span className="font-semibold">Ảnh:</span><br/>{data[viewIdx].image && <img src={data[viewIdx].image} alt={data[viewIdx].categoryName} className="w-24 h-24 object-cover rounded mt-2" />}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategory; 