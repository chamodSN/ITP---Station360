import pdf from 'html-pdf';
import { DAILY_APPOINTMENTS_TEMPLATE, USER_REPORT_TEMPLATE, TASK_REPORT_TEMPLATE, INVENTORY_STOCK_TEMPLATE, SALARY_SLIP_TEMPLATE, ATTENDANCE_REPORT_TEMPLATE } from './pdfTemplate.js';

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


// Generate User Report PDF
export const generateUserReportPDF = async (data) => {
    try {
        console.log('Generating user report PDF with data:', data);
        
        // Generate HTML using the template
        const html = USER_REPORT_TEMPLATE(data);
        
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
                    console.log("User report PDF generated successfully");
                    resolve(buffer);
                }
            });
        });
    } catch (error) {
        console.error("Error in generateUserReportPDF:", error);
        throw new Error(`Failed to generate user report PDF: ${error.message}`);
    }
};

export const generateTaskReportPDF = async (data, date) => {
    try {
        // Format technicians data for the template
        const techniciansHtml = data.map(tech => `
            <div class="technician">
                <div class="technician-name">Technician: ${tech.technicianName}</div>
                <table>
                    <tr>
                        <th>Category</th>
                        <th>Number of Tasks</th>
                    </tr>
                    ${tech.categories.map(cat => `
                        <tr>
                            <td>${cat.name}</td>
                            <td>${cat.count}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `).join('');

        // Get current date and year for footer
        const now = new Date();
        const generatedDate = now.toLocaleDateString();
        const currentYear = now.getFullYear();

        // Create template data object
        const templateData = {
            date: new Date(date).toLocaleDateString(),
            technicians: techniciansHtml,
            generatedDate: generatedDate,
            currentYear: currentYear
        };

        // Generate HTML using the template function
        const html = TASK_REPORT_TEMPLATE(templateData);

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
                    console.log("Task report PDF generated successfully");
                    resolve(buffer);
                }
            });
        });
    } catch (error) {
        console.error("Error in generateTaskReportPDF:", error);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    }
};

export const generateInventoryStockPDF = async (inventory) => {
    try {
        const LOW_STOCK_THRESHOLD = 15; // Default threshold for low stock

        // Calculate summary statistics
        const totalItems = inventory.length;
        const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const lowStockCount = inventory.filter(item => item.quantity <= LOW_STOCK_THRESHOLD).length;

        // Format inventory items for the template
        const inventoryItems = inventory.map(item => {
            const itemTotalValue = (item.quantity || 0) * (item.unitPrice || 0);
            return `
                <tr>
                    <td>${item.name || 'N/A'}</td>
                    <td>${item.brand || 'N/A'}</td>
                    <td>${item.itemType || 'N/A'}</td>
                    <td>${item.quantity || 0}</td>
                    <td>${item.unitType || 'N/A'}</td>
                    <td>$${(item.unitPrice || 0).toFixed(2)}</td>
                    <td>$${itemTotalValue.toFixed(2)}</td>
                    <td class="${(item.quantity || 0) <= LOW_STOCK_THRESHOLD ? 'low-stock' : ''}">
                        ${(item.quantity || 0) <= LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In Stock'}
                    </td>
                </tr>
            `;
        }).join('');

        // Get current date and year for footer
        const now = new Date();
        const generatedDate = now.toLocaleDateString();
        const currentYear = now.getFullYear();

        // Create template data object
        const templateData = {
            totalItems: totalItems,
            totalValue: totalValue,
            lowStockCount: lowStockCount,
            inventoryItems: inventoryItems,
            generatedDate: generatedDate,
            currentYear: currentYear
        };

        // Generate HTML using the template function
        const html = INVENTORY_STOCK_TEMPLATE(templateData);

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
                    console.log("Inventory stock PDF generated successfully");
                    resolve(buffer);
                }
            });
        });
    } catch (error) {
        console.error("Error in generateInventoryStockPDF:", error);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    }
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

export const generateAttendanceReportPDF = async (data) => {
    try {
        console.log('Generating attendance report PDF with data:', data);
        
        // Generate HTML using the template
        const html = ATTENDANCE_REPORT_TEMPLATE(data);
        
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
                    console.log("Attendance report PDF generated successfully");
                    resolve(buffer);
                }
            });
        });
    } catch (error) {
        console.error("Error in generateAttendanceReportPDF:", error);
        throw new Error(`Failed to generate attendance report PDF: ${error.message}`);
    }
};