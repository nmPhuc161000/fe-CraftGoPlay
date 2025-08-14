import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import returnRequestService from "../../../../services/apis/returnrequestApi";
import { useNotification } from "../../../../contexts/NotificationContext";
import { FiPackage, FiUser, FiPhone } from "react-icons/fi";

const statusFilters = [
    { value: "all", label: "Tất cả" },
    { value: "Pending", label: "Chờ xử lý" },
    { value: "Approved", label: "Đã chấp nhận" },
    { value: "Rejected", label: "Từ chối" },
    { value: "Refunded", label: "Đã hoàn tiền" },
];
const reasonMap = {
    ChangedMind: "Đổi ý",
    WrongItemDelivered: "Giao sai sản phẩm",
    DamagedOrDefective: "Sản phẩm bị hỏng hoặc lỗi",
    NotAsDescribed: "Không đúng mô tả",
    LateDelivery: "Giao hàng trễ",
    NoLongerNeeded: "Không còn nhu cầu",
    MissingPartsOrAccessories: "Thiếu phụ kiện hoặc bộ phận",
    OrderedByMistake: "Đặt nhầm",
    Other: "Lý do khác"
};

const ArtisanReturnRequestsTab = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [statusCounts, setStatusCounts] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const { showNotification } = useNotification();

    // Lấy danh sách yêu cầu trả hàng
    useEffect(() => {
        const fetchRequests = async (status = "") => {
            try {
                setLoading(true);
                const res = await returnRequestService.getReturnRequestByArtisanId(
                    user.id,
                    1,
                    100,
                    status
                );

                if (res.data.error === 0 && Array.isArray(res.data.data)) {
                    const data = res.data.data;

                    if (status === "") {
                        // Đếm số lượng theo status
                        const counts = statusFilters.reduce((acc, filter) => {
                            if (filter.value === "all") {
                                acc[filter.value] = data.length;
                            } else {
                                acc[filter.value] = data.filter((req) => req.status === filter.value).length;
                            }
                            return acc;
                        }, {});
                        setStatusCounts(counts);
                        setRequests(data);
                    }
                    setFilteredRequests(data);
                }
            } catch (err) {
                console.error("Lỗi khi lấy yêu cầu trả hàng:", err);
                showNotification("Lỗi khi tải dữ liệu yêu cầu trả hàng", "error");
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchRequests(selectedStatus === "all" ? "" : selectedStatus);
        }
    }, [user, selectedStatus]);

    const renderSkeleton = () => (
        <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );

    const handleChangeStatus = async (id, newStatus) => {
        try {
            await returnRequestService.updateStatusReturnRequest(id, newStatus);
            showNotification("Cập nhật trạng thái thành công", "success");

            // Reload danh sách
            const res = await returnRequestService.getReturnRequestByArtisanId(
                user.id,
                1,
                100,
                selectedStatus === "all" ? "" : selectedStatus
            );
            if (res.data.error === 0) {
                setFilteredRequests(res.data.data);
            }
        } catch (err) {
            console.error(err);
            showNotification("Lỗi khi cập nhật trạng thái", "error");
        }
    };

    const formatCurrency = (value) => value?.toLocaleString("vi-VN") + " đ";
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-[#5e3a1e] mb-6 flex items-center">
                <FiPackage className="mr-2" /> Yêu cầu trả hàng
            </h2>

            {/* Filter trạng thái */}
            <div className="mb-6 overflow-x-auto pb-2">
                <div className="flex gap-2">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setSelectedStatus(filter.value)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${selectedStatus === filter.value
                                ? "bg-[#5e3a1e] text-white"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                                }`}
                        >
                            {filter.label}
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full ${selectedStatus === filter.value
                                    ? "bg-white text-[#5e3a1e]"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {statusCounts[filter.value] || 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                renderSkeleton()
            ) : filteredRequests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">
                        {selectedStatus === "all"
                            ? "Chưa có yêu cầu trả hàng nào"
                            : `Không có yêu cầu nào ở trạng thái "${statusFilters.find((f) => f.value === selectedStatus)?.label}"`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((req) => (
                        <div
                            key={req.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Header: Request ID + Date */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <p className="text-sm text-gray-500">Mã yêu cầu</p>
                                    <p className="font-medium">
                                        #{req.id.split("-")[0].toUpperCase()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Ngày yêu cầu</p>
                                    <p className="font-medium">{formatDate(req.requestedAt)}</p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center mb-2">
                                    <FiUser className="text-gray-500 mr-2" />
                                    <span className="font-medium">{req.user.userName}</span>
                                </div>
                                <div className="flex items-center">
                                    <FiPhone className="text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-600">
                                        {req.user.phoneNumber}
                                    </span>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                                <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                                    <img
                                        src={req.orderItem.product.productImages.imageUrl}
                                        alt={req.orderItem.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">
                                        {req.orderItem.product.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        Giá: {formatCurrency(req.orderItem.unitPrice)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Số lượng: {(req.orderItem.quantity)}
                                    </p>
                                </div>
                            </div>

                            {/* Reason & Description */}
                            <div className="p-4 border-b border-gray-100 text-sm text-gray-700 space-y-3">
                                {/* Lý do */}
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start">
                                    <span className="text-yellow-600 font-bold mr-2">📌</span>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-yellow-800 whitespace-nowrap">Lý do:</p>
                                        <p className="text-gray-700">{reasonMap[req.reason] || req.reason}</p>
                                    </div>
                                </div>

                                {/* Mô tả */}
                                {req.description && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
                                        <span className="text-blue-600 font-bold mr-2">📝</span>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-blue-800 whitespace-nowrap">Mô tả:</p>
                                            <p className="text-gray-700">{req.description}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Ảnh minh họa */}
                                {req.imageUrl && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                                        <p className="font-semibold text-gray-800 mb-2">Ảnh yêu cầu trả hàng</p>
                                        <div className="w-32 h-32 rounded-md overflow-hidden border border-gray-300">
                                            <img
                                                src={req.imageUrl}
                                                alt="Ảnh yêu cầu trả hàng"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status + Action */}
                            <div className="p-4 flex justify-between items-center">
                                <span
                                    className={`px-3 py-1 text-xs rounded-full ${req.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : req.status === "Approved"
                                                ? "bg-green-100 text-green-700"
                                                : req.status === "Rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {req.status}
                                </span>

                                {req.status === "Pending" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleChangeStatus(req.id, "Approved")}
                                            className="px-3 py-1 text-xs bg-green-500 text-white rounded"
                                        >
                                            Chấp nhận
                                        </button>
                                        <button
                                            onClick={() => handleChangeStatus(req.id, "Rejected")}
                                            className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                                        >
                                            Từ chối
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default React.memo(ArtisanReturnRequestsTab);
