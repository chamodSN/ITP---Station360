import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'

const Shedule = () => {

    const { id } = useParams();
    const [shedule, setShedule] = useState(null);
    const [isEdit, setIsEdit] = useState(false);


    const fetchShedule = async () => {
        try {
            const { data } = await axios.get(`http://localhost:4200/api/admin/shedule/displayShedule/${id}`);
            if (data.success) {
                setShedule(data.Shedule);
            }

        } catch (error) {
            console.error("Error fetching shedule details", error);
        }
    };


    const deleteShedule = async () => {
        if (window.confirm("Are you sure you want to delete this shedule?")) {
            try {
                await axios.delete(`http://localhost:4200/api/admin/shedule/deleteShedule/${id}`);
            } catch (error) {
                console.error("Error deleting shedule:", error);
            }
        }
    };

    const updateShedule = async () => {
        try {
            const updatedShedule = {
                employeeName: shedule.employeeName,
                date: shedule.date,
                time: shedule.time,
                taskType: shedule.taskType,
                taskDetails: shedule.taskDetails,
                taskStatus: shedule.taskStatus,
            };

            const { data } = await axios.put(`http://localhost:4200/api/admin/shedule/updateShedule/${id}`, updatedShedule);
            console.log("Response data:", data);
            if (data.success) {
                await fetchShedule();

                setIsEdit(false);
            } else {
                console.error(data.message);
            }

        } catch (error) {
            console.error("Error updating shedule:", error);
        }
    };


    useEffect(() => {
        fetchShedule();
    }, [id]);


    return shedule && (
            <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-300 mt-10 space-y-6">
                <div className="mb-6 text-center">
                    {!isEdit ? (
                        <h1 className="text-2xl font-bold text-gray-900">{shedule.employeeName}</h1>
                    ) : (
                        <input
                            type="text"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={shedule.employeeName}
                            onChange={(e) => setShedule(prev => ({ ...prev, employeeName: e.target.value }))}
                        />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-700 font-semibold">Date:</p>
                        {!isEdit ? (
                            <p className="text-gray-800">{shedule.date}</p>
                        ) : (
                            <input
                                type="date"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={shedule.date ? new Date(shedule.date).toISOString().split('T')[0] : ''}
                                onChange={(e) => setShedule(prev => ({ ...prev, date: e.target.value }))}
                            />
                        )}
                    </div>
                    
                    <div>
                        <p className="text-gray-700 font-semibold">Time:</p>
                        {!isEdit ? (
                            <p className="text-gray-800">{shedule.time}</p>
                        ) : (
                            <input
                                type="time"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={shedule.time}
                                onChange={(e) => setShedule(prev => ({ ...prev, time: e.target.value }))}
                            />
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-gray-700 font-semibold">Task Type:</p>
                    {!isEdit ? (
                        <p className="text-gray-800">{shedule.taskType}</p>
                    ) : (
                        <input
                            type="text"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={shedule.taskType}
                            onChange={(e) => setShedule(prev => ({ ...prev, taskType: e.target.value }))}
                        />
                    )}
                </div>

                <div>
                    <p className="text-gray-700 font-semibold">Task Details:</p>
                    {!isEdit ? (
                        <p className="text-gray-800">{shedule.taskDetails}</p>
                    ) : (
                        <textarea
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            value={shedule.taskDetails}
                            onChange={(e) => setShedule(prev => ({ ...prev, taskDetails: e.target.value }))}
                        ></textarea>
                    )}
                </div>

                <div>
                    <p className="text-gray-700 font-semibold">Task Status:</p>
                    {!isEdit ? (
                        <p className="text-gray-800">{shedule.taskStatus}</p>
                    ) : (
                        <select
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={shedule.taskStatus}
                            onChange={(e) => setShedule(prev => ({ ...prev, taskStatus: e.target.value }))}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    )}
                </div>

                <div className="flex justify-center space-x-4 mt-6">
                    {isEdit ? (
                        <button onClick={updateShedule} className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">Save</button>
                    ) : (
                        <button onClick={() => setIsEdit(!isEdit)} className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-gray-600">Edit</button>
                    )}
                    <button onClick={deleteShedule} className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">Delete</button>
                </div>
            </div>
        )
    
}

export default Shedule;