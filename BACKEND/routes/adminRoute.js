import express, { Router } from 'express'
import { addExpence, displayAllExpence, displaySingleExpence, deleteSingleExpence, updateExpence, loginAdmin, logoutAdmin, AdminCheckAuth, getCompletedBookings, billUser, getEmployeeAttendance, updateEmployeeBasicSalary, addEmployeeSalary, generateSalarySlip } from '../Controllers/adminController.js'
import authAdmin from '../middleware/authAdmin.js'

const adminRoute = express.Router()

adminRoute.post('/add-expence', addExpence)
adminRoute.get('/all-expence', displayAllExpence)
adminRoute.get('/expence/:id', displaySingleExpence)
adminRoute.delete('/expence/:id', deleteSingleExpence)
adminRoute.post('/admin-login', loginAdmin)
adminRoute.post('/logout', logoutAdmin)
adminRoute.put('/expence/:id', updateExpence)
adminRoute.get('/check-auth', AdminCheckAuth)
adminRoute.get('/completed-bookings', getCompletedBookings)
adminRoute.post('/bill-user/:bookingId', billUser)
adminRoute.get('/employee-attendance', getEmployeeAttendance)
adminRoute.put('/update-salary/:employeeId', updateEmployeeBasicSalary)
adminRoute.post('/add-salary/:employeeId', addEmployeeSalary)
adminRoute.get('/salary-slip/:employeeId', generateSalarySlip)

export default adminRoute


