import React, { useState, useEffect, useRef } from "react";
import voucherService from "../../../services/apis/voucherApi";
import { motion } from "framer-motion";

const ManageVoucher = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editIdx, setEditIdx] = useState(null);
    const [editVoucher, setEditVoucher] = useState(null);
    const [form, setForm] = useState({
        code: "",
        name: "",
        description: "",
        type: "",
        discountType: "",
        paymentMethod: "",
        minOrderValue: "",
        maxDiscountAmount: "",
        quantity: "",
        discount: "",
        startDate: "",
        endDate: "",
        isActive: true,
    });
    const [formError, setFormError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewIdx, setViewIdx] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const pageSize = 10;

    const filtered = data.filter((v) =>
        v.code?.toLowerCase().includes(search.toLowerCase()) ||
        v.name?.toLowerCase().includes(search.toLowerCase())
    );

    const t = (value) => ({
        Product: "Sản phẩm",
        Delivery: "Vận chuyển",
        Percentage: "Phần trăm",
        FixedAmount: "Số tiền cố định",
        All: "Tất cả",
        Cash: "Tiền mặt",
        Online: "Thanh toán trực tuyến",
    }[value] || value);

    const fetchVouchers = async () => {
        try {
            setLoading(true);
            const res = await voucherService.getAllVouchers();
            console.log("Fetch Vouchers Response:", res);
            if (res.success && res.data && res.data.data) {
                setData(res.data.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách mã giảm giá:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    useEffect(() => {
        if (editIdx !== null && editVoucher) {
            const isValid = filtered.some((v) => v.id === editVoucher.id);
            if (!isValid) {
                setShowModal(false);
                setEditIdx(null);
                setEditVoucher(null);
                setFormError("Thông tin mã giảm giá không còn hợp lệ do thay đổi tìm kiếm!");
            }
        }
    }, [filtered, editIdx, editVoucher]);

    const totalPage = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const openAdd = () => {
        setEditIdx(null);
        setEditVoucher(null);
        setForm({
            code: "",
            name: "",
            description: "",
            type: "",
            discountType: "",
            paymentMethod: "",
            minOrderValue: "",
            maxDiscountAmount: "",
            quantity: "",
            discount: "",
            startDate: "",
            endDate: "",
            isActive: true,
        });
        setShowModal(true);
        setFormError("");
    };

    const openEdit = (idx) => {
        const actualIndex = (currentPage - 1) * pageSize + idx;
        if (actualIndex >= 0 && actualIndex < filtered.length) {
            const voucher = filtered[actualIndex];
            if (!voucher.id) {
                setFormError("Mã giảm giá không có ID hợp lệ!");
                return;
            }
            console.log("Opening Edit Voucher:", voucher);
            setEditIdx(actualIndex);
            setEditVoucher(voucher);
            setForm({
                code: voucher.code || "",
                name: voucher.name || "",
                description: voucher.description || "",
                type: voucher.type || "",
                discountType: voucher.discountType || "",
                paymentMethod: voucher.paymentMethod || "",
                minOrderValue: voucher.minOrderValue || "",
                maxDiscountAmount: voucher.maxDiscountAmount || "",
                quantity: voucher.quantity || "",
                discount: voucher.discount || "",
                startDate: voucher.startDate ? new Date(voucher.startDate).toISOString().slice(0, 16) : "",
                endDate: voucher.endDate ? new Date(voucher.endDate).toISOString().slice(0, 16) : "",
                isActive: voucher.isActive || false,
            });
            setShowModal(true);
            setFormError("");
        } else {
            setFormError("Không tìm thấy thông tin mã giảm giá!");
        }
    };

    const openView = (idx) => {
        const actualIndex = (currentPage - 1) * pageSize + idx;
        if (actualIndex >= 0 && actualIndex < filtered.length) {
            setViewIdx(actualIndex);
            setShowViewModal(true);
        }
    };

    const handleAddEdit = async (e) => {
        e.preventDefault();
        if (!form.code?.trim()) {
            setFormError("Mã voucher không được để trống!");
            return;
        }
        if (!form.name?.trim()) {
            setFormError("Tên voucher không được để trống!");
            return;
        }
        if (!form.description?.trim()) {
            setFormError("Mô tả không được để trống!");
            return;
        }
        if (!form.discount || isNaN(form.discount) || Number(form.discount) <= 0) {
            setFormError("Giá trị giảm giá phải là số lớn hơn 0!");
            return;
        }
        if (!form.startDate) {
            setFormError("Ngày bắt đầu không được để trống!");
            return;
        }
        if (!form.endDate) {
            setFormError("Ngày kết thúc không được để trống!");
            return;
        }
        if (new Date(form.startDate) >= new Date(form.endDate)) {
            setFormError("Ngày kết thúc phải sau ngày bắt đầu!");
            return;
        }
        if (!["Product", "Delivery"].includes(form.type)) {
            setFormError("Vui lòng chọn loại voucher!");
            return;
        }
        if (!["Percentage", "FixedAmount"].includes(form.discountType)) {
            setFormError("Vui lòng chọn loại giảm giá!");
            return;
        }
        if (!["All", "Cash", "Online"].includes(form.paymentMethod)) {
            setFormError("Vui lòng chọn phương thức thanh toán!");
            return;
        }
        if (form.minOrderValue && (isNaN(form.minOrderValue) || Number(form.minOrderValue) < 0)) {
            setFormError("Giá trị đơn hàng tối thiểu phải là số không âm!");
            return;
        }
        if (form.maxDiscountAmount && (isNaN(form.maxDiscountAmount) || Number(form.maxDiscountAmount) < 0)) {
            setFormError("Số tiền giảm tối đa phải là số không âm!");
            return;
        }
        if (form.quantity && (isNaN(form.quantity) || Number(form.quantity) < 0)) {
            setFormError("Số lượng phải là số không âm!");
            return;
        }

        try {
            setLoading(true);
            const voucherData = {
                code: form.code.trim(),
                name: form.name.trim(),
                description: form.description.trim(),
                type: form.type,
                discountType: form.discountType,
                paymentMethod: form.paymentMethod,
                minOrderValue: form.minOrderValue || "",
                maxDiscountAmount: form.maxDiscountAmount || "",
                quantity: form.quantity || "",
                discount: form.discount,
                startDate: form.startDate,
                endDate: form.endDate,
                isActive: form.isActive,
                usedCount: editVoucher?.usedCount || 0,
            };

            console.log("Sending Voucher Data:", voucherData);

            if (editIdx === null) {
                const res = await voucherService.createVoucher(voucherData);
                console.log("Create Voucher Response:", res);
                if (res.success) {
                    await fetchVouchers();
                    setShowModal(false);
                    setForm({
                        code: "",
                        name: "",
                        description: "",
                        type: "",
                        discountType: "",
                        paymentMethod: "",
                        minOrderValue: "",
                        maxDiscountAmount: "",
                        quantity: "",
                        discount: "",
                        startDate: "",
                        endDate: "",
                        isActive: true,
                    });
                } else {
                    let errorMessage = "Thêm mới thất bại!";
                    if (res.message) {
                        errorMessage = res.message;
                    } else if (res.error) {
                        errorMessage = typeof res.error === "string" ? res.error : Object.values(res.error).flat().join(", ");
                    }
                    setFormError(errorMessage);
                }
            } else {
                if (!editVoucher || !editVoucher.id) {
                    setFormError("Không tìm thấy thông tin mã giảm giá!");
                    return;
                }
                console.log("Sending Update Voucher Data:", { id: editVoucher.id, ...voucherData });
                const res = await voucherService.updateVoucher(editVoucher.id, voucherData);
                console.log("Update Voucher Response:", res);
                if (res.success) {
                    await fetchVouchers();
                    setShowModal(false);
                    setForm({
                        code: "",
                        name: "",
                        description: "",
                        type: "",
                        discountType: "",
                        paymentMethod: "",
                        minOrderValue: "",
                        maxDiscountAmount: "",
                        quantity: "",
                        discount: "",
                        startDate: "",
                        endDate: "",
                        isActive: true,
                    });
                    setEditIdx(null);
                    setEditVoucher(null);
                } else {
                    let errorMessage = "Cập nhật thất bại!";
                    if (res.message) {
                        errorMessage = res.message;
                    } else if (res.error) {
                        errorMessage = typeof res.error === "string" ? res.error : Object.values(res.error).flat().join(", ");
                    }
                    setFormError(errorMessage);
                }
            }
        } catch (err) {
            console.error("Error in handleAddEdit:", err);
            setFormError(err?.response?.data?.message || err?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const getStatusDisplay = (status) => {
        return status ? "Đang hoạt động" : "Ngừng hoạt động";
    };

    const handleDelete = async () => {
        if (!deleteId) {
            alert("Không tìm thấy thông tin mã giảm giá cần xóa!");
            setShowDeleteModal(false);
            return;
        }

        try {
            setLoading(true);
            const res = await voucherService.deleteVoucher(deleteId);
            if (res.success) {
                await fetchVouchers();
                setShowDeleteModal(false);
                setDeleteId(null);
            } else {
                let errorMessage = "Xóa thất bại!";
                if (res.error) {
                    errorMessage = typeof res.error === "string" ? res.error : Object.values(res.error).flat().join(", ");
                }
                alert(errorMessage);
            }
        } catch (err) {
            alert(err?.message || "Có lỗi xảy ra khi xóa mã giảm giá!");
        } finally {
            setLoading(false);
        }
    };

    const openDelete = (voucherId) => {
        if (!voucherId) {
            alert("Không tìm thấy thông tin mã giảm giá!");
            return;
        }
        setDeleteId(voucherId);
        setShowDeleteModal(true);
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg p-6 w-full"
            >
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 w-full"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý mã giảm giá</h1>
                    <div className="relative">
                        <input
                            className="w-full md:max-w-xs pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            placeholder="Tìm kiếm mã giảm giá..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#8b5e3c] to-[#c7903f] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    onClick={openAdd}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Thêm mã giảm giá</span>
                </motion.button>
            </div>

            <div className="overflow-x-auto rounded-xl shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-[#8b5e3c] to-[#c7903f]">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">STT</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Mã</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tên</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Giảm giá</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Trạng thái</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ngày bắt đầu</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ngày kết thúc</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paged.map((row, idx) => (
                            <motion.tr
                                key={row.voucherId ?? `row-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-4 py-3 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{row.code}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{row.name}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {row.discountType === "Percentage" ? `${row.discount}%` : `${row.discount.toLocaleString()} VNĐ`}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${row.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                            }`}
                                    >
                                        {getStatusDisplay(row.isActive)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                                    {row.startDate ? new Date(row.startDate).toLocaleDateString("vi-VN") : ""}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                                    {row.endDate ? new Date(row.endDate).toLocaleDateString("vi-VN") : ""}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="text-green-600 hover:text-green-800"
                                            onClick={() => openView((currentPage - 1) * pageSize + idx)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => openEdit((currentPage - 1) * pageSize + idx)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => openDelete(row.voucherId)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                    {(filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1)} đến{" "}
                    {Math.min(currentPage * pageSize, filtered.length)} trên tổng số {filtered.length}
                </span>
                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>
                    <span className="px-4 py-2 rounded-lg bg-blue-50 font-medium text-blue-600">{currentPage}</span>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                        disabled={currentPage === totalPage || totalPage === 0}
                        onClick={() => setCurrentPage((p) => Math.min(totalPage, p + 1))}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25"
                    style={{ background: "rgba(0, 0, 0, 0.5)" }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {editIdx === null ? "Thêm mã giảm giá mới" : "Chỉnh sửa mã giảm giá"}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {editIdx === null
                                            ? "Điền thông tin để tạo mã giảm giá mới"
                                            : "Cập nhật thông tin mã giảm giá"}
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditIdx(null);
                                        setForm({
                                            code: "",
                                            name: "",
                                            description: "",
                                            type: "Product",
                                            discountType: "Percentage",
                                            paymentMethod: "All",
                                            minOrderValue: "",
                                            maxDiscountAmount: "",
                                            quantity: "",
                                            discount: "",
                                            startDate: "",
                                            endDate: "",
                                            isActive: true,
                                        });
                                        setFormError("");
                                    }}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-8">
                            <form onSubmit={handleAddEdit} className="space-y-6">
                                {/* Voucher Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã voucher</label>
                                    <input
                                        type="text"
                                        value={form.code}
                                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                                        disabled={editIdx !== null}  
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:border-transparent transition-all ${editIdx !== null
                                                ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 focus:ring-blue-400"
                                            }`}
                                        placeholder="Nhập mã voucher..."
                                    />
                                </div>

                                {/* Voucher Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên voucher</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                        placeholder="Nhập tên voucher..."
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                        placeholder="Nhập mô tả voucher..."
                                        rows="4"
                                    />
                                </div>

                                {/* Voucher Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại voucher</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                    >
                                        <option value="" disabled>-- Chọn loại voucher --</option>
                                        <option value="Product">Sản phẩm</option>
                                        <option value="Delivery">Vận chuyển</option>
                                    </select>
                                </div>

                                {/* Discount Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại giảm giá</label>
                                    <select
                                        value={form.discountType}
                                        onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                    >
                                        <option value="" disabled>-- Chọn loại giảm giá --</option>
                                        <option value="Percentage">Phần trăm</option>
                                        <option value="FixedAmount">Số tiền cố định</option>
                                    </select>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                                    <select
                                        value={form.paymentMethod}
                                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                    >
                                        <option value="" disabled>-- Chọn phương thức thanh toán --</option>
                                        <option value="All">Tất cả</option>
                                        <option value="Cash">Tiền mặt</option>
                                        <option value="Online">Thanh toán trực tuyến</option>
                                    </select>
                                </div>

                                {/* Min Order Value */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá trị đơn hàng tối thiểu</label>
                                    <input
                                        type="number"
                                        value={form.minOrderValue}
                                        onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                        placeholder="Nhập giá trị tối thiểu (VNĐ)..."
                                    />
                                </div>

                                {/* Max Discount Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số tiền giảm tối đa</label>
                                    <input
                                        type="number"
                                        value={form.maxDiscountAmount}
                                        onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                        placeholder="Nhập số tiền tối đa (VNĐ)..."
                                    />
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                                    <input
                                        type="number"
                                        value={form.quantity}
                                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                        placeholder="Nhập số lượng..."
                                    />
                                </div>

                                {/* Discount Value */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá trị giảm giá</label>
                                    <input
                                        type="number"
                                        value={form.discount}
                                        onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                        placeholder={form.discountType === "Percentage" ? "Nhập phần trăm (%)..." : "Nhập số tiền (VNĐ)..."}
                                    />
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                                    <input
                                        type="datetime-local"
                                        value={form.startDate}
                                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                                    <input
                                        type="datetime-local"
                                        value={form.endDate}
                                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Is Active */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={form.isActive}
                                            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                            className="mr-2"
                                        />
                                        Kích hoạt
                                    </label>
                                </div>

                                {/* Error Message */}
                                {formError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-lg bg-red-50 text-red-600 text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{formError}</span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditIdx(null);
                                            setForm({
                                                code: "",
                                                name: "",
                                                description: "",
                                                type: "Product",
                                                discountType: "Percentage",
                                                paymentMethod: "All",
                                                minOrderValue: "",
                                                maxDiscountAmount: "",
                                                quantity: "",
                                                discount: "",
                                                startDate: "",
                                                endDate: "",
                                                isActive: true,
                                            });
                                            setFormError("");
                                        }}
                                    >
                                        Hủy
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Đang xử lý...</span>
                                            </div>
                                        ) : (
                                            <span>{editIdx === null ? "Thêm mã giảm giá" : "Cập nhật"}</span>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* View Modal */}
            {showViewModal && viewIdx !== null && filtered[viewIdx] && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-30"
                    style={{ background: "rgba(0, 0, 0, 0.5)" }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative"
                    >
                        {/* Header with sticky position */}
                        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Chi tiết mã giảm giá</h2>
                                    <div className="mt-1 text-sm text-gray-500">
                                        Ngày tạo: {filtered[viewIdx].creationDate ? new Date(filtered[viewIdx].creationDate).toLocaleDateString("vi-VN") : "Chưa có"}
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={() => {
                                        setShowViewModal(false);
                                        setViewIdx(null);
                                    }}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column - Basic Info */}
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                                        <div className="text-sm text-blue-600 font-medium mb-1">Mã voucher</div>
                                        <div className="text-xl font-bold text-gray-900">{filtered[viewIdx].code}</div>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                                        <div className="text-sm text-purple-600 font-medium mb-1">Tên voucher</div>
                                        <div className="text-xl font-bold text-gray-900">{filtered[viewIdx].name}</div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                                        <div className="text-sm text-green-600 font-medium mb-1">Mô tả</div>
                                        <div className="text-gray-900">{filtered[viewIdx].description}</div>
                                    </div>

                                    <div className="text-center">
                                        <span
                                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${filtered[viewIdx].isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                                }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full mr-2 ${filtered[viewIdx].isActive ? "bg-green-500" : "bg-red-500"}`}
                                            ></span>
                                            {getStatusDisplay(filtered[viewIdx].isActive)}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Column - Details */}
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
                                        <div className="text-sm text-amber-600 font-medium mb-1">Thông tin giảm giá</div>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-gray-500">Loại voucher:</span>
                                                <span className="ml-2 font-medium">{t(filtered[viewIdx].type)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Loại giảm giá:</span>
                                                <span className="ml-2 font-medium">{t(filtered[viewIdx].discountType)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Giá trị giảm:</span>
                                                <span className="ml-2 font-medium">
                                                    {filtered[viewIdx].discountType === "Percentage"
                                                        ? `${filtered[viewIdx].discount}%`
                                                        : `${filtered[viewIdx].discount.toLocaleString()} VNĐ`}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Phương thức thanh toán:</span>
                                                <span className="ml-2 font-medium">{t(filtered[viewIdx].paymentMethod)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Giá trị đơn hàng tối thiểu:</span>
                                                <span className="ml-2 font-medium">
                                                    {filtered[viewIdx].minOrderValue ? `${filtered[viewIdx].minOrderValue.toLocaleString()} VNĐ` : "Không giới hạn"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Số tiền giảm tối đa:</span>
                                                <span className="ml-2 font-medium">
                                                    {filtered[viewIdx].maxDiscountAmount ? `${filtered[viewIdx].maxDiscountAmount.toLocaleString()} VNĐ` : "Không giới hạn"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Số lượng:</span>
                                                <span className="ml-2 font-medium">{filtered[viewIdx].quantity || "Không giới hạn"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                                        <div className="text-sm text-green-600 font-medium mb-1">Thời gian hiệu lực</div>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-gray-500">Ngày bắt đầu:</span>
                                                <span className="ml-2 font-medium">
                                                    {filtered[viewIdx].startDate ? new Date(filtered[viewIdx].startDate).toLocaleDateString("vi-VN") : "Chưa có"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Ngày kết thúc:</span>
                                                <span className="ml-2 font-medium">
                                                    {filtered[viewIdx].endDate ? new Date(filtered[viewIdx].endDate).toLocaleDateString("vi-VN") : "Chưa có"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                                        <div className="text-sm text-purple-600 font-medium mb-1">Thông tin tạo</div>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-gray-500">Ngày tạo:</span>
                                                <span className="ml-2 font-medium">
                                                    {filtered[viewIdx].startDate
                                                        ? new Date(filtered[viewIdx].startDate).toLocaleDateString("vi-VN")
                                                        : "Chưa có"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Người tạo:</span>
                                                <span className="ml-2 font-medium">{filtered[viewIdx].createdBy || "Nhân viên"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Modal Confirm Delete */}
            {showDeleteModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25"
                    style={{ background: "rgba(0, 0, 0, 0.5)" }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4">
                                <svg className="w-full h-full text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
                            <p className="text-gray-500">Bạn có chắc chắn muốn xóa mã giảm giá này? Hành động này không thể hoàn tác.</p>

                            <div className="flex justify-center gap-3 mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Hủy
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    onClick={handleDelete}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                            <span>Đang xử lý...</span>
                                        </div>
                                    ) : (
                                        "Xác nhận xóa"
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ManageVoucher;