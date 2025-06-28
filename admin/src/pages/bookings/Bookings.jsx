import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { motion } from 'framer-motion';
import { Loader2, Calendar, Clock, Car, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const fadeInStagger = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

const fadeInCard = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Bookings = () => {
    const { services, bookings, loading, getAllBookings } = useContext(AdminContext);
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'late'
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [cancellationReason, setCancellationReason] = useState('');

    const service = services.find(s => s._id === id);

    // Filter bookings for this service
    const serviceBookings = bookings.filter(b => {
        if (typeof b.serviceId === 'object' && b.serviceId !== null) {
            return b.serviceId._id === id;
        }
        return b.serviceId === id;
    });

    // Separate upcoming and completed bookings by status
    const upcomingStatuses = ['Assigned', 'Pending'];
    const completedStatuses = ['billed', 'done'];
    const upcomingBookings = serviceBookings.filter(booking => upcomingStatuses.includes(booking.status));
    const completedBookings = serviceBookings.filter(booking => completedStatuses.includes(booking.status));

    const today = new Date();
    const lateBookings = serviceBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return upcomingStatuses.includes(booking.status) && bookingDate < today;
    });


    useEffect(() => {
        getAllBookings();
    }, []);

    const handleCancelBooking = async () => {
        try {
            const { data } = await axios.delete(
                `http://localhost:4200/api/admin/cancelbooking/${selectedBooking._id}`,
                {
                    data: { cancellationReason },
                    withCredentials: true
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAllBookings();
                setShowCancelModal(false);
                setSelectedBooking(null);
                setCancellationReason('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleMarkNoShow = async (booking) => {
        setSelectedBooking(booking);
        try {
            const { data } = await axios.put(
                `http://localhost:4200/api/admin/markAsNoShow/${booking._id}`,
                {},
                { withCredentials: true }
            );

            if (data.success) {
                toast.success(data.message);
                getAllBookings();
                setSelectedBooking(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Service not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{service.serviceName} Bookings</h1>
                    <p className="text-gray-600 mt-2">{service.category}</p>
                </div>

                {/* Tab Buttons */}
                <div className="flex gap-4 mb-8">
                    <button
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors border-2 ${activeTab === 'upcoming' ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary/50 hover:bg-primary/10'}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Bookings
                    </button>
                    <button
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors border-2 ${activeTab === 'completed' ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary/50 hover:bg-primary/10'}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed Bookings
                    </button>
                    <button
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors border-2 ${activeTab === 'late'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-red-600 border-red-400 hover:bg-red-50'
                            }`}
                        onClick={() => setActiveTab('late')}
                    >
                        Late Bookings
                    </button>

                </div>

                {/* Upcoming Bookings */}
                {activeTab === 'upcoming' && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Bookings</h2>
                        {upcomingBookings.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={fadeInStagger}
                                initial="hidden"
                                animate="show"
                            >
                                {upcomingBookings.map((booking) => (
                                    <motion.div
                                        key={booking._id}
                                        variants={fadeInCard}
                                        className="bg-white rounded-xl shadow-lg p-6"
                                        whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Calendar className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Date</p>
                                                <p className="font-semibold">{booking.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Clock className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Time</p>
                                                <p className="font-semibold">{booking.timeSlot}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Car className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Vehicle</p>
                                                {booking.vehicleId ? (
                                                    <>
                                                        <p className="font-semibold">
                                                            {booking.vehicleId.brandName} {booking.vehicleId.modelName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{booking.vehicleId.plateNumber}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-red-500">Vehicle info not available</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowCancelModal(true);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                <AlertCircle className="w-4 h-4" />
                                                Cancel Booking
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <p className="text-gray-500">No upcoming bookings</p>
                        )}
                    </div>
                )}

                {/* Completed Bookings */}
                {activeTab === 'completed' && (
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Completed Bookings</h2>
                        {completedBookings.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={fadeInStagger}
                                initial="hidden"
                                animate="show"
                            >
                                {completedBookings.map((booking) => (
                                    <motion.div
                                        key={booking._id}
                                        variants={fadeInCard}
                                        className="bg-white rounded-xl shadow-lg p-6"
                                        whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Calendar className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Date</p>
                                                <p className="font-semibold">{booking.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Clock className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Time</p>
                                                <p className="font-semibold">{booking.timeSlot}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Car className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Vehicle</p>
                                                {booking.vehicleId ? (
                                                    <>
                                                        <p className="font-semibold">
                                                            {booking.vehicleId.brandName} {booking.vehicleId.modelName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{booking.vehicleId.plateNumber}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-red-500">Vehicle info not available</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2">
                                            {completedStatuses.includes(booking.status) ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                            <span className={`text-sm ${completedStatuses.includes(booking.status) ? 'text-green-500' : 'text-red-500'}`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <p className="text-gray-500">No completed bookings</p>
                        )}
                    </div>
                )}

                {/* Late Bookings */}
                {activeTab === 'late' && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold text-red-600 mb-6">Late Bookings</h2>
                        {lateBookings.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={fadeInStagger}
                                initial="hidden"
                                animate="show"
                            >
                                {lateBookings.map((booking) => (
                                    <motion.div
                                        key={booking._id}
                                        variants={fadeInCard}
                                        className="bg-white border border-red-300 rounded-xl shadow-lg p-6"
                                        whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <Calendar className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Date</p>
                                                <p className="font-semibold">{booking.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <Clock className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Time</p>
                                                <p className="font-semibold">{booking.timeSlot}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <Car className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Vehicle</p>
                                                {booking.vehicleId ? (
                                                    <>
                                                        <p className="font-semibold">
                                                            {booking.vehicleId.brandName} {booking.vehicleId.modelName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{booking.vehicleId.plateNumber}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-red-500">Vehicle info not available</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => handleMarkNoShow(booking)}
                                                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                                            >
                                                <AlertCircle className="w-4 h-4" />
                                                Mark as No Show
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}

                            </motion.div>
                        ) : (
                            <p className="text-gray-500">No late bookings</p>
                        )}
                    </div>
                )}


            </div>

            {/* Cancel Booking Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold text-red-600 mb-4">Cancel Booking</h2>
                        <p className="text-gray-600 mb-4">Please provide a reason for cancelling this booking:</p>
                        <textarea
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            className="w-full p-3 border rounded-lg mb-4"
                            rows="4"
                            placeholder="Enter cancellation reason..."
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setSelectedBooking(null);
                                    setCancellationReason('');
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCancelBooking}
                                disabled={!cancellationReason.trim()}
                                className={`px-4 py-2 rounded-lg text-white transition-colors ${!cancellationReason.trim()
                                    ? 'bg-red-300 cursor-not-allowed'
                                    : 'bg-red-500 hover:bg-red-600'
                                    }`}
                            >
                                Confirm Cancellation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings; 