
import validator from 'validator';
import EmployeeModel from '../models/employeeModel.js';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';

const employeeRegistration = async (req, res) => {
    try {

        const { name, email, password,address,dob,phone,image, hourlyRate, role } = req.body;

        const imageFile = req.file;

        if (!name || !email || !password || !address || !dob || !phone || !role) {
            return res.json({ success:false, message: "Please fill all the fields" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success:false, message: "Please enter a valid email address" });
        }

        if (password.length < 8) {
            return res.json({ success:false, message: "Password must be at least 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"});

        const imageUrl = uploadedImage.secure_url;

        const employeeData = {
            name,
            email,
            password: hashedPassword,
            address,
            dob,
            phone,
            image: imageUrl,
            hourlyRate,
            role
        }

        const newEmployee = new EmployeeModel(employeeData);
        await newEmployee.save();

        return res.json({ success:true, message: "Employee registered successfully" });

    }catch (error) {
        return res.json({ success: false, message: error.message });
    }
    
}

const allEmployees = async (req, res) => {
    try {

        const employees = await EmployeeModel.find({}).select('-password')
        res.json({ success: true, employees })

    } catch (error) {
        console.log(error);
        return res.json({ sucess: false, message: error.message })
    }
}

const viewEmployee = async (req, res) => {
    try {
        const { id } = req.params;

            const employee = await EmployeeModel.findById(id);
            console.log(employee);
            if (!employee) {
                return res.json({ success: false, message: "Employee not found" });
            }else{
                return res.json({ success: true, employee });
            }

    } catch (error) {
        return res.json({ success: false, message: "Internal Server Error" });
    }
}



export  {employeeRegistration, allEmployees, viewEmployee};