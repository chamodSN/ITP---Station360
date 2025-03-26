import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllInventory = () => {
    const [inventory, setInventory] = useState([]);
    const navigate = useNavigate();

    const getAllInventory = async () => {
        try {
            const { data } = await axios.get('http://localhost:4200/api/admin/inventory/all-inventory');
            console.log(data);
            if (data.success) {
                setInventory(data.AllInventory);
            } else {
                alert('Failed to get Inventory');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllInventory();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">All Inventory</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {inventory.map((item) => (
                    <div 
                        key={item._id} 
                        onClick={() => navigate(`/item/${item._id}`)} 
                        className="border border-gray-300 rounded-lg shadow-md p-4 cursor-pointer transition-transform transform hover:scale-105 bg-white"
                    >
                        <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-md mb-3" />
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="text-gray-600">Brand: {item.brand}</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-gray-600">Unit Price: ${item.unitPrice}</p>
                        <p className="text-gray-600">Expiry Date: {item.expireDate}</p>
                        <p className="text-gray-600">Supplier: {item.supplierName}</p>
                        <p className="text-gray-600">Email: {item.email}</p>
                    </div>    
                ))}
            </div>
        </div>
    );
};

export default AllInventory;
