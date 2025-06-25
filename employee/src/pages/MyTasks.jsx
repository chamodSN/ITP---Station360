import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useEmployeeAuthStore } from '../store/authStore';

const API_URL = 'http://localhost:4200';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { employee, isAuthenticated, checkAuth } = useEmployeeAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (!employee && !isAuthenticated) {
          await checkAuth();
        }
      } catch (err) {
        console.error('Authentication error:', err);
        navigate('/login');
      }
    };
    
    verifyAuth();
  }, [employee, isAuthenticated, checkAuth, navigate]);

  useEffect(() => {
    if (employee && isAuthenticated) {
      fetchTasks();
    }
  }, [employee, isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/emp/shedule/bookings/my-tasks`);
      console.log('Tasks response:', response.data);
      
      if (response.data.success) {
        // Filter for tasks that are not completed or billed
        const assignedTasks = response.data.bookings.filter(task => 
          task.status && !['done', 'billed'].includes(task.status.toLowerCase())
        );
        console.log('Filtered tasks:', assignedTasks);
        setTasks(assignedTasks);
      } else {
        console.error('Failed to fetch tasks:', response.data.message);
        toast.error(response.data.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <button
            onClick={() => navigate('/done-tasks')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            View Completed Tasks
          </button>
        </div>
        
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending tasks assigned yet</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div 
                key={task._id} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">{task.serviceName}</h2>
                  <p className="text-gray-600">Customer: {task.customerName}</p>
                  <p className="text-gray-600">Date: {formatDate(task.date)}</p>
                  <p className="text-gray-600">Time: {task.time}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    task.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                  
                  <button
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
