import express from "express";
import { generateAttendanceReport, markAttendance, markLeave, getTodayAttendance, getAttendanceRecords, getAllAttendanceRecords, calculateSalary, updateAttendance, generateTaskReport } from "../Controllers/attendenceController.js";
import { authEmployee } from "../middleware/authEmployee.js";
import authAdmin from "../middleware/authAdmin.js";

const attendenceRouter = express.Router();

// Employee routes
//used in EmployeeProfile
attendenceRouter.post("/mark-attendance", authEmployee, markAttendance);

//used in EmployeeProfile
attendenceRouter.post("/mark-leave", authEmployee, markLeave);
attendenceRouter.get("/today/:employeeId", authEmployee, getTodayAttendance);
attendenceRouter.get("/records/:employeeId", authEmployee, getAttendanceRecords);

// Admin routes
attendenceRouter.get("/all", getAllAttendanceRecords);
attendenceRouter.get("/task-report", generateTaskReport);
attendenceRouter.get("/report", authAdmin, generateAttendanceReport);
attendenceRouter.put("/:attendanceId", updateAttendance);
attendenceRouter.get("/:id", getAttendanceRecords);

export default attendenceRouter;