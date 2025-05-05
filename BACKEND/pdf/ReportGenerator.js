import pdf from 'html-pdf';
import { userReportTemplate } from './pdfTemplate.js';

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
