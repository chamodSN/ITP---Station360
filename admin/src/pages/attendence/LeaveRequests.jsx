import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeaveRequests = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

    const getAllLeaveRequests = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:4200/api/leave/all');

            if (data.success) {
                setLeaveRequests(data.leaves);
            } else {
                toast.error("Failed to fetch leave requests");
            }
        } catch (error) {
            console.error("Error fetching leave requests:", error);
            toast.error("Error fetching leave requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllLeaveRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            const { data } = await axios.put(
                `http://localhost:4200/api/leave/approve/${id}`
            );
            if (data.success) {
                toast.success("Leave request approved successfully");
                getAllLeaveRequests();
            }
        } catch (error) {
            console.error("Error approving leave request:", error);
            toast.error("Failed to approve leave request");
        }
    };
    
    const handleReject = async (id) => {
        try {
            const { data } = await axios.put(
                `http://localhost:4200/api/leave/reject/${id}`
            );
            if (data.success) {
                toast.success("Leave request rejected successfully");
                getAllLeaveRequests();
            }
        } catch (error) {
            console.error("Error rejecting leave request:", error);
            toast.error("Failed to reject leave request");
        }
    };

    const filteredRequests = leaveRequests.filter(request => {
        if (filter === 'all') return true;
        return request.status.toLowerCase() === filter;
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
                <h1 className="text-3xl font-bold text-gray-800">Leave Requests</h1>
                <div className="flex gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="all">All Requests</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRequests.map((request) => (
                            <tr key={request._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{request.employee.name}</div>
                                    <div className="text-sm text-gray-500">{request.employee.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.leaveType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(request.leaveDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{request.reason}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                        request.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                        'bg-yellow-100 text-yellow-800'}`}>
                                        {request.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(request.appliedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {request.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(request._id)}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(request._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveRequests;