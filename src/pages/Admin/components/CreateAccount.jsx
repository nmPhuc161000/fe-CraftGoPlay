import React, { useState, useRef, useEffect } from "react";
import adminService from "../../../services/apis/adminApi";
import { toast } from "react-toastify";

const STATUS_COLOR = {
  Active: "bg-green-100 text-green-700 border border-green-200",
  Inactive: "bg-gray-100 text-gray-500 border border-gray-200",
  Pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Suspended: "bg-red-100 text-red-700 border border-red-200",
};

const ROLE_OPTIONS = [
  { value: "Staff", label: "Nhân viên" },
  { value: "Admin", label: "Quản trị viên" },
];

const STATUS_OPTIONS = [
  { value: "Active", label: "Đang hoạt động" },
  { value: "Inactive", label: "Ngừng hoạt động" },
  { value: "Pending", label: "Chờ duyệt" },
  { value: "Suspended", label: "Bị đình chỉ" },
];

// Helper to format yyyy-MM-dd
function formatDateYMD(date) {
  if (!date) return "";
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const CreateAccount = () => {
  const [showModal, setShowModal] = useState(false);
  const [openActionIdx, setOpenActionIdx] = useState(null);
  const actionMenuRef = useRef(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, idx: null, action: null });
  const [form, setForm] = useState({
    UserName: "",
    PasswordHash: "",
    DateOfBirth: "",
    PhoneNumber: "",
    Email: "",
    Status: "Pending",
    RoleId: "Staff",
    Thumbnail: null,
    name: "",
    address: "",
    phone: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const actionBtnRefs = useRef([]);
  const [actionMenuPos, setActionMenuPos] = useState({ top: 0, left: 0 });

  // Fetch data from API
  const fetchData = async () => {
    try {
      const res = await adminService.getCustomerList?.();
      if (Array.isArray(res?.data)) {
        setData(
          res.data.map((item) => ({
            id: item.id,
            name: item.name,
            username: item.username || item.email,
            email: item.email,
            role: item.role === "admin" ? "Quản trị viên" : item.role === "staff" ? "Nhân viên" : "Khách hàng",
            status: item.status === "Inactive" ? "Inactive" : item.status === "Pending" ? "Pending" : item.status === "Suspended" ? "Suspended" : "Active",
          }))
        );
      }
    } catch (err) {
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  // Lọc dữ liệu theo search
  const filteredData = data.filter(row =>
    row.name?.toLowerCase().includes(search.toLowerCase()) ||
    row.username?.toLowerCase().includes(search.toLowerCase()) ||
    row.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Xác nhận deactivate/active
  const handleDeactivate = (idx) => {
    setConfirmModal({ open: true, idx, action: 'deactive' });
  };
  const handleActive = (idx) => {
    setConfirmModal({ open: true, idx, action: 'active' });
  };
  const handleConfirm = async () => {
    const user = filteredData[confirmModal.idx];
    if (!user) return;
    try {
      if (confirmModal.action === 'deactive') {
        await adminService.updateCustomerStatus?.(user.id, "Inactive");
        setData(prev => prev.map((item) => item.id === user.id ? { ...item, status: "Inactive" } : item));
      } else if (confirmModal.action === 'active') {
        await adminService.updateCustomerStatus?.(user.id, "Active");
        setData(prev => prev.map((item) => item.id === user.id ? { ...item, status: "Active" } : item));
      }
    } catch (err) {
      // Xử lý lỗi nếu cần
    }
    setConfirmModal({ open: false, idx: null, action: null });
    setOpenActionIdx(null);
  };

  // Hàm gọi API tạo account admin/staff
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.UserName.trim()) {
      setFormError("Vui lòng nhập tên đăng nhập!");
      return;
    }
    if (!form.Email.trim()) {
      setFormError("Vui lòng nhập email!");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
      setFormError("Email không hợp lệ!");
      return;
    }
    if (!form.PhoneNumber.trim()) {
      setFormError("Vui lòng nhập số điện thoại!");
      return;
    }
    if (!/^\d{10}$/.test(form.PhoneNumber)) {
      setFormError("Số điện thoại phải là 10 chữ số!");
      return;
    }
    if (!form.PasswordHash.trim()) {
      setFormError("Vui lòng nhập mật khẩu!");
      return;
    }
    if (form.DateOfBirth) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(form.DateOfBirth)) {
        setFormError("Ngày sinh phải theo định dạng yyyy-MM-dd!");
        return;
      }
      const inputDate = new Date(form.DateOfBirth);
      const today = new Date();
      if (isNaN(inputDate.getTime())) {
        setFormError("Ngày sinh không hợp lệ!");
        return;
      }
      if (inputDate > today) {
        setFormError("Ngày sinh không được là ngày trong tương lai!");
        return;
      }
    }
    if (!form.RoleId) {
      setFormError("Vui lòng chọn vai trò!");
      return;
    }

    setFormLoading(true);
    try {
      const payload = new FormData();
      payload.append("UserName", form.UserName.trim());
      payload.append("PasswordHash", form.PasswordHash.trim());
      payload.append("PhoneNumber", form.PhoneNumber.trim());
      payload.append("Email", form.Email.trim());
      payload.append("Status", "Pending");
      payload.append("RoleId", form.RoleId);

      if (form.DateOfBirth) {
        payload.append("DateOfBirth", form.DateOfBirth);
      }

      if (form.Thumbnail) {
        payload.append("Thumbnail", form.Thumbnail);
      }

      // Log form data để kiểm tra
      for (let [key, value] of payload.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await adminService.createAccount(payload);
      if (res.success) {
        await fetchData();
        setShowModal(false);
        toast.success("Tạo tài khoản thành công!");

        setForm({
          UserName: "",
          PasswordHash: "",
          DateOfBirth: "",
          PhoneNumber: "",
          Email: "",
          Status: "Pending",
          RoleId: "Staff",
          Thumbnail: null,
          name: "",
          address: "",
          phone: "",
        });
      } else {
        throw new Error(res.error || "Có lỗi xảy ra khi tạo tài khoản!");
      }
    } catch (err) {
      let msg = "Có lỗi xảy ra khi tạo tài khoản!";
      if (err?.response?.data) {
        console.log("Lỗi từ server:", err.response.data);
        msg = err.response.data.message || msg;
      } else if (err.message) {
        msg = err.message;
      }
      setFormError(msg);
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  };

  // Custom input for yyyy-MM-dd
  const handleDateInput = (e) => {
    // Only allow numbers and dash, and max length 10
    let value = e.target.value.replace(/[^0-9-]/g, "");
    if (value.length > 10) value = value.slice(0, 10);
    setForm({ ...form, DateOfBirth: value });
  };

  return (
    <div className="w-full">
      <div className="bg-amber-25 min-h-screen w-full py-6 px-2 sm:px-6">
        <div className="space-y-6 max-w-full">
          <div className="bg-amber-25 rounded-xl shadow p-4 overflow-x-auto">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-bold text-xl">Danh sách khách hàng</div>
                <div className="text-sm font-medium text-gray-700 mt-1">Tìm kiếm liên quan</div>
                <div className="mt-1 flex w-full max-w-xs border rounded overflow-hidden bg-white">
                  <input
                    className="flex-1 px-2 py-1.5 text-sm outline-none bg-transparent"
                    placeholder="Nhập từ khóa tìm kiếm"
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
              <button className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm font-semibold hover:bg-gray-50 flex items-center gap-2" onClick={() => setShowModal(true)}>
                + Thêm khách hàng
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-separate border-spacing-0">
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, #5e3a1e 0%, #c7903f 100%)' }}>
                    <th className="px-3 py-2 text-left text-white font-semibold rounded-tl-lg">ID</th>
                    <th className="px-3 py-2 text-left text-white font-semibold">Họ và tên</th>
                    <th className="px-3 py-2 text-left text-white font-semibold">Tên đăng nhập</th>
                    <th className="px-3 py-2 text-left text-white font-semibold">Email</th>
                    <th className="px-3 py-2 text-left text-white font-semibold">Chức vụ</th>
                    <th className="px-3 py-2 text-left text-white font-semibold">Trạng thái</th>
                    <th className="px-3 py-2 text-left text-white font-semibold rounded-tr-lg">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="px-3 py-2">{row.id}</td>
                      <td className="px-3 py-2">{row.name}</td>
                      <td className="px-3 py-2">{row.username}</td>
                      <td className="px-3 py-2">{row.email}</td>
                      <td className="px-3 py-2">
                        <span className="border border-blue-200 bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-semibold">{row.role}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLOR[row.status]}`}>
                          {row.status === "Active" ? "Đang hoạt động" :
                            row.status === "Inactive" ? "Ngừng hoạt động" :
                              row.status === "Pending" ? "Chờ duyệt" :
                                "Bị đình chỉ"}
                        </span>
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
                            style={{ position: 'fixed', top: actionMenuPos.top, left: actionMenuPos.left, zIndex: 1000, minWidth: 100 }}
                            className="bg-white rounded-md shadow-lg animate-fadeIn p-0.5"
                          >
                            {row.status === 'Active' ? (
                              <button
                                className="flex items-center gap-1 px-1.5 py-0.5 w-full text-left hover:bg-red-50 transition rounded-md"
                                style={{ fontSize: '0.85rem' }}
                                onClick={() => handleDeactivate(idx)}
                              >
                                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-500 text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2 Ascending" />
                                    <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
                                    <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2" />
                                  </svg>
                                </span>
                                <span className="text-red-600 font-medium">Ngừng hoạt động</span>
                              </button>
                            ) : (
                              <button
                                className="flex items-center gap-1 px-1.5 py-0.5 w-full text-left hover:bg-green-50 transition rounded-md"
                                style={{ fontSize: '0.85rem' }}
                                onClick={() => handleActive(idx)}
                              >
                                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-500 text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <polyline points="8 12 11 15 16 10" stroke="currentColor" strokeWidth="2" fill="none" />
                                  </svg>
                                </span>
                                <span className="text-green-600 font-medium">Kích hoạt</span>
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
              <span>1 to {filteredData.length} of {data. length}</span>
              <div className="flex items-center gap-2">
                <button className="border rounded px-2 py-1"></button>
                <span className="border rounded px-2 py-1 bg-white">1</span>
                <button className="border rounded px-2 py-1"></button>
                <select className="border rounded px-2 py-1 ml-2">
                  <option>10 / trang</option>
                  <option>20 / trang</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Create Customer */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
                <button
                  className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setShowModal(false); setFormError(""); setForm({
                      UserName: "",
                      PasswordHash: "",
                      DateOfBirth: "",
                      PhoneNumber: "",
                      Email: "",
                      Status: "Pending",
                      RoleId: "Staff",
                      Thumbnail: null,
                      name: "",
                      address: "",
                      phone: "",
                    });
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
                <div className="text-xl font-bold mb-4">Tạo khách hàng</div>
                <form className="space-y-4" onSubmit={handleCreateAccount}>
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Nhập tên đăng nhập"
                      value={form.UserName}
                      onChange={e => setForm({ ...form, UserName: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block font-medium text-sm text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Nhập email"
                        value={form.Email}
                        onChange={e => setForm({ ...form, Email: e.target.value })}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block font-medium text-sm text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Nhập số điện thoại"
                        value={form.PhoneNumber}
                        onChange={e => setForm({ ...form, PhoneNumber: e.target.value.replace(/[^\d]/g, "") })}
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">Ngày sinh</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="yyyy-MM-dd"
                      value={form.DateOfBirth}
                      onChange={handleDateInput}
                      maxLength={10}
                      pattern="\d{4}-\d{2}-\d{2}"
                      autoComplete="off"
                    />
                    <p className="text-xs text-gray-500 mt-1">Định dạng: yyyy-MM-dd (ví dụ: 2000-01-01)</p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                    <input
                      type="password"
                      className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Nhập mật khẩu"
                      value={form.PasswordHash}
                      onChange={e => setForm({ ...form, PasswordHash: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">Địa chỉ</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 text-sm resize-y focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      rows={2}
                      placeholder="Nhập địa chỉ"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">Ảnh đại diện</label>
                    <input
                      type="file"
                      className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      onChange={e => setForm({ ...form, Thumbnail: e.target.files[0] })}
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">Chức vụ <span className="text-red-500">*</span></label>
                    <select
                      className="w-full border rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      value={form.RoleId}
                      onChange={e => setForm({ ...form, RoleId: e.target.value })}
                    >
                      {ROLE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
                    <select
                      className="w-full border rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      value={form.Status}
                      onChange={e => setForm({ ...form, Status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  {formError && <div className="text-red-500 text-sm font-medium mt-1">{formError}</div>}
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 rounded border bg-gray-50 text-sm hover:bg-gray-100"
                      onClick={() => {
                        setShowModal(false); setFormError(""); setForm({
                          UserName: "",
                          PasswordHash: "",
                          DateOfBirth: "",
                          PhoneNumber: "",
                          Email: "",
                          Status: "Pending",
                          RoleId: "Staff",
                          Thumbnail: null,
                          name: "",
                          address: "",
                          phone: "",
                        });
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                      disabled={formLoading}
                    >
                      {formLoading && (
                        <svg className="animate-spin h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                      )}
                      Gửi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal xác nhận Deactive/Active */}
          {confirmModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-xs p-6 relative animate-fadeIn">
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
                    className={`px-4 py-2 rounded text-white font-semibold ${confirmModal.action === 'deactive' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    onClick={handleConfirm}
                  >
                    Xác nhận
                  </button>
                  <button
                    className="px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100"
                    onClick={() => setConfirmModal({ open: false, idx: null, action: null })}
                  >
                    Hủy
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

export default CreateAccount;