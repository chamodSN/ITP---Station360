import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import cookieParser from 'cookie-parser'

import userRoute from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

import adminRoute from './routes/adminRoute.js';
import serviceRoute from './routes/serviceRoute.js';
import bookingRoute from './routes/bookingRoute.js';
import sheduleRoute from './routes/sheduleRoute.js';
import employeeRoute from './routes/employeeRoute.js';

import attendenceRouter from './routes/attendenceRoute.js'
import leaveRoute from './routes/leaveRoute.js'
import notificationsRoute from './routes/notificationRoute.js';
import inventoryRoute from './routes/inventoryRoute.js';


const app = express()

const port = process.env.PORT || 4200

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5175", "http://localhost:5174", "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie']
}))
app.use(cookieParser())
connectDB()
connectCloudinary()

app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoute)
app.use('/api/user', userRoute)
app.use('/api/admin/employee', employeeRoute)
app.use('/api/attendence', attendenceRouter)
app.use('/api/admin/notification', notificationsRoute)
app.use('/api/admin/service', serviceRoute)
app.use('/api/admin/shedule', sheduleRoute)
app.use('/api/emp/shedule', sheduleRoute)
app.use('/api/leave', leaveRoute)
app.use('/api', bookingRoute)
app.use('/api/admin/inventory', inventoryRoute)

app.get('/', (req, res) => {
    res.send("API WORKING")
})

app.listen(port, () => {
    console.log("Server started", port)
})
