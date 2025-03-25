import React, { useState } from 'react'
import axios from 'axios'

const AddSchedule = () => {
    const [employeeName, setemployeeName] = useState('');
    const [date, setdate] = useState('');
    const [time, settime] = useState('');
    const [taskType, settaskType] = useState('');
    const [taskDetails, settaskDetails] = useState('');
    const [taskStatus, settaskStatus] = useState('assigned');

    const onSubmitHandler = async (e) => {

        const formattedDate = new Date(date).toISOString().split('T')[0];
        const formattedTime = time.length === 5 ? `${time}:00` : time; 

        e.preventDefault();

        try {
            const formData = {
                employeeName,
                date : formattedDate,
                time : formattedTime,
                taskType,
                taskDetails,
                taskStatus
            };

            const { data } = await axios.post('http://localhost:4200/api/admin/shedule/add-shedule', formData)

            if (data) {

                console.log("Schedule added successfully");

                console.log(data.message);
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-white">
            <form onSubmit={onSubmitHandler} className="p-6 bg-gray-800 text-white rounded-lg max-w-md w-full shadow-lg">
                <div className="mb-4">
                    <label className="block text-sm font-medium">Employee Name:</label>
                    <input 
                        type="text" 
                        onChange={(e) => setemployeeName(e.target.value)} 
                        value={employeeName} 
                        required 
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
        
                <div className="mb-4">
                    <label className="block text-sm font-medium">Date:</label>
                    <input 
                        type="date" 
                        onChange={(e) => setdate(e.target.value)} 
                        value={date} 
                        required 
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
        
                <div className="mb-4">
                    <label className="block text-sm font-medium">Time:</label>
                    <input 
                        type="time" 
                        onChange={(e) => settime(e.target.value)} 
                        value={time} 
                        required 
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
        
                <div className="mb-4">
                    <label className="block text-sm font-medium">Task Type:</label>
                    <input 
                        type="text" 
                        onChange={(e) => settaskType(e.target.value)} 
                        value={taskType} 
                        required 
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
        
                <div className="mb-4">
                    <label className="block text-sm font-medium">Task Details:</label>
                    <textarea 
                        onChange={(e) => settaskDetails(e.target.value)} 
                        value={taskDetails} 
                        maxLength="500" 
                        required 
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>
        
                <div className="mb-4">
                    <label className="block text-sm font-medium">Task Status:</label>
                    <select 
                        onChange={(e) => settaskStatus(e.target.value)} 
                        value={taskStatus} 
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="assigned">Assigned</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
        
                <button 
                    type="submit" 
                    className="w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddSchedule;
