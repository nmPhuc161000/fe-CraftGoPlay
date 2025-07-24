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
  { value: "Created", label: "Chờ xử lý", icon: <FiClock /> },
  { value: "Confirmed", label: "Đã xác nhận", icon: <FiCheckCircle /> },
  { value: "Rejected", label: "Đã từ chối", icon: <FiXCircle /> },
  { value: "Preparing", label: "Đang chuẩn bị", icon: <FiPackage /> },
  { value: "AwaitingPayment", label: "Chờ thanh toán", icon: <FiDollarSign /> },
  { value: "PaymentFailed", label: "Thanh toán thất bại", icon: <FiXCircle /> },
  { value: "ReadyForShipment", label: "Sẵn sàng giao", icon: <FiTruck /> },
  { value: "Paid", label: "Đã thanh toán", icon: <FiCheckCircle /> },
  { value: "Shipped", label: "Đang giao", icon: <FiTruck /> },
  { value: "Delivered", label: "Đã giao", icon: <FiCheckCircle /> },
  { value: "Completed", label: "Hoàn thành", icon: <FiCheckCircle /> },
  { value: "Cancelled", label: "Đã hủy", icon: <FiSlash /> },
  { value: "ReturnRequested", label: "Yêu cầu trả hàng", icon: <FiAlertCircle /> },
  { value: "Returned", label: "Đã trả hàng", icon: <FiTruck /> },
  { value: "Refunded", label: "Đã hoàn tiền", icon: <FiDollarSign /> },
  { value: "DeliveryFailed", label: "Giao hàng thất bại", icon: <FiXCircle /> },
];

export const statusConfig = {
  created: {
    text: "Đơn hàng mới tạo",
    color: "bg-gray-100 text-gray-800",
    icon: <FiClock className="text-gray-500" />,
  },
  confirmed: {
    text: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800",
    icon: <FiCheck className="text-blue-500" />,
  },
  rejected: {
    text: "Đã từ chối",
    color: "bg-red-100 text-red-800",
    icon: <FiX className="text-red-500" />,
  },
  preparing: {
    text: "Đang chuẩn bị",
    color: "bg-amber-100 text-amber-800",
    icon: <FiPackage className="text-amber-500" />,
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
  },
  delivered: {
    text: "Đã giao",
    color: "bg-green-100 text-green-800",
    icon: <FiCheck className="text-green-500" />,
  },
  completed: {
    text: "Hoàn thành",
    color: "bg-green-100 text-green-800",
    icon: <FiCheck className="text-green-500" />,
  },
  cancelled: {
    text: "Đã hủy",
    color: "bg-red-100 text-red-800",
    icon: <FiSlash className="text-red-500" />,
  },
  returnRequested: {
    text: "Yêu cầu trả hàng",
    color: "bg-orange-100 text-orange-800",
    icon: <FiAlertCircle className="text-orange-500" />,
  },
  returned: {
    text: "Đã trả hàng",
    color: "bg-pink-100 text-pink-800",
    icon: <FiTruck className="text-pink-500" />,
  },
  refunded: {
    text: "Đã hoàn tiền",
    color: "bg-pink-100 text-pink-800",
    icon: <FiDollarSign className="text-pink-500" />,
  },
  deliveryFailed: {
    text: "Giao hàng thất bại",
    color: "bg-red-100 text-red-800",
    icon: <FiX className="text-red-500" />,
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
  paymentStatus: order.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
  paymentMethod:
    order.paymentMethod === "Online" ? "Thanh toán online" : "Thanh toán khi nhận hàng",
});