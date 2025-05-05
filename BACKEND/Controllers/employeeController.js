import EmployeeModel from '../models/employeeModel.js';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs';
import validator from 'validator'
import { generateEmployeeTokenAndSetCookie } from '../utils/generateEmployeeTokenAndSetCookie.js';
import { sendEmployeeWelcomeEmail } from '../nodemailer/emails.js';

const employeeRegistration = async (req, res) => {
    try {

        const { name, email, password, address, dob, phone, image, hourlyRate, role } = req.body;

        const imageFile = req.file;

        if (!name || !email || !password || !address || !dob || !phone || !role) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const uploadedImage = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const imageUrl = uploadedImage.secure_url;

        const employeeData = {
            name,
            email,
            password: hashedPassword,
            address,
            dob,
            phone,
            image: imageUrl,
            role
        }

        const newEmployee = new EmployeeModel(employeeData);
        await newEmployee.save();

        await sendEmployeeWelcomeEmail(newEmployee.email, newEmployee.name, newEmployee.role);

        return res.json({ success: true, message: "Employee registered successfully" });

    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message });
    }

}

//Merge searchEmployees into allEmployees
const allEmployees = async (req, res) => {
    try {
        const search = req.query.search || '';
        const regex = new RegExp(search, 'i'); // case-insensitive

        const employees = await EmployeeModel.find({
            $or: [
                { name: { $regex: regex } },
                { role: { $regex: regex } },
                { phone: { $regex: regex } }
            ]
        }).select('-password');

        return res.json({ success: true, employees });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};


const viewEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await EmployeeModel.findById(id);


        if (!employee) {
            return res.json({ success: false, message: "Employee not found" });
        } else {
            return res.json({ success: true, employee });
        }

    } catch (error) {
        return res.json({ success: false, message: "Internal Server Error" });
    }
}

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, address, dob, phone, role } = req.body;  // Now these will NOT be undefined
        const imageFile = req.file;

        console.log("Received body fields:", req.body);

        let employee = await EmployeeModel.findById(id);
        if (!employee) {
            return res.json({ success: false, message: "Employee not found" });
        }

        // If an image is uploaded, upload it to cloudinary
        let updatedData = {
            name: name || employee.name,
            email: email || employee.email,
            address: address || employee.address,
            dob: dob || employee.dob,
            phone: phone || employee.phone,
            role: role || employee.role,
        };

        if (imageFile) {
            const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image'
            });
            updatedData.image = uploadedImage.secure_url;
        }


        employee = await EmployeeModel.findByIdAndUpdate(id, updatedData, { new: true });

        return res.json({ success: true, message: "Employee updated successfully", employee });

    } catch (error) {
        console.error("Error updating employee:", error);
        return res.json({ success: false, message: "Internal Server Error" });
    }
};



// Delete Employee
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await EmployeeModel.findById(id);
        if (!employee) {
            return res.json({ success: false, message: "Employee not found" });
        }

        await EmployeeModel.findByIdAndDelete(id);
        return res.json({ success: true, message: "Employee deleted successfully" });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal Server Error" });
    }
}

//API for employee login
const loginEmployee = async (req, res) => {

    const { email, password } = req.body;

    try {
        const employee = await EmployeeModel.findOne({ email });
        console.log("Employee found in backend :", employee);

        if (!employee) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, employee.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateEmployeeTokenAndSetCookie(res, employee._id);

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            employee: {
                ...employee._doc,
                password: undefined,
            },
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const logoutEmployee = async (req, res) => {

    res.clearCookie("eToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const checkAuth = async (req, res) => {
    try {
        console.log('Checking auth for employeeId:', req.employeeId);
        const employee = await EmployeeModel.findById(req.employeeId);


        if (!employee) {
            return res.status(400).json({ success: false, message: "Employee not Found" });
        }

        res.status(200).json({
            success: true,
            employee: {
                ...employee._doc,
                password: undefined,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export { employeeRegistration, allEmployees, viewEmployee, updateEmployee, deleteEmployee, loginEmployee, logoutEmployee };