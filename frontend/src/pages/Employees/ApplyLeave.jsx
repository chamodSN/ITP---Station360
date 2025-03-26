import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApplyLeave = () => {

    const [leaveType, setLeaveType] = useState('Sick Leave');
    const [leaveDate, setLeaveDate] = useState('');
    const [reason, setReason] = useState('');

    const onSubmitHandler = async (e) => {

        e.preventDefault();

        try {
            const formData = {
                leaveType,
                leaveDate,
                reason,
            };

            const { data } = await axios.post('http://localhost:4200/api/admin/employee/leave/apply', formData)

            if (data.success) {
                toast.success('Leave Applied Succesfully')

            }

        } catch (error) {
            toast.error(error.message)
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-white">
            <form onSubmit={onSubmitHandler} className="p-6 bg-gray-800 text-white rounded-lg max-w-md w-full shadow-lg">
                <div className="mb-4">
                    <label className="block text-sm font-medium">Leave Type</label>
                    <select
                        onChange={(e) => setLeaveType(e.target.value)}
                        value={leaveType}
                        required
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Annual Leave">Annual Leave</option>
                        <option value="Unpaid Leave">Unpaid Leave</option>
                    </select>

                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Date:</label>
                    <input
                        type="date"
                        onChange={(e) => setLeaveDate(e.target.value)}
                        value={leaveDate}
                        required
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Reason </label>
                    <textarea
                        onChange={(e) => setReason(e.target.value)}
                        value={reason}
                        maxLength="500"
                        required
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
                >
                    Apply Leave
                </button>
            </form>
        </div>
    );
};

export default ApplyLeave;