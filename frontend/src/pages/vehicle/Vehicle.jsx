import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Vehicle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const validateInputs = () => {
        const alphanumericRegex = /^[a-zA-Z0-9\s-]+$/;

        if (!vehicle.plateNumber || !alphanumericRegex.test(vehicle.plateNumber)) {
            toast.error("Plate number should only contain letters, numbers, spaces, or hyphens.");
            return false;
        }

        if (image) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!allowedTypes.includes(image.type)) {
                toast.error("Only PNG and JPG images are allowed.");
                return false;
            }
        }

        return true;
    };

    const updateVehicle = async () => {
        if (!validateInputs()) return;

        try {
            const formData = new FormData();
            formData.append("plateNumber", vehicle.plateNumber);
            if (image) {
                formData.append("image", image);
            }

            const { data } = await axios.put(
                `http://localhost:4200/api/user/update-vehicle/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            if (data.success) {
                toast.success("Vehicle updated successfully!");
                setIsEdit(false);
                setImage(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error updating vehicle:", error);
            toast.error("Failed to update vehicle.");
        }
    };

    const deleteVehicle = async () => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                const { data } = await axios.delete(`http://localhost:4200/api/user/vehicle/${id}`, {
                    withCredentials: true
                });

                if (data.success) {
                    toast.success("Vehicle deleted successfully!");
                    navigate('/my-profile');
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("Error deleting vehicle:", error);
                toast.error("Failed to delete vehicle.");
            }
        }
    };

    return vehicle && (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="relative">
                        {!isEdit ? (
                            vehicle.Image ? (
                                <img
                                    src={vehicle.Image}
                                    alt="Vehicle"
                                    className="w-full h-64 object-cover"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                                    <img
                                        src={assets.upload_icon}
                                        alt="No Image"
                                        className="w-16 h-16 opacity-50"
                                    />
                                </div>
                            )
                        ) : (
                            <div className="relative">
                                <img
                                    src={image ? URL.createObjectURL(image) : vehicle.Image || assets.upload_icon}
                                    alt="Vehicle"
                                    className="w-full h-64 object-cover"
                                />
                                <label
                                    htmlFor="vehicle-image"
                                    className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90"
                                >
                                    <img src={assets.upload_icon} alt="Upload" className="w-5 h-5" />
                                    <input
                                        type="file"
                                        id="vehicle-image"
                                        accept="image/png, image/jpeg"
                                        hidden
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Plate Number</label>
                            {isEdit ? (
                                <input
                                    type="text"
                                    value={vehicle.plateNumber}
                                    onChange={(e) => setVehicle(prev => ({ ...prev, plateNumber: e.target.value }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            ) : (
                                <p className="mt-1 text-gray-800">{vehicle.plateNumber}</p>
                            )}
                        </div>


                        <div className="flex gap-4 mt-6">
                            {isEdit ? (
                                <button
                                    onClick={updateVehicle}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                                >
                                    Save Changes
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEdit(true)}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                                >
                                    Edit Vehicle
                                </button>
                            )}
                            <button
                                onClick={deleteVehicle}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                            >
                                Delete Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vehicle;
