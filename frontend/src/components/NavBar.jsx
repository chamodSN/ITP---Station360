import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Bell } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:4200/api/admin/notification/audience/users`
      );

      if (data.success) {
        setNotifications(data.notifications.slice(0, 5));
      } else {
        toast.error(data.message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

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
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
    setSearchQuery(''); // Clear the input field after submitting
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (isoString) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className='ml-4 mr-4 flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img onClick={() => navigate('/')} className='w-32 cursor-pointer' src={assets.logo} alt='logo' />
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
          <li className='py-1'>Home</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/services'>
          <li className='py-1'>ALL SERVICES</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/aboutus'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contactus'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2">
        <input
          type="text"
          placeholder="Search services..."
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
          <div className='flex items-center gap-4'>
            <div className="relative">
              <button 
                className='relative'
                onClick={handleNotificationsClick}
              >
                <Bell className='w-6 h-6 text-gray-700 hover:text-black' />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate(`/notifications/users`)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-gray-800">{notification.Title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1 line-clamp-2">{notification.body}</p>
                          <p className="text-xs text-gray-500">{formatDateTime(notification.updatedAt)}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={() => navigate('/notifications/users')}
                      className="w-full text-center text-sm text-primary hover:text-primary-dark py-1"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className='flex item-center gap-2 cursor-pointer group relative'>
              <img
                src={user?.image || assets.profilePic}
                alt='profile'
                className='w-8 h-8 rounded-full object-cover'
              />
              <img src={assets.dropDownIcon} alt='dropdown' className='w-2.5 ' />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-bookings')} className='hover:text-black cursor-pointer'>My Bookings</p>
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