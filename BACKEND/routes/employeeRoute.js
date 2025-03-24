import express, { Router } from 'express'
import upload from '../middleware/multer.js'
import  {employeeRegistration, allEmployees, viewEmployee} from '../Controllers/employeeController.js';

const employeeRoute = express.Router()

employeeRoute.post('/add-employee', upload.single('image'), employeeRegistration)
employeeRoute.get('/', allEmployees)
employeeRoute.get('/:id', viewEmployee)

export default employeeRoute
