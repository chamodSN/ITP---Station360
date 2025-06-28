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
import { generateSalarySlipPDF } from '../pdf/ReportGenerator.js';

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
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { ExpenceType: { $regex: search, $options: 'i' } },
                    { Reason: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const AllExpence = await expencemodel.find(query);
        return res.json({ success: true, AllExpence });
    } catch (error) {
        return res.json({ success: false, message: error.message });
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

        // Format the response to include all necessary fields and calculate total amount
        const formattedBookings = bookings.map(booking => {
            // Calculate total amount from tasks and extra expenses
            const tasksTotal = booking.tasksPerformed.reduce((sum, task) => sum + (Number(task.price) || 0), 0);
            const expensesTotal = booking.extraExpenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
            const totalAmount = tasksTotal + expensesTotal;

            return {
                _id: booking._id,
                status: booking.status,
                totalAmount: totalAmount,
                tasksPerformed: booking.tasksPerformed || [],
                extraExpenses: booking.extraExpenses || [],
                createdAt: booking.createdAt,
                date: booking.date,
                timeSlot: booking.timeSlot,
                userId: booking.userId,
                serviceId: booking.serviceId,
                vehicleId: booking.vehicleId,
                technicianId: booking.technicianId
            };
        });

        res.status(200).json(formattedBookings);
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
        const { bookingId } = req.params;
        const { tasks, extraExpenses } = req.body;

        console.log('Billing request received:', { bookingId, tasks, extraExpenses });

        const booking = await Booking.findById(bookingId)
            .populate('userId', 'name email')
            .populate('serviceId', 'name')
            .populate('vehicleId', 'brandName modelName plateNumber')
            .populate('technicianId', 'name');

        if (!booking) {
            console.log('Booking not found:', bookingId);
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'done') {
            console.log('Invalid booking status:', booking.status);
            return res.status(400).json({ message: 'Can only bill completed bookings' });
        }

        // Calculate total amount from tasks and extra expenses
        const tasksTotal = tasks.reduce((sum, task) => sum + (Number(task.price) || 0), 0);
        const expensesTotal = extraExpenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
        const calculatedTotal = tasksTotal + expensesTotal;

        console.log('Current booking:', booking);
        console.log('Setting new values:', { tasks, extraExpenses, calculatedTotal });

        // Update booking with tasks, expenses, and calculated total
        booking.tasksPerformed = tasks;
        booking.extraExpenses = extraExpenses;
        booking.totalAmount = calculatedTotal; // This will be stored in the document even though it's not in the schema
        booking.status = 'billed';

        const savedBooking = await booking.save();
        console.log('Saved booking:', savedBooking);

        // Send billing email to customer
        const emailResult = await sendBillingEmail(booking, tasks, extraExpenses, calculatedTotal);

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
        const { employeeId } = req.query;
        const { month } = req.query;

        console.log('Employee ID, Month:', { employeeId, month });

        if (!month) {
            return res.status(400).json({
                success: false,
                message: "Month parameter is required"
            });
        }

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: "Employee ID is required"
            });
        }

        // Parse the month string into a date
        const [year, monthNum] = month.split('-').map(num => parseInt(num, 10));

        if (isNaN(year) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return res.status(400).json({
                success: false,
                message: "Invalid month format. Use YYYY-MM"
            });
        }

        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

        const attendanceRecords = await Attendance.find({
            employeeId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        console.log('Attendence Records:', { attendanceRecords });

        const totalHours = attendanceRecords.reduce((sum, record) => {
            return sum + (record.hours || record.workHours || 0);
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
        const { employeeId } = req.params;
        const { hourlyRate, baseSalary } = req.body;

        const updated = await Employee.findByIdAndUpdate(
            employeeId,
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
        const { employeeId } = req.params;
        const { month, bonuses = [], deductions = [] } = req.body; // month: 'YYYY-MM'

        // 1. Fetch employee
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // 2. Fetch attendance for the month
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

        const attendanceRecords = await Attendance.find({
            employeeId: employeeId,
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
            employeeId: employeeId,
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

const generateSalarySlip = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const {
            month,
            year,
            basicSalary,
            allowances,
            deductions,
            netSalary,
            totalHours,
            totalDays
        } = req.query;

        console.log('Generating salary slip with data:', { employeeId, ...req.query });

        // Validate input parameters
        if (!employeeId || !month || !year) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Validate date format
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
            return res.status(400).json({ error: 'Invalid month or year format' });
        }

        // Validate date is not in future
        const selectedDate = new Date(yearNum, monthNum - 1);
        const currentDate = new Date();
        if (selectedDate > currentDate) {
            return res.status(400).json({ error: 'Cannot generate salary slip for future date' });
        }

        // Get employee data
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Prepare data for PDF
        const pdfData = {
            employeeName: employee.name || 'N/A',
            employeeId: employee.employeeId || employeeId,
            basicSalary: Number(basicSalary || 0),
            allowances: Number(allowances || 0),
            deductions: Number(deductions || 0),
            netSalary: Number(netSalary || 0),
            totalHours: Number(totalHours || 0),
            totalDays: Number(totalDays || 0),
            month: month,
            year: year
        };

        console.log('Prepared PDF data:', pdfData);

        try {
            // Generate PDF
            const pdf = await generateSalarySlipPDF(pdfData);

            if (!pdf) {
                throw new Error('Failed to generate PDF');
            }

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=salary-slip-${employeeId}-${month}-${year}.pdf`);

            // Send PDF
            res.send(pdf);
        } catch (pdfError) {
            console.error('Error generating PDF:', pdfError);
            return res.status(500).json({ error: 'Failed to generate PDF: ' + pdfError.message });
        }
    } catch (error) {
        console.error('Error generating salary slip:', error);
        res.status(500).json({ error: error.message });
    }
};

export {
    addExpence,
    displayAllExpence,
    displaySingleExpence,
    deleteSingleExpence,
    updateExpence,
    loginAdmin,
    logoutAdmin,
    AdminCheckAuth,
    billUser,
    getEmployeeAttendance,
    updateEmployeeBasicSalary,
    addEmployeeSalary,
    generateSalarySlip
}