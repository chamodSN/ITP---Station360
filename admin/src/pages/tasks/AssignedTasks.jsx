import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:4200' 
  : '';

const AssignedTasks = () => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const fetchAssignedTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/shedule/bookings/all`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Filter only assigned tasks (where technicianId is not null)
        const assigned = response.data.bookings.filter(booking => booking.technicianId);
        setAssignedTasks(assigned);
      }
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
      toast.error('Failed to fetch assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assigned Tasks</h1>
        <button
          onClick={() => navigate('/tasks/assign')}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Assign New Tasks
        </button>
      </div>

      {assignedTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No assigned tasks found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Service</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Start Time</th>
                <th className="py-3 px-4 text-left">End Time</th>
                <th className="py-3 px-4 text-left">Technician</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedTasks.map((task) => (
                <tr key={task._id} className="border-t border-gray-300 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {task.userId ? task.userId.name : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {task.serviceId ? task.serviceId.serviceName : 'N/A'}
                  </td>
                  <td className="py-3 px-4">{formatDate(task.date)}</td>
                  <td className="py-3 px-4">{formatTime(task.timeSlot)}</td>
                  <td className="py-3 px-4">{formatTime(task.endTime)}</td>
                  <td className="py-3 px-4">
                    {task.technicianId ? task.technicianId.name : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className="text-primary hover:text-primary-dark"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignedTasks; 