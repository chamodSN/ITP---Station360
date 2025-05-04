import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useEmployeeAuthStore } from '../store/authStore'
import { Bell } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { employee, isAuthenticated, logout, isLoading } = useEmployeeAuthStore();

  const handleNotificationsClick = () => {
    const audience = 'employees';
    navigate(`/notifications/${audience}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {

    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className='ml-4 mr-4 flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img onClick={() => navigate('/')} className='w-32 cursor-pointer' src={assets.logo} alt='logo' />
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
          <li className='py-1'>ANALYTICS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/employee-profile'>
          <li className='py-1'>PROFILE</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/leaves/apply'>
          <li className='py-1'>LEAVES</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/my-tasks'>
          <li className='py-1'>MY TASKS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>
      <div className='flex items-center gap-4'>
        {
          isAuthenticated ? (
            <div className='flex items-center gap-4'>

              <button className='relative'
                onClick={handleNotificationsClick}
              >
                <Bell className='w-6 h-6 text-gray-700 hover:text-black' />
              </button>
              <div className='flex item-center gap-2 cursor-pointer group relative'>
                <img
                  src={employee?.image || assets.profilePic}
                  alt='profile'
                  className='w-8 h-8 rounded-full object-cover'
                />
                <img src={assets.dropDownIcon} alt='dropdown' className='w-2.5 ' />
                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                  <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                    <p onClick={handleLogout} className='hover:text-black cursor-pointer'>Logout</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Login</button>
          )}
        <img className='w-6 md:hidden' src={assets.menuIcon} alt='menu' onClick={() => setShowMenu(true)} />
      </div>
    </div>
  )
}

export default Navbar