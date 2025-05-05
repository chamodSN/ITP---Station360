import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:4200' 
  : '';

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskDetails();
    fetchEmployees();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/shedule/bookings/all`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const foundTask = response.data.bookings.find(booking => booking._id === taskId);
        if (foundTask) {
          setTask(foundTask);
          if (foundTask.technicianId) {
            setSelectedEmployee(foundTask.technicianId._id);
          }
        } else {
          toast.error('Task not found');
          navigate('/admin/tasks/assigned');
        }
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast.error('Failed to fetch task details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/employee/employees`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/admin/shedule/booking/${taskId}/assign`,
        { employeeId: selectedEmployee },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Employee assigned successfully');
        fetchTaskDetails(); // Refresh the task details
      } else {
        toast.error(response.data.message || 'Failed to assign employee');
      }
    } catch (error) {
      console.error('Error assigning employee:', error);
      const errorMessage = error.response?.data?.message || 'Failed to assign employee';
      toast.error(errorMessage);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!window.confirm('Are you sure you want to delete this schedule? This action cannot be undone.')) {
      return;
    }

    try {
      // Find the schedule directly using the booking ID
      const scheduleResponse = await axios.get(
        `${API_URL}/api/admin/shedule/shedules`,
        { withCredentials: true }
      );

      if (scheduleResponse.data.success) {
        const schedule = scheduleResponse.data.AllShedules.find(
          s => s.bookingId && s.bookingId._id === taskId
        );

        if (!schedule) {
          toast.error('Schedule not found');
          return;
        }

        // Delete the schedule using its ID
        const deleteResponse = await axios.delete(
          `${API_URL}/api/admin/shedule/deleteShedule/${schedule._id}`,
          { withCredentials: true }
        );

        if (deleteResponse.data.success) {
          toast.success('Schedule deleted successfully');
          navigate('/tasks/assigned');
        } else {
          toast.error(deleteResponse.data.message || 'Failed to delete schedule');
        }
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Failed to delete schedule');
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

  if (!task) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Task not found.</p>
        <button
          onClick={() => navigate('/tasks/assigned')}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Back to Assigned Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Details</h1>
        <div className="flex gap-4">
          <button
            onClick={handleDeleteSchedule}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Schedule
          </button>
          <button
            onClick={() => navigate('/tasks/assigned')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Back to Assigned Tasks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Customer</h3>
              <p>{task.userId ? task.userId.name : 'N/A'}</p>
              <p className="text-sm text-gray-600">{task.userId ? task.userId.email : 'N/A'}</p>
              <p className="text-sm text-gray-600">{task.userId ? task.userId.phone : 'N/A'}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Service</h3>
              <p>{task.serviceId ? task.serviceId.serviceName : 'N/A'}</p>
              <p className="text-sm text-gray-600">Price: ${task.serviceId ? task.serviceId.price : 'N/A'}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Schedule</h3>
              <p>Date: {formatDate(task.date)}</p>
              <p>Start Time: {formatTime(task.timeSlot)}</p>
              <p>End Time: {formatTime(task.endTime)}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Vehicle</h3>
              <p>Plate Number: {task.vehicleId?.plateNumber}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Status</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {task.status || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Assignment Panel */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Assignment & Actions</h2>
          
          <div className="space-y-6">
            {/* Current Assignment */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Current Assignment</h3>
              {task.technicianId ? (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{task.technicianId.name}</p>
                  <p className="text-sm text-gray-600">{task.technicianId.email}</p>
                  <p className="text-sm text-gray-600">{task.technicianId.phone}</p>
                </div>
              ) : (
                <p className="text-gray-500">No employee assigned yet</p>
              )}
            </div>
            
            {/* Assign Employee */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Assign Employee</h3>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full p-2 border rounded-md mb-2"
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignEmployee}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark"
              >
                Assign Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails; 