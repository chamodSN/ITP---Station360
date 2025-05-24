import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExpiringItems = () => {
    const [inventory, setInventory] = useState([]);
    const [expiringCount, setExpiringCount] = useState(0);
    const navigate = useNavigate();

    const getExpiringItems = async () => {
        try {
            const { data } = await axios.get('http://localhost:4200/api/admin/inventory/expiring-items');
            if (data.success) {
                setInventory(data.expiringItems);
                setExpiringCount(data.expiringCount);
            } else {
                alert('Failed to get Expiring Items');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getExpiringItems();
    }, []);

    const getDaysUntilExpiry = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getExpiryStatus = (daysUntilExpiry) => {
        if (daysUntilExpiry <= 0) {
            return { text: 'EXPIRED', color: 'bg-red-600' };
        } else if (daysUntilExpiry <= 3) {
            return { text: 'CRITICAL', color: 'bg-red-500' };
        } else if (daysUntilExpiry <= 5) {
            return { text: 'WARNING', color: 'bg-orange-500' };
        } else {
            return { text: 'NOTICE', color: 'bg-yellow-500' };
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Expiring Items</h1>
            
            <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-red-700">Items Expiring Soon</h2>
                    <p className="text-3xl font-bold text-red-600">{expiringCount}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {inventory.map((item) => {
                    const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                    const status = getExpiryStatus(daysUntilExpiry);
                    
                    return (
                        <div 
                            key={item._id} 
                            onClick={() => navigate(`/item/${item._id}`)} 
                            className="border border-red-200 rounded-lg shadow-md p-4 cursor-pointer transition-transform transform hover:scale-105 bg-red-50"
                        >
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-white text-xs font-bold ${status.color}`}>
                                {status.text}
                            </div>
                            
                            <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-md mb-3" />
                            <h2 className="text-xl font-semibold">{item.name}</h2>
                            <p className="text-gray-600">Brand: {item.brand}</p>
                            <p className="text-gray-600">
                                Quantity: {item.quantity} {item.unitType}
                            </p>
                            <p className="text-gray-600">Unit Price: ${item.unitPrice}</p>
                            <p className="text-red-600 font-semibold">
                                Expiry Date: {new Date(item.expiryDate).toLocaleDateString()}
                            </p>
                            <p className="text-red-600 font-semibold">
                                {daysUntilExpiry <= 0 
                                    ? 'EXPIRED' 
                                    : `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`}
                            </p>
                            <p className="text-gray-600">Supplier: {item.supplierName}</p>
                            <p className="text-gray-600">Email: {item.email}</p>
                        </div>    
                    );
                })}
            </div>
        </div>
    );
};

export default ExpiringItems; 