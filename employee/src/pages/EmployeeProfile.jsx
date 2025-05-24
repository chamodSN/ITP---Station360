import React, { useState, useEffect } from 'react';
import { useEmployeeAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const EmployeeProfile = () => {
    const { employee, checkAuth, isCheckingAuth, error, isAuthenticated } = useEmployeeAuthStore();
    const navigate = useNavigate();
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                if (!employee && !isAuthenticated) {
                    await checkAuth();
                }
            } catch (err) {
                console.error('Authentication error:', err);
                navigate('/login');
            }
        };

        verifyAuth();
    }, [employee, isAuthenticated, checkAuth, navigate]);

    const handleCheckIn = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post('http://localhost:4200/api/attendence/mark-attendance', {}, { withCredentials: true });

            if (data.success) {
                toast.success('Check-in successful!');
                setAttendanceStatus(data.attendance);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post('http://localhost:4200/api/attendence/mark-leave', {}, { withCredentials: true });

            if (data.success) {
                toast.success('Check-out successful!');
                setAttendanceStatus(data.attendance);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Check-out failed');
        } finally {
            setLoading(false);
        }
    };

    if (isCheckingAuth) {
        return <div className="flex justify-center items-center min-h-screen">Checking authentication...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    if (!employee || !isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 min-h-screen bg-white shadow-lg">
                    <div className="p-6">
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 mb-4">
                                <img
                                    src={employee?.image || assets.default_avatar}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">{employee?.name}</h2>
                            <p className="text-sm text-gray-500">{employee?.email}</p>
                        </div>

                        <div className="mt-8 space-y-2">
                            <button
                                onClick={() => setActiveSection('profile')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeSection === 'profile'
                                        ? 'bg-primary text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveSection('attendance')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeSection === 'attendance'
                                        ? 'bg-primary text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                Mark Attendance
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {activeSection === 'profile' ? (
                        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Profile Information</h3>
                            <div className="space-y-6">
                                <div className="flex flex-col items-center mb-8">
                                    <div className="relative w-40 h-40 mb-4">
                                        <img
                                            src={employee.image}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">{employee?.name}</h2>
                                    <p className="text-sm text-gray-500">{employee?.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                                    <p className="mt-1 text-gray-800">{employee?.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <p className="mt-1 text-gray-800">{employee?.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                                    <p className="mt-1 text-gray-800">{employee?.phone || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-96">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Attendance</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white rounded-lg shadow p-4">
                                    <div className="text-center mb-4">
                                        <p className="text-gray-600 mb-2">Today's Status</p>
                                        <div className="text-lg font-semibold">
                                            {attendanceStatus ? (
                                                attendanceStatus.checkOutTime ? (
                                                    <span className="text-green-600">Checked Out</span>
                                                ) : (
                                                    <span className="text-blue-600">Checked In</span>
                                                )
                                            ) : (
                                                <span className="text-gray-600">Not Checked In</span>
                                            )}
                                        </div>
                                        {attendanceStatus && (
                                            <div className="mt-2 text-sm text-gray-500">
                                                <p>Check-in: {attendanceStatus.checkInTime || 'Not checked in'}</p>
                                                <p>Check-out: {attendanceStatus.checkOutTime || 'Not checked out'}</p>
                                                {attendanceStatus.workHours > 0 && (
                                                    <p>Work Hours: {attendanceStatus.workHours.toFixed(2)} hours</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        {!attendanceStatus && (
                                            <button
                                                onClick={handleCheckIn}
                                                disabled={loading}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                                            >
                                                Check In
                                            </button>
                                        )}
                                        {attendanceStatus && !attendanceStatus.checkOutTime && (
                                            <button
                                                onClick={handleCheckOut}
                                                disabled={loading}
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                                            >
                                                Check Out
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;
