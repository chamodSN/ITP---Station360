import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserNotifications = () => {
  const { audience } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityBorderColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#eab308';
      case 'low':
        return '#22c55e';
      default:
        return '#9ca3af';
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:4200/api/admin/notification/audience/${audience}`
      );

      if (data.success) {
        setNotifications(data.notifications);
        console.log("Notification:", data.notifications);
      } else {
        toast.error(data.message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [audience]);

  const formatDateTime = (isoString) => {
    const dateObj = new Date(isoString);
    const date = dateObj.toLocaleDateString('en-GB'); 
    const time = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 tabIndex="0" className="text-2xl font-bold text-gray-800">
          Employee Notifications
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No notifications available.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => {
            const { date, time } = formatDateTime(notification.updatedAt);
            return (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all mb-4 border-l-4"
                style={{
                  borderLeftColor: getPriorityBorderColor(notification.priority)
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">{notification.Title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(notification.priority)}`}>
                    {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{notification.body}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="capitalize">For: {notification.targetAudience}</span>
                  <div className="flex gap-4">
                    <span>Date: {date}</span>
                    <span>Time: {time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
