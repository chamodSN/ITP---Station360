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
                // Initialize order quantities
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

        // Set ordering state for this specific item
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
                // Clear the quantity for this item
                setOrderQuantities(prev => ({
                    ...prev,
                    [item._id]: ''
                }));
                
                // Refresh the low stock list to remove the ordered item
                getLowStockItems();
                
                // Navigate to the ordered items page
                navigate('/ordered-items');
            } else {
                toast.error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to place order');
        } finally {
            // Reset ordering state for this specific item
            setOrderingItems(prev => ({
                ...prev,
                [item._id]: false
            }));
        }
    };

    const isLowStock = (quantity) => {
        return quantity < 15;
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
                        className="border border-yellow-200 rounded-lg shadow-md p-4 bg-yellow-50"
                    >
                        <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-md mb-3" />
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="text-gray-600">Brand: {item.brand}</p>
                        <p className="text-gray-600">
                            Current Quantity: {item.quantity} {item.unitType}
                        </p>
                        <p className="text-gray-600">Unit Price: ${item.unitPrice}</p>
                        <p className="text-gray-600">Supplier: {item.supplierName}</p>
                        <p className="text-gray-600">Email: {item.email}</p>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Order Quantity:</label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                    type="number"
                                    min="1"
                                    value={orderQuantities[item._id]}
                                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                    placeholder="Enter quantity"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => handleOrder(item)}
                            disabled={orderingItems[item._id]}
                            className="mt-4 w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {orderingItems[item._id] ? 'Ordering...' : 'Place Order'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LowStocks;
