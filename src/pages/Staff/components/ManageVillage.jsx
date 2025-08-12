import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CraftVillageService from "../../../services/apis/craftvillageApi";

const ManageVillage = () => {
  // Dữ liệu mẫu, mỗi làng gồm: id, name, address, description, establishedAt, status ('active'|'inactive')
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewVillage, setViewVillage] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusVillage, setStatusVillage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteVillage, setDeleteVillage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createVillageName, setCreateVillageName] = useState("");
  const [createVillageDate, setCreateVillageDate] = useState("");
  const [createVillageDescription, setCreateVillageDescription] = useState("");
  const [createVillageLocation, setCreateVillageLocation] = useState("");
  const [createVillageLoading, setCreateVillageLoading] = useState(false);
  const [createVillageError, setCreateVillageError] = useState("");

  // Update modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateVillage, setUpdateVillage] = useState(null);
  const [updateVillageName, setUpdateVillageName] = useState("");
  const [updateVillageDate, setUpdateVillageDate] = useState("");
  const [updateVillageDescription, setUpdateVillageDescription] = useState("");
  const [updateVillageLocation, setUpdateVillageLocation] = useState("");
  const [updateVillageLoading, setUpdateVillageLoading] = useState(false);
  const [updateVillageError, setUpdateVillageError] = useState("");

  const pageSize = 10;

  // Cập nhật filtered mỗi khi data hoặc search thay đổi
  useEffect(() => {
    if (Array.isArray(data)) {
      const searchLower = (search || "").toLowerCase();
      setFiltered(
        data.filter((v) => {
          // Có thể là v.name hoặc v.village_Name tùy API trả về
          const name = v?.name || v?.village_Name || "";
          return name.toLowerCase().includes(searchLower);
        })
      );
    } else {
      setFiltered([]);
    }
  }, [data, search]);

  const totalPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Xem chi tiết làng
  const openView = (village) => {
    setViewVillage(village);
    setShowViewModal(true);
  };

  // Mở modal đổi trạng thái
  const openStatusChange = (village) => {
    setStatusVillage(village);
    setShowStatusModal(true);
  };

  // Mở modal xóa
  const openDelete = (village) => {
    setDeleteVillage(village);
    setShowDeleteModal(true);
  };

  // Mở modal tạo làng
  const openCreate = () => {
    setCreateVillageName("");
    setCreateVillageDate("");
    setCreateVillageDescription("");
    setCreateVillageLocation("");
    setCreateVillageError("");
    setShowCreateModal(true);
  };

  // Mở modal update làng
  const openUpdate = (village) => {
    setUpdateVillage(village);
    setUpdateVillageName(village?.village_Name || "");
    setUpdateVillageDate(
      village?.establishedDate
        ? new Date(village.establishedDate).toISOString().split("T")[0]
        : ""
    );
    setUpdateVillageDescription(village?.description || "");
    setUpdateVillageLocation(village?.location || "");
    setUpdateVillageError("");
    setShowUpdateModal(true);
  };

  // Xử lý đổi trạng thái thành lập
  const handleStatusChange = () => {
    if (!statusVillage) return;
    setData((prev) =>
      prev.map((v) =>
        v.id === statusVillage.id
          ? { ...v, status: v.status === "active" ? "inactive" : "active" }
          : v
      )
    );
    setShowStatusModal(false);
    setStatusVillage(null);
  };

  // Xử lý "xóa" (chỉ đổi status thành 'inactive')
  const handleDelete = () => {
    if (!deleteVillage) return;
    setData((prev) =>
      prev.map((v) =>
        v.id === deleteVillage.id ? { ...v, status: "inactive" } : v
      )
    );
    setShowDeleteModal(false);
    setDeleteVillage(null);
  };

  // Xử lý tạo làng mới
  const handleCreateVillage = async (e) => {
    e.preventDefault();
    setCreateVillageError("");
    if (!createVillageName.trim()) {
      setCreateVillageError("Vui lòng nhập tên làng.");
      return;
    }
    if (!createVillageDate) {
      setCreateVillageError("Vui lòng chọn ngày thành lập.");
      return;
    }
    if (!createVillageLocation.trim()) {
      setCreateVillageError("Vui lòng nhập địa chỉ làng.");
      return;
    }
    if (!createVillageDescription.trim()) {
      setCreateVillageError("Vui lòng nhập mô tả làng.");
      return;
    }
    setCreateVillageLoading(true);
    try {
      // Build formData according to API requirements
      const formData = {
        village_Name: createVillageName,
        description: createVillageDescription,
        location: createVillageLocation,
        establishedDate: new Date(createVillageDate).toISOString(), // Ensure ISO string
      };
      const response = await CraftVillageService.createCraftVillage(formData);
      // Optionally, use response.data if API returns the created object
      setData((prev) => [
        {
          ...formData,
          id: response?.data?.data?.id || Date.now(), // fallback if no id returned
          status: "active",
        },
        ...prev,
      ]);
      setShowCreateModal(false);
    } catch (err) {
      setCreateVillageError("Có lỗi xảy ra khi tạo làng mới.");
    } finally {
      setCreateVillageLoading(false);
    }
  };

  // Xử lý cập nhật làng nghề
  const handleUpdateVillage = async (e) => {
    e.preventDefault();
    setUpdateVillageError("");
    if (!updateVillageName.trim()) {
      setUpdateVillageError("Vui lòng nhập tên làng.");
      return;
    }
    if (!updateVillageDate) {
      setUpdateVillageError("Vui lòng chọn ngày thành lập.");
      return;
    }
    if (!updateVillageLocation.trim()) {
      setUpdateVillageError("Vui lòng nhập địa chỉ làng.");
      return;
    }
    if (!updateVillageDescription.trim()) {
      setUpdateVillageError("Vui lòng nhập mô tả làng.");
      return;
    }
    setUpdateVillageLoading(true);
    try {
      const formData = {
        id: updateVillage.id,
        village_Name: updateVillageName,
        description: updateVillageDescription,
        location: updateVillageLocation,
        establishedDate: new Date(updateVillageDate).toISOString(),
      };
      const response = await CraftVillageService.updateCraftVillage(formData);
      // Cập nhật lại data local
      setData((prev) =>
        prev.map((v) =>
          v.id === updateVillage.id
            ? {
                ...v,
                village_Name: updateVillageName,
                description: updateVillageDescription,
                location: updateVillageLocation,
                establishedDate: new Date(updateVillageDate).toISOString(),
              }
            : v
        )
      );
      setShowUpdateModal(false);
    } catch (err) {
      setUpdateVillageError("Có lỗi xảy ra khi cập nhật làng nghề.");
    } finally {
      setUpdateVillageLoading(false);
    }
  };

  const fetchCraftVillage = async () => {
    const response = await CraftVillageService.getCraftVillages();
    setData(response.data.data);
    // Không cần setFiltered ở đây vì đã có useEffect theo dõi data
    console.log(response.data.data);
  };

  useEffect(() => {
    fetchCraftVillage();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý làng nghề
          </h1>
          <div className="relative">
            <input
              className="w-full md:max-w-xs pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Tìm kiếm theo tên làng..."
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
        <div className="mt-4 md:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#b88a5a] to-[#e2b97c] text-white font-semibold shadow hover:from-[#cfa06a] hover:to-[#f3d6a2] transition"
            onClick={openCreate}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm làng mới
          </motion.button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#8b5e3c] to-[#c7903f]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                STT
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Tên làng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Ngày thành lập
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
            {paged.map((row, idx) => (
              <motion.tr
                key={row?.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  {(currentPage - 1) * pageSize + idx + 1}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                  {row?.village_Name || "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {row?.establishedDate ? (
                    new Date(row.establishedDate).toLocaleDateString("vi-VN")
                  ) : (
                    <span className="text-gray-400 italic">Chưa thành lập</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                                        ${
                                          row?.status === "active"
                                            ? "bg-green-100 text-green-700 border border-green-200"
                                            : "bg-gray-100 text-gray-500 border border-gray-200"
                                        }`}
                  >
                    {row?.status === "active"
                      ? "Đang hoạt động"
                      : "Ngừng hoạt động"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openView(row)}
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </motion.button>
                    {/* Nút update */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => openUpdate(row)}
                      title="Cập nhật làng nghề"
                    >
                      {/* Pencil/Edit icon */}
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </motion.button>
                    {/* <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`${
                        row?.establishedDate
                          ? "text-red-600 hover:text-red-800"
                          : "text-green-600 hover:text-green-800"
                      }`}
                      onClick={() => openStatusChange(row)}
                    >
                      {row?.establishedDate ? (
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
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </motion.button> */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-red-600"
                      onClick={() => openDelete(row)}
                      title="Xóa làng (chỉ đổi trạng thái)"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} đến{" "}
          {Math.min(currentPage * pageSize, filtered.length)} trên tổng số{" "}
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
            onClick={() => setCurrentPage((p) => Math.min(totalPage, p + 1))}
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

      {/* Modal Tạo Làng Nghề */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Thêm làng nghề mới
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowCreateModal(false)}
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
              </motion.button>
            </div>
            <form onSubmit={handleCreateVillage} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên làng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Nhập tên làng nghề"
                  value={createVillageName}
                  onChange={(e) => setCreateVillageName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Nhập địa chỉ làng nghề"
                  value={createVillageLocation}
                  onChange={(e) => setCreateVillageLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày thành lập <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={createVillageDate}
                  onChange={(e) => setCreateVillageDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Nhập mô tả làng nghề"
                  value={createVillageDescription}
                  onChange={(e) => setCreateVillageDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              {createVillageError && (
                <div className="text-red-600 text-sm">{createVillageError}</div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => setShowCreateModal(false)}
                  disabled={createVillageLoading}
                >
                  Hủy
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
                  disabled={createVillageLoading}
                >
                  {createVillageLoading ? "Đang tạo..." : "Tạo làng"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Update Village */}
      {showUpdateModal && updateVillage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Cập nhật làng nghề
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowUpdateModal(false)}
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
              </motion.button>
            </div>
            <form onSubmit={handleUpdateVillage} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên làng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Nhập tên làng nghề"
                  value={updateVillageName}
                  onChange={(e) => setUpdateVillageName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Nhập địa chỉ làng nghề"
                  value={updateVillageLocation}
                  onChange={(e) => setUpdateVillageLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày thành lập <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={updateVillageDate}
                  onChange={(e) => setUpdateVillageDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Nhập mô tả làng nghề"
                  value={updateVillageDescription}
                  onChange={(e) => setUpdateVillageDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              {updateVillageError && (
                <div className="text-red-600 text-sm">{updateVillageError}</div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => setShowUpdateModal(false)}
                  disabled={updateVillageLoading}
                >
                  Hủy
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 text-white rounded-lg bg-yellow-500 hover:bg-yellow-600 font-semibold"
                  disabled={updateVillageLoading}
                >
                  {updateVillageLoading ? "Đang cập nhật..." : "Cập nhật"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Modal View Village */}
      {showViewModal && viewVillage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-[#8b5e3c] to-[#c7903f] p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {viewVillage?.village_Name || "Chi tiết làng nghề"}
                  </h2>
                  <div className="flex items-center mt-2 space-x-4 text-white/90">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm">
                        {viewVillage?.establishedDate
                          ? new Date(
                              viewVillage.establishedDate
                            ).toLocaleDateString("vi-VN")
                          : "Chưa thành lập"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
                        />
                      </svg>
                      <span
                        className={`text-sm font-medium ${
                          viewVillage?.status === "active"
                            ? "text-green-200"
                            : "text-gray-200"
                        }`}
                      >
                        {viewVillage?.status === "active"
                          ? "Đang hoạt động"
                          : "Ngừng hoạt động"}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/80 hover:text-white transition-colors"
                  onClick={() => {
                    setShowViewModal(false);
                    setViewVillage(null);
                  }}
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
                </motion.button>
              </div>
            </div>

            {/* Content with scrollable area */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin cơ bản */}
                <div className="space-y-6">
                  {/* Địa chỉ */}
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Địa chỉ
                      </h3>
                    </div>
                    <p className="text-gray-700 pl-11">
                      {viewVillage?.location || "Chưa cập nhật"}
                    </p>
                  </div>

                  {/* Trạng thái */}
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Trạng thái
                      </h3>
                    </div>
                    <div className="pl-11">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          viewVillage?.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {viewVillage?.status === "active"
                          ? "Đang hoạt động"
                          : "Ngừng hoạt động"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mô tả */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 h-full">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Mô tả làng nghề
                    </h3>
                  </div>
                  <div className="pl-11">
                    {viewVillage?.description ? (
                      <div className="prose prose-sm max-w-none text-gray-700">
                        {viewVillage.description
                          .split("\n")
                          .map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">
                        Chưa có mô tả cho làng nghề này
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with action buttons */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowViewModal(false);
                  setViewVillage(null);
                }}
              >
                Đóng
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                  setShowViewModal(false);
                  openUpdate(viewVillage);
                }}
              >
                Chỉnh sửa
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Confirm Status Change */}
      {showStatusModal && statusVillage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4">
                {statusVillage.establishedDate ? (
                  <svg
                    className="w-full h-full text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-full h-full text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {statusVillage.establishedDate
                  ? "Chuyển sang chưa thành lập?"
                  : "Xác nhận đã thành lập?"}
              </h3>
              <p className="text-gray-500">
                Bạn có chắc chắn muốn{" "}
                {statusVillage.establishedDate
                  ? "chuyển làng về trạng thái chưa thành lập"
                  : "xác nhận làng đã thành lập"}
                ?
              </p>

              <div className="flex justify-center gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusVillage(null);
                  }}
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2 text-white rounded-lg ${
                    statusVillage.establishedDate
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={handleStatusChange}
                >
                  Xác nhận
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Confirm Delete */}
      {showDeleteModal && deleteVillage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4">
                <svg
                  className="w-full h-full text-red-600"
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
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Xác nhận xóa làng nghề?
              </h3>
              <p className="text-gray-500">
                Bạn có chắc chắn muốn{" "}
                <span className="font-semibold text-red-600">xóa</span> làng
                nghề này? (Thao tác này chỉ đổi trạng thái sang "Ngừng hoạt
                động")
              </p>
              <div className="flex justify-center gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteVillage(null);
                  }}
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Xác nhận
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageVillage;
