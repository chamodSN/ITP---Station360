import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const { logout } = useContext(AdminContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.info("Logged out successfully!");
        navigate('/employee-login'); 
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
};

export default AdminDashboard;
