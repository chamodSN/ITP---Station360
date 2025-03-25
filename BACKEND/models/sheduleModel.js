import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },  
  taskType: { type: String, required: true },
  taskDetails: { type: String, required: true,maxlength:500 },
  taskStatus: { type: String, default: "assigned" }
});

const scheduleModel = mongoose.models.schedule || mongoose.model('schedule', scheduleSchema);

export default scheduleModel;
