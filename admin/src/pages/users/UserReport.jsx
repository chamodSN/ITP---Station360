import React, { useState } from 'react';
import axios from 'axios';

function UserReport() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleGenerate = async () => {
        try {
            const res = await axios.post(
                'http://localhost:4200/api/user/user-report',
                { startDate, endDate },
                { responseType: 'blob' }
            );

            // If it's actually a PDF
            if (res.data.type === 'application/pdf') {
                const blob = new Blob([res.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'user_report.pdf';
                a.click();
            } else {
                // Read error JSON
                const text = await res.data.text();
                const json = JSON.parse(text);
                console.error('Server error:', json.message || json);
                alert('Server error: ' + (json.message || 'Unknown error'));
            }
        } catch (err) {
            alert('Request failed: ' + err.message);
        }
    };


    return (
        <div>
            <h2>User Report Generator</h2>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button onClick={handleGenerate}>Generate PDF</button>
        </div>
    );
}

export default UserReport;
