import { transporter, sender } from './nodemailerConfig.js';
import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    TWO_FACTOR_SETUP_TEMPLATE,
    LOW_STOCK_ORDER_TEMPLATE,
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

export const sendEmployeeWelcomeEmail = async (email, name, position) => {
    const portalLink = "https://portal.station360.com";
    const teamLeadName = "John Smith";
    const onboardingGuideLink = "https://station360.com/onboarding-guide";

    const html = EMPLOYEE_WELCOME_EMAIL_TEMPLATE
        .replace("{name}", name)
        .replace("{position}", position)
        .replace("{portalLink}", portalLink)
        .replace("{teamLeadName}", teamLeadName)
        .replace("{onboardingGuideLink}", onboardingGuideLink);

    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Welcome to Station360!",
            html
        });
        console.log("Employee welcome email sent");
    } catch (err) {
        console.error("Error sending employee welcome email:", err);
    }
};

export const sendLowStockOrderEmail = async (supplierEmail, items) => {
    try {
        // Generate the items list HTML
        const itemsList = items.map(item => `
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.brand}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.unitType}</td>
            </tr>
        `).join('');

        // Replace the placeholder in the template
        const emailHtml = LOW_STOCK_ORDER_TEMPLATE.replace('{itemsList}', itemsList);

        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: supplierEmail,
            subject: "Low Stock Order Request - Station360",
            html: emailHtml,
        });
        console.log("Low stock order email sent");
        return { success: true };
    } catch (err) {
        console.error("Error sending low stock order email:", err);
        return { success: false, error: err.message };
    }
};
