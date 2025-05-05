import express, { Router } from 'express'
import { bookService, displayTimeslots, displayUserBookings } from '../Controllers/bookingController.js';

const bookingRoute = express.Router()

bookingRoute.get('/availableSlots/:date/:serviceId', displayTimeslots)
bookingRoute.post('/service/bookService', bookService)
bookingRoute.get('/mybookings', displayUserBookings)
export default bookingRoute
