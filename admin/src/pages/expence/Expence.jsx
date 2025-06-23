import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function Expence() {
    const { id } = useParams();
    const [Expence, setExpence] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const Navigate = useNavigate();

    const fetchExpence = async () => {
        try {
            const { data } = await axios.get(`http://localhost:4200/api/admin/expence/${id}`);

            if (data.success) {
                setExpence(data.expence);
            }
        } catch (error) {
            console.error("Error fetching Expense details:", error);
        }
    };

    const deleteExpence = async () => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await axios.delete(`http://localhost:4200/api/admin/expence/${id}`);
                Navigate('/all-expences');
            } catch (error) {
                console.error("Error deleting expense:", error);
            }
        }
    };

    const updateExpence = async () => {
        try {
            const formData = {
                ExpenceType: Expence.ExpenceType,
                Reason: Expence.Reason,
                Cost: Expence.Cost,
                Date: Expence.Date
            };

            const { data } = await axios.put(`http://localhost:4200/api/admin/expence/${id}`, formData);

            if (data.success) {
                await fetchExpence();
                setIsEdit(false);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error updating expense:", error);
        }
    };

    useEffect(() => {
        fetchExpence();
    }, [id]);

    return Expence && (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Expense Details</h1>

                    <div>
                        <p className="font-medium text-gray-600">Expense Type:</p>
                        {!isEdit
                            ? <p className="text-gray-800">{Expence.ExpenceType}</p>
                            : <input type="text" value={Expence.ExpenceType} onChange={(e) => setExpence(prev => ({ ...prev, ExpenceType: e.target.value }))} className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" readonly />
                        }
                    </div>

                    <div>
                        <p className="font-medium text-gray-600">Reason:</p>
                        {!isEdit
                            ? <p className="text-gray-800">{Expence.Reason}</p>
                            : <input type="text" value={Expence.Reason} onChange={(e) => setExpence(prev => ({ ...prev, Reason: e.target.value }))} className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        }
                    </div>

                    <div>
                        <p className="font-medium text-gray-600">Cost:</p>
                        {!isEdit
                            ? <p className="text-gray-800">${Expence.Cost}</p>
                            : <input type="number" value={Expence.Cost} onChange={(e) => setExpence(prev => ({ ...prev, Cost: e.target.value }))} className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        }
                    </div>

                    <div>
                        <p className="font-medium text-gray-600">Date:</p>
                        <p className="text-gray-800">{Expence.Date}</p>
                    </div>

                    <div className="flex justify-between space-x-2">
                        {isEdit ? (
                            <button onClick={updateExpence} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                                Save
                            </button>
                        ) : (
                            <button onClick={() => setIsEdit(!isEdit)} className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                                Edit
                            </button>
                        )}
                        
                        <button onClick={deleteExpence} className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition">
                            Delete
                        </button>
                    </div>
                </div>
            </div>

    );
}

export default Expence;
