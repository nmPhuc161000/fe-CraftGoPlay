import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import logo from '../../../assets/images/logo.jpg';

function Sidebar() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 bg-gray-800 text-white font-nunito flex flex-col">
            <div className="p-4 flex items-center">
                <img src={logo} alt="CraftGoPlay" className="h-10 mr-2" />
                <h1 className="text-xl font-bold">CraftGoPlay</h1>
            </div>
            <nav className="flex-1">
                <NavLink
                    to="/admin/"
                    className={({ isActive }) =>
                        `block p-4 ${isActive ? 'bg-green-600' : 'hover:bg-green-700'}`
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/admin/products"
                    className={({ isActive }) =>
                        `block p-4 ${isActive ? 'bg-green-600' : 'hover:bg-green-700'}`
                    }
                >
                    Products
                </NavLink>
                <NavLink
                    to="/admin/orders"
                    className={({ isActive }) =>
                        `block p-4 ${isActive ? 'bg-green-600' : 'hover:bg-green-700'}`
                    }
                >
                    Orders
                </NavLink>
                <NavLink
                    to="/admin/analytics"
                    className={({ isActive }) =>
                        `block p-4 ${isActive ? 'bg-green-600' : 'hover:bg-green-700'}`
                    }
                >
                    Analytics
                </NavLink>
                <NavLink
                    to="/admin/messages"
                    className={({ isActive }) =>
                        `block p-4 ${isActive ? 'bg-green-600' : 'hover:bg-green-700'}`
                    }
                >
                    Messages
                </NavLink>
                <NavLink
                    to="/admin/profile"
                    className={({ isActive }) =>
                        `block p-4 ${isActive ? 'bg-green-600' : 'hover:bg-green-700'}`
                    }
                >
                    Profile
                </NavLink>
            </nav>
            <button
                onClick={handleLogout}
                className="p-4 text-left hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}

export default Sidebar;