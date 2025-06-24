import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  endTime: { type: String, required: true },
  taskType: { type: String, required: true },
  taskDetails: { type: String, required: true, maxlength: 500 },
  taskStatus: { type: String, default: "assigned" },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' }
});

const scheduleModel = mongoose.models.schedule || mongoose.model('schedule', scheduleSchema);

export default scheduleModel;
