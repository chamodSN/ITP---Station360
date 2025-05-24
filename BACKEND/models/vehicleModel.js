import mongoose from 'mongoose'

const vehicleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    brandName: { type: String, required: true },
    modelName: { type: String, required: true },
    plateNumber: { type: String, required: true },
    vinNumber: { type: String, required: true },
    fuelType: { type: String, required: true },
    Image: { type: String, required: true }
}, {
    timestamps: true
})

const vehicleModel = mongoose.models.vehicle || mongoose.model('vehicle', vehicleSchema)

export default vehicleModel