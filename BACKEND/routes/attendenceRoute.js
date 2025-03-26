import express from "express";
import { markAttendance, markLeave, getAttendanceRecords, calculateSalary,updateAttendance } from "../Controllers/attendenceController.js";

const attendenceRouter = express.Router();

attendenceRouter.post("/mark-attendance", markAttendance);
attendenceRouter.post("/mark-leave", markLeave);
attendenceRouter.get("/:employeeId", getAttendanceRecords);
attendenceRouter.post("/calculate-salary", calculateSalary);
attendenceRouter.put("/update-attendance/:attendanceId", updateAttendance);

export default attendenceRouter;