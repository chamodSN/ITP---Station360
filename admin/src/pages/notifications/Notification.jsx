import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Notification() {
  const { id } = useParams();
  const [Notification, setNotification] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const Navigate = useNavigate();

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

  const fetchNotification = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4200/api/admin/Notification/${id}`
      );
      if (data.success) {
        setNotification(data.notification);
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Error fetching notification");
    }
  };

  const updateNotification = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.put(
        `http://localhost:4200/api/admin/notification/${id}`,
        Notification
      );
      if (data.success) {
        await fetchNotification();
        setIsEdit(false);
        toast.success("Notification updated successfully");
      } else {
        toast.error(data.message || "Failed to update notification");
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Error updating notification");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotifications = async () => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        const { data } = await axios.delete(`http://localhost:4200/api/admin/notification/${id}`);
        if (data.success) {
          toast.success("Notification deleted successfully");
          Navigate('/all-notifications')
        } else {
          toast.error(data.message || "Failed to delete notification");
        }
      } catch (error) {
        console.error("Error", error);
        toast.error("Error deleting notification");
      }
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [id]);

  const formatDateTime = (isoString) => {
    const dateObj = new Date(isoString);
    const date = dateObj.toLocaleDateString('en-GB'); 
    const time = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const formattedDateTime = Notification ? formatDateTime(Notification.updatedAt) : { date: '', time: '' };

  return (
    Notification && (
      <div
        className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md border-l-4"
        style={{
          borderLeftColor: getPriorityBorderColor(Notification.priority)
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Notification</h2>
          <div className="flex items-center">
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          {isEdit ? (
            <input
              type="text"
              value={Notification.Title}
              onChange={(e) =>
                setNotification((prev) => ({ ...prev, Title: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{Notification.Title}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Body</label>
          {isEdit ? (
            <textarea
              value={Notification.Body}
              onChange={(e) =>
                setNotification((prev) => ({ ...prev, Body: e.target.value }))
              }
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{Notification.Body}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Target Audience</label>
          {isEdit ? (
            <select
              value={Notification.targetAudience}
              onChange={(e) =>
                setNotification((prev) => ({ ...prev, targetAudience: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="employees">Employees Only</option>
              <option value="users">Customers Only</option>
            </select>
          ) : (
            <p className="text-gray-900 capitalize">{Notification.targetAudience}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Priority</label>
          {isEdit ? (
            <div className="grid grid-cols-3 gap-2">
              {['high', 'medium', 'low'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    setNotification((prev) => ({ ...prev, priority: p }))
                  }
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${getPriorityColor(p)
                    } ${Notification.priority === p
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : 'hover:opacity-80'
                    }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          ) : (
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(Notification.priority)}`}>
              {Notification.priority.charAt(0).toUpperCase() + Notification.priority.slice(1)}
            </span>
          )}
        </div>

        <div className="mb-4">
          <p className="text-gray-500">Date: {formattedDateTime.date}</p>
          <p className="text-gray-500">Time: {formattedDateTime.time}</p>
        </div>

        <div className="space-y-2">
          {isEdit ? (
            <button
              onClick={updateNotification}
              disabled={isLoading}
              className={`w-full bg-green-500 text-white font-semibold py-2 rounded-lg transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                }`}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              Edit Notification
            </button>
          )}

          <button
            onClick={deleteNotifications}
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Delete Notification
          </button>
        </div>
      </div>
    )
  );
}

export default Notification;
