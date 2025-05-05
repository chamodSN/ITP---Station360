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
    const [isBookable, setIsBookable] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {

            if (!displayImage) {
                return toast.error("Please select a display image");
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
            formData.append('isBookable', isBookable);

            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            console.log("Form data being sent:", formData);

            const { data } = await axios.post('http://localhost:4200/api/admin/service/add-service', formData)

            if (data.success) {
                console.log("Service added successfully");
                toast.success("Service added successfully");

                setServiceName('');
                setCategory('General Maintenance & Inspection');
                setDisplayImage('');
                setDescription('');
                setSpecifications('');
                setInterval(0);
                setPrice(0);
                setAvailable(false);
                setIsBookable(false);

                navigate("/service/all-services");

            } else {
                console.error("Failed to add service: ", data.message);
                toast.error(error.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} encType="multipart/form-data" className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Create a New Service</h1>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="serviceName">Service Name:</label>
                <input
                    id="serviceName"
                    type="text"
                    onChange={(e) => setServiceName(e.target.value)}
                    value={serviceName}
                    required
                    maxLength="100"
                    placeholder="Enter service name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="category">Category:</label>
                <select
                    id="category"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
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
                <label className="block text-sm font-semibold mb-2" htmlFor="displayImage">Card Image:</label>
                <input
                    id="displayImage"
                    type="file"
                    onChange={(e) => setDisplayImage(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                    placeholder="Enter service description"
                    className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="specifications">Specifications (comma separated):</label>
                <textarea
                    id="specifications"
                    onChange={(e) => setSpecifications(e.target.value)}
                    value={specifications}
                    placeholder="Enter service specifications"
                    className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="price">Price:</label>
                <input
                    id="price"
                    type="number"
                    onChange={(e) => setPrice(Number(e.target.value))}
                    value={price}
                    min="0"
                    placeholder="Enter price"
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4 flex items-center">
                <input
                    id="available"
                    type="checkbox"
                    onChange={(e) => setAvailable(e.target.checked)}
                    checked={available}
                    className="mr-2"
                />
                <label htmlFor="available" className="text-sm font-semibold">Available</label>
            </div>

            <div className="mb-4 flex items-center">
                <input
                    id="isBookable"
                    type="checkbox"
                    onChange={(e) => setIsBookable(e.target.checked)}
                    checked={isBookable}
                    className="mr-2"
                />
                <label htmlFor="isBookable" className="text-sm font-semibold">Is Bookable</label>
            </div>

            {isBookable && (
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2" htmlFor="interval">Interval (In Minutes):</label>
                    <input
                        id="interval"
                        type="number"
                        onChange={(e) => setInterval(Number(e.target.value))}
                        value={interval}
                        min="0"
                        placeholder="Enter How Long a single service takes"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
            )}

            <button type="submit" className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition">Submit</button>
        </form>
    );
};

export default AddService;
