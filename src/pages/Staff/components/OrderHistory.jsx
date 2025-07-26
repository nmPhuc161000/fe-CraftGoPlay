import React, { useEffect, useState } from "react";
import { 
  FaHourglassHalf, // Pending
  FaCheckCircle,   // Accepted, Paid, Completed
  FaTimesCircle,   // Rejected, Cancelled
  FaMoneyBillWave, // Paid, Refund
  FaTruck,         // Shipped
  FaExclamationTriangle, // Refund
  FaSearch,
  FaBoxOpen
} from "react-icons/fa";
import adminService from "../../../services/apis/adminApi";

// Các trạng thái lấy từ API: Pending, Accepted, Rejected, Paid, Cancelled, Shipped, Refund, WaitingForPayment, Processing, Completed
const STATUS_TABS = [
  { key: "", label: "Tất cả đơn hàng", icon: null },
  { key: "Pending", label: "Chờ xác nhận", icon: <FaHourglassHalf className="text-yellow-500" /> },
  { key: "Accepted", label: "Đã xác nhận", icon: <FaCheckCircle className="text-blue-500" /> },
  { key: "Rejected", label: "Từ chối", icon: <FaTimesCircle className="text-red-400" /> },
  { key: "Paid", label: "Đã thanh toán", icon: <FaMoneyBillWave className="text-green-500" /> },
  { key: "Cancelled", label: "Đã hủy", icon: <FaTimesCircle className="text-gray-400" /> },
  { key: "Shipped", label: "Đã giao hàng", icon: <FaTruck className="text-blue-600" /> },
  { key: "Refund", label: "Hoàn tiền", icon: <FaExclamationTriangle className="text-orange-400" /> },
  { key: "WaitingForPayment", label: "Chờ thanh toán", icon: <FaHourglassHalf className="text-yellow-400" /> },
  { key: "Processing", label: "Đang xử lý", icon: <FaHourglassHalf className="text-blue-400" /> },
  { key: "Completed", label: "Hoàn thành", icon: <FaCheckCircle className="text-green-500" /> },
];

const STATUS_BADGE = {
  0: { text: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700 border border-yellow-300" },
  1: { text: "Đang đóng gói", color: "bg-blue-100 text-blue-700 border border-blue-300" },
  2: { text: "Đang giao hàng", color: "bg-blue-100 text-blue-700 border border-blue-300" },
  3: { text: "Chờ phản hồi", color: "bg-yellow-100 text-yellow-700 border border-yellow-300" },
  4: { text: "Thành công", color: "bg-green-100 text-green-700 border border-green-300" },
  5: { text: "Đã hủy", color: "bg-gray-100 text-gray-500 border border-gray-300" },
  6: { text: "Phản hồi xấu", color: "bg-orange-100 text-orange-700 border border-orange-300" },
  // fallback for string status if needed
  pending: { text: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700 border border-yellow-300" },
  packing: { text: "Đang đóng gói", color: "bg-blue-100 text-blue-700 border border-blue-300" },
  delivering: { text: "Đang giao hàng", color: "bg-blue-100 text-blue-700 border border-blue-300" },
  pending_feedback: { text: "Chờ phản hồi", color: "bg-yellow-100 text-yellow-700 border border-yellow-300" },
  success: { text: "Thành công", color: "bg-green-100 text-green-700 border border-green-300" },
  cancel: { text: "Đã hủy", color: "bg-gray-100 text-gray-500 border border-gray-300" },
  bad_feedback: { text: "Phản hồi xấu", color: "bg-orange-100 text-orange-700 border border-orange-300" },
};

const statusKeyMap = {
  0: "pending",
  1: "packing",
  2: "delivering",
  3: "pending_feedback",
  4: "success",
  5: "cancel",
  6: "bad_feedback",
};

const OrderHistory = () => {
  const [tab, setTab] = useState("");
  const [search, setSearch] = useState("");
  // orders là kiểu dữ liệu trả về từ API, ví dụ mẫu:
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [tab]);

  // Hàm này về cơ bản là đúng, nhưng có thể cải thiện kiểm tra null/undefined để tránh lỗi khi dữ liệu API không đầy đủ.
  function parseApiOrder(apiOrder) {
    // Kiểm tra apiOrder có tồn tại không
    if (!apiOrder) return {};

    // Kiểm tra orderItems có phải là mảng không
    const orderItems = Array.isArray(apiOrder.orderItems) ? apiOrder.orderItems : [];

    return {
      creationDate: apiOrder.creationDate
        ? new Date(apiOrder.creationDate).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      status: apiOrder.status ?? 0, // fallback to 0 nếu không có
      isPaid: apiOrder.isPaid ?? false,
      paymentMethod: apiOrder.paymentMethod ?? "",
      totalPrice: apiOrder.totalPrice ?? 0,
      products: orderItems.map((item) => {
        // Kiểm tra product và productImages
        const product = item.product || {};
        return {
          name: product.name ?? "",
          imageUrl: product.productImages.imageUrl ?? "",
          quantity: item.quantity ?? 1,
          price: item.unitPrice ?? 0,
        };
      }),
    };
  }

  async function fetchOrders() {
    try {
      const res = await adminService.getOrdersByStatus(tab, 1, 10);
      const apiData = res?.data?.data || [];
      // If apiData is an array of products, map each to an order
      const parsedOrders = Array.isArray(apiData)
        ? apiData.map(parseApiOrder)
        : [];
        console.log(parsedOrders);
      setOrders(parsedOrders);
    } catch (err) {
      setOrders([]);
    }
  }

  return (
    <div className="w-full min-h-screen bg-amber-25 flex justify-center items-start py-8 px-2">
      <div className="w-full bg-amber-25 rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 mx-auto">
        {/* Breadcrumb */}
        <div className="mb-2 text-sm text-gray-500">
          Trang chủ / Quản trị / <span className="text-blue-600 font-semibold">quản lý đơn hàng</span>
        </div>
        <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              className={`flex items-center gap-1 px-4 py-2 rounded-full border text-sm font-medium transition-all shadow-sm
                ${tab === t.key ? "bg-blue-100 border-blue-400 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50"}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon} {t.label}
              {t.key === "all" && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-200 text-blue-700 text-xs font-bold">{orders.length}</span>
              )}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="mb-8 relative">
          <input
            className="w-full border border-gray-300 rounded-full px-5 py-3 pr-12 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Tìm kiếm theo mã đơn hàng"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
        {/* Order List */}
        <div className="space-y-8">
          {orders.length === 0 && (
            <div className="text-center text-gray-400 py-12">Không tìm thấy đơn hàng nào.</div>
          )}
          {orders.map((order, idx) => {
            const statusKey = statusKeyMap[order.status] || order.status;
            const badge = STATUS_BADGE[order.status] || STATUS_BADGE[statusKey] || { text: statusKey, color: "bg-gray-100 text-gray-500 border border-gray-200" };
            return (
              <div key={order.orderCode} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 md:p-8 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    {/* <div className="text-xs text-gray-500 font-medium">
                      Mã đơn hàng: <span className="font-bold text-gray-700">{order.orderCode}</span>
                    </div> */}
                    <div className="text-xs text-gray-500">
                      Ngày tạo: <span className="font-semibold">{order.creationDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.isPaid && <span className="text-xs font-bold text-green-500 flex items-center gap-1"><FaMoneyBillWave />ĐÃ THANH TOÁN</span>}
                    <span className={`text-xs font-semibold px-2 py-1 rounded border ${badge.color}`}>{badge.text}</span>
                  </div>
                </div>
                <div className="mt-2 border-l-4 border-blue-100 bg-blue-50 rounded-xl p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-base font-medium text-blue-700">
                    <FaBoxOpen />
                    {order.paymentMethod && (
                      <span className="ml-2 text-xs text-gray-500 font-normal">Phương thức: <span className="font-semibold">{order.paymentMethod}</span></span>
                    )}
                  </div>
                  {order.products.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm border border-blue-50">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded border" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-700 text-base">{item.name}</div>
                        <div className="text-xs text-gray-500">Số lượng: {item.quantity}</div>
                        <div className="text-xs text-gray-500">Đơn giá: <span className="font-semibold text-blue-700">{item.price.toLocaleString()}đ</span></div>
                      </div>
                      <div className="text-xl font-bold text-red-500 whitespace-nowrap">{(item.price * item.quantity).toLocaleString()}đ</div>
                    </div>
                  ))}
                  <div className="flex justify-end mt-2">
                    <span className="font-bold text-lg text-black">
                      Tổng: <span className="text-red-500">{order.totalPrice.toLocaleString()}đ</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;