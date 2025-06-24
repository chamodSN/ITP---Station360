import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Inventory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const fetchInventory = async () => {
        try {
            const { data } = await axios.get(`http://localhost:4200/api/admin/inventory/${id}`);
            if (data.success) {
                setInventory(data.Item);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateInventory = async () => {
        try {
            const { data } = await axios.put(`http://localhost:4200/api/admin/inventory/${id}`, inventory);
            if (data.success) {
                await fetchInventory();
                setIsEdit(false);
                toast.success("Inventory updated successfully!");
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error", error);
        }
    };

    const deleteInventory = async () => {
        if (window.confirm("Are you sure you want to delete this Inventory?")) {
            try {
                await axios.delete(`http://localhost:4200/api/admin/inventory/${id}`);
                toast.success("Inventory deleted successfully!");
                navigate("/all-inventory");
            } catch (error) {
                console.error("Error", error);
            }
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [id]);

    return (
        inventory && (
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edit Inventory</h2>
                <div className="mb-4">
                    <label className="block text-lg font-semibold text-gray-700">Name:</label>
                    {!isEdit ? (
                        <h2 className="text-xl text-gray-800">{inventory.name}</h2>
                    ) : (
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={inventory.name}
                            onChange={(e) => setInventory((prev) => ({ ...prev, name: e.target.value }))}
                        />
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold text-gray-700">Brand:</label>
                    {!isEdit ? (
                        <h2 className="text-xl text-gray-800">{inventory.brand}</h2>
                    ) : (
                        <input
                            type="text"
                            className="input"
                            value={inventory.brand}
                            onChange={(e) => setInventory((prev) => ({ ...prev, brand: e.target.value }))}
                        />
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold text-gray-700">Quantity:</label>
                    {!isEdit ? (
                        <h2 className="text-xl text-gray-800">{inventory.quantity}</h2>
                    ) : (
                        <input
                            type="text"
                            className="input"
                            value={inventory.quantity}
                            onChange={(e) => setInventory((prev) => ({ ...prev, quantity: e.target.value }))}
                        />
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold text-gray-700">Unit Price:</label>
                    {!isEdit ? (
                        <h2 className="text-xl text-gray-800">{inventory.unitPrice}</h2>
                    ) : (
                        <input
                            type="text"
                            className="input"
                            value={inventory.unitPrice}
                            onChange={(e) => setInventory((prev) => ({ ...prev, unitPrice: e.target.value }))}
                        />
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold text-gray-700">Expiry Date:</label>
                    {!isEdit ? (
                        <h2 className="text-xl text-gray-800">{inventory.expiryDate}</h2>
                    ) : (
                        <input
                            type="text"
                            className="input"
                            value={inventory.expiryDate}
                            onChange={(e) => setInventory((prev) => ({ ...prev, expiryDate: e.target.value }))}
                            readOnly
                        />
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold text-gray-700">Supplier Name:</label>
                    {!isEdit ? (
                        <h2 className="text-xl text-gray-800">{inventory.supplierName}</h2>
                    ) : (
                        <input
                            type="text"
                            className="input"
                            value={inventory.supplierName}
                            onChange={(e) => setInventory((prev) => ({ ...prev, supplierName: e.target.value }))}
                        />
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold text-gray-700">Email:</label>
                    {!isEdit ? (
                        <h2 className="text-xl text-gray-800">{inventory.email}</h2>
                    ) : (
                        <input
                            type="text"
                            className="input"
                            value={inventory.email}
                            onChange={(e) => setInventory((prev) => ({ ...prev, email: e.target.value }))}
                        />
                    )}
                </div>

                <div className="flex space-x-4 mt-6">
                    {isEdit ? (
                        <button
                            className="px-4 py-2 bg-green-500 text-white font-medium rounded-md transition duration-300 hover:bg-green-600"
                            onClick={updateInventory}
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md transition duration-300 hover:bg-blue-600"
                            onClick={() => setIsEdit(!isEdit)}
                        >
                            Edit
                        </button>
                    )}
                    <button
                        className="px-4 py-2 bg-red-500 text-white font-medium rounded-md transition duration-300 hover:bg-red-600"
                        onClick={deleteInventory}
                    >
                        Delete
                    </button>
                </div>
            </div>
        )
    );
}

export default Inventory;
