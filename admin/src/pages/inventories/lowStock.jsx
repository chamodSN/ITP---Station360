import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LowStocks = () => {
    const [inventory, setInventory] = useState([]);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [orderQuantities, setOrderQuantities] = useState({});
    const [orderingItems, setOrderingItems] = useState({});
    const navigate = useNavigate();

    const getLowStockItems = async () => {
        try {
            const { data } = await axios.get('http://localhost:4200/api/admin/inventory/low-stock');
            if (data.success) {
                setInventory(data.lowStockItems);
                setLowStockCount(data.lowStockCount);

                const initialQuantities = {};
                data.lowStockItems.forEach(item => {
                    initialQuantities[item._id] = '';
                });
                setOrderQuantities(initialQuantities);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch low stock items');
        }
    };

    useEffect(() => {
        getLowStockItems();
    }, []);

    const handleQuantityChange = (itemId, value) => {
        setOrderQuantities(prev => ({
            ...prev,
            [itemId]: value
        }));
    };

    const handleOrder = async (item) => {
        if (!orderQuantities[item._id]) {
            toast.error('Please enter a quantity to order');
            return;
        }

        setOrderingItems(prev => ({
            ...prev,
            [item._id]: true
        }));

        try {
            const { data } = await axios.post('http://localhost:4200/api/admin/inventory/order-low-stock', {
                itemId: item._id,
                quantity: orderQuantities[item._id]
            });

            if (data.success) {
                toast.success('Order placed successfully');
                setOrderQuantities(prev => ({
                    ...prev,
                    [item._id]: ''
                }));
                getLowStockItems();
                navigate('/ordered-items');
            } else {
                toast.error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to place order');
        } finally {
            setOrderingItems(prev => ({
                ...prev,
                [item._id]: false
            }));
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Low Stock Items</h1>

            <div className="flex justify-center mb-6">
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-yellow-700">Items Low in Stock</h2>
                    <p className="text-3xl font-bold text-yellow-600">{lowStockCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {inventory.map((item) => (
                    <div
                        key={item._id}
                        className="relative flex items-center border border-yellow-200 rounded-lg shadow-md p-4 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg bg-yellow-50"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-md mr-6"
                        />
                        <div className="flex flex-col justify-center w-full">
                            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                            <p className="text-gray-600 font-medium">Brand: {item.brand}</p>
                            <p className="text-gray-600 font-medium">Quantity: {item.quantity} {item.unitType}</p>
                            <p className="text-gray-600 font-medium">Unit Price: ${item.unitPrice}</p>
                            <p className="text-gray-600 font-medium">Supplier: {item.supplierName}</p>
                            <p className="text-gray-600 font-medium">Email: {item.email}</p>

                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={orderQuantities[item._id]}
                                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                    placeholder="Enter quantity"
                                />
                            </div>

                            <button
                                onClick={() => handleOrder(item)}
                                disabled={orderingItems[item._id]}
                                className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {orderingItems[item._id] ? 'Ordering...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LowStocks;