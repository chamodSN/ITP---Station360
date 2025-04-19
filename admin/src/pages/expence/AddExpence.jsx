import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddExpence = () => {
    const [ExpenceType, setExpenceType] = useState('Office Rent');
    const [Reason, setReason] = useState('');
    const [Cost, setCost] = useState('');
    const [Date, setDate] = useState('');
    const navigate = useNavigate()

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                ExpenceType,
                Reason,
                Cost,
                Date,
            };

            const { data } = await axios.post('http://localhost:4200/api/admin/add-expence', formData);

            if (data.success) {
                toast.success('Expense added successfully');
                navigate('/all-expenses');
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message)
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={onSubmitHandler} className="bg-white p-6 shadow-md rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add Expense</h2>

                <label className="block text-gray-600">Expense Name</label>
                
<label className="block text-gray-600 mt-3">Expense Type</label>
<select
    required
    onChange={(e) => setExpenceType(e.target.value)}
    value={ExpenceType}
    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
    <option value="Office Rent">Office Rent</option>
    <option value="Utilities (Electricity, Water, Internet)">Utilities</option>
    <option value="Stationery & Office Supplies">Stationery & Office Supplies</option>
    <option value="Employee Salaries">Employee Salaries</option>
    <option value="Software & Subscriptions">Software & Subscriptions</option>
    <option value="Office Furniture & Equipment">Office Furniture & Equipment</option>
    <option value="Marketing & Advertising">Marketing & Advertising</option>
    <option value="Insurance">Insurance</option>
    <option value="Travel & Transportation">Travel & Transportation</option>
    <option value="Miscellaneous Expenses">Miscellaneous Expenses</option>
</select>

                <label className="block text-gray-600 mt-3">Reason</label>
                <input
                    type="text"
                    placeholder="Reason"
                    required
                    onChange={(e) => setReason(e.target.value)}
                    value={Reason}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-gray-600 mt-3">Cost</label>
                <input
                    type="number"
                    placeholder="Cost"
                    required
                    onChange={(e) => setCost(e.target.value)}
                    value={Cost}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-gray-600 mt-3">Date</label>
                <input
                    type="date"
                    required
                    onChange={(e) => setDate(e.target.value)}
                    value={Date}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded mt-4 hover:bg-blue-700 transition">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddExpence;
