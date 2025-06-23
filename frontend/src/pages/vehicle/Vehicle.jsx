import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Vehicle = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4200/api/user/vehicle/${id}`);
                if (data.success) {
                    setVehicle(data.vehicle);
                }
            } catch (error) {
                console.error("Error fetching vehicle:", error);
            }
        };
        fetchVehicle();
    }, [id]);

    const updateVehicle = async () => {
        try {
            console.log(vehicle);
            const formData = new FormData();

            formData.append("Image", vehicle.Image);
            formData.append("brandName", vehicle.brandName);
            formData.append("modelName", vehicle.modelName);
            formData.append("vinNumber", vehicle.vinNumber);
            formData.append("plateNumber", vehicle.plateNumber);
            formData.append("fuelType", vehicle.fuelType);

            if (image) {
                formData.append("Image", image);
            }

            console.log(formData);

            const { data } = await axios.put(`http://localhost:4200/api/user/update-vehicle/${id}`, formData);
            console.log('data', data);

            if (data.success) {
                toast.success("Vehicle Updated Successfully");
                setIsEdit(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error updating image:", error);
        }
    };

    const deleteVehicle = async () => {
        try {
            const { data } = await axios.delete(`http://localhost:4200/api/user/vehicle/${id}`);
            if (data.success) {
                toast.success("Vehicle Deleted Successfully");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error updating image:", error);
        }
    };

    return vehicle && (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Vehicle Details</h1>
            <p className="text-lg font-semibold">{vehicle.brandName}</p>
            <p className="text-gray-600">{vehicle.modelName}</p>
            <p className="text-gray-500">VIN: {vehicle.vinNumber}</p>
            <p className="text-gray-500">Plate: {vehicle.plateNumber}</p>
            <p className="text-gray-500">Fuel: {vehicle.fuelType}</p>

            {!isEdit ? (
                <img src={vehicle.Image} alt={vehicle.brandName} className="mt-4 w-full h-40 object-cover rounded-lg" />
            ) : (
                <input 
                    type="file" 
                    onChange={(e) => setImage(e.target.files[0])} 
                    className="mt-2 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}

            <div className="mt-4 flex space-x-4">
                {isEdit ? (
                    <button 
                        onClick={() => updateVehicle()} 
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
                    >
                        Save
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsEdit(!isEdit)} 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Edit
                    </button>
                )}
                <button 
                    onClick={() => deleteVehicle()} 
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default Vehicle;
