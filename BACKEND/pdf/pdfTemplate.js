export const userReportTemplate = (users, startDate, endDate) => `
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
          ${users
            .map(
              (user) =>
                `<tr><td>${user.email}</td><td>${new Date(user.createdAt).toLocaleString()}</td></tr>`
            )
            .join('')}
        </tbody>
      </table>
    </body>
  </html>
`;
