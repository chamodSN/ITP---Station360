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

        // Create data object for the template
        const templateData = {
            date: date,
            appointments: formattedAppointments,
            generatedDate: generatedDate,
            currentYear: currentYear
        };

        // Generate HTML using the template function
        const html = DAILY_APPOINTMENTS_TEMPLATE(templateData);

        console.log("Final HTML template:", html);

        // PDF options
        const options = {
            format: 'A4',
            border: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            }
        };

        // Generate PDF
        return new Promise((resolve, reject) => {
            pdf.create(html, options).toBuffer((err, buffer) => {
                if (err) {
                    console.error("PDF generation error:", err);
                    reject(err);
                } else {
                    console.log("Daily appointments PDF generated successfully");
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

export const generateSalarySlipPDF = async (employeeData) => {
    try {
        console.log('Starting PDF generation with data:', employeeData);

        // Validate only essential fields
        const requiredFields = ['employeeName'];
        const missingFields = requiredFields.filter(field => !employeeData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Prepare template data with default values for optional fields
        const templateData = {
            ...employeeData,
            employeeId: employeeData.employeeId || 'N/A',
            department: employeeData.department || 'N/A',
            position: employeeData.position || 'N/A',
            generatedDate: new Date().toLocaleDateString(),
            currentYear: new Date().getFullYear(),
            // Ensure numeric values are properly formatted
            basicSalary: Number(employeeData.basicSalary || 0),
            allowances: Number(employeeData.allowances || 0),
            overtime: Number(employeeData.overtime || 0),
            deductions: Number(employeeData.deductions || 0),
            netSalary: Number(employeeData.netSalary || 0),
            totalHours: Number(employeeData.totalHours || 0),
            totalDays: Number(employeeData.totalDays || 0)
        };

        console.log('Prepared template data:', templateData);

        // Generate HTML using template
        const html = SALARY_SLIP_TEMPLATE(templateData);
        console.log('Generated HTML template');

        // PDF options
        const options = {
            format: 'A4',
            border: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        };

        // Generate PDF
        return new Promise((resolve, reject) => {
            pdf.create(html, options).toBuffer((err, buffer) => {
                if (err) {
                    console.error('PDF generation error:', err);
                    reject(err);
                } else {
                    console.log('PDF generated successfully, buffer size:', buffer.length);
                    resolve(buffer);
                }
            });
        });
    } catch (error) {
        console.error('Error in generateSalarySlipPDF:', error);
        throw error;
    }
};