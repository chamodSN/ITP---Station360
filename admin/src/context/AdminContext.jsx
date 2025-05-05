import { useState, createContext } from 'react';
import axios from 'axios';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);


    const getAllUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:4200/api/user/user-profiles', {
                withCredentials: true,
            });
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        users,
        loading,
        getAllUsers
    };
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );

}

export default AdminContextProvider;