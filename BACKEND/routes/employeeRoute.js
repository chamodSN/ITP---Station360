import express, { Router } from 'express'
import upload from '../middleware/multer.js'
import { employeeRegistration, allEmployees, viewEmployee, updateEmployee, deleteEmployee, loginEmployee, logoutEmployee, checkAuth } from '../Controllers/employeeController.js';
import { authEmployee } from '../middleware/authEmployee.js';
import authAdmin from '../middleware/authAdmin.js';
const employeeRoute = express.Router()

//For Admin
employeeRoute.post('/add-employee', upload.single('image'), authAdmin, employeeRegistration)
employeeRoute.get('/all-employees', authAdmin, allEmployees)

//For Employee
employeeRoute.post('/login', loginEmployee)
employeeRoute.post('/logout', logoutEmployee)
employeeRoute.get('/check-auth', authEmployee, checkAuth)

//Admin routes with ID parameter 
employeeRoute.get('/:id', authAdmin, viewEmployee)
employeeRoute.put('/:id', upload.single('image'), authAdmin, updateEmployee)
employeeRoute.delete('/:id', authAdmin, deleteEmployee)

export default employeeRoute

