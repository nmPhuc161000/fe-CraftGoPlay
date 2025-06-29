import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

export default function OrdersTab() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([
    {
      id: "DH-2023-001",
      date: "15/03/2023",
      total: 1850000,
      status: "completed",
      items: 2,
    },
    {
      id: "DH-2023-002",
      date: "22/04/2023",
      total: 2450000,
      status: "shipping",
      items: 1,
    },
  ]);

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    shipping: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    processing: "bg-amber-100 text-amber-800",
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#5e3a1e]">Lịch sử đơn hàng</h3>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Mã đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.total.toLocaleString()} VND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status === "completed"
                        ? "Hoàn thành"
                        : order.status === "shipping"
                        ? "Đang giao"
                        : order.status === "processing"
                        ? "Đang xử lý"
                        : "Đã hủy"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[#5e3a1e] hover:text-[#7a4b28]">
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
