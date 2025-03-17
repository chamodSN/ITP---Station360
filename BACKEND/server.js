import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRoute from './routes/userRoutes.js';
//import adminRoute from './routes/adminRoute.js';

const app = express()

const port = process.env.PORT || 4200

app.use(express.json())
app.use(cors())
connectDB()
connectCloudinary()

//app.use('/api/admin', adminRoute)
app.use('/api/user', userRoute)

app.get('/', (req, res) => {
    res.send("API WORKING")
})

app.listen(port, () => {
    console.log("Server started", port)
})
