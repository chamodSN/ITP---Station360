import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/authAdmin';

const NotificationNavbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAdminAuthStore();
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
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
                <NavLink to='/all-notifications'><li className='py-1'>ALL NOTIFICATIONS</li></NavLink>
                <NavLink to='/add-notification'><li className='py-1'>ADD NOTIFICATION</li></NavLink>
                <NavLink to='/contact'><li className='py-1'>CONTACT</li></NavLink>
            </ul>
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

export default NotificationNavbar;
