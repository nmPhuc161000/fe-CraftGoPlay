import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import orderService from "../../../../services/apis/orderApi";
import { useNotification } from "../../../../contexts/NotificationContext";
import {
  statusFilters,
  statusConfig,
  convertStatus,
  formatPrice,
  transformOrderData,
} from "../../../../utils/orderUtils";
import {
  FiShoppingBag,
  FiClock,
} from "react-icons/fi";

const OrdersTab = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { showNotification } = useNotification();

  // Fetch orders based on status
  useEffect(() => {
    const fetchOrders = async (status = "") => {
      try {
        setLoading(true);
        const res = await orderService.getOrderByUserId(
          user.id,
          1,
          100,
          status
        );

        if (res.data.error === 0 && Array.isArray(res.data.data)) {
          const transformed = res.data.data.map(transformOrderData);

          if (status === "") {
            // Tính toán số lượng cho từng trạng thái
            const counts = statusFilters.reduce((acc, filter) => {
              if (filter.value === "all") {
                acc[filter.value] = transformed.length;
              } else {
                acc[filter.value] = transformed.filter(
                  (order) => order.status === filter.value
                ).length;
              }
              return acc;
            }, {});
            setStatusCounts(counts);
            setOrders(transformed);
          }
          setFilteredOrders(transformed);
        }
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders(selectedStatus === "all" ? "" : selectedStatus);
    }
  }, [user, selectedStatus]);

  const handleUserAction = async (orderId, action) => {
    try {
      setLoading(true);
      let newStatus = "";

      switch (action) {
        case "cancel":
          newStatus = "Cancelled";
          break;
        case "complete":
          newStatus = "Completed";
          break;
        case "returnRequest":
          newStatus = "ReturnRequested";
          break;
        default:
          return;
      }

      if (newStatus) {
        // Optimistic update
        const updatedOrders = orders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus, statusKey: convertStatus(newStatus) }
            : order
        );
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders.filter(
          (order) => selectedStatus === "all" || order.status === selectedStatus
        ));

        // Cập nhật số lượng trạng thái
        setStatusCounts((prev) => {
          const newCounts = { ...prev };
          const oldStatus = orders.find((o) => o.id === orderId)?.status;
          if (oldStatus && oldStatus !== newStatus) {
            newCounts[oldStatus] = (newCounts[oldStatus] || 0) - 1;
            newCounts[newStatus] = (newCounts[newStatus] || 0) + 1;
            newCounts["all"] = orders.length;
          }
          return newCounts;
        });

        const res = await orderService.updateStatusOrder(orderId, newStatus);
        if (res.data.error === 0) {
          showNotification("Cập nhật đơn hàng thành công", "success");
        }
      } else if (action === "contact") {
        showNotification("Đã mở cửa sổ liên hệ với nghệ nhân", "info");
      }
    } catch (err) {
      console.error("Lỗi khi xử lý hành động:", err);
      showNotification("Có lỗi xảy ra khi xử lý", "error");
      // Rollback
      const originalRes = await orderService.getOrderByUserId(user.id, 1, 100, selectedStatus === "all" ? "" : selectedStatus);
      if (originalRes.data.error === 0 && Array.isArray(originalRes.data.data)) {
        const transformed = originalRes.data.data.map(transformOrderData);
        setOrders(transformed);
        setFilteredOrders(transformed);
      }
    } finally {
      setLoading(false);
    }
  };

  const getAvailableUserActions = (currentStatus) => {
    switch (currentStatus) {
      case "Created":
        return [
          { action: "cancel", label: "Hủy đơn hàng", color: "bg-red-600 hover:bg-red-700" },
        ];
      case "Confirmed":
      case "Preparing":
      case "AwaitingPayment":
      case "ReadyForShipment":
        return [
          { action: "cancel", label: "Hủy đơn hàng", color: "bg-red-600 hover:bg-red-700" },
          { action: "contact", label: "Liên hệ nghệ nhân", color: "bg-amber-600 hover:bg-amber-700" },
        ];
      case "Shipped":
        return [
          { action: "contact", label: "Liên hệ nghệ nhân", color: "bg-amber-600 hover:bg-amber-700" },
          { action: "cancel", label: "Hủy đơn hàng", color: "bg-red-600 hover:bg-red-700" },
        ];
      case "Delivered":
        return [
          { action: "returnRequest", label: "Yêu cầu trả hàng", color: "bg-orange-600 hover:bg-orange-700" },
          { action: "complete", label: "Xác nhận đã nhận hàng", color: "bg-green-600 hover:bg-green-700" },
        ];
      case "Completed":
        return [
          { action: "returnRequest", label: "Yêu cầu trả hàng", color: "bg-orange-600 hover:bg-orange-700" },
          { action: "complete", label: "Đánh giá sản phẩm", color: "bg-green-600 hover:bg-green-700" },
        ];
      default:
        return [];
    }
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white/80 rounded-2xl shadow-lg p-6 animate-pulse">
          <div className="flex justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl shadow-lg">
                <FiShoppingBag className="text-2xl text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Lịch sử đơn hàng
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Quản lý và theo dõi đơn hàng của bạn
                </p>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="mt-6 overflow-x-auto pb-2">
            <div className="flex gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedStatus(filter.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                    selectedStatus === filter.value
                      ? "bg-[#5e3a1e] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedStatus === filter.value
                      ? "bg-white text-[#5e3a1e]"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {statusCounts[filter.value] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          renderSkeleton()
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6">
              <FiShoppingBag className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {selectedStatus === "all"
                ? "Chưa có đơn hàng nào"
                : "Không tìm thấy đơn hàng"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {selectedStatus === "all"
                ? "Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm thủ công tuyệt vời!"
                : `Không có đơn hàng nào ở trạng thái "${
                    statusFilters.find((f) => f.value === selectedStatus)?.label
                  }"`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-6 border-b border-amber-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-600 p-3 rounded-xl shadow-md">
                        <FiShoppingBag className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-amber-700 mb-1">
                          Nghệ nhân
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {order.orderItems?.[0]?.artisanName ||
                            "Chưa rõ nghệ nhân"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-amber-700 mb-1">
                        Ngày đặt
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {order.formattedDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.orderItems?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                          <img
                            src={
                              item.product?.productImages?.imageUrl ||
                              "https://via.placeholder.com/100"
                            }
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                            {item.product?.name || "Sản phẩm"}
                          </h4>
                          <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-amber-600">
                            {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                        {statusConfig[order.statusKey]?.icon || (
                          <FiClock />
                        )}
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            statusConfig[order.statusKey]?.color ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusConfig[order.statusKey]?.text || order.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-amber-700 mb-1">
                        Tổng cộng
                      </p>
                      <p className="text-2xl font-bold text-amber-600 mb-2">
                        {formatPrice(order.totalPrice)}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
                          {order.paymentMethod}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full font-medium ${
                            order.paymentStatus === "Đã thanh toán"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {getAvailableUserActions(order.status).length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3 justify-end">
                      {getAvailableUserActions(order.status).map(
                        (action, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              handleUserAction(order.id, action.action)
                            }
                            disabled={loading}
                            className={`px-6 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${action.color
                              .replace("blue", "amber")
                              .replace("purple", "brown")} ${
                              loading
                                ? "opacity-50 cursor-not-allowed transform-none"
                                : ""
                            }`}
                          >
                            {action.label}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(OrdersTab);