import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "Employee"
    },
    hourlyRate: {
        type: Number,
        min: 0,
        default: 0
    },
    baseSalary: {
        type: Number,
        min: 0,
        default: 0
    }
}, {
    timestamps: true
});

const EmployeeModel = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
export default EmployeeModel;