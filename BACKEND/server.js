import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRoute from './routes/adminRoute.js';
import serviceRoute from './routes/serviceRoute.js';
import bookingRoute from './routes/bookingRoute.js';
import sheduleRoute from './routes/sheduleRoute.js';
import employeeRoute from './routes/employeeRoute.js';
import attendenceRouter from './routes/attendenceRoute.js'
import leaveRoute from './routes/leaveRoute.js'

const app = express()

const port = process.env.PORT || 4200

app.use(express.json())
app.use(cors())
connectDB()
connectCloudinary()

app.use('/api/admin', adminRoute)
app.use('/api/admin/employee', employeeRoute)
app.use('/api/admin/attendence', attendenceRouter)
app.use('/api/admin/service', serviceRoute)
app.use('/api/admin/shedule', sheduleRoute)
app.use('/api/emp/leave', leaveRoute)
app.use('/api', bookingRoute)

app.get('/', (req, res) => {
    res.send("API WORKING")
})

app.listen(port, () => {
    console.log("Server started", port)
})
