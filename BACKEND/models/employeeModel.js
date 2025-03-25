import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: String, required: true },
    phone: { type: String, required: true, default: '0000000000' },
    image: { type: String, required: true },
    hourlyRate: { type: Number, default: 0 },
    role: { type: String, default: 'Technician' }
});

const EmployeeModel = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
export default EmployeeModel;