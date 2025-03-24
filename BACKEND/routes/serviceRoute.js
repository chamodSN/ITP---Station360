import express, { Router } from 'express'
import upload from '../middleware/multer.js'
import { addService, displayAllServices, displaySingleServices, updateService, deleteService } from '../Controllers/serviceController.js';

const serviceRoute = express.Router()

serviceRoute.post('/add-service', upload.single('displayImage'), addService)
serviceRoute.get('/', displayAllServices)
serviceRoute.get('/:serviceId', displaySingleServices)
serviceRoute.put('/:serviceId', upload.single('displayImage'), updateService);
serviceRoute.delete('/:serviceId', deleteService);

export default serviceRoute
