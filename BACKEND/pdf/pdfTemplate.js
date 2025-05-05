export const DAILY_APPOINTMENTS_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .header {
            background-color: #2196F3;
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
        }
        .date {
            font-size: 18px;
            margin: 20px 0;
            text-align: center;
            color: #666;
        }
        .appointments-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .appointments-table th {
            background-color: #f5f5f5;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #ddd;
        }
        .appointments-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }
        .appointments-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            text-align: center;
            padding: 20px;
            margin-top: 40px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
        }
        .status {
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
        }
        .status-scheduled {
            background-color: #fff3cd;
            color: #856404;
        }
        .status-completed {
            background-color: #d4edda;
            color: #155724;
        }
        .status-cancelled {
            background-color: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Daily Appointments Report</h1>
    </div>
    
    <div class="date">
        <h2>Appointments for {date}</h2>
    </div>

    <table class="appointments-table">
        <thead>
            <tr>
                <th>Time</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Vehicle</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {appointments}
        </tbody>
    </table>

    <div class="footer">
        <p>Generated on {generatedDate} | Station360 - Your Trusted Auto Service Partner</p>
        <p>© {currentYear} Station360. All rights reserved.</p>
    </div>
</body>
</html>
`;

export const USER_REPORT_TEMPLATE = (users, startDate, endDate) => `
  <html>
    <head>
      <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background: #eee; }
      </style>
    </head>
    <body>
      <h1>User Login Report</h1>
      <p>From: ${new Date(startDate).toDateString()} To: ${new Date(endDate).toDateString()}</p>
      <table>
        <thead>
          <tr><th>Email</th><th>Created At</th></tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.email}</td>
              <td>${new Date(user.createdAt).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
  </html>
`;