import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    Title: { type: String, required: true, maxlength: 50 },
    Body: { type: String, required: true, maxlength: 500 },
    targetAudience: {
        type: String,
        required: true,
        enum: ['employees', 'users', 'all'],
        default: 'all'
    },
    priority: {
        type: String,
        required: true,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    }
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
