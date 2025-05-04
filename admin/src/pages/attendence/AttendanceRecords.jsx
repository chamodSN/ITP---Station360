import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceRecords = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'present', 'absent'
    const [dateFilter, setDateFilter] = useState('');

    const getAllAttendanceRecords = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:4200/api/admin/attendence/all', {
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
        <div className="max-w-7xl mx-auto p-6">
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
                                    <div className="text-sm font-medium text-gray-900">{record.employee?.name || 'Unknown'}</div>
                                    <div className="text-sm text-gray-500">{record.employee?.email || 'No email'}</div>
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