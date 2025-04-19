import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    leaveType: {
        type: String,
        required: true
    },
    leaveDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

const LeaveModel = mongoose.models.leave || mongoose.model("leave", leaveSchema);

export default LeaveModel;