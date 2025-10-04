import React, { useEffect, useState } from "react";
import {
  MdReportProblem,
  MdExpandMore,
  MdExpandLess,
  MdCheckCircle,
  MdCancel,
  MdFilterList,
  MdRefresh,
  MdClose,
  MdImage,
  MdPerson,
  MdShoppingBag,
} from "react-icons/md";
import returnRequestService from "../../../services/apis/returnrequestApi";
import {
  statusMap,
  statusColorMap,
  reasonMap,
  rejectReasonMap,
  orderItemStatusMap,
  formatDate,
  formatCurrency,
  isActionRequired,
} from "../../../utils/returnRequestUtils";
import { useNotification } from "../../../contexts/NotificationContext";
import { useConfirm } from "../../../components/ConfirmForm/ConfirmForm";

// Skeleton Loading Component
const ComplaintSkeleton = () => (
  <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
    <div className="p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Lightbox Component
const Lightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
      >
        <MdClose size={32} />
      </button>
      <img
        src={imageUrl}
        alt="Xem ảnh"
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
        crossOrigin="anonymous"
      />
    </div>
  );
};

// Info Badge Component
const InfoBadge = ({ icon: Icon, label, value, highlight = false }) => (
  <div
    className={`flex items-start gap-2 p-2 rounded-md ${
      highlight ? "bg-blue-50" : ""
    }`}
  >
    {Icon && (
      <Icon
        className={`text-lg mt-0.5 ${
          highlight ? "text-blue-600" : "text-gray-400"
        }`}
      />
    )}
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800 break-words">
        {value || "—"}
      </p>
    </div>
  </div>
);

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lightboxImage, setLightboxImage] = useState(null);
  const pageSize = 10;
  const { showNotification } = useNotification();
  const { confirm, ConfirmComponent } = useConfirm();

  useEffect(() => {
    fetchComplaints();
  }, [currentPage]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await returnRequestService.getListEscalated(
        currentPage,
        pageSize
      );
      if (res?.data) {
        setComplaints(res.data.data);
        setTotalPages(Math.ceil(res.data.totalCount / pageSize));
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khiếu nại:", error);
      showNotification({
        message: "Đã có lỗi xảy ra khi lấy danh sách khiếu nại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleResolveRequest = async (returnRequestId, acceptRefund) => {
    const confirmMessage = acceptRefund
      ? "Bạn có chắc chắn muốn chấp nhận hoàn tiền cho khiếu nại này?"
      : "Bạn có chắc chắn muốn từ chối hoàn tiền cho khiếu nại này?";

    try {
      const confirmed = await confirm({
        title: acceptRefund ? "Chấp nhận hoàn tiền" : "Từ chối hoàn tiền",
        message: confirmMessage,
        confirmText: acceptRefund ? "Chấp nhận" : "Từ chối",
        type: acceptRefund ? "default" : "danger",
      });

      if (!confirmed) return;

      await returnRequestService.resolveEscalatedRequest(
        returnRequestId,
        acceptRefund
      );

      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.id === returnRequestId
            ? { ...complaint, status: "Resolved", isRefunded: acceptRefund }
            : complaint
        )
      );

      showNotification(
        `Yêu cầu đã được xử lý: ${
          acceptRefund ? "Hoàn tiền" : "Từ chối hoàn tiền"
        }`,
        "success"
      );
    } catch (error) {
      console.error("Lỗi khi xử lý yêu cầu:", error);
      showNotification("Đã có lỗi xảy ra khi xử lý yêu cầu.", "error");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <ComplaintSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <ConfirmComponent />
      {lightboxImage && (
        <Lightbox
          imageUrl={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <MdReportProblem className="text-red-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Quản lý khiếu nại
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {complaints.length > 0
                  ? `${complaints.length} khiếu nại`
                  : "Không có khiếu nại"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchComplaints}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all hover:shadow-md font-medium"
            >
              <MdRefresh className="text-lg" />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all hover:shadow-md font-medium">
              <MdFilterList className="text-lg" />
              <span className="hidden sm:inline">Bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {complaints.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <MdReportProblem className="text-6xl text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không có khiếu nại nào
            </h3>
            <p className="text-gray-500">
              Tất cả khiếu nại đã được xử lý hoặc chưa có khiếu nại mới.
            </p>
          </div>
        ) : (
          <>
            {/* Complaints List */}
            <ul className="space-y-3">
              {complaints.map((c) => {
                const needsAction = isActionRequired(c.status);

                return (
                  <li
                    key={c.id}
                    className={`border-2 rounded-xl shadow-sm bg-white overflow-hidden transition-all duration-200 hover:shadow-lg ${
                      needsAction
                        ? "border-red-200 bg-red-50"
                        : "border-gray-100"
                    }`}
                  >
                    {/* Complaint Header */}
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleExpand(c.id)}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Status and Date */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                statusColorMap[c.status]
                              }`}
                            >
                              {statusMap[c.status] || c.status}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                              {formatDate(c.requestedAt)}
                            </span>
                            {needsAction && (
                              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-semibold animate-pulse shadow-sm">
                                🔥 Cần xử lý ngay
                              </span>
                            )}
                          </div>

                          {/* Reason and Description */}
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-800 flex items-center gap-2">
                              <span className="text-blue-600">•</span>
                              {reasonMap[c.reason] || c.reason}
                            </p>
                            <p
                              className="text-sm text-gray-600 line-clamp-2"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {c.description}
                            </p>
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                          {expandedId === c.id ? (
                            <MdExpandLess size={28} />
                          ) : (
                            <MdExpandMore size={28} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === c.id && (
                      <div className="px-4 pb-4 border-t-2 border-gray-100 pt-4 bg-white">
                        <div className="space-y-6">
                          {/* Complaint Details Section */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <MdReportProblem className="text-blue-600 text-xl" />
                              <h3 className="font-bold text-gray-800">
                                Chi tiết khiếu nại
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <InfoBadge
                                label="Lý do"
                                value={reasonMap[c.reason] || c.reason}
                              />
                              <InfoBadge
                                label="Ngày duyệt"
                                value={formatDate(c.approvedAt)}
                              />
                              <InfoBadge
                                label="Lý do từ chối"
                                value={
                                  c.rejectReturnReasonEnum
                                    ? rejectReasonMap[
                                        c.rejectReturnReasonEnum
                                      ] || c.rejectReturnReasonEnum
                                    : "—"
                                }
                              />
                              <InfoBadge
                                label="Trạng thái hoàn tiền"
                                value={
                                  <span
                                    className={
                                      c.isRefunded
                                        ? "text-green-600 font-semibold"
                                        : "text-red-600 font-semibold"
                                    }
                                  >
                                    {c.isRefunded
                                      ? "✓ Đã hoàn tiền"
                                      : "✗ Chưa hoàn tiền"}
                                  </span>
                                }
                              />
                            </div>
                            <div className="mt-3 p-3 bg-white rounded-md">
                              <p className="text-xs text-gray-500 mb-1">
                                Mô tả chi tiết
                              </p>
                              <p className="text-sm text-gray-700">
                                {c.description}
                              </p>
                            </div>
                          </div>

                          {/* User Info Section */}
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <MdPerson className="text-purple-600 text-xl" />
                              <h3 className="font-bold text-gray-800">
                                Thông tin người dùng
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <InfoBadge label="Email" value={c.user?.email} />
                              <InfoBadge label="Tên" value={c.user?.userName} />
                              <InfoBadge
                                label="Số điện thoại"
                                value={c.user?.phoneNumber}
                              />
                            </div>
                          </div>

                          {/* Images Section */}
                          {c.imageUrl && (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <MdImage className="text-amber-600 text-xl" />
                                <h3 className="font-bold text-gray-800">
                                  Hình ảnh đính kèm
                                </h3>
                              </div>
                              <div className="flex gap-3 flex-wrap">
                                <div
                                  className="relative group cursor-pointer"
                                  onClick={() => setLightboxImage(c.imageUrl)}
                                >
                                  <img
                                    src={c.imageUrl}
                                    alt="Ảnh khiếu nại"
                                    className="w-32 h-32 object-cover rounded-lg border-2 border-white shadow-md group-hover:shadow-xl transition-all"
                                    crossOrigin="anonymous"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                                    <MdImage className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Product Info Section */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <MdShoppingBag className="text-green-600 text-xl" />
                              <h3 className="font-bold text-gray-800">
                                Thông tin sản phẩm
                              </h3>
                            </div>
                            <div className="flex items-start gap-4 p-3 bg-white rounded-lg shadow-sm">
                              <img
                                src={
                                  c.orderItem?.product?.productImages?.imageUrl
                                }
                                alt={c.orderItem?.product?.name}
                                className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0"
                                crossOrigin="anonymous"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 mb-3">
                                  {c.orderItem?.product?.name}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  <InfoBadge
                                    label="Số lượng"
                                    value={c.orderItem?.quantity}
                                    highlight
                                  />
                                  <InfoBadge
                                    label="Giá"
                                    value={formatCurrency(
                                      c.orderItem?.unitPrice
                                    )}
                                    highlight
                                  />
                                  <InfoBadge
                                    label="Thợ thủ công"
                                    value={c.orderItem?.artisanName}
                                  />
                                  <InfoBadge
                                    label="Trạng thái"
                                    value={
                                      orderItemStatusMap[c.orderItem?.status] ||
                                      c.orderItem?.status
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {needsAction && (
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-100">
                              <button
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-semibold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResolveRequest(c.id, true);
                                }}
                              >
                                <MdCheckCircle size={20} />
                                Chấp nhận hoàn tiền
                              </button>
                              <button
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg font-semibold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResolveRequest(c.id, false);
                                }}
                              >
                                <MdCancel size={20} />
                                Từ chối hoàn tiền
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                  >
                    ← Trước
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`min-w-[40px] h-10 rounded-lg font-semibold transition-all ${
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                              : "border-2 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
