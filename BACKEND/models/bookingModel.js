import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Services', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle', required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    endTime: { type: String, required: true },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    tasksPerformed: [
        {
            task: { type: String, required: true },
            price: { type: Number, default: null }
        }
    ],
    extraExpenses: [
        {
            description: { type: String, required: true },
            amount: { type: Number, required: true },
            addedAt: { type: Date, default: Date.now }
        }
    ],
    status: { type: String, default: 'Pending' }
}, {
    timestamps: true
});


bookingSchema.index({ serviceId: 1, date: 1, timeSlot: 1 }, { unique: true });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;