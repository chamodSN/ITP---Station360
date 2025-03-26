import LeaveModel from "../models/leaveModel.js";
import EmployeeModel from "../models/employeeModel.js";

export const applyLeave = async (req, res) => {
    try {
        const employeeId = "67d677f33fd67fd054dd044f"
        const { leaveType, leaveDate, reason } = req.body;

        console.log("Received data:", req.body);

        const employee = await EmployeeModel.findById(employeeId);
        console.log("employee data:", employee);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        const leave = new LeaveModel({
            employee: employeeId,
            leaveType,
            leaveDate,
            reason
        });

        await leave.save();
        res.status(201).json({ success: true, message: "Leave request submitted successfully", leave });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// Get All Leave Requests (Admin)
export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await LeaveModel.find();
        res.status(200).json({ success: true, leaves });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

export const getAllLeavesOfEmployees = async (req, res) => {
    try {

        const { id } = req.params;
        
        const leaves = await LeaveModel.find({ employee: id }); 

        return res.status(200).json({ success: true, leaves });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// Approve Leave Request (Admin)
export const approveLeave = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const leave = await LeaveModel.findById(leaveId);

        if (!leave) {
            return res.status(404).json({ success: false, message: "Leave request not found" });
        }

        leave.status = "Approved";
        await leave.save();

        res.status(200).json({ success: true, message: "Leave request approved", leave });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

export const rejectLeave = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const leave = await LeaveModel.findById(leaveId);

        if (!leave) {
            return res.status(404).json({ success: false, message: "Leave request not found" });
        }

        leave.status = "Rejected";
        await leave.save();

        res.status(200).json({ success: true, message: "Leave request rejected", leave });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};