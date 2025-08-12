import React, { useEffect, useState } from "react";
import { MdCheck, MdClose, MdSearch } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import artisanRequestService from "../../../services/apis/artisanrequestApi";

const ArtisanRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const fetchArtisanRequest = async () => {
    try {
      const response = await artisanRequestService.getAllRequest();
      console.log("Artisan Req: ", response);
      if (response.success && response.data) {
        const apiData = response.data.data;
        console.log(apiData);
        const artisanRequests = Array.isArray(apiData) ? apiData : [];
        console.log(artisanRequests);
        setRequests(artisanRequests);
      }
    } catch (error) {
      const errorMessage = error.message || "Không thể kết nối đến server";
      console.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchArtisanRequest();
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await artisanRequestService.approveRequest(id);
      if (response.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
        );
      }
    } catch (error) {
      console.error("Lỗi khi phê duyệt:", error);
    }
  };

  const handleReject = async (
    id,
    reason = "Không đủ điều kiện trở thành nghệ nhân"
  ) => {
    try {
      const response = await artisanRequestService.rejectRequest({
        id: id, // Chỉ cần truyền id và reason trực tiếp
        reason: reason,
      });

      if (response.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi khi từ chối:", error);
      return false;
    }
  };

  const filteredRequests = requests.filter(
    (r) =>
      r.user.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.user.email.toLowerCase().includes(search.toLowerCase()) ||
      r.user.phoneNumber.includes(search)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Yêu cầu từ nghệ nhân
          </h1>
          <div className="relative">
            <input
              className="w-full md:max-w-xs pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Tìm kiếm yêu cầu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <MdSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#8b5e3c] to-[#c7903f]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Tên khách hàng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Chi tiết
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((r, idx) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">{r.id}</td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                  {r.user.userName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                  {r.user.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                  {r.user.phoneNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors"
                    onClick={() => setDetail(r)}
                  >
                    Xem chi tiết
                  </motion.button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {r.status === "Pending" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      Chờ duyệt
                    </span>
                  ) : r.status === "Approved" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                      <MdCheck className="inline-block mr-1" size={14} />
                      Đã kích hoạt
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-200">
                      <MdClose className="inline-block mr-1" size={14} />
                      Bị từ chối
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setDetail(null)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-2xl font-bold mb-6">Chi tiết yêu cầu</h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Hình ảnh đính kèm
                </h3>
                <div className="flex justify-center">
                  <img
                    src={detail.image}
                    alt="Hình ảnh nghệ nhân"
                    className="max-h-60 rounded-lg object-cover border border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=Không+có+hình+ảnh";
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Tên đăng nhập</div>
                    <div className="font-semibold mt-1">
                      {detail.user.userName}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-semibold mt-1">
                      {detail.user.email}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Số điện thoại</div>
                    <div className="font-semibold mt-1">
                      {detail.user.phoneNumber}
                    </div>
                  </div>
                </motion.div>

                <motion.div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Làng nghề</div>
                    <div className="font-semibold mt-1">
                      {detail.craftVillages?.village_Name || "Không có"}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Kinh nghiệm</div>
                    <div className="font-semibold mt-1">
                      {detail.yearsOfExperience
                        ? `${detail.yearsOfExperience} năm`
                        : "Không có"}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Mô tả</div>
                    <div className="font-semibold mt-1">
                      {detail.description || "Không có"}
                    </div>
                  </div>
                </motion.div>
              </div>

              {detail.status === "Pending" && (
                <div className="flex flex-col gap-3 mt-8">
                  <div className="mb-4">
                    <label
                      htmlFor="rejectReason"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Lý do từ chối (nếu có)
                    </label>
                    <input
                      id="rejectReason"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Nhập lý do từ chối"
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg border border-red-500 text-red-600 font-medium hover:bg-red-50 transition-colors"
                      onClick={() => {
                        handleReject(
                          detail.id,
                          rejectReason ||
                            "Không đủ điều kiện trở thành nghệ nhân"
                        );
                        setDetail(null);
                      }}
                    >
                      Từ chối
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:shadow-lg transition-all"
                      onClick={() => {
                        handleApprove(detail.id);
                        setDetail(null);
                      }}
                    >
                      Duyệt yêu cầu
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ArtisanRequestList;
