import { useEffect, useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate, useLocation } from 'react-router-dom';

const UserList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { users, loading, getAllUsers } = useContext(AdminContext);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getAllUsers();
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('search');
        setSearchQuery(query || '');
    }, [location.search]);

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
            <div className="space-y-6">
                {filteredUsers.map((user) => (
                    <div
                        key={user._id}
                        className="flex items-center bg-white border border-blue-100 rounded-lg shadow-sm px-4 py-4 hover:shadow-md transition"
                    >
                        <img
                            src={user.image}
                            alt={user.name}
                            className="w-24 h-24 object-cover rounded-md border mr-6"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-lg mb-1">Name: {user.name}</div>
                            <div className="text-gray-600 mb-1">Email: {user.email}</div>
                            {/* Add more user details here if needed */}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <button
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
                                onClick={() => navigate(`/user/${user._id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;