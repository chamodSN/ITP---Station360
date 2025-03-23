import express, { Router } from 'express'
import { bookService, displayTimeslots } from '../Controllers/bookingController.js';

const bookingRoute = express.Router()

bookingRoute.get('/availableSlots/:date/:serviceId', displayTimeslots)
bookingRoute.post('/service/bookService', bookService)
export default bookingRoute
