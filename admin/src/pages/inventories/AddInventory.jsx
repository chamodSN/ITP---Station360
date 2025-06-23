import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

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
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (name.length > 20) {
            newErrors.name = 'Name cannot exceed 20 letters';
        }
        if (supplierName.length > 20) {
            newErrors.supplierName = 'Supplier name cannot exceed 20 letters';
        }
        if (parseFloat(quantity) < 0) {
            newErrors.quantity = 'Quantity cannot be negative';
        }
        if (parseFloat(unitPrice) < 0) {
            newErrors.unitPrice = 'Unit price cannot be negative';
        }
        if (image && !['image/jpeg', 'image/png'].includes(image.type)) {
            newErrors.image = 'Only JPG and PNG files are allowed';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

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
                toast.success("Inventory added successfully");
                // Clear input fields
                setName('');
                setImage('');
                setBrand('');
                setQuantity('');
                setUnitPrice('');
                setExpireDate('');
                setsupplierName('');
                setEmail('');
                setItemType('material');
                setUnitType('quantity');
                setForSale(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to add inventory');
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
                maxLength={20}
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full p-2 border rounded-lg mb-4"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}

            <p className="text-gray-700 font-bold mb-2">Item Image:</p>
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                required
                className="w-full p-2 border rounded-lg mb-4"
            />
            {errors.image && <p className="text-red-500">{errors.image}</p>}

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
                min={0}
                onChange={(e) => setQuantity(e.target.value)}
                value={quantity}
                className="w-full p-2 border rounded-lg mb-4"
            />
            {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}

            <label className="block text-gray-700 font-bold mb-2">Unit Price</label>
            <input
                type="number"
                placeholder="Unit Price"
                required
                min={0}
                onChange={(e) => setUnitPrice(e.target.value)}
                value={unitPrice}
                className="w-full p-2 border rounded-lg mb-4"
            />
            {errors.unitPrice && <p className="text-red-500">{errors.unitPrice}</p>}

            <label className="block text-gray-700 font-bold mb-2">Expire Date</label>
            <input
                type="date"
                onChange={(e) => setExpireDate(e.target.value)}
                value={expireDate}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded-lg mb-4"
            />

            <label className="block text-gray-700 font-bold mb-2">Supplier Name</label>
            <input
                type="text"
                placeholder="Supplier Name"
                required
                maxLength={20}
                onChange={(e) => setsupplierName(e.target.value)}
                value={supplierName}
                className="w-full p-2 border rounded-lg mb-4"
            />
            {errors.supplierName && <p className="text-red-500">{errors.supplierName}</p>}

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
