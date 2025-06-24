import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const OrderedItems = () => {
    const [orderedItems, setOrderedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getOrderedItems();
    }, []);

    const getOrderedItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:4200/api/admin/inventory/ordered-items');
            if (response.data && response.data.success) {
                setOrderedItems(response.data.orders || []);
            } else {
                setError('Failed to fetch ordered items');
                toast.error('Failed to fetch ordered items');
            }
        } catch (error) {
            console.error('Error fetching ordered items:', error);
            setError('Error fetching ordered items');
            toast.error('Error fetching ordered items');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'received':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={getOrderedItems}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Ordered Items</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {!orderedItems || orderedItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 col-span-full">No ordered items found.</p>
                ) : (
                    orderedItems.map((order) => (
                        <motion.div
                            key={order._id}
                            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="relative flex items-center border border-gray-300 rounded-lg shadow-md p-4 cursor-pointer bg-white"
                        >
                            <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <img
                                src={order.item?.image || 'https://via.placeholder.com/96x96?text=No+Image'}
                                alt={order.item?.name || 'Unknown Item'}
                                className="w-24 h-24 object-cover rounded-md mr-6"
                            />
                            <div className="flex flex-col justify-center">
                                <h3 className="text-xl font-semibold mb-2">{order.item?.name || 'Unknown Item'}</h3>
                                <p className="text-gray-600 font-medium mb-1">Quantity: {order.quantity} {order.item?.unitType || ''}</p>
                                <p className="text-gray-500 text-sm">Order Date: {format(new Date(order.orderDate), 'MMM dd, yyyy')}</p>
                                {order.receivedDate && (
                                    <p className="text-gray-500 text-sm">Received: {format(new Date(order.receivedDate), 'MMM dd, yyyy')}</p>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderedItems; 