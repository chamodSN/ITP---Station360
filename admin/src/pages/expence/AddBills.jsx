import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddBills = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompletedBookings();
    }, []);

    const fetchCompletedBookings = async () => {
        try {
            const response = await axios.get('http://localhost:4200/api/admin/completed-bookings');
            setBookings(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching completed bookings:', error);
            toast.error('Failed to fetch completed bookings');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Completed Bookings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                    <div key={booking._id} className="bg-white p-6 rounded-lg shadow">
                        <div className="mb-4">
                            <p className="text-gray-600">Service: {booking.serviceId.serviceName}</p>
                            <p className="text-gray-600">Date: {booking.date}</p>
                            <p className="text-gray-600">Time: {booking.timeSlot}</p>
                            <p className="text-gray-600">Technician: {booking.technicianId?.name || 'N/A'}</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Tasks Performed:</h3>
                            <ul className="list-disc list-inside">
                                {booking.tasksPerformed && booking.tasksPerformed.length > 0 ? (
                                    booking.tasksPerformed.map((task, index) => (
                                        <li key={index} className="text-gray-600">
                                            {task.task} - {task.price ? `$${task.price}` : 'No price set'}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No tasks performed</li>
                                )}
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Extra Expenses:</h3>
                            <ul className="list-disc list-inside">
                                {booking.extraExpenses && booking.extraExpenses.length > 0 ? (
                                    booking.extraExpenses.map((expense, index) => (
                                        <li key={index} className="text-gray-600">
                                            {expense.description} - ${expense.amount}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No extra expenses</li>
                                )}
                            </ul>
                        </div>

                        <Link
                            to={`/booking-details/${booking._id}`}
                            className="block w-full bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddBills; 