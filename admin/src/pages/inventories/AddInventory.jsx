import React, { useState } from 'react'
import axios from 'axios'

const AddInventory = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [supplierName, setsupplierName] = useState('');
    const [email, setEmail] = useState('');
    const [itemType, setItemType] = useState('material');
    const [unitType, setUnitType] = useState('quantity');
    const [forSale, setForSale] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('image', image);
            formData.append('brand', brand);
            formData.append('quantity', quantity);
            formData.append('unitPrice', unitPrice);
            formData.append('expiryDate', expireDate);
            formData.append('supplierName', supplierName);
            formData.append('email', email);
            formData.append('itemType', itemType);
            formData.append('unitType', unitType);
            formData.append('forSale', forSale);

            const { data } = await axios.post('http://localhost:4200/api/admin/inventory/add-inventory', formData);

            if (data.success) {
                console.log("Inventory added successfully");
                console.log(data.message);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to add inventory');
        }
    }

    const handleItemTypeChange = (e) => {
        const type = e.target.value;
        setItemType(type);
        setUnitType(type === 'liquid' ? 'liters' : 'quantity');
    };

    return (
        <form onSubmit={onSubmitHandler} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add Inventory</h2>
            
            <label className="block text-gray-700 font-bold mb-2">Name</label>
            <input 
                type="text" 
                placeholder="Name" 
                required 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                className="w-full p-2 border rounded-lg mb-4"
            />
        
            <p className="text-gray-700 font-bold mb-2">Item Image:</p>
            <input 
                type="file" 
                onChange={(e) => setImage(e.target.files[0])} 
                required 
                className="w-full p-2 border rounded-lg mb-4"
            />
        
            <label className="block text-gray-700 font-bold mb-2">Brand</label>
            <input 
                type="text" 
                placeholder="Brand" 
                required 
                onChange={(e) => setBrand(e.target.value)} 
                value={brand} 
                className="w-full p-2 border rounded-lg mb-4"
            />

            <label className="block text-gray-700 font-bold mb-2">Item Type</label>
            <select
                value={itemType}
                onChange={handleItemTypeChange}
                className="w-full p-2 border rounded-lg mb-4"
                required
            >
                <option value="material">Material</option>
                <option value="liquid">Liquid</option>
            </select>

            <label className="block text-gray-700 font-bold mb-2">Unit Type</label>
            <input 
                type="text" 
                value={unitType}
                readOnly
                className="w-full p-2 border rounded-lg mb-4 bg-gray-100"
            />
        
            <label className="block text-gray-700 font-bold mb-2">Quantity</label>
            <input 
                type="number" 
                placeholder="Quantity" 
                required 
                onChange={(e) => setQuantity(e.target.value)} 
                value={quantity} 
                className="w-full p-2 border rounded-lg mb-4"
            />
        
            <label className="block text-gray-700 font-bold mb-2">Unit Price</label>
            <input 
                type="number" 
                placeholder="Unit Price" 
                required 
                onChange={(e) => setUnitPrice(e.target.value)} 
                value={unitPrice} 
                className="w-full p-2 border rounded-lg mb-4"
            />
        
            <label className="block text-gray-700 font-bold mb-2">Expire Date</label>
            <input 
                type="date" 
                required 
                onChange={(e) => setExpireDate(e.target.value)} 
                value={expireDate} 
                className="w-full p-2 border rounded-lg mb-4"
            />
        
            <label className="block text-gray-700 font-bold mb-2">Supplier Name</label>
            <input 
                type="text" 
                placeholder="Supplier Name" 
                required 
                onChange={(e) => setsupplierName(e.target.value)} 
                value={supplierName} 
                className="w-full p-2 border rounded-lg mb-4"
            />

            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input 
                type="email" 
                placeholder="Email" 
                required 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                className="w-full p-2 border rounded-lg mb-4"
            />

            <div className="flex items-center mb-4">
                <input 
                    type="checkbox" 
                    id="forSale" 
                    checked={forSale}
                    onChange={(e) => setForSale(e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="forSale" className="text-gray-700 font-bold">Available for Sale</label>
            </div>

            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
                Add Inventory
            </button>
        </form>
    );
};

export default AddInventory;
