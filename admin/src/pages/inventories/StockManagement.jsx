import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const StockManagement = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [stockOutQuantity, setStockOutQuantity] = useState('');
    const [restockQuantity, setRestockQuantity] = useState('');
    const [restockUnitPrice, setRestockUnitPrice] = useState('');
    const [restockExpiryDate, setRestockExpiryDate] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:4200/api/admin/inventory/all-inventory');
            if (response.data.success) {
                setInventory(response.data.AllInventory);
            } else {
                toast.error('Failed to fetch inventory');
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
            toast.error('Error fetching inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleItemSelect = (item) => {
        setSelectedItem(item);
        setStockOutQuantity('');
        setRestockQuantity('');
        setRestockUnitPrice('');
        setRestockExpiryDate('');
    };

    const handleStockOut = async () => {
        if (!selectedItem) {
            toast.error('Please select an item');
            return;
        }

        if (!stockOutQuantity || isNaN(stockOutQuantity) || stockOutQuantity <= 0) {
            toast.error('Please enter a valid quantity');
            return;
        }

        if (parseInt(stockOutQuantity) > selectedItem.quantity) {
            toast.error('Stock out quantity cannot exceed current stock');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await axios.post('http://localhost:4200/api/admin/inventory/stock-out', {
                id: selectedItem._id,
                quantity: parseInt(stockOutQuantity)
            });

            if (response.data.success) {
                toast.success('Stock out successful');
                setStockOutQuantity('');
                fetchInventory(); // Refresh inventory data
            } else {
                toast.error(response.data.message || 'Stock out failed');
            }
        } catch (error) {
            console.error('Error during stock out:', error);
            toast.error('Error during stock out');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRestock = async () => {
        if (!selectedItem) {
            toast.error('Please select an item');
            return;
        }

        if (!restockQuantity || isNaN(restockQuantity) || restockQuantity <= 0) {
            toast.error('Please enter a valid quantity');
            return;
        }

        if (!restockUnitPrice || isNaN(restockUnitPrice) || restockUnitPrice <= 0) {
            toast.error('Please enter a valid unit price');
            return;
        }

        if (!restockExpiryDate) {
            toast.error('Please select an expiry date');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await axios.post('http://localhost:4200/api/admin/inventory/restock', {
                id: selectedItem._id,
                quantity: parseInt(restockQuantity),
                unitPrice: parseFloat(restockUnitPrice),
                expiryDate: restockExpiryDate
            });

            if (response.data.success) {
                toast.success('Restock successful');
                setRestockQuantity('');
                setRestockUnitPrice('');
                setRestockExpiryDate('');
                fetchInventory(); // Refresh inventory data
            } else {
                toast.error(response.data.message || 'Restock failed');
            }
        } catch (error) {
            console.error('Error during restock:', error);
            toast.error('Error during restock');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Stock Management</h1>
            
            {!selectedItem ? (
                // Inventory List View
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold">Inventory Items</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inventory.map((item) => (
                                    <tr 
                                        key={item._id} 
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleItemSelect(item)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt={item.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{item.brand}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{item.quantity} {item.unitType}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">${item.unitPrice.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.itemType === 'liquid' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {item.itemType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button 
                                                className="text-indigo-600 hover:text-indigo-900"
                                                onClick={() => handleItemSelect(item)}
                                            >
                                                Manage Stock
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                // Stock Operations View
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Selected Item Details */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-6">
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="mr-4 text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-semibold">Stock Operations</h2>
                        </div>
                        
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <img src={selectedItem.image} alt={selectedItem.name} className="h-16 w-16 rounded-md object-cover mr-4" />
                                <div>
                                    <p className="font-medium">{selectedItem.name}</p>
                                    <p className="text-gray-600">{selectedItem.brand}</p>
                                    <p className="text-gray-600">Current Stock: {selectedItem.quantity} {selectedItem.unitType}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stock Out Form */}
                        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Stock Out</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Remove</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedItem.quantity}
                                    value={stockOutQuantity}
                                    onChange={(e) => setStockOutQuantity(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                    placeholder="Enter quantity"
                                />
                            </div>
                            <button
                                onClick={handleStockOut}
                                disabled={isProcessing || !stockOutQuantity}
                                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : 'Stock Out'}
                            </button>
                        </div>

                        {/* Restock Form */}
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Restock</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={restockQuantity}
                                    onChange={(e) => setRestockQuantity(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                    placeholder="Enter quantity"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={restockUnitPrice}
                                    onChange={(e) => setRestockUnitPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                    placeholder="Enter unit price"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    value={restockExpiryDate}
                                    onChange={(e) => setRestockExpiryDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                />
                            </div>
                            <button
                                onClick={handleRestock}
                                disabled={isProcessing || !restockQuantity || !restockUnitPrice || !restockExpiryDate}
                                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : 'Restock'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockManagement; 