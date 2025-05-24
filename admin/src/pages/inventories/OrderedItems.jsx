import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

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
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="grid grid-cols-1 gap-4 p-4">
                    {!orderedItems || orderedItems.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No ordered items found.</p>
                    ) : (
                        orderedItems.map((order) => (
                            <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{order.item?.name || 'Unknown Item'}</h3>
                                        <p className="text-gray-600">{order.item?.brand || 'Unknown Brand'}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Quantity Ordered</p>
                                        <p className="font-medium">{order.quantity} {order.item?.unitType || ''}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Order Date</p>
                                        <p className="font-medium">{format(new Date(order.orderDate), 'MMM dd, yyyy')}</p>
                                    </div>
                                    {order.receivedDate && (
                                        <div>
                                            <p className="text-sm text-gray-500">Received Date</p>
                                            <p className="font-medium">{format(new Date(order.receivedDate), 'MMM dd, yyyy')}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-500">Supplier</p>
                                        <p className="font-medium">{order.item?.supplier?.name || 'Unknown Supplier'}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderedItems; 