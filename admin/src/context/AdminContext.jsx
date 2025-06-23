import { useState, createContext } from 'react';
import axios from 'axios';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);

    const getAllServices = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:4200/api/admin/service/');
            if (data.success) {
                setServices(data.allServices);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAllEmployees = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:4200/api/admin/employee/all-employees', {
                withCredentials: true,
            });
            if (data.success) {
                setEmployees(data.employees);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const getAllBookings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:4200/api/admin/bookings', {
                withCredentials: true,
                params: {
                    populate: 'serviceId'
                }
            });
            console.log('Bookings API Response:', data);
            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        getAllEmployees,
        employees,
        users,
        bookings,
        loading,
        getAllUsers,
        getAllBookings,
        services,
        getAllServices,
    };
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );

}

export default AdminContextProvider;