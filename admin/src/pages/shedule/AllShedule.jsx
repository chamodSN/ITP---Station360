import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllShedules = () => {
    const [shedules, setShedules] = useState([]);
    const [searchParams, setSearchParams] = useState({
        employeeName: '',
        date: '',
        taskType: ''
    });
    const navigate = useNavigate();

    const getAllShedules = async () => {
        try {

            const { data } = await axios.get(`http://localhost:4200/api/admin/shedule/shedules`);

            console.log("Fetched Data:", data);

            if (data.success) {
                setShedules(data.AllShedules);
               
            } else {
                console.log("Problem fetching schedules", data.error);
            }
        } catch (error) {
            console.log("Error fetching schedules", error);
        }
    };


    // Function to get all schedules, or filtered schedules if search params are provided
    const searchFunction = async () => {
        try {
            // Construct the search query string based on searchParams state
            const queryString = new URLSearchParams(searchParams).toString();

            const { data } = await axios.get(`http://localhost:4200/api/admin/search-schedules?${queryString}`);

            if (data.success) {
                setSearchParams(data.schedules); // Update state with filtered schedules
            } else {
                console.log("Problem searching schedules");
            }
        } catch (error) {
            console.log("Error searching schedules", error);
        }
    };

    useEffect(() => {
        // Initially load all schedules
        getAllShedules();

        console.log(shedules)
    }, []); // Empty dependency array means it only runs on mount

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchFunction(); // Re-fetch schedules with new search parameters
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">All Schedules</h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <input
                    type="text"
                    name="employeeName"
                    placeholder="Search by Employee Name"
                    value={searchParams.employeeName}
                    onChange={handleSearchChange}
                    className="border p-2 rounded w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="date"
                    name="date"
                    value={searchParams.date}
                    onChange={handleSearchChange}
                    className="border p-2 rounded w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="taskType"
                    placeholder="Search by Task Type"
                    value={searchParams.taskType}
                    onChange={handleSearchChange}
                    className="border p-2 rounded w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">Search</button>
            </form>

            {/* Schedule Table */}
            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full border-collapse border border-gray-300 text-gray-700">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="border border-gray-300 py-3 px-4 text-left">Employee Name</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Date</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Time</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Task Type</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Task Details</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shedules && (
                            shedules.map((item) => (
                                <tr 
                                    key={item._id} 
                                    onClick={() => navigate(`/displayShedule/${item._id}`)}
                                    className="border border-gray-300 hover:bg-gray-100 cursor-pointer transition duration-200"
                                >
                                    <td className="border border-gray-300 py-2 px-4">{item.employeeName}</td>
                                    <td className="border border-gray-300 py-2 px-4">{item.date}</td>
                                    <td className="border border-gray-300 py-2 px-4">{item.time}</td>
                                    <td className="border border-gray-300 py-2 px-4">{item.taskType}</td>
                                    <td className="border border-gray-300 py-2 px-4">{item.taskDetails}</td>
                                    <td className={`border border-gray-300 py-2 px-4 font-bold ${item.taskStatus === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>{item.taskStatus}</td>
                                </tr>
                            ))
                        ) }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllShedules;
