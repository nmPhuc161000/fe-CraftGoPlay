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
  FiPackage,
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiChevronRight,
  FiCalendar,
  FiPhone,
  FiMail,
  FiTruck,
} from "react-icons/fi";

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
    const fetchOrders = async (group = "") => {
      try {
        setLoading(true);
        // Luôn lấy tất cả đơn hàng, sau đó lọc theo group ở client
        const res = await orderService.getOrderByArtisanId(user.id, 1, 100, "");

        if (res.data.error === 0 && Array.isArray(res.data.data)) {
          const transformed = res.data.data.map(transformOrderData);
          console.log("Transformed Orders:", transformed);

          // Tính counts cho từng group
          const counts = statusFilters.reduce((acc, filter) => {
            if (filter.value === "all") {
              acc[filter.value] = transformed.length;
            } else {
              acc[filter.value] = transformed.filter((order) =>
                filter.includes.includes(order.status)
              ).length;
            }
            return acc;
          }, {});

          setStatusCounts(counts);
          setOrders(transformed);

          // Lọc đơn hàng theo group được chọn
          if (group === "all" || group === "") {
            setFilteredOrders(transformed);
          } else {
            const filter = statusFilters.find((f) => f.value === group);
            if (filter && filter.includes) {
              setFilteredOrders(
                transformed.filter((order) =>
                  filter.includes.includes(order.status)
                )
              );
            } else {
              setFilteredOrders([]);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders(selectedStatus);
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
              ? {
                  ...order,
                  statusKey: convertStatus(newStatus),
                  status: newStatus,
                }
              : order
          )
        );
        setFilteredOrders((prev) =>
          prev
            .map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    statusKey: convertStatus(newStatus),
                    status: newStatus,
                  }
                : order
            )
            .filter(
              (order) =>
                selectedStatus === "all" || order.status === selectedStatus
            )
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
        {
          status: "Confirmed",
          label: "Xác nhận đơn hàng",
          color: "bg-green-600 hover:bg-green-700",
        },
        {
          status: "Rejected",
          label: "Từ chối đơn hàng",
          color: "bg-red-600 hover:bg-red-700",
        },
      ],
      Confirmed: [
        {
          status: "Preparing",
          label: "Bắt đầu chuẩn bị",
          color: "bg-blue-600 hover:bg-blue-700",
        },
        {
          status: "Cancelled",
          label: "Hủy đơn hàng",
          color: "bg-red-600 hover:bg-red-700",
        },
      ],
      Preparing: [
        {
          status: "ReadyForShipment",
          label: "Sẵn sàng giao hàng",
          color: "bg-purple-600 hover:bg-purple-700",
        },
        {
          status: "Cancelled",
          label: "Hủy đơn hàng",
          color: "bg-red-600 hover:bg-red-700",
        },
      ],
      ReadyForShipment: [
        {
          status: "Shipped",
          label: "Bắt đầu giao hàng",
          color: "bg-purple-600 hover:bg-purple-700",
        },
      ],
      Shipped: [
        {
          status: "Delivered",
          label: "Xác nhận đã giao",
          color: "bg-green-600 hover:bg-green-700",
        },
        {
          status: "DeliveryFailed",
          label: "Giao hàng thất bại",
          color: "bg-red-600 hover:bg-red-700",
        },
      ],
      Delivered: [
        {
          status: "DeliveryFailed",
          label: "Giao hàng thất bại",
          color: "bg-red-600 hover:bg-red-700",
        },
      ],
      ReturnRequested: [
        {
          status: "Returned",
          label: "Xác nhận đã trả hàng",
          color: "bg-pink-600 hover:bg-pink-700",
        },
      ],
    };
    return actions[currentStatus] || [];
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm p-6 animate-pulse"
        >
          <div className="flex justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded-lg w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/6"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="h-8 bg-gray-200 rounded-full w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                    <FiPackage size={24} />
                  </div>
                  Quản lý đơn hàng
                </h1>
                <p className="mt-2 text-gray-600">
                  Theo dõi và xử lý các đơn hàng của bạn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Filter Pills */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FiFilter size={20} className="text-gray-500" />
            <h3 className="font-semibold text-gray-700">Lọc theo trạng thái</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedStatus === filter.value
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-102"
                }`}
              >
                <span
                  className={
                    selectedStatus === filter.value
                      ? "text-white"
                      : "text-gray-500"
                  }
                >
                  {filter.icon}
                </span>
                <span>{filter.label}</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedStatus === filter.value
                      ? "bg-white text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {statusCounts[filter.value] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          renderSkeleton()
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FiPackage size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có đơn hàng
            </h3>
            <p className="text-gray-500">
              {selectedStatus === "all"
                ? "Chưa có đơn hàng nào được tạo"
                : `Không có đơn hàng nào ở trạng thái "${
                    statusFilters.find((f) => f.value === selectedStatus)?.label
                  }"`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const availableActions = getAvailableStatusActions(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="font-bold text-lg text-gray-900">
                          #{order.id.split("-")[0].toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiCalendar size={16} />
                          <span className="text-sm">{order.formattedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusConfig[order.statusKey]?.icon}
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            statusConfig[order.statusKey]?.color ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusConfig[order.statusKey]?.text || order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FiUser size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Khách hàng</p>
                            <p className="font-semibold text-gray-900">
                              {order.userAddress?.fullName || "Khách hàng"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FiPhone size={16} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Điện thoại</p>
                            <p className="font-medium text-gray-700">
                              {order.userAddress?.phoneNumber ||
                                "Chưa cập nhật"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <FiMapPin size={16} className="text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Địa chỉ giao hàng
                            </p>
                            <p className="font-medium text-gray-700 text-sm">
                              {order.userAddress?.fullAddress ||
                                "Chưa có địa chỉ"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FiTruck size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Phí vận chuyển
                            </p>
                            <p className="font-semibold text-gray-900">
                              {order.delivery_Amount || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiPackage size={18} />
                      Sản phẩm đặt hàng
                    </h4>
                    <div className="space-y-4">
                      {order.orderItems?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-sm">
                            <img
                              src={
                                item.product?.productImages?.imageUrl ||
                                "https://via.placeholder.com/100"
                              }
                              alt={item.product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 truncate">
                              {item.product?.name || "Sản phẩm"}
                            </h5>
                            <p className="text-sm text-gray-600 mt-1">
                              Số lượng:{" "}
                              <span className="font-medium">
                                {item.quantity}
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">
                              {formatPrice(item.unitPrice)}
                            </p>
                            <p className="text-sm text-gray-500">/ sản phẩm</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary & Actions */}
                  <div className="px-6 py-6">
                    <div className="flex flex-col gap-6">
                      {/* Payment Info + Total Price */}
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                        {/* Payment Info */}
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                order.isPaid ? "bg-green-100" : "bg-red-100"
                              }`}
                            >
                              <FiDollarSign
                                size={16}
                                className={
                                  order.isPaid
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Thanh toán
                              </p>
                              <p
                                className={`font-semibold ${
                                  order.isPaid
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {order.paymentStatus}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.paymentMethod}
                              </p>
                            </div>
                          </div>

                          {/* <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FiTruck size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Phí vận chuyển
                              </p>
                              <p className="font-semibold text-gray-900">
                                {order.delivery_Amount || 0}
                              </p>
                            </div>
                          </div> */}
                        </div>

                        {/* Total Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Tổng thanh toán
                          </p>
                          <p className="font-bold text-2xl text-blue-600">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="w-full flex flex-wrap justify-end gap-3">
                        {availableActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleUpdateStatus(order.id, action.status)
                            }
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                              action.color
                            } ${
                              loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            {action.label}
                            <FiChevronRight size={16} />
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
    </div>
  );
};

export default React.memo(ArtisanOrdersTab);
