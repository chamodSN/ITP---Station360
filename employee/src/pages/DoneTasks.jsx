import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheck, FaClock, FaUser, FaCar, FaTools } from 'react-icons/fa';

const API_URL = 'http://localhost:4200';

const DoneTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/emp/shedule/bookings/my-tasks`);
      
      if (response.data.success) {
        // Filter only completed tasks
        const completedTasks = response.data.bookings.filter(task => task.status === 'done');
        setTasks(completedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Completed Tasks</h1>
        
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No completed tasks yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white rounded-lg shadow-md p-6">
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
                      <FaCheck className="text-green-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium text-green-500">{task.status}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {task.tasksPerformed && task.tasksPerformed.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">Tasks Performed</h3>
                    <div className="space-y-2">
                      {task.tasksPerformed.map((item, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-gray-900">{item.task}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoneTasks; 