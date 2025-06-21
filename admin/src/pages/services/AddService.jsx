import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const AddService = () => {

    const navigate = useNavigate();

    const [serviceName, setServiceName] = useState('');
    const [category, setCategory] = useState('General Maintenance & Inspection');
    const [displayImage, setDisplayImage] = useState('');
    const [description, setDescription] = useState('');
    const [specifications, setSpecifications] = useState('');
    const [interval, setInterval] = useState(0);
    const [price, setPrice] = useState(0);
    const [available, setAvailable] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
    
        try {
            if (!displayImage) {
                return toast.error("Please select a display image");
            }
    
            // File type validation
            const allowedTypes = ['image/png', 'image/jpeg'];
            if (!allowedTypes.includes(displayImage.type)) {
                return toast.error("Only JPG and PNG image formats are allowed");
            }
    
            // Service name length
            if (serviceName.length < 3 || serviceName.length > 100) {
                return toast.error("Service name must be between 3 and 100 characters");
            }
    
            // Description length
            if (description.length < 10) {
                return toast.error("Description must be at least 10 characters long");
            }
    
            // Interval minimum check
            if (interval < 30) {
                return toast.error("Interval must be at least 30 minutes");
            }
    
            const formData = new FormData();
            formData.append('serviceName', serviceName);
            formData.append('category', category);
            formData.append('displayImage', displayImage);
            formData.append('description', description);
            formData.append('specificationsString', specifications);
            formData.append('interval', interval);
            formData.append('price', price);
            formData.append('available', available);
    
            const { data } = await axios.post('http://localhost:4200/api/admin/service/add-service', formData);
    
            if (data.success) {
                toast.success("Service added successfully");
                // Reset form
                setServiceName('');
                setCategory('General Maintenance & Inspection');
                setDisplayImage('');
                setDescription('');
                setSpecifications('');
                setInterval(0);
                setPrice(0);
                setAvailable(false);
                navigate("/service/all-services");
            } else {
                toast.error(data.message || "Failed to add service");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while submitting the form");
        }
    }
    

    return (
        <form onSubmit={onSubmitHandler} encType="multipart/form-data" className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Create a New Service</h1>

            <div className="mb-4">
                <p className="mb-1">Service Name</p>
                <input
                    type="text"
                    onChange={(e) => setServiceName(e.target.value)}
                    value={serviceName}
                    maxLength="100"
                    placeholder="Enter service name"
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <p className="mb-1">Category</p>
                <select
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="General Maintenance & Inspection">General Maintenance & Inspection</option>
                    <option value="Oil Change & Lubrication">Oil Change & Lubrication</option>
                    <option value="Brake Repair & Replacement">Brake Repair & Replacement</option>
                    <option value="Wheel Alignment & Balancing">Wheel Alignment & Balancing</option>
                    <option value="Vehicle Cleaning & Detailing">Vehicle Cleaning & Detailing</option>
                    <option value="Battery & Electrical System Services">Battery & Electrical System Services</option>
                    <option value="Engine Diagnostics & Repair">Engine Diagnostics & Repair</option>
                    <option value="Transmission Repair & Service">Transmission Repair & Service</option>
                    <option value="AC & Heating System Services">AC & Heating System Services</option>
                    <option value="Body & Paint Services">Body & Paint Services</option>
                </select>
            </div>

            <div className="mb-4">
                <p className="mb-2 text-sm font-semibold">Card Image</p>
                <label htmlFor="displayImage" className="cursor-pointer inline-block relative">
                    {displayImage ? (
                        <img
                            className="w-36 h-36 rounded opacity-75 object-cover"
                            src={URL.createObjectURL(displayImage)}
                            alt="Preview"
                        />
                    ) : (
                        <div className="w-36 h-36 rounded border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200">
                            <span className="text-gray-500 text-sm">Click to upload</span>
                        </div>
                    )}
                    <input
                        type="file"
                        id="displayImage"
                        accept="image/*"
                        hidden
                        onChange={(e) => setDisplayImage(e.target.files[0])}
                    />
                </label>
            </div>


            <div className="mb-4">
                <p className="mb-1">Description</p>
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder="Enter service description"
                    className="w-full p-2 border rounded"
                    required
                ></textarea>
            </div>

            <div className="mb-4">
                <p className="mb-1">Specifications (comma separated)</p>
                <textarea
                    onChange={(e) => setSpecifications(e.target.value)}
                    value={specifications}
                    placeholder="Enter service specifications"
                    className="w-full p-2 border rounded"
                ></textarea>
            </div>

            <div className="mb-4">
                <p className="mb-1">Price</p>
                <input
                    type="number"
                    onChange={(e) => setPrice(Number(e.target.value))}
                    value={price}
                    min="0"
                    placeholder="Enter price"
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        onChange={(e) => setAvailable(e.target.checked)}
                        checked={available}
                    />
                    <span>Available</span>
                </label>
            </div>

            <div className="mb-4">
                <p className="mb-1">Interval (in minutes)</p>
                <input
                    type="number"
                    onChange={(e) => setInterval(Number(e.target.value))}
                    value={interval}
                    min="0"
                    placeholder="Enter how long a single service takes"
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                type="submit"
                className="w-full p-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
            >
                Submit
            </button>
        </form>

    );
};

export default AddService;
