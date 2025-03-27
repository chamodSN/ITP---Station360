import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingAppoinment = () => {

  const today = new Date();

  const [availableSlots, setAvailableSlots] = useState([]);

  const formattedDate = today.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState('');

  const [selectedTime, setSelectedTime] = useState(null);

  const [vehicleNumber, setVehicleNumber] = useState('ABX-2323');

  //this is until we have user authentication
  const [userId, setUserId] = useState("67dd1a12e1485ca648678a8d");

  const { id } = useParams();

  const getAvailableSlots = async (e) => {

    try {
      const { data } = await axios.get(`http://localhost:4200/api/availableSlots/${selectedDate}/${id}`);

      setAvailableSlots(data.availableSlots);

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    if (selectedDate) {
      getAvailableSlots();
    }
  }, [selectedDate]);

  const bookService = async (e) => {
    e.preventDefault();

    const formData = {
      userId: userId,
      date: selectedDate,
      timeSlot: selectedTime,
      vehicleNumPlate: vehicleNumber,
      serviceId: id
    };

    try {
      const { data } = await axios.post('http://localhost:4200/api/service/bookService', formData);
      if (data.success) {
        toast.success("Service booked successfully");
      } else {
        toast.error("Failed to book service");
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-4">

      <div className="text-3xl font-bold text-gray-800 mb-6 text-center">
        <p>BOOK THE SERVICE</p>
        <hr className="border-2 border-primary w-100 mt-2" />
      </div>

      <div className="flex justify-between items-start space-x-10">

        <div className="w-1/2">
          <label className="block text-gray-700 mb-2">Select a Date:</label>
          <input type='date'
            min={formattedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            value={selectedDate}
            className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <div className="w-1/2">
          <label className="block text-gray-700 mb-2">Available Slots:</label>
          <div className="grid grid-cols-3 gap-2">
            {Array.isArray(availableSlots) && availableSlots.length > 0 ? (
              availableSlots.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTime(item)}
                  className={`p-2 border rounded transition-colors duration-300 w-full text-center 
                    ${selectedTime === item ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
                  {item}
                </button>
              ))
            ) : (
              <p className="text-red-500">No slots available</p>
            )}
          </div>
        </div>

      </div>

      <form onSubmit={bookService} className="mt-6">
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-500 text-white p-2 px-6 rounded hover:bg-green-600">Book Appointment</button>
        </div>
      </form>

    </div>
  );

}

export default BookingAppoinment