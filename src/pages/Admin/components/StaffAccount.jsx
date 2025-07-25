import React, { useState, useEffect } from "react";
import { FaPlus, FaUserTie } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
// import staffService from "../../../services/apis/staffApi";
import { motion } from "framer-motion";
import adminService from "../../../services/apis/adminApi";

// Tách CreateStaffModal thành component riêng
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
                formError.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên đăng nhập"
              autoComplete="off"
            />
            {formError.username && (
              <div className="text-red-500 text-xs mt-1">
                {formError.username}
              </div>
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
                formError.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
            />
            {/* {formError.password && (
              <div className="text-red-500 text-xs mt-1">{formError.password}</div>
            )} */}
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
              <div className="text-red-500 text-xs mt-1">
                {formError.dateOfBirth}
              </div>
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
              <div className="text-red-500 text-xs mt-1">
                {formError.phoneNumber}
              </div>
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
              <div className="text-red-500 text-xs mt-1">
                {formError.email}
              </div>
            )}
          </div>
          {/* Thumbnail input */}
          <div>
            <label className="block font-medium mb-1">
              Ảnh đại diện
            </label>
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
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
              <option value="Inactive">Ngừng hoạt động</option>
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
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState({});
  const [creating, setCreating] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Lấy danh sách nhân viên
  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        // const res = await staffService.getStaffs();
        // if (res?.success) {
        //   setStaffs(res.data?.data || []);
        // } else {
        //   setStaffs([]);
        // }
        // Tạm thời bỏ gọi API lấy danh sách nhân viên vì staffService chưa được import
        setStaffs([]);
      } catch (e) {
        setStaffs([]);
      }
      setLoading(false);
    };
    fetchStaffs();
  }, []);

  // Validate form
  const validate = () => {
    const err = {};
    if (!form.userName) err.username = "Bắt buộc";
    if (!form.passwordHash) err.password = "Bắt buộc";
    if (!form.dateOfBirth) err.dateOfBirth = "Bắt buộc";
    if (!form.phoneNumber) err.phoneNumber = "Bắt buộc";
    if (!form.email) err.email = "Bắt buộc";
    // thumbnail không bắt buộc
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
      // Tạo form data để truyền lên API
      const formData = new FormData();
      formData.append("userName", form.userName);
      formData.append("passwordHash", form.passwordHash);
      formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("email", form.email);
      formData.append("status", form.status);
      if (form.thumbnail) {
        formData.append("thumbnail", form.thumbnail);
      }

      const res = await adminService.createStaff(formData);
      console.log(res);
      if (res?.success) {
        setStaffs((prev) => [...prev, res.data]);
        setShowCreateModal(false);
        setForm(defaultForm);
        setThumbnailPreview(null);
      } else {
        setFormError({ api: res?.error || "Lỗi tạo nhân viên" });
      }
    } catch (e) {
      setFormError({ api: "Lỗi kết nối server" });
      console.log(e);
    }
    setCreating(false);
  };

  useEffect(() => {
    console.log(form);
  }, [form]);

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
    const file = e.target.files && e.target.files[0];
    if (file) {
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

  return (
    <div className="w-full">
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
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        {loading ? (
          <div>Đang tải...</div>
        ) : staffs.length === 0 ? (
          <div>Chưa có nhân viên nào.</div>
        ) : (
          // Chưa viết xong phần bảng danh sách nhân viên
          <div>Chức năng hiển thị danh sách nhân viên sẽ được bổ sung...</div>
        )}
      </div>
      <CreateStaffModal
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setFormError({});
          setThumbnailPreview(null);
          setForm((prev) => ({ ...prev, thumbnail: null }));
        }}
        form={form}
        formError={formError}
        creating={creating}
        handleChange={handleChange}
        handleCreate={handleCreate}
        handleThumbnailChange={handleThumbnailChange}
        thumbnailPreview={thumbnailPreview}
      />
    </div>
  );
};

export default StaffAccount;