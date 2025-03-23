import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'services', required: true },
    //vehicleNumPlate: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicles', required: true },
    vehicleNumPlate: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', default: null },
    tasksPerformed: [
        {
            task: { type: String, required: true },
            price: { type: Number, default: null }
        }
    ],
    status: { type: String, default: 'Pending' }
}, {
    timestamps: true
});


bookingSchema.index({ serviceId: 1, date: 1, timeSlot: 1 }, { unique: true });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
