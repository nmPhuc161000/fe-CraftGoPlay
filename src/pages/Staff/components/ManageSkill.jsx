import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import craftskillService from "../../../services/apis/craftskillApi";

function generateId() {
  // Simple random id generator
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  );
}

const ManageSkill = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [addError, setAddError] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateSkillId, setUpdateSkillId] = useState(null);
  const [updateSkillName, setUpdateSkillName] = useState("");
  const [updateError, setUpdateError] = useState("");
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

  useEffect(() => {
    fetchCraftSkills();
  }, []);

  const fetchCraftSkills = async () => {
    try {
      const response = await craftskillService.getAllCraftSkills();
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching craft skills:", error);
    }
  };

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
  const handleAddSkill = async () => {
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

    try {
      const formData = { name: trimmed };
      const response = await craftskillService.createCraftSkill(formData);
      // Giả sử API trả về object skill mới trong response.data.data
      // const newSkill = response.data.data;
      fetchCraftSkills();
      setShowAddModal(false);
      setNewSkillName("");
      setAddError("");
      setCurrentPage(1);
    } catch (error) {
      setAddError("Có lỗi xảy ra khi thêm kỹ năng. Vui lòng thử lại.");
      console.error("Error creating craft skill:", error);
    }
  };

  // Cập nhật kỹ năng
  const handleUpdateSkill = async () => {
    const trimmed = updateSkillName.trim();
    if (!trimmed) {
      setUpdateError("Tên kỹ năng không được để trống.");
      return;
    }
    // Check duplicate name (case-insensitive), exclude current
    if (
      data.some(
        (skill) =>
          skill.id !== updateSkillId &&
          skill.name.trim().toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setUpdateError("Tên kỹ năng đã tồn tại.");
      return;
    }

    try {
      const formData = { id: updateSkillId, name: trimmed };
      await craftskillService.updateCraftSkill(formData);
      fetchCraftSkills();
      setShowUpdateModal(false);
      setUpdateSkillId(null);
      setUpdateSkillName("");
      setUpdateError("");
    } catch (error) {
      setUpdateError("Có lỗi xảy ra khi cập nhật kỹ năng. Vui lòng thử lại.");
      console.error("Error updating craft skill:", error);
    }
  };

  // Mở popup cập nhật
  const openUpdateModal = (skill) => {
    setUpdateSkillId(skill.id);
    setUpdateSkillName(skill.name);
    setUpdateError("");
    setShowUpdateModal(true);
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
                  <td className="px-4 py-3 whitespace-nowrap flex gap-2">
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
                    {/* Nút update dạng icon */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-2 py-1 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Cập nhật kỹ năng"
                      onClick={() => openUpdateModal(row)}
                    >
                      {/* Pencil/Edit icon */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
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

      {/* Modal Cập nhật kỹ năng */}
      {showUpdateModal && (
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
                setShowUpdateModal(false);
                setUpdateError("");
                setUpdateSkillId(null);
                setUpdateSkillName("");
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
                Cập nhật kỹ năng
              </h3>
              <div className="mb-4">
                <input
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Nhập tên kỹ năng..."
                  value={updateSkillName}
                  onChange={(e) => {
                    setUpdateSkillName(e.target.value);
                    setUpdateError("");
                  }}
                  maxLength={100}
                  autoFocus
                />
                {updateError && (
                  <div className="text-red-600 text-sm mt-1">{updateError}</div>
                )}
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setUpdateError("");
                    setUpdateSkillId(null);
                    setUpdateSkillName("");
                  }}
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
                  onClick={handleUpdateSkill}
                >
                  Cập nhật
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageSkill