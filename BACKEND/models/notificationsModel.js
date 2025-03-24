import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    Title: { type: String, required: true, maxlength: 50 },
    Body: { type: String, required: true, maxlength: 500 },
    Date: { type: String, required: true },
    Time: { type: String, required: true }
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
