import { AppContext } from '../context/AppContext';
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';

const MyBookings = () => {

    const [bookings, setBookings] = useState([]);

    const { services } = useContext(AppContext);

    const getUserBookings = async () => {

        try {

            const { data } = await axios.get('http://localhost:4200/api/mybookings');

            if (data.success) {
                setBookings(data.bookings.reverse());
                console.log(data.bookings);
            } else {
                toast.error(data.message);
            }


        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getUserBookings();
        console.log("Services:", services);
    }, []);

    return bookings && services && (
        <div className="container mx-auto p-4">
            <div className="text-3xl font-bold text-gray-800 mb-6">
                <p>MY BOOKINGS</p>
                <hr className="border-2 border-primary w-20 mt-2" />
            </div>
            <div>
                {bookings.map((item, index) => {
                    const service = services.find(service => service._id === item.serviceId);
                    return (
                        <div className="grid grid-cols-[1fr_2fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border border-blue-200 rounded-xl mb-4" key={index}>
                            <div>
                                <img
                                    className="w-32 ml-2 bg-indigo-50"
                                    src={service.displayImage}
                                    alt={service.serviceName}
                                />
                            </div>
                            <div className='flex-1 text-zinc-600'>
                                <p className='text-neutral-800 font-semibold'>{service.serviceName}</p>
                                <p>{service.category}</p>
                                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {item.date} | {item.timeSlot}</p>
                            </div>
                            <div className='flex items-center justify-center flex-1'>
                                <p className='text-m mt-1'><span className='text-m text-neutral-700 font-medium'>Technician Assigned:</span> {item.technicianId === null ? "No" : "YES"}</p>
                            </div>
                            <div className="flex flex-col gap-2 justify-center items-center mr-5">
                                <button className="text-sm text-white text-center sm:min-w-48 py-2 border rounded bg-red-500 hover:bg-red-800 transition-all duration-300 ">
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MyBookings