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
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:4200/api/user/delete-profile-by-admin/${id}`, {
                    withCredentials: true,
                });
                toast.success("User deleted successfully!");
                navigate('/users');
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user!");
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    return user && (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
                <h1 className="text-2xl font-semibold text-center">{user.name}</h1>

                <p className="font-semibold mt-4">Email:</p>
                <p>{user.email}</p>

                <p className="font-semibold mt-4">Phone:</p>
                <p>{user.phone}</p>

                <p className="font-semibold mt-4">Image:</p>
                <img className="w-36 rounded" src={user.image} alt="User" />

                <div className="mt-6 flex justify-center">
                    <button onClick={deleteUser} className="bg-red-500 text-white px-4 py-2 rounded">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default User;
