import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const User = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const { data } = await axios.get(`http://localhost:4200/api/user/get-profile-by-admin/${id}`, {
                withCredentials: true,
            });
            if (data.success) {
                setUser(data.user);
            }
        } catch (error) {
            console.error("Error fetching user details:", error.message);
            toast.error("Failed to fetch user details!");
        }
    };

    const deleteUser = async () => {
        try {
            const { data } = await axios.delete(`http://localhost:4200/api/user/delete/${id}`, {
                withCredentials: true,
            });
            if (data.success) {
                toast.success("User deleted successfully!");
                navigate('/users');
            }
        } catch (error) {
            console.error("Error deleting user:", error.message);
            toast.error("Failed to delete user!");
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    return user && (
        <div className="flex justify-center items-center min-h-screen bg-[#e9ecef]">
            <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Left column */}
                <div className="flex flex-col items-center justify-center bg-[#5F6FFF] w-1/2 py-12 px-8">
                    <span className="text-gray-300 text-sm mb-4">#{user._id?.slice(-3)}</span>
                    <img
                        className="w-48 h-56 object-cover rounded shadow mb-8"
                        src={user.image}
                        alt={user.name}
                    />
                    <div className="text-3xl font-serif text-gray-800 mb-2">{user.name}</div>
                    <div className="text-gray-600">{user.location || "Los Angeles, CA"}</div>
                </div>
                {/* Right column */}
                <div className="flex-1 flex flex-col justify-center px-10 py-12 bg-white">
                    <h2 className="text-4xl font-serif text-[#5F6FFF] mb-8">User Profile</h2>
                    <div className="bg-[#f7f6ef] rounded-lg p-8 mb-8">
                        <div className="grid grid-cols-3 gap-4 items-center mb-4">
                            <div className="text-[#5F6FFF] font-serif text-lg">Phone</div>
                            <div className="col-span-2 text-gray-800 text-lg">{user.phone || "N/A"}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-center mb-4">
                            <div className="text-[#5F6FFF] font-serif text-lg">Email</div>
                            <div className="col-span-2 text-gray-800 text-lg">{user.email}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <div className="text-[#5F6FFF] font-serif text-lg">Birthday</div>
                            <div className="col-span-2 text-gray-800 text-lg">{user.birthday || "August 7, 1996"}</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end">
                        <button
                            onClick={deleteUser}
                            className="text-[#5F6FFF] font-serif text-lg flex items-center gap-2 hover:underline"
                        >
                            Delete
                            
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User; 