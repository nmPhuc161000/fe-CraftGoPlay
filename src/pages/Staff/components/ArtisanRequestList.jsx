import React, { useState } from "react";
import { MdCheck, MdClose, MdSearch } from 'react-icons/md';
import { motion, AnimatePresence } from "framer-motion";

// Fake data yêu cầu từ nghệ nhân
const FAKE_REQUESTS = [
  { id: 1, name: "Nguyễn Văn F", email: "f@gmail.com", phone: "0901234567", address: "123 Đường A, Quận B, TP.HCM", username: "nguyenvanf", status: "pending" },
  { id: 2, name: "Trần Thị G", email: "g@gmail.com", phone: "0912345678", address: "456 Đường X, Quận Y, Hà Nội", username: "tranthig", status: "pending" },
];

const ArtisanRequestList = () => {
  const [requests, setRequests] = useState(FAKE_REQUESTS);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");

  const handleApprove = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
  };

  const handleReject = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
  };

  const filteredRequests = requests.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.phone.includes(search)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Yêu cầu từ nghệ nhân</h1>
          <div className="relative">
            <input 
              className="w-full md:max-w-xs pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Tìm kiếm yêu cầu..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <MdSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tên khách hàng</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Số điện thoại</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Chi tiết</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Hành động</th>
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
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{r.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{r.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{r.phone}</td>
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
                {r.status === "pending" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Chờ duyệt
                  </span>
                ) : r.status === "approved" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                      <MdCheck className="inline-block mr-1" size={14} />
                      Kích hoạt
                  </span>
                ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-200">
                      <MdClose className="inline-block mr-1" size={14} />
                      Ngừng hoạt động
                  </span>
                )}
              </td>
                <td className="px-4 py-3 whitespace-nowrap">
                {r.status === "pending" && (
                    <div className="flex gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 rounded-lg border border-green-500 text-green-600 font-medium hover:bg-green-50 transition-colors"
                        onClick={() => handleApprove(r.id)}
                      >
                      Duyệt
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 rounded-lg border border-red-500 text-red-600 font-medium hover:bg-red-50 transition-colors"
                        onClick={() => handleReject(r.id)}
                      >
                      Từ chối
                      </motion.button>
                  </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
            >
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setDetail(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Chi tiết yêu cầu</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Họ tên</div>
                    <div className="font-semibold mt-1">{detail.name}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-semibold mt-1">{detail.email}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Số điện thoại</div>
                    <div className="font-semibold mt-1">{detail.phone}</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Tên đăng nhập</div>
                    <div className="font-semibold mt-1">{detail.username}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Địa chỉ</div>
                    <div className="font-semibold mt-1">{detail.address}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Trạng thái</div>
                    <div className="font-semibold mt-1">
                      {detail.status === "pending" ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          Chờ duyệt
                        </span>
                      ) : detail.status === "approved" ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                          <MdCheck className="inline-block mr-1" size={14} />
                          Kích hoạt
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-200">
                          <MdClose className="inline-block mr-1" size={14} />
                          Ngừng hoạt động
                        </span>
                      )}
            </div>
          </div>
                </motion.div>
              </div>

              {detail.status === "pending" && (
                <div className="flex justify-end gap-3 mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg border border-red-500 text-red-600 font-medium hover:bg-red-50 transition-colors"
                    onClick={() => {
                      handleReject(detail.id);
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
      )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ArtisanRequestList; 