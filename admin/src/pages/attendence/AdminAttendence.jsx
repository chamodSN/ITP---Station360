import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.NODE_ENV === "development" 
    ? "http://localhost:4200" 
    : "";

const AdminAttendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch employees and their attendance records
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch employees
                const response = await axios.get(`${API_URL}/api/admin/employee/all-employees`);
    
                // Fetch attendance records
                const attendanceResponse = await axios.get(`${API_URL}/api/attendence/all`);
    
                if (!response.data || !response.data.success || !Array.isArray(response.data.employees)) {
                    console.error("Unexpected employee API response format", response.data);
                    return;
                }

                if (!attendanceResponse.data || !Array.isArray(attendanceResponse.data.records)) {
                    console.error("Unexpected attendance API response format", attendanceResponse.data);
                    return;
                }
    
                setEmployees(response.data.employees);
                setAttendances(attendanceResponse.data.records);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error(error.response?.data?.message || "Failed to fetch attendance data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Attendance Dashboard</h2>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th className="p-3 text-left">Employee Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Check-in Time</th>
                                <th className="p-3 text-left">Check-out Time</th>
                                <th className="p-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => {
                                // Find today's attendance for this employee
                                const today = new Date().toISOString().split('T')[0];
                                const todayAttendance = attendances.find(
                                    (att) => att.employeeId._id === emp._id && att.date === today
                                );

                                // Determine status
                                let status = "Absent";
                                let statusColor = "bg-red-100 text-red-800";
                                
                                if (todayAttendance) {
                                    if (todayAttendance.checkInTime && todayAttendance.checkOutTime) {
                                        status = "Completed";
                                        statusColor = "bg-green-100 text-green-800";
                                    } else if (todayAttendance.checkInTime) {
                                        status = "On Duty";
                                        statusColor = "bg-yellow-100 text-yellow-800";
                                    }
                                }

                                return (
                                    <tr key={emp._id} className="border-b hover:bg-gray-100">
                                        <td className="p-3 text-gray-700">{emp.name}</td>
                                        <td className="p-3 text-gray-700">{emp.email}</td>
                                        <td className="p-3 text-gray-700">
                                            {todayAttendance?.checkInTime 
                                                ? new Date(`2000-01-01T${todayAttendance.checkInTime}`).toLocaleTimeString() 
                                                : "Not Checked In"}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {todayAttendance?.checkOutTime 
                                                ? new Date(`2000-01-01T${todayAttendance.checkOutTime}`).toLocaleTimeString() 
                                                : "Not Checked Out"}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAttendance;