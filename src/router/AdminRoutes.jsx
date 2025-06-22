import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Admin from '../pages/Admin/Admin';
import Dashboard from '../pages/Admin/components/Dashboard';
import ProductList from '../pages/Admin/components/ProductList';
import OrderList from '../pages/Admin/components/OrderList';
import Analytics from '../pages/Admin/components/Analytics';
import Messages from '../pages/Admin/components/Messages';
import Profile from '../pages/Admin/components/Profile';

function AdminRoutes() {
    return (
        <Routes>
            <Route element={<Admin />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
            </Route>
        </Routes>
    );
}

export default AdminRoutes;