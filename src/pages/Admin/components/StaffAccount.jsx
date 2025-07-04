import React, { useState, useRef, useEffect } from "react";

const FAKE_DATA = [
  { id: 246, name: "Nguyen Hoang Le Minh", username: "staff001@gmail.com", email: "staff001@gmail.com", role: "Staff", status: "Active" },
  { id: 247, name: "Nguyen Ngoc Bao", username: "staff002@gmail.com", email: "staff002@gmail.com", role: "Staff", status: "Active" },
  { id: 248, name: "Nguyen Minh Phuc", username: "staff003@gmail.com", email: "staff003@gmail.com", role: "Staff", status: "Active" },
  { id: 249, name: "Ung Tuan Kiet", username: "staff004@gmail.com", email: "staff004@gmail.com", role: "Staff", status: "Active" },
  { id: 250, name: "Nguyen Thanh Tien", username: "staff005@gmail.com", email: "staff005@gmail.com", role: "Staff", status: "Active" },
  { id: 246, name: "Nguyen Hoang Le Minh", username: "staff001@gmail.com", email: "staff001@gmail.com", role: "Staff", status: "Active" },
  { id: 247, name: "Nguyen Ngoc Bao", username: "staff002@gmail.com", email: "staff002@gmail.com", role: "Staff", status: "Active" },
  { id: 248, name: "Nguyen Minh Phuc", username: "staff003@gmail.com", email: "staff003@gmail.com", role: "Staff", status: "Active" },
  { id: 249, name: "Ung Tuan Kiet", username: "staff004@gmail.com", email: "staff004@gmail.com", role: "Staff", status: "Active" },
  { id: 250, name: "Nguyen Thanh Tien", username: "staff005@gmail.com", email: "staff005@gmail.com", role: "Staff", status: "Active" },
  { id: 246, name: "Nguyen Hoang Le Minh", username: "staff001@gmail.com", email: "staff001@gmail.com", role: "Staff", status: "Active" },
  { id: 247, name: "Nguyen Ngoc Bao", username: "staff002@gmail.com", email: "staff002@gmail.com", role: "Staff", status: "Active" },
  { id: 248, name: "Nguyen Minh Phuc", username: "staff003@gmail.com", email: "staff003@gmail.com", role: "Staff", status: "Active" },
  { id: 249, name: "Ung Tuan Kiet", username: "staff004@gmail.com", email: "staff004@gmail.com", role: "Staff", status: "Active" },
  { id: 250, name: "Nguyen Thanh Tien", username: "staff005@gmail.com", email: "staff005@gmail.com", role: "Staff", status: "Active" },
  { id: 246, name: "Nguyen Hoang Le Minh", username: "staff001@gmail.com", email: "staff001@gmail.com", role: "Staff", status: "Active" },
  { id: 247, name: "Nguyen Ngoc Bao", username: "staff002@gmail.com", email: "staff002@gmail.com", role: "Staff", status: "Active" },
  { id: 248, name: "Nguyen Minh Phuc", username: "staff003@gmail.com", email: "staff003@gmail.com", role: "Staff", status: "Active" },
  { id: 249, name: "Ung Tuan Kiet", username: "staff004@gmail.com", email: "staff004@gmail.com", role: "Staff", status: "Active" },
  { id: 250, name: "Nguyen Thanh Tien", username: "staff005@gmail.com", email: "staff005@gmail.com", role: "Staff", status: "Active" },
];

const STATUS_COLOR = {
  Active: "bg-green-100 text-green-700 border border-green-200",
  Inactive: "bg-gray-100 text-gray-500 border border-gray-200",
};

const StaffAccount = () => {
  const [showModal, setShowModal] = useState(false);
  const [openActionIdx, setOpenActionIdx] = useState(null);
  const actionMenuRef = useRef(null);
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('adminStaffData');
    return savedData ? JSON.parse(savedData) : FAKE_DATA;
  });
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, idx: null, action: null });
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [formError, setFormError] = useState("");
  const actionBtnRefs = useRef([]);
  const [actionMenuPos, setActionMenuPos] = useState({ top: 0, left: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Lưu dữ liệu vào localStorage khi data thay đổi
  useEffect(() => {
    localStorage.setItem('adminStaffData', JSON.stringify(data));
  }, [data]);

  // Lọc dữ liệu theo search
  const filteredData = data.filter(row =>
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row.username.toLowerCase().includes(search.toLowerCase()) ||
    row.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPage = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setOpenActionIdx(null);
      }
    }
    if (openActionIdx !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionIdx]);

  // Xác nhận deactivate/active
  const handleDeactivate = (idx) => {
    setConfirmModal({ open: true, idx, action: 'deactive' });
  };
  const handleActive = (idx) => {
    setConfirmModal({ open: true, idx, action: 'active' });
  };
  const handleConfirm = () => {
    if (confirmModal.action === 'deactive') {
      setData(prev => prev.map((item, i) => i === confirmModal.idx ? { ...item, status: "Inactive" } : item));
    } else if (confirmModal.action === 'active') {
      setData(prev => prev.map((item, i) => i === confirmModal.idx ? { ...item, status: "Active" } : item));
    }
    setConfirmModal({ open: false, idx: null, action: null });
    setOpenActionIdx(null);
  };

  // Reset về trang 1 khi search thay đổi và đảm bảo currentPage không vượt quá totalPage
  useEffect(() => { 
    setCurrentPage(1); 
  }, [search]);

  // Đảm bảo currentPage không vượt quá totalPage
  useEffect(() => {
    if (currentPage > totalPage && totalPage > 0) {
      setCurrentPage(totalPage);
    }
  }, [totalPage, currentPage]);

  return (
    <div className="w-full">
      <div className="bg-amber-25 min-h-screen w-full py-6 px-2 sm:px-6">
        <div className="space-y-6 max-w-full">
          <div className="bg-amber-25 rounded-xl shadow p-4 overflow-x-auto">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-bold text-xl">Staff List</div>
                <div className="text-sm font-medium text-gray-700 mt-1">Search by related</div>
                <div className="mt-1 flex w-full max-w-xs border rounded overflow-hidden bg-white">
                  <input
                    className="flex-1 px-2 py-1.5 text-sm outline-none bg-transparent"
                    placeholder="input search text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button
                    className="px-2 flex items-center justify-center text-gray-500 hover:text-black"
                    onClick={e => { e.preventDefault(); }}
                    tabIndex={-1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm font-semibold hover:bg-gray-50 flex items-center gap-2"
                onClick={() => setShowModal(true)}
              >
                + New Staff
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold rounded-tl-lg">ID</th>
                    <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Full Name</th>
                    <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Username</th>
                    <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Email</th>
                    <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Role</th>
                    <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold">Status</th>
                    <th className="px-3 py-2 text-left bg-blue-600 text-white font-semibold rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((row, idx) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="px-3 py-2">{row.id}</td>
                      <td className="px-3 py-2">{row.name}</td>
                      <td className="px-3 py-2">{row.username}</td>
                      <td className="px-3 py-2">{row.email}</td>
                      <td className="px-3 py-2">
                        <span className="border border-blue-200 bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-semibold">{row.role}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLOR[row.status]}`}>{row.status}</span>
                      </td>
                      <td className="px-3 py-2 relative">
                        <button
                          ref={el => actionBtnRefs.current[idx] = el}
                          className="p-1 rounded hover:bg-gray-100"
                          onClick={e => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setActionMenuPos({ top: rect.bottom + window.scrollY, left: rect.right + window.scrollX });
                            setOpenActionIdx(openActionIdx === idx ? null : idx);
                          }}
                        >
                          ...
                        </button>
                        {openActionIdx === idx && (
                          <div
                            ref={actionMenuRef}
                            style={{ position: 'fixed', top: actionMenuPos.top, left: actionMenuPos.left, zIndex: 1000 }}
                            className="w-24 bg-white rounded-md shadow-lg animate-fadeIn p-0.5"
                          >
                            {row.status === 'Active' ? (
                              <button
                                className="flex items-center gap-1 px-1.5 py-0.5 w-full text-left hover:bg-red-50 transition rounded-md"
                                style={{ fontSize: '0.85rem' }}
                                onClick={() => handleDeactivate(idx)}
                              >
                                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-500 text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2"/>
                                  </svg>
                                </span>
                                <span className="text-red-600 font-medium">Deactivate</span>
                              </button>
                            ) : (
                              <button
                                className="flex items-center gap-1 px-1.5 py-0.5 w-full text-left hover:bg-green-50 transition rounded-md"
                                style={{ fontSize: '0.85rem' }}
                                onClick={() => handleActive(idx)}
                              >
                                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-500 text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <polyline points="8 12 11 15 16 10" stroke="currentColor" strokeWidth="2" fill="none"/>
                                  </svg>
                                </span>
                                <span className="text-green-600 font-medium">Active</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{(filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1)} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}</span>
              <div className="flex items-center gap-2">
                <button
                  className="border rounded px-2 py-1"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >&lt;</button>
                <span className="border rounded px-2 py-1 bg-white">{currentPage}</span>
                <button
                  className="border rounded px-2 py-1"
                  disabled={currentPage === totalPage || totalPage === 0}
                  onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))}
                >&gt;</button>
                <select
                  className="border rounded px-2 py-1 ml-2"
                  value={pageSize}
                  disabled
                >
                  <option>10 / page</option>
                </select>
              </div>
            </div>
          </div>
          {/* Modal Create Staff */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
                <button
                  className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-600"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <div className="text-xl font-bold mb-4">Create Staff</div>
                <form className="space-y-4" onSubmit={e => {
                  e.preventDefault();
                  setFormError("");
                  if (!form.name || !form.email) {
                    setFormError("Vui lòng nhập đầy đủ thông tin!");
                    return;
                  }
                  if (!/^\d{10}$/.test(form.phone)) {
                    setFormError("Số điện thoại phải là 10 chữ số!");
                    return;
                  }
                  setData(prev => [
                    {
                      id: prev.length ? prev[0].id + 1 : 1,
                      name: form.name,
                      username: form.email,
                      email: form.email,
                      role: "Staff",
                      status: "Active",
                    },
                    ...prev,
                  ]);
                  setShowModal(false);
                  setForm({ name: "", email: "", phone: "", address: "" });
                }}>
                  <div>
                    <label className="block font-medium mb-1">Full Name</label>
                    <input type="text" className="w-full border rounded px-3 py-2" placeholder="Enter full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block font-medium mb-1">Email</label>
                      <input type="email" className="w-full border rounded px-3 py-2" placeholder="Enter email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="flex-1">
                      <label className="block font-medium mb-1">Phone</label>
                      <input type="text" className="w-full border rounded px-3 py-2" placeholder="Enter phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^\d]/g, "") })} maxLength={10} />
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Address</label>
                    <textarea className="w-full border rounded px-3 py-2 resize-none" rows={2} placeholder="Enter address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Role</label>
                    <select className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-400" disabled>
                      <option>Staff</option>
                    </select>
                  </div>
                  {formError && <div className="text-red-500 text-sm font-medium mt-1">{formError}</div>}
                  <div className="flex justify-end gap-2 mt-4">
                    <button type="button" className="px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100" onClick={() => { setShowModal(false); setForm({ name: "", email: "", phone: "", address: "" }); }}>
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
          {/* Modal xác nhận Deactive/Active */}
          {confirmModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-amber-25 rounded-xl shadow-lg w-full max-w-xs p-6 relative animate-fadeIn">
                <div className="text-lg font-bold mb-2 text-center">
                  {confirmModal.action === 'deactive' ? 'Xác nhận vô hiệu hóa?' : 'Xác nhận kích hoạt?'}
                </div>
                <div className="text-center mb-4 text-gray-600">
                  {confirmModal.action === 'deactive'
                    ? 'Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?'
                    : 'Bạn có chắc chắn muốn kích hoạt lại tài khoản này?'}
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    className="px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100"
                    onClick={() => setConfirmModal({ open: false, idx: null, action: null })}
                  >
                    Hủy
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-white font-semibold ${confirmModal.action === 'deactive' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    onClick={handleConfirm}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffAccount; 