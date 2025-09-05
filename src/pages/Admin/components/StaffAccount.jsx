import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaUserTie } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { motion } from "framer-motion";
import adminService from "../../../services/apis/adminApi";

// Component CreateStaffModal
const CreateStaffModal = ({
  open,
  onClose,
  form,
  formError,
  creating,
  handleChange,
  handleCreate,
  handleThumbnailChange,
  thumbnailPreview,
  setThumbnailPreview,
  setForm,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.2)" }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          type="button"
        >
          <MdCancel size={24} />
        </button>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaPlus className="text-orange-500" /> Tạo mới nhân viên
        </h3>
        {formError.api && (
          <div className="mb-2 text-red-600 text-sm">{formError.api}</div>
        )}
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none ${
                formError.userName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên đăng nhập"
              autoComplete="off"
            />
            {formError.userName && (
              <div className="text-red-500 text-xs mt-1">{formError.userName}</div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="passwordHash"
              value={form.passwordHash}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none ${
                formError.passwordHash ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
            />
            {formError.passwordHash && (
              <div className="text-red-500 text-xs mt-1">{formError.passwordHash}</div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none ${
                formError.dateOfBirth ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="yyyy-MM-dd"
            />
            {formError.dateOfBirth && (
              <div className="text-red-500 text-xs mt-1">{formError.dateOfBirth}</div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none ${
                formError.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập số điện thoại"
              autoComplete="off"
            />
            {formError.phoneNumber && (
              <div className="text-red-500 text-xs mt-1">{formError.phoneNumber}</div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none ${
                formError.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập email"
              autoComplete="off"
            />
            {formError.email && (
              <div className="text-red-500 text-xs mt-1">{formError.email}</div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Ảnh đại diện</label>
            <div className="flex items-center gap-4">
              <div>
                <label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-orange-400 bg-orange-50 hover:bg-orange-100 transition group"
                >
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Xem trước ảnh đại diện"
                      className="w-24 h-24 object-cover rounded-full border-2 border-orange-400 shadow group-hover:scale-105 transition"
                      crossorigin="anonymous"
                    />
                  ) : (
                    <span className="flex flex-col items-center text-orange-400">
                      <svg
                        className="w-8 h-8 mb-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-orange-500">Tải ảnh lên</span>
                    </span>
                  )}
                  <input
                    id="thumbnail-upload"
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              </div>
              {thumbnailPreview && (
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                  onClick={() => {
                    setThumbnailPreview(null);
                    setForm((prev) => ({ ...prev, thumbnail: null }));
                  }}
                >
                  Xóa ảnh
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Chọn ảnh đại diện (jpg, png, tối đa 2MB)</p>
          </div>
          <div>
            <label className="block font-medium mb-1">Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none border-gray-300"
            >
              <option value="Active">Đang hoạt động</option>
              <option value="Pending">Đang chờ</option>
              <option value="Inactive">Ngừng hoạt động</option>
              <option value="Rejected">Bị từ chối</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={onClose}
              disabled={creating}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center gap-2"
              disabled={creating}
            >
              {creating ? (
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <FaPlus />
              )}
              Tạo mới
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const defaultForm = {
  userName: "",
  passwordHash: "",
  dateOfBirth: "",
  phoneNumber: "",
  email: "",
  status: "Active",
  thumbnail: null,
};

const StaffAccount = () => {
  const [staffs, setStaffs] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState({});
  const [creating, setCreating] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [openActionIdx, setOpenActionIdx] = useState(null);
  const [actionMenuPos, setActionMenuPos] = useState({ top: 0, left: 0 });
  const [confirmModal, setConfirmModal] = useState({ open: false, idx: null, action: null });
  const actionBtnRefs = useRef([]);
  const actionMenuRef = useRef(null);

  // Lấy danh sách nhân viên
  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        const response = await adminService.getAllAccount({
          pageIndex,
          pageSize,
          status: statusFilter || undefined,
          role: "Staff", // Role mặc định là Staff
        });
        setStaffs(response.data.data || []);
        setFilteredStaffs(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
        setStaffs([]);
        setFilteredStaffs([]);
      }
      setLoading(false);
    };
    fetchStaffs();
  }, [pageIndex, pageSize, statusFilter]);

  // Lọc dữ liệu theo tìm kiếm
  useEffect(() => {
    const filtered = staffs.filter(
      (staff) =>
        staff.userName?.toLowerCase().includes(search.toLowerCase()) ||
        staff.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStaffs(filtered);
  }, [search, staffs]);

  // Xử lý click ngoài để đóng menu hành động
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setOpenActionIdx(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validate form tạo nhân viên
  const validate = () => {
    const err = {};
    if (!form.userName) err.userName = "Bắt buộc nhập tên đăng nhập";
    if (!form.passwordHash) err.passwordHash = "Bắt buộc nhập mật khẩu";
    if (!form.dateOfBirth) err.dateOfBirth = "Bắt buộc chọn ngày sinh";
    if (!form.phoneNumber) err.phoneNumber = "Bắt buộc nhập số điện thoại";
    if (!form.email) err.email = "Bắt buộc nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Email không hợp lệ";
    return err;
  };

  // Xử lý tạo mới nhân viên
  const handleCreate = async (e) => {
    e.preventDefault();
    const err = validate();
    setFormError(err);
    if (Object.keys(err).length > 0) return;
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("userName", form.userName);
      formData.append("passwordHash", form.passwordHash);
      formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("email", form.email);
      formData.append("status", form.status);
      formData.append("role", "Staff"); // Thêm role Staff vào formData
      if (form.thumbnail) {
        formData.append("thumbnail", form.thumbnail);
      }

      const res = await adminService.createStaff(formData);
      if (res?.success) {
        setStaffs((prev) => [...prev, res.data]);
        setFilteredStaffs((prev) => [...prev, res.data]);
        setShowCreateModal(false);
        setForm(defaultForm);
        setThumbnailPreview(null);
        setFormError({});
      } else {
        setFormError({ api: res?.error || "Lỗi khi tạo nhân viên" });
      }
    } catch (e) {
      setFormError({ api: "Lỗi kết nối server" });
      console.error("Lỗi khi tạo nhân viên:", e);
    }
    setCreating(false);
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi thumbnail
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError({ thumbnail: "Ảnh không được lớn hơn 2MB" });
        return;
      }
      setForm((prev) => ({
        ...prev,
        thumbnail: file,
      }));
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({
        ...prev,
        thumbnail: null,
      }));
      setThumbnailPreview(null);
    }
  };

  // Xử lý kích hoạt/vô hiệu hóa
  const handleActive = (idx) => {
    setConfirmModal({ open: true, idx, action: "active" });
  };

  const handleDeactivate = (idx) => {
    setConfirmModal({ open: true, idx, action: "deactive" });
  };

  const handleConfirm = () => {
    console.log(`Xác nhận ${confirmModal.action} cho nhân viên tại index ${confirmModal.idx}`);
    setConfirmModal({ open: false, idx: null, action: null });
  };

  // Xử lý thay đổi bộ lọc trạng thái
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPageIndex(1);
  };

  // Xử lý phân trang
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPageIndex(1);
  };

  const handlePrevPage = () => {
    if (pageIndex > 1) setPageIndex(pageIndex - 1);
  };

  const handleNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  return (
    <div className="w-full">
      <div className="bg-amber-25 min-h-screen w-full py-6 px-2 sm:px-6">
        <div className="space-y-6 max-w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaUserTie className="text-orange-500" /> Danh sách nhân viên
            </h2>
            <button
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow transition"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus /> Tạo mới nhân viên
            </button>
          </div>
          <div className="bg-amber-25 rounded-xl shadow p-4 overflow-x-auto">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-sm font-medium text-gray-700 mt-1">Tìm kiếm liên quan</div>
                <div className="mt-1 flex w-full max-w-xs border rounded overflow-hidden bg-white">
                  <input
                    className="flex-1 px-2 py-1.5 text-sm outline-none bg-transparent"
                    placeholder="Nhập từ khóa tìm kiếm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    className="px-2 flex items-center justify-center text-gray-500 hover:text-black"
                    onClick={(e) => e.preventDefault()}
                    tabIndex={-1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2">
                  <select
                    className="border rounded px-2 py-1.5 text-sm"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <option value="">Không dữ liệu</option>
                    <option value="Active">Đang hoạt động</option>
                    <option value="Pending">Đang chờ</option>
                    <option value="Inactive">Ngừng hoạt động</option>
                    <option value="Rejected">Bị từ chối</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-4">Đang tải...</div>
              ) : filteredStaffs.length === 0 ? (
                <div className="text-center py-4">Chưa có nhân viên nào.</div>
              ) : (
                <table className="min-w-full text-sm border-separate border-spacing-0">
                  <thead>
                    <tr style={{ background: "linear-gradient(90deg, #5e3a1e 0%, #c7903f 100%)" }}>
                      <th className="px-3 py-2 text-left font-semibold rounded-tl-lg text-white">ID</th>
                      <th className="px-3 py-2 text-left font-semibold text-white">Tên đăng nhập</th>
                      <th className="px-3 py-2 text-left font-semibold text-white">Email</th>
                      <th className="px-3 py-2 text-left font-semibold text-white">Số điện thoại</th>
                      <th className="px-3 py-2 text-left font-semibold text-white">Trạng thái</th>
                      <th className="px-3 py-2 text-left font-semibold rounded-tr-lg text-white">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaffs.map((staff, idx) => (
                      <tr key={staff.id} className="border-b last:border-0">
                        <td className="px-3 py-2">{staff.id}</td>
                        <td className="px-3 py-2">{staff.userName}</td>
                        <td className="px-3 py-2">{staff.email}</td>
                        <td className="px-3 py-2">{staff.phoneNumber}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`
                              inline-flex items-center gap-1
                              px-3 py-1.5 rounded-full text-xs font-semibold border
                              shadow-sm transition-all
                              cursor-pointer
                              ${staff.status === "Active"
                                ? "bg-gradient-to-r from-green-200 to-green-100 text-green-800 border-green-300"
                                : staff.status === "Pending"
                                ? "bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800 border-yellow-300"
                                : staff.status === "Rejected"
                                ? "bg-gradient-to-r from-red-200 to-red-100 text-red-800 border-red-300"
                                : "bg-white text-gray-600 border-gray-300"
                              }
                            `}
                          >
                            {staff.status === "Active" ? (
                              <>
                                <svg className="w-3.5 h-3.5 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <circle cx="10" cy="10" r="8" />
                                  <path
                                    d="M7.5 10.5l2 2 3-4"
                                    stroke="#22c55e"
                                    strokeWidth="1.5"
                                    fill="none"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <span>Đang hoạt động</span>
                              </>
                            ) : staff.status === "Pending" ? (
                              <>
                                <svg className="w-3.5 h-3.5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <circle cx="10" cy="10" r="8" />
                                  <path
                                    d="M10 6v4l3 3"
                                    stroke="#f59e0b"
                                    strokeWidth="1.5"
                                    fill="none"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <span>Đang chờ</span>
                              </>
                            ) : staff.status === "Rejected" ? (
                              <>
                                <svg className="w-3.5 h-3.5 mr-1 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                  <circle cx="10" cy="10" r="8" />
                                  <line x1="7" y1="7" x2="13" y2="13" stroke="#ef4444" strokeWidth="1.5" />
                                  <line x1="13" y1="7" x2="7" y2="13" stroke="#ef4444" strokeWidth="1.5" />
                                </svg>
                                <span>Bị từ chối</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <circle cx="10" cy="10" r="8" />
                                  <line x1="7" y1="7" x2="13" y2="13" stroke="#6b7280" strokeWidth="1.5" />
                                  <line x1="13" y1="7" x2="7" y2="13" stroke="#6b7280" strokeWidth="1.5" />
                                </svg>
                                <span>Ngừng hoạt động</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-3 py-2 relative">
                          <button
                            ref={(el) => (actionBtnRefs.current[idx] = el)}
                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setActionMenuPos({
                                top: rect.bottom + window.scrollY,
                                left: rect.right + window.scrollX,
                              });
                              setOpenActionIdx(openActionIdx === idx ? null : idx);
                            }}
                          >
                            ...
                          </button>
                          {openActionIdx === idx && (
                            <div
                              ref={actionMenuRef}
                              style={{
                                position: "fixed",
                                top: actionMenuPos.top,
                                left: actionMenuPos.left,
                                zIndex: 1000,
                                minWidth: 100,
                              }}
                              className="bg-white rounded-md shadow-lg animate-fadeIn p-0.5"
                            >
                              {staff.status === "Active" ? (
                                <button
                                  className="flex items-center gap-1 px-1.5 py-0.5 w-full text-left hover:bg-red-50 transition rounded-md"
                                  style={{ fontSize: "0.85rem" }}
                                  onClick={() => handleDeactivate(idx)}
                                >
                                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-500 text-sm">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-2.5 h-2.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                      <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
                                      <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                  </span>
                                  <span className="text-red-600 font-medium">Ngừng hoạt động</span>
                                </button>
                              ) : (
                                <button
                                  className="flex items-center gap-1 px-1.5 py-0.5 w-full text-left hover:bg-green-50 transition rounded-md"
                                  style={{ fontSize: "0.85rem" }}
                                  onClick={() => handleActive(idx)}
                                >
                                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-500 text-sm">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-2.5 h-2.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                      <polyline
                                        points="8 12 11 15 16 10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                      />
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
              )}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>
                {filteredStaffs.length > 0 ? (pageIndex - 1) * pageSize + 1 : 0} đến{" "}
                {Math.min(pageIndex * pageSize, filteredStaffs.length)} trong số {staffs.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="border rounded px-2 py-1 disabled:opacity-50"
                  onClick={handlePrevPage}
                  disabled={pageIndex === 1}
                >
                  &lt;
                </button>
                <span className="border rounded px-2 py-1 bg-white">{pageIndex}</span>
                <button
                  className="border rounded px-2 py-1 disabled:opacity-50"
                  onClick={handleNextPage}
                  disabled={filteredStaffs.length < pageSize}
                >
                  &gt;
                </button>
                <select
                  className="border rounded px-2 py-1 ml-2"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="10">10 / trang</option>
                  <option value="20">20 / trang</option>
                </select>
              </div>
            </div>
          </div>
          <CreateStaffModal
            open={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setFormError({});
              setThumbnailPreview(null);
              setForm(defaultForm);
            }}
            form={form}
            formError={formError}
            creating={creating}
            handleChange={handleChange}
            handleCreate={handleCreate}
            handleThumbnailChange={handleThumbnailChange}
            thumbnailPreview={thumbnailPreview}
            setThumbnailPreview={setThumbnailPreview}
            setForm={setForm}
          />
          {confirmModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-xs p-6 relative animate-fadeIn">
                <div className="text-lg font-bold mb-2 text-center">
                  {confirmModal.action === "deactive" ? "Xác nhận vô hiệu hóa?" : "Xác nhận kích hoạt?"}
                </div>
                <div className="text-center mb-4 text-gray-600">
                  {confirmModal.action === "deactive"
                    ? "Bạn Hacker News Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?"
                    : "Bạn có chắc chắn muốn kích hoạt lại tài khoản này?"}
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    className={`px-4 py-2 rounded text-white font-semibold ${
                      confirmModal.action === "deactive"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
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

export default StaffAccount;