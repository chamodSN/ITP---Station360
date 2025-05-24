import pdf from 'html-pdf';
import { DAILY_APPOINTMENTS_TEMPLATE, USER_REPORT_TEMPLATE } from './pdfTemplate.js';

export const generateDailyAppointmentsPDF = async (appointments, date) => {
    try {
        console.log("Generating PDF for date:", date);
        console.log("Received appointments:", JSON.stringify(appointments, null, 2));

        // Format appointments for the template
        const formattedAppointments = appointments.map(appointment => {
            console.log("Processing appointment:", appointment);
            return `
                <tr>
                    <td>${appointment.timeSlot} - ${appointment.endTime}</td>
                    <td>${appointment.customerName}</td>
                    <td>${appointment.serviceName}</td>
                    <td>${appointment.vehicleDetails}</td>
                    <td><span class="status status-${appointment.status.toLowerCase()}">${appointment.status}</span></td>
                </tr>
            `;
        }).join('');

        console.log("Formatted HTML for appointments:", formattedAppointments);

        // Get current date and year for footer
        const now = new Date();
        const generatedDate = now.toLocaleDateString();
        const currentYear = now.getFullYear();

        // Replace template placeholders
        let html = DAILY_APPOINTMENTS_TEMPLATE
            .replace('{date}', date)
            .replace('{appointments}', formattedAppointments)
            .replace('{generatedDate}', generatedDate)
            .replace('{currentYear}', currentYear);

        console.log("Final HTML template:", html);

        // PDF options
        const options = {
            format: 'A4',
            border: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            },
            header: {
                height: '0.5in'
            },
            footer: {
                height: '0.5in'
            }
        };

        // Generate PDF
        return new Promise((resolve, reject) => {
            pdf.create(html, options).toBuffer((err, buffer) => {
                if (err) {
                    console.error("PDF generation error:", err);
                    reject(err);
                } else {
                    console.log("PDF generated successfully");
                    resolve(buffer);
                }
            });
        });
    } catch (error) {
        console.error("Error in generateDailyAppointmentsPDF:", error);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    }
};

export const generateUserReportPDF = (users, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        const html = userReportTemplate(users, startDate, endDate);
        const options = { format: 'A4' };

        pdf.create(html, options).toStream((err, stream) => {
            if (err) {
                return reject(err);
            }
            resolve(stream);
        });
    });
};