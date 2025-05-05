import express from "express";
import { getAllLeaves, approveLeave, rejectLeave, applyLeave, getAllLeavesOfEmployees } from "../Controllers/leaveController.js";
import authAdmin from "../middleware/authAdmin.js";
import { authEmployee } from "../middleware/authEmployee.js";

const leaveRoute = express.Router();

//For Admin
leaveRoute.get("/all", getAllLeaves);
leaveRoute.put("/approve/:leaveId", approveLeave);
leaveRoute.put("/reject/:leaveId", rejectLeave);

//For Employee
leaveRoute.post("/apply", authEmployee, applyLeave);
leaveRoute.get("/my-leaves", authEmployee, getAllLeavesOfEmployees);

export default leaveRoute;