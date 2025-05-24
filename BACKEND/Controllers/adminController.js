import dotenv from 'dotenv';
dotenv.config();
import expencemodel from '../models/expencemodel.js';
import jwt from 'jsonwebtoken';
import { generateAdminTokenAndSetCookie } from '../utils/generateAdminTokenAndSetCookie.js';
import Booking from '../models/bookingModel.js';
import Attendance from '../models/attendenceModel.js';
import Employee from '../models/employeeModel.js';
import Salary from '../models/salaryModel.js';
import { sendSalaryEmail } from '../nodemailer/emails.js';
import { sendBillingEmail } from '../nodemailer/emails.js';

const addExpence = async (req, res) => {
    try {

        const { ExpenceType, Reason, Cost } = req.body

        if (!ExpenceType || !Reason || !Cost) {
            return res.json({ success: false, message: "All fields are required." });
        }

        const expenceData = {
            ExpenceType,
            Reason,
            Cost,
            Date: Date.now(),
        }
        const newExpence = new expencemodel(expenceData);


        await newExpence.save()
        return res.json({ sucess: true, message: "Expence added successfully" })


    } catch (error) {
        return res.json({ sucess: false, message: error.message })

    }


}
const displayAllExpence = async (req, res) => {
    try {

        const AllExpence = await expencemodel.find()
        return res.json({ success: true, AllExpence })

    } catch (error) {
        return res.json({ sucess: false, message: error.message })
    }
}
const displaySingleExpence = async (req, res) => {
    try {

        const expenceId = req.params.id;

        const expence = await expencemodel.findById(expenceId)

        return res.json({ success: true, expence })

    } catch (error) {
        return res.json({ sucess: false, message: error.message })
    }
}
const deleteSingleExpence = async (req, res) => {
    try {

        const expenceId = req.params.id;

        await expencemodel.findByIdAndDelete(expenceId)

        return res.json({ success: true, message: " Expence deleted successfully." })

    } catch (error) {
        return res.json({ sucess: false, message: error.message })
    }
}
const updateExpence = async (req, res) => {
    try {

        const expenceId = req.params.id;

        const { ExpenceType, Reason, Cost } = req.body

        if (!ExpenceType || !Reason || !Cost) {
            return res.json({ success: false, message: "All fields are required." });
        }

        await expencemodel.findByIdAndUpdate(expenceId, { $set: { ExpenceType, Reason, Cost } })

        return res.json({ success: true, message: "Expence update successfully." })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

// Updated admin login
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        generateAdminTokenAndSetCookie(res);

        return res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
        });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials" });
};

// Admin logout stays the same
const logoutAdmin = async (req, res) => {
    res.clearCookie("Atoken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Admin auth check
const AdminCheckAuth = async (req, res) => {
    try {
        const Atoken = req.cookies.Atoken;
        if (!Atoken) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const decoded = jwt.verify(Atoken, process.env.JWT_SECRET);

        if (decoded.userId !== "admin") {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        res.status(200).json({
            success: true,
            user: {
                role: "admin",
                email: process.env.ADMIN_EMAIL,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get completed bookings
export const getCompletedBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ 
            $or: [
                { status: 'done' },
                { status: 'billed' }
            ]
        })
            .populate('userId', 'name email phone')
            .populate('serviceId', 'serviceName')
            .populate('vehicleId', 'brandName modelName plateNumber')
            .populate('technicianId', 'name')
            .sort({ createdAt: -1 });

        console.log('Found bookings:', bookings); // Debug log

        if (!bookings || !Array.isArray(bookings)) {
            console.error('Bookings is not an array:', bookings);
            return res.status(500).json({ message: 'Internal server error: Invalid bookings data' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error in getCompletedBookings:', error);
        res.status(500).json({ message: error.message });
    }
};

// Add task price to completed booking
export const addTaskPrice = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { task, price } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'Done') {
            return res.status(400).json({ message: 'Can only add prices to completed bookings' });
        }

        booking.tasksPerformed.push({ task, price });
        await booking.save();

        res.status(200).json({ message: 'Task price added successfully', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add extra expense to completed booking
export const addExtraExpense = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { description, amount } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'done') {
            return res.status(400).json({ message: 'Can only add expenses to completed bookings' });
        }

        booking.extraExpenses.push({ description, amount });
        await booking.save();

        res.status(200).json({ message: 'Extra expense added successfully', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Bill user for completed booking
const billUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { totalAmount, tasks, extraExpenses } = req.body;

        console.log('Billing request received:', { id, totalAmount, tasks, extraExpenses });

        const booking = await Booking.findById(id)
            .populate('userId', 'name email')
            .populate('serviceId', 'name')
            .populate('vehicleId', 'brandName modelName plateNumber')
            .populate('technicianId', 'name');

        if (!booking) {
            console.log('Booking not found:', id);
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'done') {
            console.log('Invalid booking status:', booking.status);
            return res.status(400).json({ message: 'Can only bill completed bookings' });
        }

        console.log('Current booking:', booking);
        console.log('Setting new values:', { tasks, extraExpenses, totalAmount });

        booking.tasksPerformed = tasks;
        booking.extraExpenses = extraExpenses;
        booking.totalAmount = totalAmount;
        booking.status = 'billed';

        const savedBooking = await booking.save();
        console.log('Saved booking:', savedBooking);

        // Send billing email to customer
        const emailResult = await sendBillingEmail(booking, tasks, extraExpenses, totalAmount);
        
        if (!emailResult.success) {
            console.error('Failed to send billing email:', emailResult.error);
            // Continue with the response even if email fails
        }

        res.status(200).json({ 
            success: true, 
            message: 'User billed successfully' + (emailResult.success ? ' and email sent' : ' but email failed to send'),
            booking: savedBooking
        });
    } catch (error) {
        console.error('Error billing user:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get employee attendance for a specific month
const getEmployeeAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({ 
                success: false, 
                message: "Month parameter is required" 
            });
        }

        // Parse the month string into a date
        const [year, monthNum] = month.split('-');
        const startDate = new Date(year, monthNum - 1, 1); // First day of month
        const endDate = new Date(year, monthNum, 0); // Last day of month

        console.log('Searching attendance for:', {
            employeeId: id,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        });

        const attendanceRecords = await Attendance.find({
            employeeId: id,
            date: {
                $gte: startDate.toISOString().split('T')[0],
                $lte: endDate.toISOString().split('T')[0]
            }
        });

        console.log('Found attendance records:', attendanceRecords);

        const totalHours = attendanceRecords.reduce((sum, record) => {
            console.log('Processing record:', record);
            return sum + (record.workHours || 0);
        }, 0);
        
        const totalDays = attendanceRecords.length;

        console.log('Calculated totals:', { totalHours, totalDays });

        res.status(200).json({
            success: true,
            totalHours,
            totalDays,
            attendanceRecords
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update only hourlyRate and baseSalary for an employee
const updateEmployeeBasicSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const { hourlyRate, baseSalary } = req.body;

        const updated = await Employee.findByIdAndUpdate(
            id,
            { hourlyRate, baseSalary },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        res.json({ success: true, message: "Salary details updated", employee: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add salary for an employee for a given month
const addEmployeeSalary = async (req, res) => {
    try {
        const { id } = req.params; // employeeId
        const { month, bonuses = [], deductions = [] } = req.body; // month: 'YYYY-MM'

        // 1. Fetch employee
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // 2. Fetch attendance for the month
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

        const attendanceRecords = await Attendance.find({
            employeeId: id,
            date: { $gte: startDate, $lte: endDate }
        });

        const totalHours = attendanceRecords.reduce((sum, record) => sum + (record.hours || 0), 0);
        const totalDays = attendanceRecords.length;

        // 3. Calculate base pay
        const hourlyRate = employee.hourlyRate || 0;
        const baseSalary = employee.baseSalary || 0;
        const basePay = totalHours * hourlyRate + baseSalary;

        // 4. Calculate total bonuses and deductions
        const totalBonuses = bonuses.reduce((sum, b) => sum + (b.amount || 0), 0);
        const totalDeductions = deductions.reduce((sum, d) => sum + (d.amount || 0), 0);

        // 5. Calculate final salary
        const finalSalary = basePay + totalBonuses - totalDeductions;

        // 6. Create and save salary record
        const salaryRecord = new Salary({
            employeeId: id,
            month,
            totalHours,
            totalDays,
            hourlyRate,
            baseSalary,
            bonuses,
            deductions,
            totalBonuses,
            totalDeductions,
            finalSalary,
            status: 'pending'
        });

        await salaryRecord.save();

        // 7. Add salary as an expense
        const expenceData = {
            ExpenceType: "Employee Salaries",
            Reason: `Salary for ${employee.name} - ${month}`,
            Cost: finalSalary,
            Date: new Date()
        };
        const newExpence = new expencemodel(expenceData);
        await newExpence.save();

        // Send salary slip email
        await sendSalaryEmail(employee, salaryRecord);

        res.status(201).json({ 
            success: true, 
            message: "Salary record created and added to expenses", 
            salary: salaryRecord 
        });
    } catch (error) {
        console.error('Error adding salary:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addExpence, displayAllExpence, displaySingleExpence, deleteSingleExpence, updateExpence, loginAdmin, logoutAdmin, AdminCheckAuth, billUser, getEmployeeAttendance, updateEmployeeBasicSalary, addEmployeeSalary }