import React, { useState, useEffect } from "react";

const FAKE_CATEGORIES = [
  { id: 1, name: "Đồ gia dụng", desc: "Các sản phẩm gia dụng thủ công" },
  { id: 2, name: "Đồ trang trí", desc: "Sản phẩm trang trí nhà cửa" },
  { id: 3, name: "Đèn lồng", desc: "Các loại đèn lồng thủ công" },
  // ... thêm danh mục giả nếu muốn
];

const ManageCategory = () => {
  // Khôi phục dữ liệu từ localStorage hoặc sử dụng fake data ban đầu
  const getInitialData = () => {
    const savedData = localStorage.getItem('staff_categories');
    return savedData ? JSON.parse(savedData) : FAKE_CATEGORIES;
  };

  const [data, setData] = useState(getInitialData);
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

  // Lưu dữ liệu vào localStorage mỗi khi data thay đổi
  useEffect(() => {
    localStorage.setItem('staff_categories', JSON.stringify(data));
  }, [data]);

  const filtered = data.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
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
        const maxId = prev.length > 0 ? Math.max(...prev.map(item => item.id)) : 0;
        const newItem = { id: maxId + 1, ...form };
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
  const handleDelete = () => {
    setData(prev => prev.filter(c => c.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="bg-amber-25 rounded-2xl shadow p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="font-bold text-xl">Category List</div>
          <div className="text-sm font-medium text-gray-700 mt-1">Search by name</div>
          <div className="mt-1 flex w-full max-w-xs border rounded overflow-hidden bg-white">
            <input className="flex-1 px-2 py-1.5 text-sm outline-none bg-transparent" placeholder="input search text" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <button className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm font-semibold hover:bg-gray-50 flex items-center gap-2" onClick={openAdd}>
          + New Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold rounded-tl-lg">ID</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Name</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Description</th>
              <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, idx) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="px-3 py-2">{row.id}</td>
                <td className="px-3 py-2 font-semibold">{row.name}</td>
                <td className="px-3 py-2">{row.desc}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button className="text-green-500 hover:underline" onClick={() => openView((currentPage-1)*pageSize+idx)}>View</button>
                  <button className="text-blue-500 hover:underline" onClick={() => openEdit((currentPage-1)*pageSize+idx)}>Edit</button>
                  <button className="text-red-500 hover:underline" onClick={() => openDelete(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>{(filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1)} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}</span>
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
            <div className="text-xl font-bold mb-4">{editIdx === null ? 'Create Category' : 'Edit Category'}</div>
            <form className="space-y-4" onSubmit={handleAddEdit}>
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input type="text" className="w-full border rounded px-3 py-2" placeholder="Enter name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea className="w-full border rounded px-3 py-2 resize-none" rows={2} placeholder="Enter description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
              </div>
              {formError && <div className="text-red-500 text-sm font-medium mt-1">{formError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100" onClick={() => { setShowModal(false); setForm({ name: "", desc: "" }); setEditIdx(null); }}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700">
                  Submit
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
                <div><span className="font-semibold">Name:</span> {data[viewIdx].name}</div>
                <div><span className="font-semibold">Description:</span> {data[viewIdx].desc}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategory; 