import {
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiDollarSign,
  FiAlertCircle,
  FiSlash,
  FiCheck,
  FiX,
  FiPackage,
} from "react-icons/fi";
import dayjs from "dayjs";

export const statusFilters = [
  { value: "all", label: "Tất cả", icon: <FiShoppingBag /> },
  { 
    value: "pending", 
    label: "Chờ xác nhận", 
    icon: <FiClock />,
    includes: ["Created", "Confirmed"]
  },
  { 
    value: "preparing", 
    label: "Chờ lấy hàng", 
    icon: <FiPackage />,
    includes: ["Preparing", "ReadyForShipment"]
  },
  { 
    value: "shipping", 
    label: "Chờ giao hàng", 
    icon: <FiTruck />,
    includes: ["Shipped", "Delivered", "DeliveryFailed"]
  },
  { 
    value: "completed", 
    label: "Hoàn thành", 
    icon: <FiCheckCircle />,
    includes: ["Completed"]
  },
  { 
    value: "cancelled", 
    label: "Đã hủy", 
    icon: <FiXCircle />,
    includes: ["Rejected", "Cancelled"]
  },
  { 
    value: "return_refund", 
    label: "Trả hàng/Hoàn tiền", 
    icon: <FiDollarSign />,
    includes: ["ReturnRequested", "Returned", "Refunded"]
  },
];

export const statusConfig = {
  created: {
    text: "Đơn hàng mới tạo",
    color: "bg-gray-100 text-gray-800",
    icon: <FiClock className="text-gray-500" />,
    group: "pending"
  },
  confirmed: {
    text: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800",
    icon: <FiCheck className="text-blue-500" />,
    group: "pending"
  },
  rejected: {
    text: "Đã từ chối",
    color: "bg-red-100 text-red-800",
    icon: <FiX className="text-red-500" />,
    group: "cancelled"
  },
  preparing: {
    text: "Đang chuẩn bị",
    color: "bg-amber-100 text-amber-800",
    icon: <FiPackage className="text-amber-500" />,
    group: "preparing"
  },
  awaitingPayment: {
    text: "Chờ thanh toán",
    color: "bg-yellow-100 text-yellow-800",
    icon: <FiDollarSign className="text-yellow-500" />,
  },
  paymentFailed: {
    text: "Thanh toán thất bại",
    color: "bg-red-100 text-red-800",
    icon: <FiX className="text-red-500" />,
  },
  readyForShipment: {
    text: "Sẵn sàng giao",
    color: "bg-purple-100 text-purple-800",
    icon: <FiTruck className="text-purple-500" />,
    group: "preparing"
  },
  paid: {
    text: "Đã thanh toán",
    color: "bg-green-100 text-green-800",
    icon: <FiCheck className="text-green-500" />,
  },
  shipped: {
    text: "Đang giao",
    color: "bg-purple-100 text-purple-800",
    icon: <FiTruck className="text-purple-500" />,
    group: "shipping"
  },
  delivered: {
    text: "Đã giao",
    color: "bg-green-100 text-green-800",
    icon: <FiCheck className="text-green-500" />,
    group: "shipping"
  },
  completed: {
    text: "Hoàn thành",
    color: "bg-green-100 text-green-800",
    icon: <FiCheck className="text-green-500" />,
    group: "completed"
  },
  cancelled: {
    text: "Đã hủy",
    color: "bg-red-100 text-red-800",
    icon: <FiSlash className="text-red-500" />,
    group: "cancelled"
  },
  returnRequested: {
    text: "Yêu cầu trả hàng",
    color: "bg-orange-100 text-orange-800",
    icon: <FiAlertCircle className="text-orange-500" />,
    group: "return_refund"
  },
  returned: {
    text: "Đã trả hàng",
    color: "bg-pink-100 text-pink-800",
    icon: <FiTruck className="text-pink-500" />,
    group: "return_refund"
  },
  refunded: {
    text: "Đã hoàn tiền",
    color: "bg-pink-100 text-pink-800",
    icon: <FiDollarSign className="text-pink-500" />,
    group: "return_refund"
  },
  deliveryFailed: {
    text: "Giao hàng thất bại",
    color: "bg-red-100 text-red-800",
    icon: <FiX className="text-red-500" />,
    group: "shipping"
  },
};

export const convertStatus = (status) => {
  const statusMap = {
    Created: "created",
    Confirmed: "confirmed",
    Rejected: "rejected",
    Preparing: "preparing",
    AwaitingPayment: "awaitingPayment",
    PaymentFailed: "paymentFailed",
    ReadyForShipment: "readyForShipment",
    Paid: "paid",
    Shipped: "shipped",
    Delivered: "delivered",
    Completed: "completed",
    Cancelled: "cancelled",
    ReturnRequested: "returnRequested",
    Returned: "returned",
    Refunded: "refunded",
    DeliveryFailed: "deliveryFailed",
  };
  return statusMap[status] || "created";
};

// Hàm mới để lấy group của một status
export const getStatusGroup = (status) => {
  const statusKey = convertStatus(status);
  return statusConfig[statusKey]?.group || "other";
};

// Hàm mới để lọc đơn hàng theo group
export const filterOrdersByGroup = (orders, group) => {
  if (group === "all") return orders;
  
  const filter = statusFilters.find(f => f.value === group);
  if (!filter || !filter.includes) return [];
  
  return orders.filter(order => filter.includes.includes(order.status));
};

export const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export const transformOrderData = (order) => ({
  ...order,
  date: dayjs(order.creationDate).format("DD/MM/YYYY"),
  formattedDate: dayjs(order.creationDate).format("DD/MM/YYYY"),
  statusKey: convertStatus(order.status),
  statusGroup: getStatusGroup(order.status), // Thêm statusGroup
  paymentStatus: order.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
  delivery_Amount: formatPrice(order.delivery_Amount),
  paymentMethod:
    order.paymentMethod === "Online" ? "Thanh toán online" : "Thanh toán khi nhận hàng",
});