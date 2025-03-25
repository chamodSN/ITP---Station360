import upload from '../middleware/multer.js'
import express,{Router} from 'express'
import {addvehicle, getAllVehicles, getVehicle, deleteVehicle, updateVehicle} from '../Controllers/userController.js'


const userRoute = express.Router()

userRoute.post('/add-vehicle', upload.single('Image'), addvehicle);
userRoute.get('/all-vehicles',getAllVehicles);
userRoute.get('/vehicle/:id',getVehicle);
userRoute.put('/update-vehicle/:id', upload.single('Image'),updateVehicle);
userRoute.delete('/vehicle/:id',deleteVehicle);

export default userRoute


