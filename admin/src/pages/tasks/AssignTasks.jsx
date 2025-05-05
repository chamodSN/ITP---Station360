import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:4200' 
  : '';

const AssignTasks = () => {
  const [unassignedBookings, setUnassignedBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnassignedBookings();
    fetchEmployees();
  }, []);

  const fetchUnassignedBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/shedule/bookings/all`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Filter only unassigned bookings (where technicianId is null)
        const unassigned = response.data.bookings.filter(booking => !booking.technicianId);
        setUnassignedBookings(unassigned);
      }
    } catch (error) {
      console.error('Error fetching unassigned bookings:', error);
      toast.error('Failed to fetch unassigned bookings');
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
    if (!selectedBooking || !selectedEmployee) {
      toast.error('Please select both a booking and an employee');
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/admin/shedule/booking/${selectedBooking._id}/assign`,
        { employeeId: selectedEmployee },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Employee assigned successfully');
        setSelectedBooking(null);
        setSelectedEmployee('');
        fetchUnassignedBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error assigning employee:', error);
      toast.error('Failed to assign employee');
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
        <h1 className="text-2xl font-bold">Assign Tasks</h1>
        <button
          onClick={() => navigate('/tasks/assigned')}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          View Assigned Tasks
        </button>
      </div>

      {unassignedBookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No unassigned bookings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unassigned Bookings List */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Unassigned Bookings</h2>
            <div className="space-y-4">
              {unassignedBookings.map((booking) => (
                <div
                  key={booking._id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedBooking?._id === booking._id
                      ? 'border-primary bg-primary-50'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {booking.userId ? booking.userId.name : 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {booking.serviceId ? booking.serviceId.serviceName : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{formatDate(booking.date)}</p>
                      <p className="text-sm text-gray-600">{formatTime(booking.timeSlot)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Panel */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Assign Employee</h2>
            {selectedBooking ? (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium">Booking Details</h3>
                  <p className="text-sm text-gray-600">
                    Customer: {selectedBooking.userId ? selectedBooking.userId.name : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Service: {selectedBooking.serviceId ? selectedBooking.serviceId.serviceName : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(selectedBooking.date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Time: {formatTime(selectedBooking.timeSlot)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Employee
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select an employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAssignEmployee}
                  className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark"
                >
                  Assign Employee
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a booking to assign an employee.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTasks; 