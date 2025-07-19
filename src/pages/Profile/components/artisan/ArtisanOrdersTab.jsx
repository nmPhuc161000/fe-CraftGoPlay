import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import orderService from "../../../../services/apis/orderApi";
import dayjs from "dayjs";
import {
  FiPackage,
  FiCheck,
  FiX,
  FiTruck,
  FiDollarSign,
  FiUser,
  FiMapPin,
  FiClock,
  FiSlash,
  FiAlertCircle,
  FiFilter,
} from "react-icons/fi";
import { useNotification } from "../../../../contexts/NotificationContext";

export default function ArtisanOrdersTab() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const { showNotification } = useNotification();

  // Danh sách các trạng thái có thể lọc
  const statusFilters = [
    { value: "all", label: "Tất cả" },
    { value: "Pending", label: "Chờ xử lý" },
    { value: "Accepted", label: "Đã chấp nhận" },
    { value: "Processing", label: "Đang chuẩn bị" },
    { value: "Shipped", label: "Đang giao" },
    { value: "Completed", label: "Hoàn thành" },
    { value: "Rejected", label: "Đã từ chối" },
    { value: "Cancelled", label: "Đã hủy" },
    { value: "WaitingForPayment", label: "Chờ thanh toán" },
    { value: "Refund", label: "Hoàn tiền" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrderByArtisanId(user.id);

        if (res.data.error === 0 && Array.isArray(res.data.data)) {
          const transformed = res.data.data.map((order) => ({
            ...order,
            date: dayjs(order.creationDate).format("DD/MM/YYYY"),
            formattedDate: dayjs(order.creationDate).format(
              "HH:mm - DD/MM/YYYY"
            ),
            statusKey: convertStatus(order.status),
            paymentStatus: order.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
            paymentMethod:
              order.paymentMethod === "Online" ? "Online" : "Tiền mặt",
          }));
          setOrders(transformed);
          setFilteredOrders(transformed); // Mặc định hiển thị tất cả đơn hàng
        }
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  // Hàm lọc đơn hàng theo trạng thái
  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) => order.status === selectedStatus
      );
      setFilteredOrders(filtered);
    }
  }, [selectedStatus, orders]);

  const convertStatus = (status) => {
    switch (status) {
      case "Completed":
        return "completed";
      case "Shipped":
        return "shipped";
      case "Processing":
        return "processing";
      case "Accepted":
        return "accepted";
      case "Rejected":
        return "rejected";
      case "Cancelled":
        return "cancelled";
      case "WaitingForPayment":
        return "waitingForPayment";
      case "Refund":
        return "refund";
      case "Pending":
      default:
        return "pending";
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const res = await orderService.updateStatusOrder(orderId, newStatus);

      if (res.data.error === 0) {
        // Cập nhật lại danh sách đơn hàng
        const updatedOrders = orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                statusKey: convertStatus(newStatus),
                status: newStatus,
              }
            : order
        );
        showNotification("Cập nhật đơn hàng thành công", "success");
        setOrders(updatedOrders);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending: {
      text: "Chờ xử lý",
      color: "bg-gray-100 text-gray-800",
      icon: <FiClock className="text-gray-500" />,
    },
    accepted: {
      text: "Đã chấp nhận",
      color: "bg-blue-100 text-blue-800",
      icon: <FiCheck className="text-blue-500" />,
    },
    processing: {
      text: "Đang chuẩn bị",
      color: "bg-amber-100 text-amber-800",
      icon: <FiPackage className="text-amber-500" />,
    },
    shipped: {
      text: "Đang giao hàng",
      color: "bg-purple-100 text-purple-800",
      icon: <FiTruck className="text-purple-500" />,
    },
    completed: {
      text: "Hoàn thành",
      color: "bg-green-100 text-green-800",
      icon: <FiCheck className="text-green-500" />,
    },
    rejected: {
      text: "Đã từ chối",
      color: "bg-red-100 text-red-800",
      icon: <FiX className="text-red-500" />,
    },
    cancelled: {
      text: "Đã hủy",
      color: "bg-red-100 text-red-800",
      icon: <FiSlash className="text-red-500" />,
    },
    waitingForPayment: {
      text: "Chờ thanh toán",
      color: "bg-yellow-100 text-yellow-800",
      icon: <FiDollarSign className="text-yellow-500" />,
    },
    refund: {
      text: "Hoàn tiền",
      color: "bg-pink-100 text-pink-800",
      icon: <FiDollarSign className="text-pink-500" />,
    },
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getAvailableStatusActions = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return [
          {
            status: "Accepted",
            label: "Chấp nhận",
            color: "bg-green-600 hover:bg-green-700",
          },
          {
            status: "Rejected",
            label: "Từ chối",
            color: "bg-red-600 hover:bg-red-700",
          },
        ];
      case "Accepted":
        return [
          {
            status: "Processing",
            label: "Bắt đầu chuẩn bị",
            color: "bg-blue-600 hover:bg-blue-700",
          },
          {
            status: "Cancelled",
            label: "Hủy đơn",
            color: "bg-red-600 hover:bg-red-700",
          },
        ];
      case "Processing":
        return [
          {
            status: "Shipped",
            label: "Bắt đầu giao hàng",
            color: "bg-purple-600 hover:bg-purple-700",
          },
          {
            status: "Cancelled",
            label: "Hủy đơn",
            color: "bg-red-600 hover:bg-red-700",
          },
        ];
      case "Shipped":
        return [
          {
            status: "Completed",
            label: "Hoàn thành",
            color: "bg-green-600 hover:bg-green-700",
          },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#5e3a1e] flex items-center">
          <FiPackage className="mr-2" /> Quản lý đơn hàng
        </h2>

        {/* Filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusFilter(!showStatusFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <FiFilter />
            <span>Lọc theo trạng thái</span>
          </button>

          {showStatusFilter && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="p-2">
                {statusFilters.map((filter) => (
                  <div
                    key={filter.value}
                    onClick={() => {
                      setSelectedStatus(filter.value);
                      setShowStatusFilter(false);
                    }}
                    className={`px-4 py-2 text-sm rounded cursor-pointer ${
                      selectedStatus === filter.value
                        ? "bg-[#5e3a1e] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {filter.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hiển thị trạng thái filter đang chọn */}
      {selectedStatus !== "all" && (
        <div className="mb-4 flex items-center">
          <span className="text-sm text-gray-600 mr-2">Đang lọc:</span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              statusConfig[convertStatus(selectedStatus)]?.color ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {statusFilters.find((f) => f.value === selectedStatus)?.label}
          </span>
          <button
            onClick={() => setSelectedStatus("all")}
            className="ml-2 text-sm text-[#5e3a1e] hover:underline"
          >
            (Xóa lọc)
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {selectedStatus === "all"
              ? "Chưa có đơn hàng nào"
              : `Không có đơn hàng nào ở trạng thái "${
                  statusFilters.find((f) => f.value === selectedStatus)?.label
                }"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const availableActions = getAvailableStatusActions(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Header: Order ID + Date */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div>
                    <p className="text-sm text-gray-500">Mã đơn hàng</p>
                    <p className="font-medium">
                      #{order.id.split("-")[0].toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="font-medium">{order.formattedDate}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center mb-2">
                    <FiUser className="text-gray-500 mr-2" />
                    <span className="font-medium">
                      {order.user?.userName || "Khách hàng"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiMapPin className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      {order.userAddresses?.[0]?.address ||
                        order.user?.address ||
                        "Chưa có địa chỉ"}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 border-b border-gray-100">
                  {order.orderItems?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-3 last:mb-0"
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={
                            item.product?.productImages?.imageUrl ||
                            "https://via.placeholder.com/100"
                          }
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.product?.name || "Sản phẩm"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="ml-2 text-right">
                        <p className="font-medium">
                          {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary & Actions */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      {statusConfig[order.statusKey]?.icon || <FiAlertCircle />}
                      <span
                        className={`ml-2 px-3 py-1 text-xs rounded-full ${
                          statusConfig[order.statusKey]?.color ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusConfig[order.statusKey]?.text || order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tổng cộng</p>
                      <p className="font-bold text-lg text-[#5e3a1e]">
                        {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <FiDollarSign className="mr-1" />
                      <span
                        className={
                          order.isPaid ? "text-green-600" : "text-red-600"
                        }
                      >
                        {order.paymentStatus} ({order.paymentMethod})
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-x-2">
                      {availableActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleUpdateStatus(order.id, action.status)
                          }
                          disabled={loading}
                          className={`px-3 py-1 text-white rounded text-sm ${
                            action.color
                          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
