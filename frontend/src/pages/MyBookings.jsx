import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [agreeConditions, setAgreeConditions] = useState(false);

    const getUserBookings = async () => {
        try {
            const { data } = await axios.get('http://localhost:4200/api/mybookings', {
                withCredentials: true
            });

            if (data.success) {
                setBookings(data.bookings.reverse());
                console.log(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const cancelBooking = async () => {
        try {
            const { data } = await axios.delete(`http://localhost:4200/api/cancelbooking/${selectedBookingId}`, {
                withCredentials: true,
            });

            if (data.success) {
                toast.success(data.message);
                setBookings(prev => prev.filter(booking => booking._id !== selectedBookingId));
                closeModal();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const openModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setAgreeConditions(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBookingId(null);
        setAgreeConditions(false);
    };

    useEffect(() => {
        getUserBookings();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="text-3xl font-bold text-gray-800 mb-6">
                <p>MY BOOKINGS</p>
                <hr className="border-2 border-primary w-20 mt-2" />
            </div>

            <div>
                {bookings.filter(item => item.status === "Pending").length > 0 ? bookings
                    .filter(item => item.status === "Pending")
                    .map((item, index) => (
                        <div
                            className="grid grid-cols-[1fr_2fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border border-blue-200 rounded-xl mb-4"
                            key={index}
                        >
                            <div>
                                <img
                                    className="w-32 ml-2 bg-indigo-50"
                                    src={item.serviceId.displayImage}
                                    alt={item.serviceId.serviceName}
                                />
                            </div>

                            <div className="flex-1 text-zinc-600">
                                <p className="text-neutral-800 font-semibold">
                                    Vehicle: {item.vehicleId?.plateNumber || "N/A"}
                                </p>

                                <p className="text-neutral-700 font-medium mt-1">
                                    {item.serviceId.serviceName}
                                </p>

                                <p className="text-xs mt-2">
                                    <span className="text-sm text-neutral-700 font-medium">Date & Time:</span> {item.date} | {item.timeSlot}
                                </p>
                            </div>

                            <div className="flex items-center justify-center flex-1">
                                <div className="text-center">
                                    <p className="text-m mt-1">
                                        <span className="text-m text-neutral-700 font-medium">
                                            Technician Assigned:
                                        </span>{" "}
                                        {item.technicianId ? item.technicianId.name : "No"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 justify-center items-center mr-5">
                                <button
                                    onClick={() => openModal(item._id)}
                                    className="text-sm text-white text-center sm:min-w-48 py-2 border rounded bg-red-500 hover:bg-red-800 transition-all duration-300"
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    )) : (
                    <p className="text-center text-gray-600">No bookings found.</p>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-red-600">Cancel Booking Confirmation</h2>

                        <p className="text-sm text-gray-700 mb-4">
                            By canceling this booking, you agree that:
                            <ul className="list-disc ml-5 mt-2">
                                <li>Cancellation may not be refundable depending on service policy.</li>
                                <li>Repeated cancellations may affect your account reputation.</li>
                                <li>Make sure to cancel at least 24 hours before the scheduled time.</li>
                            </ul>
                        </p>

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="agree"
                                className="mr-2"
                                checked={agreeConditions}
                                onChange={() => setAgreeConditions(!agreeConditions)}
                            />
                            <label htmlFor="agree" className="text-sm text-gray-700">
                                I agree to the terms and conditions.
                            </label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={cancelBooking}
                                disabled={!agreeConditions}
                                className={`px-4 py-2 rounded text-white ${agreeConditions ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
