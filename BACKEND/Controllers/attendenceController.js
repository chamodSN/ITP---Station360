import Attendance from "../models/attendenceModel.js";
import Employee from "../models/employeeModel.js";
import moment from "moment";

const markAttendance = async (req, res) => {
    try {
        const { employeeId } = req.body;

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
            checkIn: moment().format("HH:mm:ss"),
        });

        await attendance.save();
        res.status(201).json({ success: true, message: "Attendance marked successfully", attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};


const markLeave = async (req, res) => {
    try {
        const { employeeId } = req.body;

        const today = moment().format("YYYY-MM-DD");
        const attendance = await Attendance.findOne({ employeeId, date: today });

        if (!attendance) return res.status(404).json({ success: false, message: "No attendance record found for today" });

        if (attendance.checkOut) {
            return res.status(400).json({ success: false, message: "Employee already checked out" });
        }

        attendance.checkOut = moment().format("HH:mm:ss");

        const checkInTime = moment(attendance.checkIn, "HH:mm:ss");
        const checkOutTime = moment(attendance.checkOut, "HH:mm:ss");
        attendance.workHours = checkOutTime.diff(checkInTime, "hours", true);

        await attendance.save();
        res.status(200).json({ success: true, message: "Leave marked successfully", attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};


const getAttendanceRecords = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const records = await Attendance.find({ employeeId }).sort({ date: -1 });

        if (!records.length) {
            return res.status(404).json({ success: false, message: "No attendance records found" });
        }

        res.status(200).json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
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

export {markAttendance, markLeave, getAttendanceRecords, calculateSalary,updateAttendance}