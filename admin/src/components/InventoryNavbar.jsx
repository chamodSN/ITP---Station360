import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/authAdmin';

const InventoryNavbar = () => {
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
            navigate(`/all-inventory?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/all-inventory');
        }
        setSearchQuery(''); // Clear the input field after submitting
    };

    return (
        <div className='ml-4 mr-4 flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            <img
                onClick={() => navigate('/')}
                className='w-32 cursor-pointer'
                src={assets.logo}
                alt='logo'
            />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'><li className='py-1'>Home</li></NavLink>
                <NavLink to='/all-inventory'><li className='py-1'>ALL INVENTORY</li></NavLink>
                <NavLink to='/expiring-items'><li className='py-1'>EXPIRING ITEMS</li></NavLink>
                <NavLink to='/low-stock'><li className='py-1'>LOW STOCK ITEMS</li></NavLink>
                <NavLink to='/add-inventory'><li className='py-1'>ADD INVENTORY</li></NavLink>
                <NavLink to='/ordered-items'><li className='py-1'>ORDERED ITEMS</li></NavLink>
                <NavLink to='/stock-management'><li className='py-1'>STOCK MANAGEMENT</li></NavLink>
            </ul>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search inventory..."
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

            <div className='flex items-center gap-4'>
                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        className='bg-red-500 text-white px-8 py-3 rounded-full font-light hidden md:block'
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'
                    >
                        Login
                    </button>
                )}
                <img
                    className='w-6 md:hidden'
                    src={assets.menuIcon}
                    alt='menu'
                    onClick={() => setShowMenu(true)}
                />
            </div>
        </div>
    );
};

export default InventoryNavbar;
