import React, { useState, useEffect } from 'react';
import adminApi from '../../../services/apis/adminApi';

function OrderList() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await adminApi.getOrders();
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await adminApi.updateOrderStatus(id, status);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className="font-nunito">
            <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left">Order ID</th>
                            <th className="p-4 text-left">Total</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-t">
                                <td className="p-4">{order._id}</td>
                                <td className="p-4">${order.totalAmount}</td>
                                <td className="p-4">{order.status}</td>
                                <td className="p-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="p-2 border rounded-md"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderList;