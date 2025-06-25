import Attendance from "../models/attendenceModel.js";
import Employee from "../models/employeeModel.js";
import moment from "moment";
import scheduleModel from "../models/sheduleModel.js";
import { generateTaskReportPDF, generateAttendanceReportPDF } from "../pdf/ReportGenerator.js";

//used in EmployeeProfile
const markAttendance = async (req, res) => {
    try {
        const employeeId = req.employeeId;

        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

        const today = moment().format("YYYY-MM-DD");
        const existingRecord = await Attendance.findOne({ employeeId, date: today });

        if (existingRecord) {
            return res.status(400).json({ success: false, message: "Attendance already marked for today" });
        }

        const attendance = new Attendance({
            employeeId,
            date: today,
            checkInTime: moment().format("HH:mm:ss"),
        });

        await attendance.save();
        res.status(201).json({ success: true, message: "Attendance marked successfully", attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

//used in EmployeeProfile
const markLeave = async (req, res) => {
    try {
        const employeeId = req.employeeId;

        const today = moment().format("YYYY-MM-DD");
        const attendance = await Attendance.findOne({ employeeId, date: today });

        if (!attendance) return res.status(404).json({ success: false, message: "No attendance record found for today" });

        if (attendance.checkOutTime) {
            return res.status(400).json({ success: false, message: "Employee already checked out" });
        }

        attendance.checkOutTime = moment().format("HH:mm:ss");

        const checkInTime = moment(attendance.checkInTime, "HH:mm:ss");
        const checkOutTime = moment(attendance.checkOutTime, "HH:mm:ss");
        attendance.workHours = checkOutTime.diff(checkInTime, "hours", true);

        await attendance.save();
        res.status(200).json({ success: true, message: "Leave marked successfully", attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

const getTodayAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const today = moment().format("YYYY-MM-DD");

        const attendance = await Attendance.findOne({
            employeeId: employeeId,
            date: today
        });

        if (!attendance) {
            return res.status(200).json({
                success: true,
                message: "No attendance record found for today",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Today's attendance retrieved successfully",
            data: attendance
        });
    } catch (error) {
        console.error("Error in getTodayAttendance:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getAttendanceRecords = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { id } = req.query;

        let query = {};

        // If ID is provided, get single record
        if (id) {
            query = { _id: id };
        } else {
            // Otherwise get all records for the employee
            query = { employeeId };
        }

        const records = await Attendance.find(query)
            .populate('employeeId', 'name email')
            .sort({ date: -1, checkInTime: -1 });

        if (!records.length) {
            return res.status(404).json({ success: false, message: "No attendance records found" });
        }

        res.status(200).json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

const getAllAttendanceRecords = async (req, res) => {
    try {
        const records = await Attendance.find()
            .populate('employeeId', 'name email')
            .sort({ date: -1, checkInTime: -1 });

        // Return empty array instead of 404 when no records exist
        res.status(200).json({
            success: true,
            records: records || [],
            message: records.length ? "Attendance records retrieved successfully" : "No attendance records found"
        });
    } catch (error) {
        console.error("Error in getAllAttendanceRecords:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
            records: []
        });
    }
};

const calculateSalary = async (req, res) => {
    try {
        const { employeeId, month } = req.body;

        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

        const attendanceRecords = await Attendance.find({
            employeeId,
            date: { $regex: `^${month}` }
        });

        if (!attendanceRecords.length) {
            return res.status(404).json({ success: false, message: "No records found for this month" });
        }

        const totalHours = attendanceRecords.reduce((sum, record) => sum + (record.workHours || 0), 0);

        const salary = totalHours * employee.hourlyRate;

        res.status(200).json({
            success: true,
            employeeId,
            totalHours,
            hourlyRate: employee.hourlyRate,
            salary
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

const updateAttendance = async (req, res) => {
    try {
        const { attendanceId } = req.params;
        const { employeeId, checkInTime, checkOutTime, workHours } = req.body;

        const updatedAttendance = await Attendance.findByIdAndUpdate(
            attendanceId,
            { employeeId, checkInTime, checkOutTime, workHours },
            { new: true } // Returns the updated document
        );

        if (!updatedAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        res.status(200).json(updatedAttendance);
    } catch (error) {
        res.status(500).json({ message: "Error updating attendance", error: error.message });
    }
};

const generateTaskReport = async (req, res) => {
    try {
        const { date } = req.query;

        console.log(date);

        // Get all tasks for the specified date
        const tasks = await scheduleModel.find({
            date: date
        }).populate('employeeId', 'name email');

        // Group tasks by technician and category
        const reportData = tasks.reduce((acc, task) => {
            const techId = task.employeeId._id;
            const techName = task.employeeId.name;
            const taskType = task.taskType;

            if (!acc[techId]) {
                acc[techId] = {
                    technicianName: techName,
                    categories: {}
                };
            }

            if (!acc[techId].categories[taskType]) {
                acc[techId].categories[taskType] = 0;
            }

            acc[techId].categories[taskType]++;
            return acc;
        }, {});

        // Format data for PDF template
        const formattedData = Object.entries(reportData).map(([techId, data]) => ({
            technicianName: data.technicianName,
            categories: Object.entries(data.categories).map(([category, count]) => ({
                name: category,
                count: count
            }))
        }));

        // Generate PDF
        const pdfBuffer = await generateTaskReportPDF(formattedData, date);

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=task-report-${date}.pdf`);

        // Send the PDF buffer
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating task report:", error);
        res.status(500).json({
            success: false,
            message: "Error generating task report",
            error: error.message
        });
    }
};

const generateAttendanceReport = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({ error: 'Month parameter is required in YYYY-MM format' });
        }

        // Parse the month string (YYYY-MM)
        const [year, monthNum] = month.split('-').map(num => parseInt(num, 10));

        if (isNaN(year) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM' });
        }

        // Get all employees
        const employees = await Employee.find().select('name employeeId');

        // Get attendance records for the specified month and year
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0);

        // Format dates as YYYY-MM-DD strings for MongoDB query
        const startDateStr = `${year}-${String(monthNum).padStart(2, '0')}-01`;
        const endDateStr = `${year}-${String(monthNum).padStart(2, '0')}-${endDate.getDate()}`;

        const attendanceRecords = await Attendance.find({
            date: {
                $gte: startDateStr,
                $lte: endDateStr
            }
        }).populate('employeeId', 'name employeeId');

        // Calculate attendance statistics for each employee
        const employeeStats = employees.map(employee => {
            const employeeRecords = attendanceRecords.filter(record =>
                record.employeeId._id.toString() === employee._id.toString()
            );

            const presentDays = employeeRecords.filter(record => record.checkInTime && record.checkOutTime).length;
            const absentDays = employeeRecords.filter(record => !record.checkInTime).length;
            const lateDays = employeeRecords.filter(record => {
                if (!record.checkInTime) return false;
                const checkInTime = new Date(`2000-01-01T${record.checkInTime}`);
                return checkInTime.getHours() >= 9; // Consider late if checked in after 9 AM
            }).length;
            const totalWorkingDays = endDate.getDate(); // Total days in the month
            const attendanceRate = ((presentDays + lateDays) / totalWorkingDays * 100).toFixed(1);

            return {
                name: employee.name,
                employeeId: employee.employeeId,
                presentDays,
                absentDays,
                lateDays,
                totalWorkingDays,
                attendanceRate
            };
        });

        // Prepare data for PDF generation
        const pdfData = {
            month: new Date(year, monthNum - 1).toLocaleString('default', { month: 'long' }),
            year: year,
            employees: employeeStats,
            generatedDate: new Date().toLocaleString(),
            currentYear: new Date().getFullYear()
        };

        // Generate PDF
        const pdf = await generateAttendanceReportPDF(pdfData);

        if (!pdf) {
            throw new Error('Failed to generate PDF');
        }

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=attendance-report-${month}.pdf`);

        // Send PDF
        res.send(pdf);
    } catch (error) {
        console.error('Error generating attendance report:', error);
        res.status(500).json({ error: error.message });
    }
};

export { generateAttendanceReport, markAttendance, markLeave, getTodayAttendance, getAttendanceRecords, getAllAttendanceRecords, calculateSalary, updateAttendance, generateTaskReport }