import express,{Router} from 'express'
import {addSchedule,displayAllShedules,displayShedule,updateShedule,deleteShedule,assignEmployeeToBooking,getAllBookings,getEmployeeTasks,updateTasksPerformed} from '../Controllers/sheduleController.js'
import { authEmployee } from '../middleware/authEmployee.js'

const sheduleRoute = express.Router()

// Admin Routes
sheduleRoute.post('/add-shedule', addSchedule)
sheduleRoute.get('/shedules',displayAllShedules)
sheduleRoute.get('/displayShedule/:id', displayShedule)
sheduleRoute.put('/updateShedule/:id', updateShedule)
sheduleRoute.delete('/deleteShedule/:taskId', deleteShedule)

// Employee Routes
sheduleRoute.get('/bookings/all', getAllBookings)
sheduleRoute.get('/bookings/my-tasks', authEmployee, getEmployeeTasks)
sheduleRoute.post('/bookings/:bookingId/tasks', authEmployee, updateTasksPerformed)
sheduleRoute.put('/booking/:bookingId/assign', assignEmployeeToBooking)

export default sheduleRoute