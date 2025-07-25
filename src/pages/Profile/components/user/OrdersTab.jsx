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
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiCreditCard,
  FiTruck,
  FiStar,
  FiCheck
} from "react-icons/fi";

const OrdersTab = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState({});
  const { showNotification } = useNotification();

  // Fetch orders based on status
  useEffect(() => {
    const fetchOrders = async (status = "") => {
      try {
        setLoading(true);
        const res = await orderService.getOrderByUserId(user.id, 1, 100, status);

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
        showNotification("Lỗi khi lấy danh sách đơn hàng", "error");
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
        const updatedOrders = orders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus, statusKey: convertStatus(newStatus) }
            : order
        );
        setOrders(updatedOrders);
        setFilteredOrders(
          updatedOrders.filter(
            (order) => selectedStatus === "all" || order.status === selectedStatus
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
      const originalRes = await orderService.getOrderByUserId(
        user.id,
        1,
        100,
        selectedStatus === "all" ? "" : selectedStatus
      );
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
          { 
            action: "cancel", 
            label: "Hủy đơn hàng", 
            color: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-200",
            icon: <FiX className="w-4 h-4" />
          },
        ];
      case "Confirmed":
      case "Preparing":
      case "AwaitingPayment":
      case "ReadyForShipment":
        return [
          { 
            action: "cancel", 
            label: "Hủy đơn hàng", 
            color: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-200",
            icon: <FiX className="w-4 h-4" />
          },
          { 
            action: "contact", 
            label: "Liên hệ nghệ nhân", 
            color: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-200",
            icon: <FiUser className="w-4 h-4" />
          },
        ];
      case "Shipped":
        return [
          { 
            action: "contact", 
            label: "Liên hệ nghệ nhân", 
            color: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-200",
            icon: <FiUser className="w-4 h-4" />
          },
          { 
            action: "cancel", 
            label: "Hủy đơn hàng", 
            color: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-200",
            icon: <FiX className="w-4 h-4" />
          },
        ];
      case "Delivered":
        return [
          { 
            action: "returnRequest", 
            label: "Yêu cầu trả hàng", 
            color: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-200",
            icon: <FiPackage className="w-4 h-4" />
          },
          { 
            action: "complete", 
            label: "Xác nhận đã nhận hàng", 
            color: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-200",
            icon: <FiCheck className="w-4 h-4" />
          },
        ];
      case "Completed":
        return [
          { 
            action: "returnRequest", 
            label: "Yêu cầu trả hàng", 
            color: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-200",
            icon: <FiPackage className="w-4 h-4" />
          },
          { 
            action: "ratting", 
            label: "Đánh giá sản phẩm", 
            color: "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-yellow-200",
            icon: <FiStar className="w-4 h-4" />
          },
        ];
      default:
        return [];
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng của tôi</h1>
          <p className="text-gray-600">Quản lý và theo dõi các đơn hàng của bạn</p>
        </div>

        {/* Status Filter Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiPackage className="mr-2 text-blue-600" />
              Lọc theo trạng thái
            </h3>
            <div className="flex flex-wrap gap-3">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedStatus(filter.value)}
                  className={`group relative flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedStatus === filter.value
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center">
                    {filter.icon}
                    <span className="ml-2">{filter.label}</span>
                    {statusCounts[filter.value] > 0 && (
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-bold ${
                        selectedStatus === filter.value
                          ? "bg-white text-blue-600"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {statusCounts[filter.value]}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 font-medium">Đang tải đơn hàng...</p>
            <p className="mt-2 text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FiShoppingBag className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có đơn hàng nào</h3>
              <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào trong danh mục này</p>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-200">
                Bắt đầu mua sắm
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 rounded-lg p-3">
                            <FiPackage className="text-blue-600 text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Đơn hàng #{order.id.split('-')[0].toUpperCase()}
                            </h3>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <FiCalendar className="mr-1" />
                                {order.formattedDate}
                              </div>
                              <div className="flex items-center">
                                <FiDollarSign className="mr-1" />
                                {formatPrice(order.totalPrice)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusConfig[order.statusKey].color}`}>
                          {statusConfig[order.statusKey].icon}
                          <span className="ml-2">{statusConfig[order.statusKey].text}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-gray-400 group-hover:text-gray-600 transition-colors">
                      {expandedOrders[order.id] ? (
                        <FiChevronUp className="text-2xl" />
                      ) : (
                        <FiChevronDown className="text-2xl" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrders[order.id] && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    <div className="p-6">
                      {/* Order Items */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <FiShoppingBag className="mr-2 text-blue-600" />
                          Sản phẩm đã đặt
                        </h4>
                        <div className="space-y-4">
                          {order.orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="relative">
                                  <img
                                    src={item.product.productImages.imageUrl}
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded-xl shadow-sm"
                                  />
                                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                    {item.quantity}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-900 mb-2">{item.product.name}</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                      <FiUser className="mr-1 text-gray-400" />
                                      <span className="font-medium">Nghệ nhân:</span>
                                      <span className="ml-1">{item.artisanName}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <FiPackage className="mr-1 text-gray-400" />
                                      <span className="font-medium">Số lượng:</span>
                                      <span className="ml-1">{item.quantity}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <FiDollarSign className="mr-1 text-gray-400" />
                                      <span className="font-medium">Giá:</span>
                                      <span className="ml-1 font-semibold text-blue-600">{formatPrice(item.unitPrice)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <FiCreditCard className="mr-2 text-green-600" />
                            Thông tin thanh toán
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phương thức:</span>
                              <span className="font-medium">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Trạng thái:</span>
                              <span className="font-medium">{order.paymentStatus}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <FiTruck className="mr-2 text-orange-600" />
                            Thông tin vận chuyển
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phí vận chuyển:</span>
                              <span className="font-medium text-orange-600">{order.delivery_Amount}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        {getAvailableUserActions(order.status).map((action) => (
                          <button
                            key={action.action}
                            onClick={() => handleUserAction(order.id, action.action)}
                            className={`flex items-center px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${action.color}`}
                          >
                            {action.icon}
                            <span className="ml-2">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(OrdersTab);