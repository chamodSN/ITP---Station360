import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ExpiringItems = () => {
    const [inventory, setInventory] = useState([]);
    const [expiringCount, setExpiringCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getExpiringItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get('http://localhost:4200/api/admin/inventory/expiring-items');
            if (data.success) {
                setInventory(data.expiringItems);
                setExpiringCount(data.expiringCount);
                if (data.expiringItems.length === 0) {
                    toast.info('No items are expiring soon');
                }
            } else {
                setError('Failed to get Expiring Items');
                toast.error('Failed to get Expiring Items');
            }
        } catch (error) {
            console.error(error);
            setError('Error fetching expiring items');
            toast.error('Error fetching expiring items');
        } finally {
            setLoading(false);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Loading expiring items...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={getExpiringItems}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Expiring Items</h1>
            
            <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-red-700">Items Expiring Soon</h2>
                    <p className="text-3xl font-bold text-red-600">{expiringCount}</p>
                </div>
            </div>
            
            {inventory.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                    No items are expiring soon
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {inventory.map((item) => {
                        const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                        const status = getExpiryStatus(daysUntilExpiry);
                        
                        return (
                            <div 
                                key={item._id} 
                                onClick={() => navigate(`/item/${item._id}`)} 
                                className="relative flex items-center border border-red-200 rounded-lg shadow-md p-4 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg bg-red-50"
                            >
                                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-white text-xs font-bold ${status.color}`}>
                                    {status.text}
                                </div>
                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-6" />
                                <div className="flex flex-col justify-center">
                                    <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                                    <p className="text-gray-600 font-medium">Quantity: {item.quantity}</p>
                                </div>
                            </div>    
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExpiringItems; 