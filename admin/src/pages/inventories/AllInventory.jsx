import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const AllInventory = () => {
    const [inventory, setInventory] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const getAllInventory = async () => {
        try {
            const searchParams = new URLSearchParams(location.search);
            const searchQuery = searchParams.get('search');
            const url = searchQuery 
                ? `http://localhost:4200/api/admin/inventory/all-inventory?search=${encodeURIComponent(searchQuery)}`
                : 'http://localhost:4200/api/admin/inventory/all-inventory';

            const { data } = await axios.get(url);
            if (data.success) {
                setInventory(data.AllInventory);
            } else {
                toast.error('Failed to get Inventory');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching inventory');
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const response = await axios.get('http://localhost:4200/api/admin/inventory/stock-report', {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf'
                }
            });

            // Check if the response is actually a PDF
            if (response.headers['content-type'] === 'application/json') {
                // If it's JSON, it's probably an error message
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorData = JSON.parse(reader.result);
                        toast.error(errorData.message || 'Failed to generate PDF');
                    } catch (e) {
                        toast.error('Failed to generate PDF');
                    }
                };
                reader.readAsText(response.data);
                return;
            }

            if (!response.data || response.data.size === 0) {
                throw new Error('Received empty response');
            }

            // Create a blob from the PDF data
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'inventory-stock-report.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Stock report downloaded successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to download stock report');
        }
    };

    useEffect(() => {
        getAllInventory();
    }, [location.search]);

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    {searchQuery
                        ? `Search results for "${searchQuery}"`
                        : 'All Inventory'}
                </h1>
                <button
                    onClick={handleDownloadPDF}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Stock PDF
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {inventory.map((item) => (
                    <div 
                        key={item._id} 
                        onClick={() => navigate(`/item/${item._id}`)} 
                        className="flex items-center border border-gray-300 rounded-lg shadow-md p-4 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg bg-white"
                    >
                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-6" />
                        <div className="flex flex-col justify-center">
                            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                            <p className="text-gray-600 font-medium">Quantity: {item.quantity}</p>
                        </div>
                    </div>    
                ))}
            </div>
        </div>
    );
};

export default AllInventory;
