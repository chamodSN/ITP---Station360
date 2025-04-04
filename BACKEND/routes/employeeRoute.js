import express, { Router } from 'express'
import upload from '../middleware/multer.js'
import  {employeeRegistration, allEmployees, viewEmployee,updateEmployee,deleteEmployee} from '../Controllers/employeeController.js';

const employeeRoute = express.Router()

employeeRoute.post('/add-employee', upload.single('image'), employeeRegistration)
employeeRoute.get('/', allEmployees)
employeeRoute.get('/:id', viewEmployee)
employeeRoute.put('/:id', updateEmployee)
employeeRoute.delete('/:id', deleteEmployee)

export default employeeRoute
