import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

function Admin() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-nunito">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default Admin;