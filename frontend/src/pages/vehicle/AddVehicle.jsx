import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AddVehicle = () => {
    const navigate = useNavigate();
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [plateNumber, setPlateNumber] = useState('')
    const [vin, setVin] = useState('')
    const [fuel, setFuel] = useState('')
    const [image, setImage] = useState(null)

    const validateInputs = () => {
        
        const isValidVIN = (vin) => {
            if (!vin || vin.length !== 17) return false;
        
            const vinUpper = vin.toUpperCase();
        
            // VIN cannot contain I, O, or Q
            if (/[IOQ]/.test(vinUpper)) return false;
        
            // Transliteration table (letters to numbers)
            const transliteration = {
                A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
                J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
                S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
                '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
                '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
            };
        
            // Weighting factors for each position
            const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
        
            let sum = 0;
            for (let i = 0; i < 17; i++) {
                const char = vinUpper[i];
                const value = transliteration[char];
                if (value === undefined) return false; // Invalid character
                sum += value * weights[i];
            }
        
            const checkDigit = vinUpper[8];
            const remainder = sum % 11;
            const expectedCheck = remainder === 10 ? 'X' : remainder.toString();
        
            return checkDigit === expectedCheck;
        };

        
        const plateRegex = /^[A-Z0-9-]{4,}$/i; // Basic alphanumeric plate check
        if (!brand.trim() || brand.length < 2) {
            toast.error("Enter a valid brand name");
            return false;
        }
        if (!model.trim() || model.length < 1) {
            toast.error("Enter a valid model name");
            return false;
        }
        if (!plateRegex.test(plateNumber)) {
            toast.error("Enter a valid plate number");
            return false;
        }
        if (!isValidVIN(vin)) {
            toast.error("Invalid VIN: does not meet structural and check digit requirements");
            return false;
        }        
        if (!fuel || fuel === "Not selected") {
            toast.error("Please select a fuel type");
            return false;
        }
        if (image) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!allowedTypes.includes(image.type)) {
                toast.error("Only PNG and JPG images are allowed.");
                return false;
            }
        }
        if (!image) {
            toast.error("Please upload an image");
            return false;
        }
        return true;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!validateInputs()) return;

        try {
            const formData = new FormData();
            formData.append('brandName', brand);
            formData.append('modelName', model);
            formData.append('plateNumber', plateNumber);
            formData.append('vinNumber', vin);
            formData.append('fuelType', fuel);
            formData.append('Image', image);

            const { data } = await axios.post(
                'http://localhost:4200/api/user/add-vehicle',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );

            if (data.success) {
                toast.success('Vehicle Added Successfully');
                navigate('/my-profile');
            } else {
                toast.error(data.message || "Failed to add vehicle");
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding vehicle");
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Add Vehicle</h1>

            <div className="mb-4">
                <p className="mb-1">Vehicle Image</p>
                <label htmlFor="image" className="cursor-pointer">
                    <div className="inline-block relative cursor-pointer">
                        {image ? (
                            <img
                                className="w-36 h-36 rounded opacity-75 object-cover"
                                src={URL.createObjectURL(image)}
                                alt="Vehicle Preview"
                            />
                        ) : (
                            <div className="w-36 h-36 rounded border-2 border-dashed border-gray-300 flex items-center justify-center bg-black">
                                <img
                                    className="w-10"
                                    src={assets.upload_icon}
                                    alt="Upload Icon"
                                />
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </label>
            </div>

            <div className="mb-4">
                <p className="mb-1">Brand Name</p>
                <input
                    type="text"
                    onChange={(e) => setBrand(e.target.value)}
                    value={brand}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <p className="mb-1">Model Name</p>
                <input
                    type="text"
                    onChange={(e) => setModel(e.target.value)}
                    value={model}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <p className="mb-1">Plate Number</p>
                <input
                    type="text"
                    onChange={(e) => setPlateNumber(e.target.value)}
                    value={plateNumber}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <p className="mb-1">VIN Number</p>
                <input
                    type="text"
                    onChange={(e) => setVin(e.target.value)}
                    value={vin}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <p className="mb-1">Fuel Type</p>
                <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">Not selected</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                    <option value="LPG">LPG</option>
                </select>
            </div>

            <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-all"
            >
                Add Vehicle
            </button>
        </form>
    )
}

export default AddVehicle;
