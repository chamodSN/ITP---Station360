import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={bookService}>
        <input type='date' min={formattedDate} onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate} />

        {Array.isArray(availableSlots) && availableSlots.length > 0 ? (
          availableSlots.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => setSelectedTime(item)}>
                {item}
              </button>
            </div>
          ))
        ) : (
          <p>No slots available</p>
        )}
        <button type="submit">Book Appointment</button>
      </form>
    </>
  )
}

export default BookingAppoinment