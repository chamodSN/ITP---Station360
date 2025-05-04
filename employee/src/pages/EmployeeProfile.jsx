import React, { useState, useEffect } from 'react';
import { useEmployeeAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmployeeProfile = () => {
    const { employee, checkAuth, isCheckingAuth, error, isAuthenticated } = useEmployeeAuthStore();
    const navigate = useNavigate();
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [loading, setLoading] = useState(false);

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
            const { data } = await axios.post('http://localhost:4200/api/attendence/mark-attendance', {
                withCredentials: true,
            });
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
            const { data } = await axios.post('http://localhost:4200/api/attendence/mark-leave', {
                withCredentials: true,
            });
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
        <div className="flex gap-6 p-6 max-w-7xl mx-auto">
            {/* Left side - Employee Information */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-6">Employee Profile</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="inline-block relative">
                        <img
                            className="w-36 h-36 rounded-full object-cover"
                            src={employee.image}
                            alt="Employee"
                        />
                    </div>

                    <p className="font-medium text-3xl text-neutral-800 mt-4">{employee.name}</p>

                    <hr className="bg-zinc-400 h-[1px] border-none my-4" />

                    <div>
                        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
                        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                            <p className="font-medium">Email :</p>
                            <p className="text-blue-500">{employee.email}</p>
                            <p className="font-medium">Phone :</p>
                            <p className="text-blue-400">{employee.phone}</p>
                            <p className="font-medium">Address :</p>
                            <p className="text-blue-400">{employee.address}</p>
                        </div>
                    </div>

                    <p className="text-neutral-500 underline mt-5">BASIC INFORMATION</p>
                    <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                        <p className="font-medium">Date of Birth :</p>
                        <p className="text-gray-500">{new Date(employee.dob).toLocaleDateString()}</p>
                        <p className="font-medium">Role :</p>
                        <p className="text-gray-500">{employee.role}</p>
                    </div>


                </div>
            </div>

            {/* Right side - Attendance */}
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
        </div>
    );
};

export default EmployeeProfile;
