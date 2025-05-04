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

        // Get search query from the URL
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <div
                        key={user._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/user/${user._id}`)}
                    >
                        <img
                            src={user.image}
                            alt={user.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
                            <p className="text-primary font-semibold">Email : {user.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;
