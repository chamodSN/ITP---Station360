import React, { useState } from 'react';
import axios from 'axios';

const AddService = () => {
    const [serviceName, setServiceName] = useState('');
    const [category, setCategory] = useState('General Maintenance & Inspection');
    const [displayImage, setDisplayImage] = useState('');
    const [description, setDescription] = useState('');
    const [specifications, setSpecifications] = useState('');
    const [interval, setInterval] = useState(1);
    const [price, setPrice] = useState(0);
    const [available, setAvailable] = useState(false);
    const [isBookable, setIsBookable] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {

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
            } else {
                console.error("Failed to add service: ", data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} encType="multipart/form-data">
            <h1>Create a New Service</h1>

            <p>Service Name:</p>
            <input
                type="text"
                onChange={(e) => setServiceName(e.target.value)}
                value={serviceName}
                required
                maxLength="100"
                placeholder="Enter service name"
            />

            <p>Category:</p>
            <select onChange={(e) => setCategory(e.target.value)} value={category} required>
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

            <p>Card Image:</p>
            <input
                type="file"
                onChange={(e) => setDisplayImage(e.target.files[0])}
                required
            />

            <p>Description:</p>
            <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
                placeholder="Enter service description"
            ></textarea>

            <p>Specifications (comma separated):</p>
            <textarea
                onChange={(e) => setSpecifications(e.target.value)}
                value={specifications}
                placeholder="Enter service specifications"
            ></textarea>

            <p>Price:</p>
            <input
                type="number"
                onChange={(e) => setPrice(Number(e.target.value))}
                value={price}
                min="0"
                placeholder="Enter price"
            />

            <p>Available:</p>
            <input
                type="checkbox"
                onChange={(e) => setAvailable(e.target.checked)}
                checked={available}
            />

            <p>Is Bookable:</p>
            <input
                type="checkbox"
                onChange={(e) => setIsBookable(e.target.checked)}
                checked={isBookable}
            />

            {isBookable && (
                <>
                    <p>Interval (In Minutes):</p>
                    <input type="number" onChange={(e) => setInterval(Number(e.target.value))} value={interval} min="0" placeholder="Enter How Long a single service takes" />
                </>
            )}


            <button type="submit">Submit</button>
        </form>
    );
};

export default AddService;
