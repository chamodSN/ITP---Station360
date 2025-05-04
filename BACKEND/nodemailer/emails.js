import { transporter, sender } from './nodemailerConfig.js';
import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    TWO_FACTOR_SETUP_TEMPLATE
} from './emailTemplates.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        });
        console.log("Verification email sent");
    } catch (err) {
        console.error("Error sending verification email:", err);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Reset your password",
            html
        });

        console.log("Password reset email sent");
    } catch (err) {
        console.error("Error sending reset email:", err);
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE
        });
        console.log("Password reset success email sent");
    } catch (err) {
        console.error("Error sending success email:", err);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const html = WELCOME_EMAIL_TEMPLATE.replace("{name}", name);
    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Welcome to Station360",
            html
        });
        console.log("Welcome email sent");
    } catch (err) {
        console.error("Error sending welcome email:", err);
    }
};

export const send2FAEmail = async (email, name, secret) => {
    try {
        const html = TWO_FACTOR_SETUP_TEMPLATE
            .replace("{name}", name)
            .replace("{secret}", secret);

        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Set Up Two-Factor Authentication",
            html
        });

        console.log("2FA setup email sent");
    } catch (err) {
        console.error("Error sending 2FA setup email:", err);
    }
};
