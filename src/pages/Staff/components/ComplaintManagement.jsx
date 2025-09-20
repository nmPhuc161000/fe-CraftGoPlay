import React, { useEffect, useState } from "react";
import {
  MdReportProblem,
  MdExpandMore,
  MdExpandLess,
  MdCheckCircle,
  MdCancel,
  MdFilterList,
  MdRefresh,
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

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  // Function to handle resolving escalated requests
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
      // Update the complaints list after resolving
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.id === returnRequestId
            ? { ...complaint, status: "Resolved", isRefunded: acceptRefund }
            : complaint
        )
      );
      showNotification({
        message: `Yêu cầu đã được xử lý: ${
          acceptRefund ? "Hoàn tiền" : "Từ chối hoàn tiền"
        }`,
        type: "success",
      });
    } catch (error) {
      console.error("Lỗi khi xử lý yêu cầu:", error);
      showNotification({
        message: "Đã có lỗi xảy ra khi xử lý yêu cầu.",
        type: "error",
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ConfirmComponent />
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MdReportProblem className="text-red-500 text-3xl" />
            Quản lý khiếu nại
          </h2>
          <div className="flex gap-2">
            <button
              onClick={fetchComplaints}
              className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <MdRefresh className="text-lg" />
              Làm mới
            </button>
            <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              <MdFilterList className="text-lg" />
              Bộ lọc
            </button>
          </div>
        </div>

        {complaints.length === 0 ? (
          <div className="text-center py-12">
            <MdReportProblem className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không có khiếu nại nào.</p>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              {complaints.map((c) => (
                <li
                  key={c.id}
                  className="border rounded-lg shadow-sm bg-white overflow-hidden transition-all hover:shadow-md"
                >
                  <div
                    className="p-4 cursor-pointer flex justify-between items-start"
                    onClick={() => toggleExpand(c.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColorMap[c.status]
                          }`}
                        >
                          {statusMap[c.status] || c.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(c.requestedAt)}
                        </span>
                      </div>
                      <p className="font-medium text-gray-800">
                        Lý do: {reasonMap[c.reason] || c.reason}
                      </p>
                      <p
                        className="text-sm text-gray-600 mt-1"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {c.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isActionRequired(c.status) && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full animate-pulse">
                          Cần xử lý
                        </span>
                      )}
                      <span className="text-gray-400">
                        {expandedId === c.id ? (
                          <MdExpandLess size={24} />
                        ) : (
                          <MdExpandMore size={24} />
                        )}
                      </span>
                    </div>
                  </div>

                  {expandedId === c.id && (
                    <div className="px-4 pb-4 border-t pt-4 space-y-4 text-sm text-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">
                            Chi tiết khiếu nại
                          </h3>
                          <div className="space-y-2">
                            <p>
                              <span className="font-medium">Lý do:</span>{" "}
                              {reasonMap[c.reason] || c.reason}
                            </p>
                            <p>
                              <span className="font-medium">
                                Mô tả khiếu nại từ người mua:
                              </span>{" "}
                              {c.description}
                            </p>
                            <p>
                              <span className="font-medium">
                                Lý do từ chối:
                              </span>{" "}
                              {c.rejectReturnReasonEnum
                                ? rejectReasonMap[c.rejectReturnReasonEnum] ||
                                  c.rejectReturnReasonEnum
                                : "—"}
                            </p>
                            <p>
                              <span className="font-medium">Ngày duyệt:</span>{" "}
                              {formatDate(c.approvedAt)}
                            </p>
                            <p>
                              <span className="font-medium">Đã hoàn tiền:</span>{" "}
                              <span
                                className={
                                  c.isRefunded
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {c.isRefunded ? "Có" : "Chưa"}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">
                            Thông tin người dùng
                          </h3>
                          <div className="space-y-2">
                            <p>
                              <span className="font-medium">Email:</span>{" "}
                              {c.user?.email}
                            </p>
                            <p>
                              <span className="font-medium">Tên:</span>{" "}
                              {c.user?.userName}
                            </p>
                            <p>
                              <span className="font-medium">SĐT:</span>{" "}
                              {c.user?.phoneNumber || "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {c.imageUrl && (
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">
                            Hình ảnh đính kèm
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            <img
                              src={c.imageUrl}
                              alt="Ảnh khiếu nại"
                              className="w-32 h-32 object-cover rounded-md cursor-pointer border"
                              onClick={() => window.open(c.imageUrl, "_blank")}
                              crossOrigin="anonymous"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Thông tin sản phẩm
                        </h3>
                        <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-md">
                          <img
                            src={c.orderItem?.product?.productImages?.imageUrl}
                            alt={c.orderItem?.product?.name}
                            className="w-16 h-16 object-cover rounded-md border"
                            crossOrigin="anonymous"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {c.orderItem?.product?.name}
                            </p>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                              <p>
                                <span className="font-medium">Số lượng:</span>{" "}
                                {c.orderItem?.quantity}
                              </p>
                              <p>
                                <span className="font-medium">Giá:</span>{" "}
                                {formatCurrency(c.orderItem?.unitPrice)}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Thợ thủ công:
                                </span>{" "}
                                {c.orderItem?.artisanName || "—"}
                              </p>
                              <p>
                                <span className="font-medium">Trạng thái:</span>{" "}
                                {orderItemStatusMap[c.orderItem?.status] ||
                                  c.orderItem?.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons for escalated requests */}
                      {isActionRequired(c.status) && (
                        <div className="flex gap-3 pt-3 border-t">
                          <button
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolveRequest(c.id, true);
                            }}
                          >
                            <MdCheckCircle />
                            Chấp nhận hoàn tiền
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolveRequest(c.id, false);
                            }}
                          >
                            <MdCancel />
                            Từ chối hoàn tiền
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-md ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "border"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
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