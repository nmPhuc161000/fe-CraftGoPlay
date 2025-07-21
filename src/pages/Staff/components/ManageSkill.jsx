import React, { useState } from "react";
import { motion } from "framer-motion";

const initialSkills = [
  {
    id: "71481618-616b-455a-fc29-08ddc8235bfb",
    name: "Sáng tạo và thiết kế",
    status: "active",
  },
];

function generateId() {
  // Simple random id generator
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  );
}

const ManageSkill = () => {
  const [data, setData] = useState(initialSkills);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [addError, setAddError] = useState("");
  const pageSize = 10;

  const filtered = data.filter((skill) => {
    const searchLower = (search || "").toLowerCase();
    return skill?.name?.toLowerCase()?.includes(searchLower);
  });

  const totalPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Đổi status giữa active/inactive
  const handleToggleStatus = (id) => {
    setData((prev) =>
      prev.map((skill) =>
        skill.id === id
          ? {
              ...skill,
              status: skill.status === "active" ? "inactive" : "active",
            }
          : skill
      )
    );
  };

  // Thêm kỹ năng mới
  const handleAddSkill = () => {
    const trimmed = newSkillName.trim();
    if (!trimmed) {
      setAddError("Tên kỹ năng không được để trống.");
      return;
    }
    // Check duplicate name (case-insensitive)
    if (
      data.some(
        (skill) => skill.name.trim().toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setAddError("Tên kỹ năng đã tồn tại.");
      return;
    }

    
    setData((prev) => [
      {
        id: generateId(),
        name: trimmed,
        status: "active",
      },
      ...prev,
    ]);
    setShowAddModal(false);
    setNewSkillName("");
    setAddError("");
    setCurrentPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý kỹ năng
          </h1>
          <div className="relative">
            <input
              className="w-full md:max-w-xs pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Tìm kiếm theo tên kỹ năng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 md:mt-0 px-5 py-2 rounded-lg bg-gradient-to-r from-[#8b5e3c] to-[#c7903f] text-white font-semibold shadow hover:opacity-90 transition"
          onClick={() => {
            setShowAddModal(true);
            setNewSkillName("");
            setAddError("");
          }}
        >
          + Thêm kỹ năng
        </motion.button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#8b5e3c] to-[#c7903f]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                STT
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Tên kỹ năng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Không có kỹ năng nào.
                </td>
              </tr>
            ) : (
              paged.map((row, idx) => (
                <motion.tr
                  key={row?.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                    {row?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.status === "active" ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <svg
                          className="w-4 h-4 mr-1 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-400"
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
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`px-2 py-1 rounded transition-colors ${
                        row.status === "active"
                          ? "text-red-600 hover:bg-red-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                      title={
                        row.status === "active"
                          ? "Chuyển sang Inactive"
                          : "Chuyển sang Active"
                      }
                      onClick={() => handleToggleStatus(row.id)}
                    >
                      {row.status === "active" ? (
                        // Icon chuyển sang inactive (dấu X)
                        <svg
                          className="w-5 h-5"
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
                      ) : (
                        // Icon chuyển sang active (dấu check)
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          {filtered.length === 0
            ? 0
            : (currentPage - 1) * pageSize + 1}{" "}
          đến {Math.min(currentPage * pageSize, filtered.length)} trên tổng số{" "}
          {filtered.length}
        </span>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>
          <span className="px-4 py-2 rounded-lg bg-blue-50 font-medium text-blue-600">
            {currentPage}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === totalPage || totalPage === 0}
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPage, p + 1))
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Modal Thêm kỹ năng */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowAddModal(false);
                setAddError("");
              }}
              title="Đóng"
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
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Thêm kỹ năng mới
              </h3>
              <div className="mb-4">
                <input
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Nhập tên kỹ năng..."
                  value={newSkillName}
                  onChange={(e) => {
                    setNewSkillName(e.target.value);
                    setAddError("");
                  }}
                  maxLength={100}
                  autoFocus
                />
                {addError && (
                  <div className="text-red-600 text-sm mt-1">{addError}</div>
                )}
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => {
                    setShowAddModal(false);
                    setAddError("");
                  }}
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 text-white rounded-lg bg-[#c7903f] hover:bg-[#b07d2c] font-semibold"
                  onClick={handleAddSkill}
                >
                  Thêm
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageSkill;