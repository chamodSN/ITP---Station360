import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DisplayEmployeeLeave = () => {

    const [leaves, setLeaves] = useState([]);
    const navigate = useNavigate();

    const getAllLeaves = async () => {
        try {

            const { data } = await axios.get(`http://localhost:4200/api/admin/employee/leave/67d677f33fd67fd054dd044f`);

            console.log(data)

            console.log("Fetched Data:", data);

            if (data.success) {
                setLeaves(data.leaves);
               
            } else {
                console.log("Problem fetching leaves", data.error);
            }
        } catch (error) {
            console.log("Error fetching leaves", error);
        }
    };

    useEffect(() => {
        // Initially load all schedules
        getAllLeaves();

    }, []); // Empty dependency array means it only runs on mount

   

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">My Leave</h1>
            
           
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
                        </tr>
                    </thead>
                    <tbody>
                        {leaves && (
                            leaves.map((leave) => (
                                <tr 
                                    key={leave._id} 
                                    className="border border-gray-300 hover:bg-gray-100 cursor-pointer transition duration-200"
                                >
                                    <td className="border border-gray-300 py-2 px-4">{leave.leaveType}</td>
                                    <td className="border border-gray-300 py-2 px-4">{leave.leaveDate}</td>
                                    <td className="border border-gray-300 py-2 px-4">{leave.reason}</td>
                                    <td className="border border-gray-300 py-2 px-4">{leave.status}</td>
                                    <td className="border border-gray-300 py-2 px-4">{leave.appliedAt}</td>
                                </tr>
                            ))
                        ) }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DisplayEmployeeLeave;