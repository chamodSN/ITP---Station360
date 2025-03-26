import express from "express";
import { getAllLeaves, approveLeave, rejectLeave } from "../Controllers/leaveController.js";

const leaveRoute = express.Router();

leaveRoute.get("/all", getAllLeaves);
leaveRoute.put("/approve/:leaveId", approveLeave);
leaveRoute.put("/reject/:leaveId", rejectLeave);

export default leaveRoute;