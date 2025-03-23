import upload from '../middleware/multer.js'
import express,{Router} from 'express'
import {addvehicle, getAllVehicles, getVehicle, deleteVehicle, updateVehicle} from '../controllers/userController.js'


const userRoute = express.Router()

userRoute.post('/add-vehicle', upload.single('Image'), addvehicle);
userRoute.get('/all-vehicles',getAllVehicles);
userRoute.get('/vehicle/:id',getVehicle);
userRoute.put('/update-vehicle/:id',updateVehicle);
userRoute.delete('/vehicle/:id',deleteVehicle);

export default userRoute


