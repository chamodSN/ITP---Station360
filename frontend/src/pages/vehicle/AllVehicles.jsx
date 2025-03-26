import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const navigate = useNavigate();

    const getAllVehicles = async () => {
        try {
            const { data } = await axios.get('http://localhost:4200/api/user/all-vehicles');

            console.log(data);

            if (data.success) {
                setVehicles(data.allVehicles);
            } else {
                alert('Failed to get vehicles');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllVehicles();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">All Vehicles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.map((item) => (
                    <div 
                        key={item._id} 
                        onClick={() => navigate(`/vehicle/${item._id}`)}
                        className="border border-gray-300 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition duration-300"
                    >
                        <p className="text-lg font-semibold">{item.brandName}</p>
                        <p className="text-gray-600">{item.modelName}</p>
                        <p className="text-gray-500">Plate: {item.plateNumber}</p>
                        {item.Image && (
                            <img 
                                src={item.Image} 
                                alt={item.brandName} 
                                className="mt-2 w-full h-40 object-cover rounded-lg"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllVehicles;
