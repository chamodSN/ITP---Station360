import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: String, required: true },
    checkInTime: { type: String, default: null },
    checkOutTime: { type: String, default: null },
    workHours: { type: Number, default: 0 },
});

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

export default Attendance;