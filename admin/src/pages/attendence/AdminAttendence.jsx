import { useEffect, useState } from "react";
import axios from "axios";

const AdminAttendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendances, setAttendances] = useState([]);

    // Fetch employees who haven't applied for leave
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:4200/api/admin/employee");
                console.log("Employee API Response:", response.data);
    
                const leaveResponse = await axios.get("http://localhost:4200/api/emp/leave/all");
                console.log("Leave API Response:", leaveResponse.data);
    
                // Ensure response.data contains expected properties
                if (!response.data || !response.data.employees || !Array.isArray(response.data.employees)) {
                    console.error("Unexpected employee API response format", response.data);
                    return;
                }
    
                if (!leaveResponse.data || !leaveResponse.data.leaves || !Array.isArray(leaveResponse.data.leaves)) {
                    console.error("Unexpected leave API response format", leaveResponse.data);
                    return;
                }
    
                const employeesData = response.data.employees;
                const leaveData = leaveResponse.data.leaves;
    
                // Get employee IDs who are on approved leave
                const leaveEmployeeIds = leaveData
                    .filter(leave => leave.status === "Approved")
                    .map(leave => leave.employeeId);
    
                // Filter out employees who are on leave
                const workingEmployees = employeesData.filter(emp => !leaveEmployeeIds.includes(emp._id));
                setEmployees(workingEmployees);
            } catch (error) {
                console.error("Error fetching employees:", error);
                if (error.response) {
                    console.error("Response Data:", error.response.data);
                }
            }
        };
    
        fetchEmployees();
    }, []);
    

    // Mark Attendance (Check-in or Check-out)
    const markAttendance = async (employeeId) => {
        try {
            console.log("Marking attendance for employee ID:", employeeId);
    
            const existingAttendance = attendances.find(
                att => att.employeeId === employeeId && !att.checkOutTime
            );
    
            let response;
            if (!existingAttendance) {
                // Mark Check-in
                response = await axios.post("http://localhost:4200/api/admin/attendence/mark-attendance", {
                    employeeId: employeeId
                }, {
                    headers: { "Content-Type": "application/json" }
                });
            } else {
                // Mark Check-out
                response = await axios.put(
                    `http://localhost:4200/api/admin/attendence/update-attendance/${existingAttendance._id}`,
                    { employeeId: employeeId },
                    { headers: { "Content-Type": "application/json" } }
                );
            }
    
            console.log("Attendance marked successfully:", response.data);
    
            // Refresh data without full reload
            setAttendances(prev => prev.map(att =>
                att.employeeId === employeeId
                    ? { ...att, checkOutTime: response.data.checkOutTime || new Date().toISOString() }
                    : att
            ));
        } catch (error) {
            console.error("Error marking attendance:", error);
    
            if (error.response) {
                console.error("Response Data:", error.response.data);
                console.error("Response Status:", error.response.status);
            }
        }
    };
    
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Attendance Dashboard</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-3 text-left">Employee Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Check-in Time</th>
                  <th className="p-3 text-left">Check-out Time</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const attendance = attendances.find(
                    (att) => att.employeeId === emp._id && !att.checkOutTime
                  );
                  return (
                    <tr key={emp._id} className="border-b hover:bg-gray-100">
                      <td className="p-3 text-gray-700">{emp.name}</td>
                      <td className="p-3 text-gray-700">{emp.email}</td>
                      <td className="p-3 text-gray-700">
                        {attendance?.checkInTime ? new Date(attendance.checkInTime).toLocaleString() : "Not Checked In"}
                       </td>
                       <td className="p-3 text-gray-700">
                        {attendance?.checkOutTime ? new Date(attendance.checkOutTime).toLocaleString() : "Not Checked Out"}
                       </td>
                        <td>
                        <button
                          onClick={() => markAttendance(emp._id)}
                          className={`px-4 py-2 text-white font-semibold rounded-md shadow-md transition duration-300 
                            ${attendance ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                        >
                          {attendance ? "Mark Check-Out" : "Mark Check-In"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    
};

export default AdminAttendance;