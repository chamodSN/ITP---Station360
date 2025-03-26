import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeaveRequests = () => {

    const [leaveRequests, setLeaveRequests] = useState([]);
    const navigate = useNavigate();

    const getAllLeaveRequests = async () => {
        try {

            const { data } = await axios.get('http://localhost:4200/api/emp/leave/all');

            console.log(data)

            console.log("Fetched Data:", data);

            if (data.success) {
                setLeaveRequests(data.leaves);
               
            } else {
                console.log("Problem fetching leave requests", data.error);
            }
        } catch (error) {
            console.log("Error fetching leave requests", error);
        }
    };

    useEffect(() => {
        // Initially load all schedules
        getAllLeaveRequests();

    }, []); // Empty dependency array means it only runs on mount

    const handleApprove = async (id) => {
        try {
            const { data } = await axios.put(`http://localhost:4200/api/emp/leave/approve/${id}`);
            if (data.success) {
                alert("Leave request approved!");
            }
        } catch (error) {
            console.error("Error approving leave request:", error);
        }
    };
    
    const handleReject = async (id) => {
        try {
            const { data } = await axios.put(`http://localhost:4200/api/emp/leave/reject/${id}`);
            if (data.success) {
                alert("Leave request rejected!");
            }
        } catch (error) {
            console.error("Error rejecting leave request:", error);
        }
    };
    

   

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800"> Leave Requests</h1>
            
           
            {/* Schedule Table */}
            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full border-collapse border border-gray-300 text-gray-700">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                           
                            <th className="border border-gray-300 py-3 px-4 text-left">Leave Type</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Leave Date</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Reason</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Status</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Apply Date</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Approve</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Reject</th>
                        </tr>
                    </thead>
                    <tbody>
    {leaveRequests
        .filter((leaveRequest) => leaveRequest.status === "Pending")
        .map((leaveRequest) => (
            <tr 
                key={leaveRequest._id} 
                className="border border-gray-300 hover:bg-gray-100 cursor-pointer transition duration-200"
            >
                <td className="border border-gray-300 py-2 px-4">{leaveRequest.leaveType}</td>
                <td className="border border-gray-300 py-2 px-4">{new Date(leaveRequest.leaveDate).toISOString().split('T')[0]}</td>
                <td className="border border-gray-300 py-2 px-4">{leaveRequest.reason}</td>
                <td className="border border-gray-300 py-2 px-4">{leaveRequest.status}</td>
                <td className="border border-gray-300 py-2 px-4">{new Date(leaveRequest.appliedAt).toISOString().split('T')[0]}</td>
                <td className="border border-gray-300 py-2 px-4">
                    <button 
                        onClick={() => handleApprove(leaveRequest._id)} 
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                        Approve
                    </button>
                </td>
                <td className="border border-gray-300 py-2 px-4">
                    <button 
                        onClick={() => handleReject(leaveRequest._id)} 
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Reject
                    </button>
                </td>
            </tr>
        ))
    }
</tbody>

                </table>
            </div>
        </div>
    );
};

export default LeaveRequests;