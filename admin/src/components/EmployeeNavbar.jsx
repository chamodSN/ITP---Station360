import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/authAdmin';

const EmployeeNavbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAdminAuthStore();
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            //  Navigate to employee list with query string for backend filter
            navigate(`/employees?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            // If search query is empty, clear the search query from the URL
            navigate('/employees');
        }
        setSearchQuery(''); // Clear the input field after submitting
    };

    return (
        <div className="ml-4 mr-4 flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
            <img
                onClick={() => navigate('/')}
                className="w-32 cursor-pointer"
                src={assets.logo}
                alt="logo"
            />
            <ul className="hidden md:flex items-start gap-5 font-medium">
                <NavLink to="/"><li className="py-1">Home</li></NavLink>
                <NavLink to="/add-employee"><li className="py-1">ADD EMPLOYEE</li></NavLink>
                <NavLink to="/employees"><li className="py-1">EMPLOYEE LIST</li></NavLink>
                <NavLink to="/leave-requests"><li className="py-1">LEAVE REQUESTS</li></NavLink>
            </ul>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border px-3 py-2 rounded-md text-sm"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                >
                    Search
                </button>
            </form>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-8 py-3 rounded-full font-light hidden md:block"
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
                    >
                        Login
                    </button>
                )}
                <img
                    className="w-6 md:hidden"
                    src={assets.menuIcon}
                    alt="menu"
                    onClick={() => setShowMenu(true)}
                />
            </div>
        </div>
    );
};

export default EmployeeNavbar;
