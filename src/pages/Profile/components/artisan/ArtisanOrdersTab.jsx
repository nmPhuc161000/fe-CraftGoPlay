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
  FiChevronDown,
  FiChevronUp,
  FiAlertTriangle,
  FiShoppingBag,
  FiCreditCard,
} from "react-icons/fi";

const ArtisanOrdersTab = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const { showNotification } = useNotification();
  const [expandedOrders, setExpandedOrders] = useState({});

  // State for modal and reason selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedReason, setSelectedReason] = useState("Empty");

  // List of reasons for "DeliveryAttemptFailed"
  const deliveryFailureReasons = [
    { value: "Empty", label: "Không có lý do" },
    { value: "RecipientUnavailable", label: "Người nhận không có ở nhà" },
    { value: "WrongAddress", label: "Sai/không tìm thấy địa chỉ" },
    { value: "PhoneNotReachable", label: "Không liên lạc được số điện thoại" },
    { value: "CustomerRefused", label: "Khách từ chối nhận hàng" },
    { value: "DamagedInTransit", label: "Hàng bị hư hỏng khi vận chuyển" },
    { value: "Other", label: "Lý do khác" },
  ];

  // Hàm lấy label của lý do giao hàng thất bại
  const getDeliveryFailureReasonLabel = (reasonValue) => {
    const reason = deliveryFailureReasons.find((r) => r.value === reasonValue);
    return reason ? reason.label : "Không xác định";
  };

  // Fetch total orders
  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const res = await orderService.countOrderByArtisanId(user.id);
        if (res.data.error === 0) {
          setTotalOrders(res.data.data.totalOrders);
        }
      } catch (err) {
        console.error("Lỗi khi lấy tổng số đơn hàng:", err);
      }
    };

    if (user?.id) fetchTotalOrders();
  }, [user]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async (group = "") => {
      try {
        setLoading(true);
        const res = await orderService.getOrderByArtisanId(
          user.id,
          pageIndex,
          pageSize,
          ""
        );

        if (res.data.error === 0 && Array.isArray(res.data.data)) {
          const transformed = res.data.data.map(transformOrderData);
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

          if (group === "all" || group === "") {
            setFilteredOrders(transformed);
          } else {
            const filter = statusFilters.find((f) => f.value === group);
            setFilteredOrders(
              filter
                ? transformed.filter((order) =>
                    filter.includes.includes(order.status)
                  )
                : []
            );
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
  }, [user, selectedStatus, pageIndex, pageSize]);

  const totalPages = Math.ceil(totalOrders / pageSize);

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageIndex(newPage);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleUpdateStatus = async (orderId, newStatus, reason = "") => {
    try {
      setLoading(true);
      const res = await orderService.updateStatusOrder(
        orderId,
        newStatus,
        reason
      );
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
      showNotification("Lỗi khi cập nhật trạng thái đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the modal for "DeliveryAttemptFailed"
  const handleOpenReasonModal = (orderId) => {
    setSelectedOrderId(orderId);
    setSelectedReason("Empty"); // Reset to default reason
    setIsModalOpen(true);
  };

  // Handle confirming the reason selection
  const handleConfirmReason = () => {
    if (selectedOrderId && selectedReason) {
      handleUpdateStatus(
        selectedOrderId,
        "DeliveryAttemptFailed",
        selectedReason
      );
      setIsModalOpen(false);
      setSelectedOrderId(null);
      setSelectedReason("Empty");
    }
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    setSelectedReason("Empty");
  };

  const getAvailableStatusActions = (currentStatus) => {
    const actions = {
      Created: [
        {
          status: "Rejected",
          label: "Từ chối đơn hàng",
          color: "bg-red-600 hover:bg-red-700",
        },
        {
          status: "Confirmed",
          label: "Xác nhận đơn hàng",
          color: "bg-green-600 hover:bg-green-700",
        },
      ],
      Confirmed: [
        {
          status: "Preparing",
          label: "Bắt đầu chuẩn bị",
          color: "bg-blue-600 hover:bg-blue-700",
        },
      ],
      Preparing: [
        {
          status: "ReadyForShipment",
          label: "Sẵn sàng giao hàng",
          color: "bg-purple-600 hover:bg-purple-700",
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
          status: "DeliveryAttemptFailed",
          label: "Giao hàng không thành công",
          color: "bg-red-600 hover:bg-red-700",
          action: handleOpenReasonModal, // Custom action to open modal
        },
        {
          status: "Delivered",
          label: "Xác nhận đã giao",
          color: "bg-green-600 hover:bg-green-700",
        },
      ],
      DeliveryAttemptFailed: [
        {
          status: "Shipped",
          label: "Giao Hàng lại",
          color: "bg-purple-600 hover:bg-purple-700",
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
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Order Header - Clickable để mở rộng/thu gọn - Giống OrdersTab */}
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
                                Đơn hàng #{order.id.split("-")[0].toUpperCase()}
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
                          <div
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                              statusConfig[order.statusKey].color
                            }`}
                          >
                            {statusConfig[order.statusKey].icon}
                            <span className="ml-2">
                              {statusConfig[order.statusKey].text}
                            </span>
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

                  {/* Order Details - Chỉ hiển thị khi mở rộng */}
                  {expandedOrders[order.id] && (
                    <div className="border-t border-gray-100 bg-gray-50">
                      <div className="p-6">
                        {/* Hiển thị lý do giao hàng thất bại chỉ khi status là DeliveryAttemptFailed */}
                        {order.status === "DeliveryAttemptFailed" &&
                          order.reasonDeliveryFailed && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                              <div className="flex items-start">
                                <FiAlertTriangle className="text-red-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="text-lg font-semibold text-red-800 mb-2">
                                    Giao hàng thất bại
                                  </h4>
                                  <p className="text-red-700 mb-1">
                                    <span className="font-medium">Lý do: </span>
                                    {getDeliveryFailureReasonLabel(
                                      order.reasonDeliveryFailed
                                    )}
                                  </p>
                                  <p className="text-red-600 text-sm">
                                    Vui lòng thử giao hàng lại hoặc liên hệ hỗ
                                    trợ.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {/* Customer Information */}
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FiUser className="mr-2 text-blue-600" />
                            Thông tin khách hàng
                          </h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <FiUser size={16} className="text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Khách hàng
                                  </p>
                                  <p className="font-semibold text-gray-900">
                                    {order.userAddress?.fullName ||
                                      "Khách hàng"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <FiPhone
                                    size={16}
                                    className="text-green-600"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Điện thoại
                                  </p>
                                  <p className="font-medium text-gray-700">
                                    {order.userAddress?.phoneNumber ||
                                      "Chưa cập nhật"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                  <FiMapPin
                                    size={16}
                                    className="text-orange-600"
                                  />
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
                                  <FiTruck
                                    size={16}
                                    className="text-blue-600"
                                  />
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
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FiShoppingBag className="mr-2 text-blue-600" />
                            Sản phẩm đặt hàng
                          </h4>
                          <div className="space-y-4">
                            {order.orderItems?.map((item, index) => (
                              <div
                                key={index}
                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="relative">
                                    <img
                                      src={
                                        item.product?.productImages?.imageUrl ||
                                        "https://via.placeholder.com/100"
                                      }
                                      alt={item.product?.name}
                                      className="w-20 h-20 object-cover rounded-xl shadow-sm"
                                      crossOrigin="anonymous"
                                    />
                                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                      {item.quantity}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-3">
                                        <h5 className="font-semibold text-gray-900">
                                          {item.product?.name || "Sản phẩm"}
                                        </h5>
                                        <div
                                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            statusConfig[
                                              convertStatus(item.status)
                                            ]
                                              ? statusConfig[
                                                  convertStatus(item.status)
                                                ].color
                                              : "bg-gray-100 text-gray-700"
                                          }`}
                                        >
                                          {statusConfig[
                                            convertStatus(item.status)
                                          ] ? (
                                            <>
                                              {
                                                statusConfig[
                                                  convertStatus(item.status)
                                                ].icon
                                              }
                                              <span className="ml-1">
                                                {
                                                  statusConfig[
                                                    convertStatus(item.status)
                                                  ].text
                                                }
                                              </span>
                                            </>
                                          ) : (
                                            <span>Unknown Status</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                      <div className="flex items-center">
                                        <span className="font-medium">
                                          Số lượng:
                                        </span>
                                        <span className="ml-1">
                                          {item.quantity}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium">
                                          Giá:
                                        </span>
                                        <span className="ml-1 font-semibold text-blue-600">
                                          {formatPrice(item.unitPrice)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary & Actions */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FiDollarSign className="mr-2 text-green-600" />
                            Chi tiết thanh toán & vận chuyển
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h5 className="font-semibold text-gray-800 flex items-center">
                                <FiCreditCard className="mr-2 text-green-500" />
                                Chi tiết thanh toán
                              </h5>

                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Phương thức:
                                  </span>
                                  <span className="font-medium">
                                    {order.paymentMethod}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Trạng thái:
                                  </span>
                                  <span className="font-medium">
                                    {order.paymentStatus}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h5 className="font-semibold text-gray-800 flex items-center">
                                <FiDollarSign className="mr-2 text-orange-500" />
                                Chi tiết đơn hàng
                              </h5>

                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Tổng tiền hàng:
                                  </span>
                                  <span className="font-medium">
                                    {formatPrice(order.product_Amount)}
                                  </span>
                                </div>

                                {(order.productDiscount > 0 ||
                                  order.deliveryDiscount > 0 ||
                                  order.pointDiscount > 0) && (
                                  <div className="pt-2 border-t border-gray-100">
                                    <div className="text-gray-600 font-medium mb-1">
                                      Giảm giá:
                                    </div>
                                    {order.productDiscount > 0 && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 pl-2">
                                          - Giảm giá sản phẩm:
                                        </span>
                                        <span className="text-green-600">
                                          -{formatPrice(order.productDiscount)}
                                        </span>
                                      </div>
                                    )}
                                    {order.deliveryDiscount > 0 && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 pl-2">
                                          - Giảm giá vận chuyển:
                                        </span>
                                        <span className="text-green-600">
                                          -{formatPrice(order.deliveryDiscount)}
                                        </span>
                                      </div>
                                    )}
                                    {order.pointDiscount > 0 && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 pl-2">
                                          - Giảm giá từ xu:
                                        </span>
                                        <span className="text-green-600">
                                          -{formatPrice(order.pointDiscount)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="flex justify-between pt-2 border-t border-gray-100">
                                  <span className="text-gray-600">
                                    Phí vận chuyển:
                                  </span>
                                  <span className="font-medium text-orange-600">
                                    {order.delivery_Amount}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-gray-200 mt-4">
                                <div className="flex justify-between font-semibold text-lg">
                                  <span>Tổng cộng:</span>
                                  <span className="text-blue-600">
                                    {formatPrice(order.totalPrice)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 justify-end">
                          {availableActions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                action.action
                                  ? action.action(order.id)
                                  : handleUpdateStatus(order.id, action.status)
                              }
                              disabled={loading}
                              className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
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
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reason Selection Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chọn lý do giao hàng không thành công
            </h3>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              {deliveryFailureReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmReason}
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => handleChangePage(pageIndex - 1)}
          disabled={pageIndex === 1}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Trang trước
        </button>
        <span>
          Trang {pageIndex} / {totalPages}
        </span>
        <button
          onClick={() => handleChangePage(pageIndex + 1)}
          disabled={pageIndex === totalPages}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default React.memo(ArtisanOrdersTab);
