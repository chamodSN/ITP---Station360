import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [services, setServices] = useState(null);

    const getAllServices = async () => {
        try {
            const { data } = await axios.get('http://localhost:4200/api/admin/service/');
            console.log("API Response:", data);

            if (data.success) {
                setServices(data.allServices);
            } else {
                console.error("Failed to fetch services", data.message);
            }
        } catch (error) {
            console.error("Error fetching services", error);

        }
    };

    useEffect(() => {
        getAllServices();
    }, []);

    const value = { services };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
