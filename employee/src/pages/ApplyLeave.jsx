import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEmployeeAuthStore } from '../store/authStore';

const ApplyLeave = () => {
    const { employee } = useEmployeeAuthStore();
    const [leaves, setLeaves] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [leaveType, setLeaveType] = useState('Sick Leave');
    const [leaveDate, setLeaveDate] = useState('');
    const [reason, setReason] = useState('');

    const fetchLeaves = async () => {
        try {
            const { data } = await axios.get(
                'http://localhost:4200/api/leave/my-leaves',
                { withCredentials: true }
            );
            if (data.success) {
                setLeaves(data.leaves);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
            toast.error('Failed to fetch leaves');
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                leaveType,
                leaveDate,
                reason,
            };

            const { data } = await axios.post(
                'http://localhost:4200/api/leave/apply',
                formData,
                {
                    withCredentials: true
                }
            );

            if (data.success) {
                toast.success('Leave Applied Successfully');
                // Reset form
                setLeaveType('Sick Leave');
                setLeaveDate('');
                setReason('');
                setShowForm(false);
                // Refresh leaves list
                fetchLeaves();
            }
        } catch (error) {
            console.error('Leave application error:', error);
            toast.error(error.response?.data?.message || 'Failed to apply leave');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Leaves</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Apply for Leave
                    </button>
                </div>

                {/* Leave List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leaves.map((leave) => (
                                <tr key={leave._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.leaveType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(leave.leaveDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{leave.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(leave.appliedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Apply Leave Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Apply for Leave</h3>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={onSubmitHandler}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                                    <select
                                        onChange={(e) => setLeaveType(e.target.value)}
                                        value={leaveType}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="Sick Leave">Sick Leave</option>
                                        <option value="Casual Leave">Casual Leave</option>
                                        <option value="Annual Leave">Annual Leave</option>
                                        <option value="Unpaid Leave">Unpaid Leave</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        onChange={(e) => setLeaveDate(e.target.value)}
                                        value={leaveDate}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Reason</label>
                                    <textarea
                                        onChange={(e) => setReason(e.target.value)}
                                        value={reason}
                                        maxLength="500"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyLeave;