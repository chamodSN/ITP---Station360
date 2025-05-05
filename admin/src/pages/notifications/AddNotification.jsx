import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddNotification = () => {
  const [Title, setTitle] = useState("");
  const [Body, setBody] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmitHandaler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = { Title, Body, targetAudience, priority };

      const { data } = await axios.post(
        "http://localhost:4200/api/admin/notification/add-notifications",
        formData
      );

      if (data.success) {
        toast.success("Notification added successfully");
        setTitle("");
        setBody("");
        setTargetAudience("all");
        setPriority("medium");
      } else {
        toast.error(data.message || "Failed to add notification");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandaler}
      className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add Notification</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Title</label>
        <input
          type="text"
          placeholder="Enter notification title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={Title}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Body</label>
        <textarea
          placeholder="Enter notification message"
          required
          maxLength="500"
          onChange={(e) => setBody(e.target.value)}
          value={Body}
          rows="4"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Target Audience</label>
        <select
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Users</option>
          <option value="employees">Employees Only</option>
          <option value="users">Customers Only</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Priority</label>
        <div className="grid grid-cols-3 gap-2">
          {['high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                getPriorityColor(p)
              } ${
                priority === p
                  ? 'ring-2 ring-offset-2 ring-blue-500'
                  : 'hover:opacity-80'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-blue-500 text-white font-semibold py-2 rounded-lg mt-4 transition-all ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
      >
        {isSubmitting ? 'Adding...' : 'Add Notification'}
      </button>
    </form>
  );
};

export default AddNotification;
