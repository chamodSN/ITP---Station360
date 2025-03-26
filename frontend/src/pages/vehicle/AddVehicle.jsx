import React, { useState } from 'react'
import axios from 'axios'

const AddVehicle = () => {

    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [plateNumber, setPlateNumber] = useState('')
    const [vin, setVin] = useState('')
    const [fuel, setFuel] = useState('')
    const [image, setImage] = useState('')
    const [userId, setUserId] = useState('67dd1a12e1485ca648678a8d')

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('brandName', brand);
            formData.append('modelName', model);
            formData.append('plateNumber', plateNumber);
            formData.append('vinNumber', vin);
            formData.append('fuelType', fuel);
            formData.append('Image', image);

            formData.forEach((value, key) => {
                console.log(`${key} : ${value}`)
            })

            const { data } = await axios.post('http://localhost:4200/api/user/add-vehicle', formData)

            if(data.success){
                window.alert('Vehicle Added Successfully')
            }else{
                console.log("Error message", data.error)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Add Vehicle</h1>

            <form onSubmit={onSubmitHandler} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Brand Name</label>
                    <input 
                        type="text" 
                        onChange={(e) => setBrand(e.target.value)} 
                        value={brand} 
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Model Name</label>
                    <input 
                        type="text" 
                        onChange={(e) => setModel(e.target.value)} 
                        value={model} 
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Plate Number</label>
                    <input 
                        type="text" 
                        onChange={(e) => setPlateNumber(e.target.value)} 
                        value={plateNumber} 
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Vin Number</label>
                    <input 
                        type="text" 
                        onChange={(e) => setVin(e.target.value)} 
                        value={vin} 
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Fuel Type</label>
                    <input 
                        type="text" 
                        onChange={(e) => setFuel(e.target.value)} 
                        value={fuel} 
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Image</label>
                    <input 
                        type="file" 
                        onChange={(e) => setImage(e.target.files[0])} 
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                    Add Vehicle
                </button>
            </form>
        </div>
    )
}

export default AddVehicle
