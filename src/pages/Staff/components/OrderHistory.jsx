import React, { useEffect, useState } from "react";
import {
  FaHourglassHalf, // Pending
  FaCheckCircle, // Accepted, Paid, Completed
  FaTimesCircle, // Rejected, Cancelled
  FaMoneyBillWave, // Paid, Refund
  FaTruck, // Shipped
  FaExclamationTriangle, // Refund
  FaSearch,
  FaBoxOpen,
} from "react-icons/fa";
import adminService from "../../../services/apis/adminApi";
import { formatDate } from "../../../utils/formatUtils";
import {
  statusFilters as STATUS_TABS,
  statusConfig as STATUS_BADGE,
  convertStatus,
} from "../../../utils/orderUtils";

// Các trạng thái lấy từ API: Pending, Accepted, Rejected, Paid, Cancelled, Shipped, Refund, WaitingForPayment, Processing, Completed

const OrderHistory = () => {
  const [tab, setTab] = useState("");
  const [search, setSearch] = useState("");
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
    const orderItems = Array.isArray(apiOrder.orderItems)
      ? apiOrder.orderItems
      : [];

    return {
      creationDate: apiOrder.creationDate,
      status: apiOrder.status ?? 0, // fallback to 0 nếu không có
      isPaid: apiOrder.isPaid ?? false,
      paymentMethod: apiOrder.paymentMethod ?? "",
      totalPrice: apiOrder.totalPrice ?? 0,
      delivery_Amount: apiOrder.delivery_Amount ?? 0,
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
          Trang chủ / Quản trị /{" "}
          <span className="text-blue-600 font-semibold">quản lý đơn hàng</span>
        </div>
        <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {STATUS_TABS.map((t) => (
            <button
              key={t.value}
              className={`flex items-center gap-1 px-4 py-2 rounded-full border text-sm font-medium transition-all shadow-sm
      ${
        tab === t.value
          ? "bg-blue-100 border-blue-400 text-blue-700"
          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50"
      }`}
              onClick={() => setTab(t.value)}
            >
              {t.icon} {t.label}
              {t.value === "all" && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-200 text-blue-700 text-xs font-bold">
                  {orders.length}
                </span>
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
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
        {/* Order List */}
        <div className="space-y-8">
          {orders.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              Không tìm thấy đơn hàng nào.
            </div>
          )}
          {orders.map((order, idx) => {
            const statusKey = convertStatus(order.status);
            const badge = STATUS_BADGE[statusKey] || {
              text: order.status,
              color: "bg-gray-100 text-gray-500 border border-gray-200",
            };
            return (
              <div
                key={order.orderCode}
                className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 md:p-8 flex flex-col gap-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    {/* <div className="text-xs text-gray-500 font-medium">
                      Mã đơn hàng: <span className="font-bold text-gray-700">{order.orderCode}</span>
                    </div> */}
                    <div className="text-xs text-gray-500">
                      Ngày tạo:{" "}
                      <span className="font-semibold">
                        {formatDate(order.creationDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.isPaid && (
                      <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                        <FaMoneyBillWave />
                        ĐÃ THANH TOÁN
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded border ${badge.color}`}
                    >
                      {badge.text}
                    </span>
                  </div>
                </div>
                <div className="mt-2 border-l-4 border-blue-100 bg-blue-50 rounded-xl p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-base font-medium text-blue-700">
                    <FaBoxOpen />
                    {order.paymentMethod && (
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        Phương thức:{" "}
                        <span className="font-semibold">
                          {order.paymentMethod}
                        </span>
                      </span>
                    )}
                  </div>
                  {order.products.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm border border-blue-50"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-700 text-base">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Số lượng: {item.quantity}
                        </div>
                        <div className="text-xs text-gray-500">
                          Đơn giá:{" "}
                          <span className="font-semibold text-blue-700">
                            {item.price.toLocaleString()}đ
                          </span>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-red-500 whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col items-end mt-2 gap-1">
                    <div className="text-sm text-gray-600">
                      Phí vận chuyển:{" "}
                      <span className="font-semibold">
                        {order.delivery_Amount.toLocaleString()}đ
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Tổng sản phẩm:{" "}
                      <span className="font-semibold">
                        {(
                          order.totalPrice - order.delivery_Amount
                        ).toLocaleString()}
                        đ
                      </span>
                    </div>

                    <div className="font-bold text-lg text-black">
                      Tổng thanh toán:{" "}
                      <span className="text-red-500">
                        {order.totalPrice.toLocaleString()}đ
                      </span>
                    </div>
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
