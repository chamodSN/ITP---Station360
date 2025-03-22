import express, { Router } from 'express'
import upload from '../middleware/multer.js'
import { addService, displayAllServices, displaySingleServices, updateService, deleteService } from '../Controllers/serviceController.js';

const adminRoute = express.Router()

adminRoute.post('/add-service', upload.single('displayImage'), addService)
adminRoute.get('/', displayAllServices)
adminRoute.get('/:serviceId', displaySingleServices)
adminRoute.put('/:serviceId', updateService);
adminRoute.delete('/:serviceId', deleteService);

export default adminRoute
