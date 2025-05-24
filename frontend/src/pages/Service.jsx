import { AppContext } from '../context/AppContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { CheckCircle2, Loader2, Tag, List, CheckCircle, ArrowLeft } from 'lucide-react';

const sriLankaHolidays = [
    '2025-01-13', // Duruthu Full Moon Poya Day
    '2025-01-14', // Tamil Thai Pongal Day
    '2025-02-04', // National Day (Independence Day)
    '2025-02-12', // Navam Full Moon Poya Day
    '2025-02-26', // Mahasivarathri Day
    '2025-03-13', // Medin Full Moon Poya Day
    '2025-03-31', // Id-Ul-Fitr (Ramazan Festival Day)
    '2025-04-12', // Bak Full Moon Poya Day
    '2025-04-13', // Day prior to Sinhala & Tamil New Year Day
    '2025-04-14', // Sinhala & Tamil New Year Day
    '2025-04-18', // Good Friday
    '2025-05-01', // May Day
    '2025-05-12', // Vesak Full Moon Poya Day
    '2025-05-13', // Day following Vesak Full Moon Poya Day
    '2025-06-07', // Id-Ul-Alha (Hadji Festival Day)
    '2025-06-10', // Poson Full Moon Poya Day
    '2025-07-10', // Esala Full Moon Poya Day
    '2025-08-08', // Nikini Full Moon Poya Day
    '2025-09-05', // Milad-Un-Nabi (Holy Prophet's Birthday)
    '2025-09-07', // Binara Full Moon Poya Day
    '2025-10-06', // Vap Full Moon Poya Day
    '2025-10-20', // Deepavali Festival Day
    '2025-11-05', // Il Full Moon Poya Day
    '2025-12-04', // Unduvap Full Moon Poya Day
    '2025-12-25', // Christmas Day
  ];
  

const Service = () => {
    const { id } = useParams();
    const { services, userVehicles, fetchUserVehicles } = useContext(AppContext);
    const [service, setService] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState(null);
    const [vehicleId, setVehicleId] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isHoliday, setIsHoliday] = useState(false);
    const navigate = useNavigate();

    const fetchServiceInfo = async () => {
        const serviceInfo = services.find(singleService => singleService._id === id);
        setService(serviceInfo);
    };

    const getAvailableSlots = async () => {
        if (!selectedDate) return;
        
        // Check if selected date is a holiday
        const isSelectedDateHoliday = sriLankaHolidays.includes(selectedDate);
        setIsHoliday(isSelectedDateHoliday);
        
        if (isSelectedDateHoliday) {
            setAvailableSlots([]);
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:4200/api/availableSlots/${selectedDate}/${id}`);
            setAvailableSlots(data.availableSlots);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch available slots");
        } finally {
            setIsLoading(false);
        }
    };

    const bookService = async (e) => {
        e.preventDefault();
        
        if (!vehicleId) {
            toast.error("Please select a vehicle first");
            return;
        }

        if (!selectedDate || !selectedTime) {
            toast.error("Please select both date and time slot");
            return;
        }

        const bookingData = {
            date: selectedDate,
            timeSlot: selectedTime,
            vehicleId: vehicleId,
            serviceId: id
        };

        try {
            const { data } = await axios.post('http://localhost:4200/api/service/bookService', bookingData, {
                withCredentials: true,
            });
            if (data.success) {
                toast.success("Service booked successfully");
                setSelectedTime(null);
                getAvailableSlots();
            } else {
                toast.error("Failed to book service");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while booking the service");
        }
    };

    useEffect(() => {
        fetchServiceInfo();
        fetchUserVehicles();
    }, [services, id]);

    useEffect(() => {
        getAvailableSlots();
    }, [selectedDate]);

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <ArrowLeft className="mr-2" />
                    Back
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="p-8">
                        {/* Service Header */}
                        <div className="text-3xl font-bold text-gray-800 mb-6">
                            <p>{service.serviceName.toUpperCase()}</p>
                            <hr className="border-2 border-primary w-20 mt-2" />
                        </div>

                        <div className="text-gray-600 mb-6">
                            <p className="text-lg">{service.category}</p>
                            <hr className="border-1 border-primary w-20 mt-2" />
                        </div>

                        {/* Service Image and Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Image Section */}
                            <div className="space-y-6">
                                <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-xl">
                                    <img 
                                        src={service.displayImage} 
                                        alt={service.serviceName} 
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <p className="text-lg font-semibold text-gray-700 mb-2">Description:</p>
                                    <p className="text-gray-600">{service.description}</p>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <p className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
                                        <Tag className="w-5 h-5 text-primary" /> Price:
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">Starting From <span className="text-primary">${service.price}</span></p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <p className="text-lg font-bold text-gray-700 flex items-center gap-2 mb-4">
                                        <List className="w-5 h-5 text-primary" /> SPECIFICATIONS:
                                    </p>
                                    <div className="space-y-3">
                                        {service.specifications.map((spec, index) => (
                                            <p key={index} className="text-gray-600 flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-800">{spec}</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Section */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Appointment</h2>
                            <form onSubmit={bookService} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Vehicle Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select Your Vehicle
                                        </label>
                                        <select
                                            value={vehicleId}
                                            onChange={(e) => setVehicleId(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"                         
                                        >
                                            <option value="">-- Select Vehicle --</option>
                                            {userVehicles.map((vehicle) => (
                                                <option key={vehicle._id} value={vehicle._id}>
                                                    {vehicle.brandName} {vehicle.modelName} - {vehicle.plateNumber}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select Date
                                        </label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Available Time Slots */}
                                {selectedDate && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Available Time Slots
                                        </label>
                                        {isHoliday ? (
                                            <div className="text-center py-4">
                                                <p className="text-red-500 font-medium">No bookings available for this date as it is a Sri Lanka holiday.</p>
                                            </div>
                                        ) : isLoading ? (
                                            <div className="flex justify-center py-4">
                                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                            </div>
                                        ) : availableSlots.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {availableSlots.map((slot) => (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => setSelectedTime(slot)}
                                                        className={`p-3 rounded-lg border-2 transition-colors ${
                                                            selectedTime === slot
                                                                ? 'border-primary bg-primary/10 text-primary'
                                                                : 'border-gray-200 hover:border-primary'
                                                        }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No available slots for this date</p>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Booking...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                Confirm Booking
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Service;