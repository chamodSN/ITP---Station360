import upload from '../middleware/multer.js'
import express, { Router } from 'express'
import { addvehicle, getAllVehicles, getVehicle, deleteVehicle, updateVehicle, updateProfile, getProfile, deleteProfile, getMyVehicles, allUsers, deleteProfileByAdmin, getProfileByAdmin, generateUserReport } from '../Controllers/userController.js'
import { authUser } from "../middleware/authUser.js";
import authAdmin from "../middleware/authAdmin.js";

const userRoute = express.Router()

// Profile routes
userRoute.get('/profile', authUser, getProfile);
userRoute.put('/update-profile', authUser, upload.single('image'), updateProfile);
userRoute.delete('/delete-profile', authUser, deleteProfile);

// Vehicle routes
userRoute.post('/add-vehicle', authUser, upload.single('Image'), addvehicle);
userRoute.get('/vehicle/:id', getVehicle);
userRoute.put('/update-vehicle/:id', authUser, upload.single('image'), updateVehicle);
userRoute.delete('/vehicle/:id', deleteVehicle);
userRoute.get('/my-vehicles', authUser, getMyVehicles);

//Admin User Routes
userRoute.get('/user-profiles', authAdmin, allUsers);
userRoute.delete('/delete-profile-by-admin/:id', authAdmin, deleteProfileByAdmin);
userRoute.get('/get-profile-by-admin/:id', authAdmin, getProfileByAdmin);
userRoute.post('/user-report', authAdmin, generateUserReport);

//Admin Vehicle Routes
userRoute.get('/all-vehicles', authAdmin, getAllVehicles);
export default userRoute

