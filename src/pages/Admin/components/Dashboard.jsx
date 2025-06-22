import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';

function Dashboard() {
    const { user } = useContext(AuthContext);

    return (
        <div className="font-nunito">
            <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name || 'Artisan'}!</h2>
            {/* Marquee Banner */}
            <div className="bg-secondary text-white p-2 mb-4 overflow-hidden whitespace-nowrap animate-marquee">
                <span className="inline-block">CraftGoPlay - Manage Your Craft Empire! </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Products</h3>
                    <p>Manage your handmade crafts.</p>
                    <NavLink to="/admin/products" className="text-green-600 hover:underline">
                        Go to Products
                    </NavLink>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Orders</h3>
                    <p>Track and update order status.</p>
                    <NavLink to="/admin/orders" className="text-green-600 hover:underline">
                        Go to Orders
                    </NavLink>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Analytics</h3>
                    <p>View sales and product performance.</p>
                    <NavLink to="/admin/analytics" className="text-green-600 hover:underline">
                        Go to Analytics
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;