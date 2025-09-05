import React, { useState, useEffect, useRef } from "react";
import adminService from "../../../services/apis/adminApi";

const UserAccount = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [openActionIdx, setOpenActionIdx] = useState(null);
  const [actionMenuPos, setActionMenuPos] = useState({ top: 0, left: 0 });
  const [confirmModal, setConfirmModal] = useState({ open: false, idx: null, action: null });
  const actionBtnRefs = useRef([]);
  const actionMenuRef = useRef(null);

  // Lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await adminService.getAllAccount({
          pageIndex,
          pageSize,
          status: statusFilter || undefined,
          role: "User", // Role mặc định là User
        });
        setUsers(response.data.data || []);
        setFilteredUsers(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        setUsers([]);
        setFilteredUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [pageIndex, pageSize, statusFilter]);

  // Lọc dữ liệu theo tìm kiếm
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.id?.toLowerCase().includes(search.toLowerCase()) ||
        user.userName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

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

  // Xử lý kích hoạt/vô hiệu hóa
  const handleActive = (idx) => {
    setConfirmModal({ open: true, idx, action: "active" });
  };

  const handleDeactivate = (idx) => {
    setConfirmModal({ open: true, idx, action: "deactive" });
  };

  const handleConfirm = () => {
    console.log(`Xác nhận ${confirmModal.action} cho người dùng tại index ${confirmModal.idx}`);
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
          <div className="bg-amber-25 rounded-xl shadow p-4 overflow-x-auto">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-bold text-xl">Danh sách người dùng</div>
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
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-4">Chưa có người dùng nào.</div>
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
                    {filteredUsers.map((user, idx) => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="px-3 py-2">{user.id}</td>
                        <td className="px-3 py-2">{user.userName}</td>
                        <td className="px-3 py-2">{user.email}</td>
                        <td className="px-3 py-2">{user.phoneNumber || "-"}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`
                              inline-flex items-center gap-1
                              px-3 py-1.5 rounded-full text-xs font-semibold border
                              shadow-sm transition-all
                              cursor-pointer
                              ${user.status === "Active"
                                ? "bg-gradient-to-r from-green-200 to-green-100 text-green-800 border-green-300"
                                : user.status === "Pending"
                                ? "bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800 border-yellow-300"
                                : user.status === "Rejected"
                                ? "bg-gradient-to-r from-red-200 to-red-100 text-red-800 border-red-300"
                                : "bg-white text-gray-600 border-gray-300"
                              }
                            `}
                          >
                            {user.status === "Active" ? (
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
                            ) : user.status === "Pending" ? (
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
                            ) : user.status === "Rejected" ? (
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
                              {user.status === "Active" ? (
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
                {filteredUsers.length > 0 ? (pageIndex - 1) * pageSize + 1 : 0} đến{" "}
                {Math.min(pageIndex * pageSize, filteredUsers.length)} trong số {users.length}
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
                  disabled={filteredUsers.length < pageSize}
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
          {confirmModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-xs p-6 relative animate-fadeIn">
                <div className="text-lg font-bold mb-2 text-center">
                  {confirmModal.action === "deactive" ? "Xác nhận vô hiệu hóa?" : "Xác nhận kích hoạt?"}
                </div>
                <div className="text-center mb-4 text-gray-600">
                  {confirmModal.action === "deactive"
                    ? "Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?"
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

export default UserAccount;