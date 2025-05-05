import Attendance from "../models/attendenceModel.js";
import Employee from "../models/employeeModel.js";
import moment from "moment";


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

export { markAttendance, markLeave, getTodayAttendance, getAttendanceRecords, getAllAttendanceRecords, calculateSalary, updateAttendance }