import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: '0000000000'
    },
    image: {
        type: String,
        default: "data:image/jpeg;base64,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"
    },
    gender: {
        type: String,
        default: "Not selected"
    },
    lastlogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User;