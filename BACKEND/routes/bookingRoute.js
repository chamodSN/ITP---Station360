import express, { Router } from 'express'
import {
    bookService, displayTimeslots, displayUserBookings, cancelBooking,
    getAllBookings, cancelBookingByAdmin, getDailyAppointments, getVehicleServiceHistory, markBookingAsNoShow
} from '../Controllers/bookingController.js';
import { authUser } from "../middleware/authUser.js";
import authAdmin from '../middleware/authAdmin.js';

const bookingRoute = express.Router()

bookingRoute.get('/availableSlots/:date/:serviceId', displayTimeslots)
bookingRoute.post('/service/bookService', authUser, bookService)
bookingRoute.delete('/cancelbooking/:bookingId', authUser, cancelBooking)
bookingRoute.get('/mybookings', authUser, displayUserBookings)
bookingRoute.get('/admin/bookings', authUser, getAllBookings)
bookingRoute.delete('/admin/cancelbooking/:bookingId', authAdmin, cancelBookingByAdmin)
bookingRoute.get('/daily-appointments', getDailyAppointments)
bookingRoute.get('/vehicle-history/:vehicleId', getVehicleServiceHistory)
bookingRoute.put('/admin/markAsNoShow/:bookingId', authAdmin, markBookingAsNoShow)
export default bookingRoute
