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