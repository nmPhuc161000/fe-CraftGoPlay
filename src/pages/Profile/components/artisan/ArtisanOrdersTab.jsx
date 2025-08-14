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
import { FiPackage, FiUser, FiMapPin, FiDollarSign } from "react-icons/fi";

const ArtisanOrdersTab = () => {
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
        const res = await orderService.getOrderByArtisanId(
          user.id,
          1,
          100,
          status
        );

        if (res.data.error === 0 && Array.isArray(res.data.data)) {
          const transformed = res.data.data.map(transformOrderData);

          if (status === "") {
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const res = await orderService.updateStatusOrder(orderId, newStatus);
      if (res.data.error === 0) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, statusKey: convertStatus(newStatus), status: newStatus }
              : order
          )
        );
        setFilteredOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, statusKey: convertStatus(newStatus), status: newStatus }
              : order
          ).filter((order) => selectedStatus === "all" || order.status === selectedStatus)
        );
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
        showNotification("Cập nhật đơn hàng thành công", "success");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableStatusActions = (currentStatus) => {
    const actions = {
      Created: [
        { status: "Confirmed", label: "Xác nhận đơn hàng", color: "bg-green-600 hover:bg-green-700" },
        { status: "Rejected", label: "Từ chối đơn hàng", color: "bg-red-600 hover:bg-red-700" },
      ],
      Confirmed: [
        { status: "Preparing", label: "Bắt đầu chuẩn bị", color: "bg-blue-600 hover:bg-blue-700" },
        { status: "Cancelled", label: "Hủy đơn hàng", color: "bg-red-600 hover:bg-red-700" },
      ],
      Preparing: [
        { status: "ReadyForShipment", label: "Sẵn sàng giao hàng", color: "bg-purple-600 hover:bg-purple-700" },
        { status: "Cancelled", label: "Hủy đơn hàng", color: "bg-red-600 hover:bg-red-700" },
      ],
      ReadyForShipment: [
        { status: "Shipped", label: "Bắt đầu giao hàng", color: "bg-purple-600 hover:bg-purple-700" },
      ],
      Shipped: [
        { status: "Delivered", label: "Xác nhận đã giao", color: "bg-green-600 hover:bg-green-700" },
        { status: "DeliveryFailed", label: "Giao hàng thất bại", color: "bg-red-600 hover:bg-red-700" },
      ],
      Delivered: [
        { status: "DeliveryFailed", label: "Giao hàng thất bại", color: "bg-red-600 hover:bg-red-700" },
      ],
      ReturnRequested: [
        { status: "Returned", label: "Xác nhận đã trả hàng", color: "bg-pink-600 hover:bg-pink-700" },
      ],
    };
    return actions[currentStatus] || [];
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
          <div className="flex justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded"></div>
            <div className="ml-3 flex-1">
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
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#5e3a1e] flex items-center">
          <FiPackage className="mr-2" /> Quản lý đơn hàng
        </h2>
      </div>

      {/* Horizontal Status Filter with Counts */}
      <div className="mb-6 overflow-x-auto pb-2">
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

      {loading ? (
        renderSkeleton()
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
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
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
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
                      {statusConfig[order.statusKey]?.icon || <FiPackage />}
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

                    <div className="space-x-2">
                      {availableActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleUpdateStatus(order.id, action.status)
                          }
                          disabled={loading}
                          className={`px-3 py-1.5 text-white rounded text-sm font-medium transition-colors duration-200 ${action.color} ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
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
};

export default React.memo(ArtisanOrdersTab);