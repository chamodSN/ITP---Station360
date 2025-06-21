import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const AllServices = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const getAllServices = async () => {
        try {
            const searchParams = new URLSearchParams(location.search);
            const searchQuery = searchParams.get('search');
            const url = searchQuery
                ? `http://localhost:4200/api/admin/service?search=${encodeURIComponent(searchQuery)}`
                : 'http://localhost:4200/api/admin/service';

            const { data } = await axios.get(url);

            if (data.success) {
                setServices(data.allServices)
            } else {
                toast.warn("Failed to load services.");
            }

        } catch (error) {
            toast.error("Error fetching services. Please try again!");
        }
    }

    useEffect(() => {
        getAllServices();
    }, [location.search]);

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">
                {searchQuery
                    ? `Search results for "${searchQuery}"`
                    : 'All Services'}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((item) => (
                    <div
                        key={item._id}
                        onClick={() => navigate(`/service/${item._id}`)}
                        className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition flex gap-4 items-center"
                    >
                        <img
                            src={item.displayImage}
                            alt={item.serviceName}
                            className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex flex-col justify-between">
                            <h2 className="text-xl font-semibold">{item.serviceName}</h2>
                            <p className="text-gray-600">Category: {item.category}</p>
                            <p className="text-gray-800 font-bold">Price: {item.price}</p>
                            <p className={item.available ? "text-green-600" : "text-red-600"}>
                                {item.available ? "Available" : "Not Available"}
                            </p>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}

export default AllServices;
