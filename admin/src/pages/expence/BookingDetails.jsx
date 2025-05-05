import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [taskPrices, setTaskPrices] = useState({});
    const [extraExpenses, setExtraExpenses] = useState([{ description: '', amount: '' }]);

    useEffect(() => {
        fetchBookingDetails();
    }, [id]);

    const fetchBookingDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:4200/api/admin/completed-bookings`);
            const bookingData = response.data.find(booking => booking._id === id);
            if (bookingData) {
                setBooking(bookingData);
                // Initialize task prices with existing prices
                const initialPrices = {};
                bookingData.tasksPerformed.forEach((task, index) => {
                    initialPrices[index] = task.price || '';
                });
                setTaskPrices(initialPrices);
            } else {
                toast.error('Booking not found');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching booking details:', error);
            toast.error('Failed to fetch booking details');
            setLoading(false);
        }
    };

    const handlePriceChange = (index, value) => {
        setTaskPrices(prev => ({
            ...prev,
            [index]: value
        }));
    };

    const handleExpenseChange = (index, field, value) => {
        setExtraExpenses(prev => {
            const newExpenses = [...prev];
            newExpenses[index] = {
                ...newExpenses[index],
                [field]: value
            };
            return newExpenses;
        });
    };

    const addExpenseField = () => {
        setExtraExpenses(prev => [...prev, { description: '', amount: '' }]);
    };

    const removeExpenseField = (index) => {
        setExtraExpenses(prev => prev.filter((_, i) => i !== index));
    };

    const handleBillUser = async () => {
        try {
            // Validate all expenses
            const invalidExpenses = extraExpenses.some(expense => 
                !expense.description || !expense.amount || isNaN(expense.amount)
            );

            if (invalidExpenses) {
                toast.error('Please enter valid details for all expenses');
                return;
            }

            // Prepare task prices
            const tasksWithPrices = booking.tasksPerformed.map((task, index) => ({
                ...task,
                price: parseFloat(taskPrices[index]) || 0
            }));

            // Prepare extra expenses
            const newExpenses = extraExpenses.map(expense => ({
                description: expense.description,
                amount: parseFloat(expense.amount)
            }));

            // Calculate total amount
            const tasksTotal = tasksWithPrices.reduce((sum, task) => sum + task.price, 0);
            const expensesTotal = newExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const totalAmount = tasksTotal + expensesTotal;

            // Send billing request with all data
            await axios.post(`http://localhost:4200/api/admin/bill-user/${id}`, {
                totalAmount,
                tasks: tasksWithPrices,
                extraExpenses: newExpenses
            });

            


            toast.success('User has been billed successfully');
            navigate('/admin/expense');
        } catch (error) {
            console.error('Error billing user:', error);
            toast.error('Failed to bill user');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!booking) {
        return <div className="flex justify-center items-center h-screen">Booking not found</div>;
    }

    // Check if all tasks have prices
    const allTasksPriced = Object.values(taskPrices).every(price => price && !isNaN(price));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/admin/expense')}
                    className="text-blue-500 hover:text-blue-700"
                >
                    ← Back to Bookings
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
                        <p className="mb-2"><span className="font-medium">Date:</span> {booking.date}</p>
                        <p className="mb-2"><span className="font-medium">Time:</span> {booking.timeSlot}</p>
                        <p className="mb-2"><span className="font-medium">Vehicle Plate:</span> {booking.vehicleId.vehicleNumPlate}</p>
                        <p className="mb-2"><span className="font-medium">Technician:</span> {booking.technicianId?.name || 'N/A'}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Service Information</h2>
                        <p className="mb-2"><span className="font-medium">Service:</span> {booking.serviceId.serviceName}</p>
                        <p className="mb-2"><span className="font-medium">Status:</span> {booking.status}</p>
                        <p className="mb-2"><span className="font-medium">Created:</span> {new Date(booking.createdAt).toLocaleString()}</p>
                        <p className="mb-2"><span className="font-medium">Last Updated:</span> {new Date(booking.updatedAt).toLocaleString()}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Tasks Performed</h2>
                    <div className="space-y-4">
                        {booking.tasksPerformed.map((task, index) => (
                            <div key={index} className="border p-4 rounded">
                                <p className="font-medium mb-2">{task.task}</p>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        placeholder="Enter price"
                                        value={taskPrices[index] || ''}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                        className="border rounded px-3 py-2 w-32"
                                    />
                                    {taskPrices[index] && !isNaN(taskPrices[index]) && (
                                        <span className="text-green-600">Price: ${parseFloat(taskPrices[index]).toFixed(2)}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Extra Expenses</h2>
                    <div className="space-y-4">
                        {booking.extraExpenses.map((expense, index) => (
                            <div key={index} className="border p-4 rounded">
                                <p className="font-medium">{expense.description}</p>
                                <p className="text-green-600">Amount: ${expense.amount}</p>
                            </div>
                        ))}
                        
                        <div className="border p-4 rounded">
                            <h3 className="font-medium mb-4">Add New Expenses</h3>
                            <div className="space-y-4">
                                {extraExpenses.map((expense, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={expense.description}
                                            onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
                                            className="border rounded px-3 py-2 flex-1"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={expense.amount}
                                            onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                                            className="border rounded px-3 py-2 w-32"
                                        />
                                        {index > 0 && (
                                            <button
                                                onClick={() => removeExpenseField(index)}
                                                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addExpenseField}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Add Another Expense
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bill User Button */}
                <div className="mt-8">
                    <button
                        onClick={handleBillUser}
                        disabled={!allTasksPriced}
                        className={`w-full py-3 px-4 rounded text-white font-medium ${
                            allTasksPriced 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {allTasksPriced ? 'Bill User' : 'Add Prices to All Tasks First'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;