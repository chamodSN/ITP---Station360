import express, { Router } from 'express'
import { addExpence, displayAllExpence, displaySingleExpence, deleteSingleExpence, updateExpence, loginAdmin, logoutAdmin, AdminCheckAuth, getCompletedBookings, billUser, getEmployeeAttendance, updateEmployeeBasicSalary, addEmployeeSalary } from '../Controllers/adminController.js'
import authAdmin from '../middleware/authAdmin.js'



const adminRoute = express.Router()

adminRoute.post('/add-expence', addExpence)
adminRoute.get('/all-expence', displayAllExpence)
adminRoute.get('/expence/:id', displaySingleExpence)
adminRoute.delete('/expence/:id', deleteSingleExpence)
adminRoute.post('/admin-login', loginAdmin)
adminRoute.post('/logout', logoutAdmin)
adminRoute.put('/expence/:id', updateExpence)
adminRoute.get('/completed-bookings', getCompletedBookings)
adminRoute.post('/bill-user/:id', billUser);
adminRoute.get('/attendance/:id', getEmployeeAttendance);
adminRoute.put('/employee/:id/salary', updateEmployeeBasicSalary);
adminRoute.post('/employee/:id/salary/add', addEmployeeSalary);

export default adminRoute


