import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true, maxlength: 20 },
    displayImage: { type: String, required: true },
    description: { type: String, required: true },
    specifications: { type: [String], default: [] },
    interval: { type: Number, min: 0, default: 0 },
    price: { type: Number, min: 0, default: 0 },
    available: { type: Boolean, required: true },
    isBookable: { type: Boolean, required: true },
    timeSlots: { type: [String], default: [] },
    bookedSlots: { type: [{ date: Date, timeSlot: String }], default: [] },
});

const serviceModel = mongoose.models.Services || mongoose.model("Services", serviceSchema);

export default serviceModel;
