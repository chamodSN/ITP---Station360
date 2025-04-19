import express, { Router } from 'express'
import upload from '../middleware/multer.js'
import  {employeeRegistration, allEmployees, viewEmployee,updateEmployee,deleteEmployee,loginEmployee} from '../Controllers/employeeController.js';

import { applyLeave, getAllLeavesOfEmployees } from "../Controllers/leaveController.js";

const employeeRoute = express.Router()

employeeRoute.post('/add-employee', upload.single('image'), employeeRegistration) 
employeeRoute.get('/', allEmployees)
employeeRoute.get('/:id', viewEmployee)
employeeRoute.put('/:id', updateEmployee)
employeeRoute.delete('/:id', deleteEmployee)

employeeRoute.post('/login',loginEmployee)

employeeRoute.post("/leave/apply", applyLeave);
employeeRoute.get("/leave/:id", getAllLeavesOfEmployees);


export default employeeRoute

