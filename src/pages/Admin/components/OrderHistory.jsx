import React, { useState } from "react";
import { FaHourglassHalf, FaBoxOpen, FaTruck, FaStar, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaSearch } from "react-icons/fa";

const STATUS_TABS = [
  { key: "all", label: "All orders", icon: null },
  { key: "pending", label: "Pending", icon: <FaHourglassHalf className="text-yellow-500" /> },
  { key: "packing", label: "Packing", icon: <FaBoxOpen className="text-blue-400" /> },
  { key: "delivering", label: "Delivering", icon: <FaTruck className="text-blue-600" /> },
  { key: "pending_feedback", label: "Pending to feedback", icon: <FaStar className="text-yellow-400" /> },
  { key: "success", label: "Success order", icon: <FaCheckCircle className="text-green-500" /> },
  { key: "cancel", label: "Cancel", icon: <FaTimesCircle className="text-gray-400" /> },
  { key: "bad_feedback", label: "Bad feedback", icon: <FaExclamationTriangle className="text-orange-400" /> },
];

const FAKE_ORDERS = [
  {
    code: "OD24220250601010940",
    created: "01/06/2025 08:09",
    status: "pending",
    paid: true,
    total: 44444,
    items: [
      {
        name: "Sản phẩm thủ công bằng Tre",
        img: "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg",
        quantity: 1,
        serial: null,
        warranty: null,
      },
    ],
    combo: "Combo thủ công",
  },
  {
    code: "OD24220250601005059",
    created: "01/06/2025 07:50",
    status: "success",
    paid: true,
    total: 44444,
    items: [
      {
        name: "Sản phẩm thủ công bằng Tre",
        img: "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg",
        quantity: 1,
        serial: "TCH0001",
        warranty: "01/09/2025 00:53",
      },
    ],
    combo: "Combo thủ công",
  },
  // ... Thêm nhiều đơn hàng giả với các trạng thái khác nhau nếu muốn ...
];

const STATUS_BADGE = {
  pending: { text: "Pending", color: "bg-yellow-100 text-yellow-700 border border-yellow-300" },
  packing: { text: "Packing", color: "bg-blue-100 text-blue-700 border border-blue-300" },
  delivering: { text: "Delivering", color: "bg-blue-100 text-blue-700 border border-blue-300" },
  pending_feedback: { text: "Pending to feedback", color: "bg-yellow-100 text-yellow-700 border border-yellow-300" },
  success: { text: "Success order", color: "bg-green-100 text-green-700 border border-green-300" },
  cancel: { text: "Cancel", color: "bg-gray-100 text-gray-500 border border-gray-300" },
  bad_feedback: { text: "Bad feedback", color: "bg-orange-100 text-orange-700 border border-orange-300" },
};

const OrderHistory = () => {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = FAKE_ORDERS.filter(order => {
    const matchTab = tab === "all" ? true : order.status === tab;
    const matchSearch = order.code.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="w-full min-h-screen bg-amber-25 flex justify-center items-start py-8 px-2">
      <div className="w-full bg-amber-25 rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 mx-auto">
        {/* Breadcrumb */}
        <div className="mb-2 text-sm text-gray-500">
          Home / Admin / <span className="text-blue-600 font-semibold">manage order</span>
        </div>
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
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
                <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-200 text-blue-700 text-xs font-bold">{FAKE_ORDERS.length}</span>
              )}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="mb-8 relative">
          <input
            className="w-full border border-gray-300 rounded-full px-5 py-3 pr-12 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Search by order code"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
        {/* Order List */}
        <div className="space-y-8">
          {filtered.length === 0 && (
            <div className="text-center text-gray-400 py-12">No orders found.</div>
          )}
          {filtered.map((order, idx) => (
            <div key={order.code} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 md:p-8 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500 font-medium">Order code: <span className="font-bold text-gray-700">{order.code}</span></div>
                  <div className="text-xs text-gray-500">Create date: <span className="font-semibold">{order.created}</span></div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {order.paid && <span className="text-xs font-bold text-green-500">PAID</span>}
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${STATUS_BADGE[order.status]?.color || "bg-gray-100 text-gray-500 border-gray-200"}`}>{STATUS_BADGE[order.status]?.text || order.status}</span>
                </div>
              </div>
              <div className="mt-2 border-l-4 border-blue-100 bg-blue-50 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-base font-medium text-blue-700">
                  <FaBoxOpen />
                  {order.combo}
                </div>
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm border border-blue-50">
                    <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded border" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-700 text-base">{item.name}</div>
                      <div className="text-xs text-gray-500">Quantity: {item.quantity}</div>
                      {item.serial && <div className="text-xs text-gray-400">Warranty serial number: <span className="font-semibold">{item.serial}</span></div>}
                      {item.warranty && <div className="text-xs text-green-500">Warranty until: {item.warranty}</div>}
                    </div>
                    <div className="text-xl font-bold text-red-500 whitespace-nowrap">{order.total.toLocaleString()}đ</div>
                  </div>
                ))}
                <div className="flex justify-end mt-2">
                  <span className="font-bold text-lg text-black">Total: <span className="text-red-500">{order.total.toLocaleString()}đ</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory; 