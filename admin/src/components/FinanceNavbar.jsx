import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/authAdmin';

const FinanceNavbar = () => {
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
            navigate(`/all-expences?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/all-expences');
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
                <NavLink to='/'><li className='py-1'>HOME</li></NavLink>
                <NavLink to='/finance-dashboard'><li className='py-1'>FINANCE DASHBOARD</li></NavLink>
                <NavLink to='/all-expences'><li className='py-1'>ALL EXPENCE</li></NavLink>
                <NavLink to='/add-bills'><li className='py-1'>ADD BILLS</li></NavLink>
                <NavLink to='/employee-salary'><li className='py-1'>EMPLOYEE SALARY</li></NavLink>
                <NavLink to='/add-expence'><li className='py-1'>ADD EXPENCE</li></NavLink>

            </ul>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search expenses..."
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

export default FinanceNavbar;
