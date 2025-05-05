import { createContext, useContext, useState } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [userVehicles, setUserVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [servicesLoading, setServicesLoading] = useState(false);

    const getAllServices = async () => {
        try {
            setServicesLoading(true);
            const { data } = await axios.get('http://localhost:4200/api/admin/service/');
            if (data.success) {
                setServices(data.allServices);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setServicesLoading(false);
        }
    };

    const fetchUserVehicles = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:4200/api/user/my-vehicles', {
                withCredentials: true
            });

            if (data.success) {
                setUserVehicles(data.vehicles);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppContext.Provider value={{
            services,
            servicesLoading,
            getAllServices,
            userVehicles,
            loading,
            fetchUserVehicles
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
