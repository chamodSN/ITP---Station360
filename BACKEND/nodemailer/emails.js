import { transporter, sender } from './nodemailerConfig.js';
import nodemailer from 'nodemailer';
import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    EMPLOYEE_WELCOME_EMAIL_TEMPLATE,
    LOW_STOCK_ORDER_TEMPLATE,
    salaryEmailTemplate,
    BILLING_EMAIL_TEMPLATE,
    BOOKING_CANCELLATION_TEMPLATE,
    BOOKING_CONFIRMATION_TEMPLATE
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

export const sendSalaryEmail = async (employee, salary) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: employee.email,
        subject: `Your Salary Slip for ${salary.month}`,
        html: salaryEmailTemplate({
            name: employee.name,
            month: salary.month,
            totalDays: salary.totalDays,
            totalHours: salary.totalHours,
            baseSalary: salary.baseSalary,
            totalBonuses: salary.totalBonuses,
            totalDeductions: salary.totalDeductions,
            finalSalary: salary.finalSalary
        })
    };

    await transporter.sendMail(mailOptions);
};

export const sendBillingEmail = async (booking, tasks, extraExpenses, totalAmount) => {
    try {
        // Generate tasks list HTML
        const tasksList = tasks.map(task => `
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${task.task}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${task.price}</td>
            </tr>
        `).join('');

        // Generate extra expenses list HTML if there are any
        const extraExpensesList = extraExpenses.length > 0 ? `
            <h3 style="color: #2196F3; margin-top: 20px;">Extra Expenses</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                <thead>
                    <tr>
                        <th style="background-color: #f8f9fa; padding: 10px; border: 1px solid #ddd; text-align: left;">Description</th>
                        <th style="background-color: #f8f9fa; padding: 10px; border: 1px solid #ddd; text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${extraExpenses.map(expense => `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">${expense.description}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${expense.amount}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : '';

        // Replace placeholders in the template
        const emailHtml = BILLING_EMAIL_TEMPLATE
            .replace('{customerName}', booking.userId.name)
            .replace('{bookingId}', booking._id)
            .replace('{bookingDate}', new Date(booking.date).toLocaleDateString())
            .replace('{bookingTime}', booking.time)
            .replace('{vehicleDetails}', `${booking.vehicleId.brandName} ${booking.vehicleId.modelName} (${booking.vehicleId.plateNumber})`)
            .replace('{technicianName}', booking.technicianId.name)
            .replace('{tasksList}', tasksList)
            .replace('{extraExpensesList}', extraExpensesList)
            .replace('{totalAmount}', totalAmount);

        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: booking.userId.email,
            subject: `Billing Details for Booking #${booking._id}`,
            html: emailHtml
        });

        console.log("Billing email sent successfully");
        return { success: true };
    } catch (err) {
        console.error("Error sending billing email:", err);
        return { success: false, error: err.message };
    }
};

export const sendBookingCancellationEmail = async (booking, cancellationReason) => {
    try {
        const emailHtml = BOOKING_CANCELLATION_TEMPLATE
            .replace('{customerName}', booking.userId.name)
            .replace('{bookingDate}', new Date(booking.date).toLocaleDateString())
            .replace('{bookingTime}', booking.timeSlot)
            .replace('{serviceName}', booking.serviceId.serviceName)
            .replace('{vehicleDetails}', `${booking.vehicleId.brandName} ${booking.vehicleId.modelName} (${booking.vehicleId.plateNumber})`)
            .replace('{cancellationReason}', cancellationReason);

        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: booking.userId.email,
            subject: `Booking Cancellation - ${booking.serviceId.serviceName}`,
            html: emailHtml
        });

        console.log("Booking cancellation email sent successfully");
        return { success: true };
    } catch (err) {
        console.error("Error sending booking cancellation email:", err);
        return { success: false, error: err.message };
    }
};

export const sendBookingConfirmationEmail = async (booking) => {
    try {
        const emailHtml = BOOKING_CONFIRMATION_TEMPLATE
            .replace('{customerName}', booking.userId.name)
            .replace('{serviceName}', booking.serviceId.serviceName)
            .replace('{bookingDate}', new Date(booking.date).toLocaleDateString())
            .replace('{bookingTime}', booking.timeSlot)
            .replace('{endTime}', booking.endTime)
            .replace('{vehicleDetails}', `${booking.vehicleId.brandName} ${booking.vehicleId.modelName} (${booking.vehicleId.plateNumber})`);

        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: booking.userId.email,
            subject: `Booking Confirmation - ${booking.serviceId.serviceName}`,
            html: emailHtml
        });

        console.log("Booking confirmation email sent successfully");
        return { success: true };
    } catch (err) {
        console.error("Error sending booking confirmation email:", err);
        return { success: false, error: err.message };
    }
};
