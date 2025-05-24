import { useEffect, useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:4200' 
  : '';

const UserList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { users, loading, getAllUsers } = useContext(AdminContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        getAllUsers();
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('search');
        setSearchQuery(query || '');
    }, [location.search]);

    const handleGeneratePDF = async () => {
        if (!startDate || !endDate) {
            toast.error('Please select both start and end dates');
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/api/user/report`,
                {
                    params: { startDate, endDate },
                    responseType: 'blob',
                    withCredentials: true
                }
            );

            // Check if the response is actually a PDF
            if (response.data.type === 'application/json') {
                // If it's JSON, it's an error response
                const reader = new FileReader();
                reader.onload = () => {
                    const errorData = JSON.parse(reader.result);
                    toast.error(errorData.message || 'Failed to generate user report');
                };
                reader.readAsText(response.data);
                return;
            }

            // Create blob and download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `user-report-${startDate}-to-${endDate}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('User report downloaded successfully');
        } catch (error) {
            console.error('Error generating PDF:', error);
            if (error.response?.data) {
                // Handle blob error response
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorData = JSON.parse(reader.result);
                        toast.error(errorData.message || 'Failed to generate user report');
                    } catch (e) {
                        toast.error('Failed to generate user report');
                    }
                };
                reader.readAsText(error.response.data);
            } else {
                toast.error('Failed to generate user report');
            }
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                {searchQuery ? `Search results for "${searchQuery}"` : 'Users List'}
            </h1>

            {/* Date Range and PDF Button */}
            <div className="flex flex-wrap gap-4 items-end mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border p-2 rounded-md focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border p-2 rounded-md focus:ring-2 focus:ring-primary"
                    />
                </div>
                <button
                    onClick={handleGeneratePDF}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    Generate Report
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredUsers.map((user) => (
                    <div
                        key={user._id}
                        className="bg-white rounded-xl shadow-md flex items-center gap-6 cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/user/${user._id}`)}
                    >
                        <img
                            src={user.image}
                            alt={user.name}
                            className="w-32 h-32 object-cover rounded-l-xl"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
                            <p className="text-primary font-semibold">Email: {user.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;
