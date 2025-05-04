import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import validator from 'validator'
import crypto from 'crypto';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail, sendResetSuccessEmail, sendPasswordResetEmail } from '../nodemailer/emails.js';


export const signup = async (req, res) => {

    const { email, password, name } = req.body;

    try {
        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }
        //Checking the email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid Email" })
        }
        //Checking the password length
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" })
        }

        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const verificationToken = generateVerificationToken();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken,);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);


        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastlogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const logout = async (req, res) => {

    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        // Send reset email
        const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
        await sendPasswordResetEmail(user.email, resetURL);

        return res.status(200).json({ success: true, message: "Reset email sent successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // Update password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        sendResetSuccessEmail(user.email);

        return res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not Found" });
        }

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}