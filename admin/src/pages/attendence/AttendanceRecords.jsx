import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceRecords = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'present', 'absent'
    const [dateFilter, setDateFilter] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const getAllAttendanceRecords = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:4200/api/attendence/all', {
                withCredentials: true
            });

            if (data.success) {
                setAttendanceRecords(data.records);
            } else {
                toast.error("Failed to fetch attendance records");
            }
        } catch (error) {
            console.error("Error fetching attendance records:", error);
            toast.error("Error fetching attendance records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllAttendanceRecords();
    }, []);

    const handleGeneratePDF = async () => {
        if (!selectedMonth || !selectedYear) {
            toast.error('Please select both month and year');
            return;
        }

        try {
            // Format month with leading zero if needed
            const formattedMonth = String(selectedMonth).padStart(2, '0');
            const monthYear = `${selectedYear}-${formattedMonth}`;

            const response = await axios.get(
                'http://localhost:4200/api/attendence/report',
                {
                    params: { month: monthYear },
                    responseType: 'blob',
                    withCredentials: true
                }
            );

            if (response.data.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = () => {
                    const errorData = JSON.parse(reader.result);
                    toast.error(errorData.message || 'Failed to generate attendance report');
                };
                reader.readAsText(response.data);
                return;
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance-report-${selectedMonth}-${selectedYear}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Attendance report downloaded successfully');
        } catch (error) {
            console.error('Error generating PDF:', error);
            if (error.response?.data) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorData = JSON.parse(reader.result);
                        toast.error(errorData.message || 'Failed to generate attendance report');
                    } catch (e) {
                        toast.error('Failed to generate attendance report');
                    }
                };
                reader.readAsText(error.response.data);
            } else {
                toast.error('Failed to generate attendance report');
            }
        }
    };

    const filteredRecords = attendanceRecords.filter(record => {
        if (filter === 'all') return true;
        if (filter === 'present') return record.checkInTime && record.checkOutTime;
        if (filter === 'absent') return !record.checkInTime;
        return true;
    }).filter(record => {
        if (!dateFilter) return true;
        return record.date.split('T')[0] === dateFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Attendance Records</h1>

            {/* Add PDF Generation Controls */}
            <div className="flex flex-wrap gap-4 items-end mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                    </label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border p-2 rounded-md focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Select Month</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                    </label>
                    <input
                        type="number"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="border p-2 rounded-md focus:ring-2 focus:ring-primary"
                        min="2000"
                        max={new Date().getFullYear()}
                    />
                </div>
                <button
                    onClick={handleGeneratePDF}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    Generate Report
                </button>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Attendance Records</h1>
                <div className="flex gap-4">
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="all">All Records</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                    </select>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Hours</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRecords.map((record) => (
                            <tr key={record._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{record.employeeId?.name || 'Unknown'}</div>
                                    <div className="text-sm text-gray-500">{record.employeeId?.email || 'No email'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.checkInTime || 'Not checked in'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.checkOutTime || 'Not checked out'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.workHours ? `${record.workHours.toFixed(2)} hours` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${record.checkInTime && record.checkOutTime ? 'bg-green-100 text-green-800' : 
                                        record.checkInTime ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-red-100 text-red-800'}`}>
                                        {record.checkInTime && record.checkOutTime ? 'Present' : 
                                         record.checkInTime ? 'Working' : 'Absent'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceRecords; 