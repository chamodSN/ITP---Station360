import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import { FaArrowLeft, FaCheck, FaClock, FaUser, FaCar, FaTools, FaPlus, FaTrash } from 'react-icons/fa';
import { useEmployeeAuthStore } from '../store/authStore';

const API_URL = 'http://localhost:4200';

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([{ description: '' }]);
  const { employee } = useEmployeeAuthStore();

  useEffect(() => {
    if (!employee) {
      navigate('/login');
      return;
    }
    fetchTaskDetails();
  }, [taskId, navigate, employee]);

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/emp/shedule/bookings/my-tasks`);

      if (!response.data.success) {
        toast.error(response.data.message || 'Failed to fetch task details');
        navigate('/my-tasks');
        return;
      }

      const tasks = response.data.bookings || [];
      const currentTask = tasks.find(t => t._id === taskId);
      
      if (currentTask) {
        setTask(currentTask);
      } else {
        toast.error('Task not found');
        navigate('/my-tasks');
      }
    } catch (error) {
      console.error('Error fetching task details:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to fetch task details');
      navigate('/my-tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTaskField = () => {
    setTasks([...tasks, { description: '' }]);
  };

  const handleRemoveTaskField = (index) => {
    if (tasks.length > 1) {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
    }
  };

  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index].description = value;
    setTasks(newTasks);
  };

  const handleAddTasks = async (e) => {
    e.preventDefault();
    
    // Validate that all tasks have descriptions
    if (tasks.some(t => !t.description.trim())) {
      toast.error('Please fill in all task descriptions');
      return;
    }

    try {
      // Add each task sequentially
      for (const taskItem of tasks) {
        await axios.post(
          `${API_URL}/api/emp/shedule/bookings/${taskId}/tasks`,
          { task: taskItem.description }
        );
      }

      setTasks([{ description: '' }]); // Reset to one empty field
      toast.success('Tasks added successfully');
      fetchTaskDetails(); // Refresh task details
    } catch (error) {
      console.error('Error adding tasks:', error);
      toast.error('Failed to add tasks');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/my-tasks')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Tasks
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Task Details</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser className="text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{task.userId?.name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaCar className="text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">{task.vehicleNumPlate || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaTools className="text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">{task.serviceId?.serviceName || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <FaClock className="text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {new Date(task.date).toLocaleDateString()} at {task.timeSlot}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <FaCheck className="text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{task.status || 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks Performed</h2>
          
          <form onSubmit={handleAddTasks} className="mb-6">
            <div className="space-y-4">
              {tasks.map((taskItem, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={taskItem.description}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    placeholder="Enter task description..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTaskField(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleAddTaskField}
                  className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800"
                >
                  <FaPlus className="mr-2" /> Add Another Task
                </button>
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Tasks
                </button>
              </div>
            </div>
          </form>

          {task.tasksPerformed && task.tasksPerformed.length > 0 ? (
            <div className="space-y-4">
              {task.tasksPerformed.map((item, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-gray-900">{item.task}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No tasks performed yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;