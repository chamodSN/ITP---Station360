import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary'
import inventoryModel from '../models/inventoryModel.js'
import { sendLowStockOrderEmail } from '../nodemailer/emails.js';
import Order from '../models/orderModel.js';
import { generateInventoryStockPDF } from '../pdf/ReportGenerator.js';

const LOW_STOCK_THRESHOLD = 15;

const addInventory = async (req, res) => {
    try {
        const { name, image, brand, quantity, unitPrice, expiryDate, supplierName, email, itemType, unitType, forSale } = req.body

        const imageFile = req.file

        if (!name || !brand || !quantity || !unitPrice || !expiryDate || !supplierName || !email || !imageFile || !itemType || !unitType) {
            return res.json({ sucess: false, message: " All fields are required." })
        }

        if (!validator.isEmail(email)) {
            return res.json({ sucess: false, message: " Invalid Email." })
        }

        if ((itemType === 'liquid' && unitType !== 'liters') || (itemType === 'material' && unitType !== 'quantity')) {
            return res.json({ success: false, message: "Invalid unit type for the selected item type." });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url;

        const stockEntry = {
            quantity: Number(quantity),
            unitPrice: Number(unitPrice),
            dateAdded: new Date(),
            expiryDate: new Date(expiryDate)
        };

        const inventoryData = {
            name,
            image: imageUrl,
            brand,
            quantity: Number(quantity),
            unitPrice: Number(unitPrice),
            expiryDate: new Date(expiryDate),
            supplierName,
            email,
            itemType,
            unitType,
            forSale: forSale === 'true',
            stockEntries: [stockEntry]
        }

        const newInventory = new inventoryModel(inventoryData)
        await newInventory.save()

        return res.json({ sucess: true, message: " Item added successfully." })


    } catch (error) {
        return res.json({ sucess: false, message: error.message })
    }
}

const lowStock = async (req, res) => {
    try {
        // Get items that are low in stock (for sale items below threshold)
        const lowStockItems = await inventoryModel.find({
            quantity: { $lt: LOW_STOCK_THRESHOLD },
            forSale: true
        });

        // Get all pending orders
        const pendingOrders = await Order.find({ status: 'pending' });
        const orderedItemIds = pendingOrders.map(order => order.item.toString());

        // Filter out items that have pending orders
        const filteredLowStockItems = lowStockItems.filter(item =>
            !orderedItemIds.includes(item._id.toString())
        );

        return res.json({
            success: true,
            lowStockItems: filteredLowStockItems,
            lowStockCount: filteredLowStockItems.length
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

const expiringItems = async (req, res) => {
    try {
        // Get items that are expiring within a week
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

        // Find items where either the main expiryDate or any stock entry is expiring within a week
        const expiringItems = await inventoryModel.find({
            $or: [
                { expiryDate: { $lte: oneWeekFromNow } },
                { 'stockEntries.expiryDate': { $lte: oneWeekFromNow } }
            ]
        });

        // Filter out items that have no quantity
        const validExpiringItems = expiringItems.filter(item => item.quantity > 0);

        return res.json({
            success: true,
            expiringItems: validExpiringItems,
            expiringCount: validExpiringItems.length
        });
    } catch (error) {
        console.error('Error in expiringItems:', error);
        return res.json({ success: false, message: error.message });
    }
}

const stockOut = async (req, res) => {
    try {
        const { id, quantity } = req.body;
        const item = await inventoryModel.findById(id);

        if (!item) {
            return res.json({ success: false, message: "Item not found." });
        }

        // Filter out expired entries and sort by expiry date (earliest first)
        let validStockEntries = item.stockEntries
            .filter(entry => new Date(entry.expiryDate) > new Date())
            .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

        const totalAvailable = validStockEntries.reduce((sum, entry) => sum + entry.quantity, 0);
        if (totalAvailable < quantity) {
            return res.json({ success: false, message: "Insufficient unexpired stock." });
        }

        let remainingQuantity = Number(quantity);
        const updatedStockEntries = [];

        for (let entry of validStockEntries) {
            if (remainingQuantity === 0) {
                updatedStockEntries.push(entry);
                continue;
            }

            if (entry.quantity <= remainingQuantity) {
                remainingQuantity -= entry.quantity;
                // Skip adding this entry (used up)
            } else {
                // Partial use
                entry.quantity -= remainingQuantity;
                updatedStockEntries.push(entry);
                remainingQuantity = 0;
            }
        }

        const newQuantity = updatedStockEntries.reduce((sum, entry) => sum + entry.quantity, 0);

        await inventoryModel.findByIdAndUpdate(id, {
            quantity: newQuantity,
            stockEntries: updatedStockEntries
        });

        return res.json({ success: true, message: "Stock out successful." });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


const displayAllInventory = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { brand: { $regex: search, $options: 'i' } },
                    { supplierName: { $regex: search, $options: 'i' } },
                    { itemType: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const AllInventory = await inventoryModel.find(query);
        return res.json({ success: true, AllInventory });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

const displaySingleItem = async (req, res) => {
    try {

        const itemId = req.params.id;

        const Item = await inventoryModel.findById(itemId)

        return res.json({ success: true, Item })

    } catch (error) {
        return res.json({ sucess: false, message: error.message })
    }
}

const deleteSingleItem = async (req, res) => {
    try {

        const itemId = req.params.id;

        await inventoryModel.findByIdAndDelete(itemId)

        return res.json({ success: true, message: " Item deleted successfully." })

    } catch (error) {
        return res.json({ sucess: false, message: error.message })
    }
}

const updateItem = async (req, res) => {
    try {

        const itemId = req.params.id;

        const { name, brand, quantity, unitPrice, expiryDate, supplierName, email } = req.body

        if (!name || !brand || !quantity || !unitPrice || !expiryDate || !supplierName || !email) {
            return res.json({ sucess: false, message: " All fields are required." })
        }

        if (!validator.isEmail(email)) {
            return res.json({ sucess: false, message: " Invalid Email." })
        }

        await inventoryModel.findByIdAndUpdate(itemId, { $set: { name, brand, quantity, unitPrice, expiryDate, supplierName, email } })

        return res.json({ success: true, message: " Item updated successfully." })

    } catch (error) {
        return res.json({ sucess: false, message: error.message })
    }
}

const orderLowStock = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;

        const item = await inventoryModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        // Create order record
        const order = new Order({
            item: itemId,
            quantity: quantity,
            status: 'pending',
            orderDate: new Date()
        });
        await order.save();

        // Send email to supplier
        const orderDetails = {
            name: item.name,
            brand: item.brand,
            quantity: quantity,
            unitType: item.unitType
        };

        const emailResult = await sendLowStockOrderEmail(item.email, [orderDetails]);
        if (!emailResult.success) {
            return res.status(500).json({ success: false, message: 'Failed to send order email' });
        }

        res.status(200).json({
            success: true,
            message: 'Order placed successfully',
            order: order
        });
    } catch (error) {
        console.error('Error in orderLowStock:', error);
        res.status(500).json({ success: false, message: 'Failed to place order' });
    }
};

const getOrderedItems = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('item')
            .sort({ orderDate: -1 });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching ordered items:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching ordered items'
        });
    }
};

const restock = async (req, res) => {
    try {
        const { id, quantity, unitPrice, expiryDate } = req.body;
        console.log('Received expiryDate:', expiryDate);

        if (!id || !quantity || !unitPrice || !expiryDate) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const item = await inventoryModel.findById(id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Create a new stock entry
        const newStockEntry = {
            quantity: Number(quantity),
            unitPrice: Number(unitPrice),
            dateAdded: new Date(),
            expiryDate: new Date(expiryDate)
        };

        


        // Add the new stock entry to the item's stockEntries array
        item.stockEntries.push(newStockEntry);

        // Update the total quantity
        item.quantity += Number(quantity);

        if (!item.expiryDate) {
            item.expiryDate = new Date(expiryDate);
        }
        

        // Save the updated item
        await item.save();

        return res.json({
            success: true,
            message: 'Restock successful',
            item
        });
    } catch (error) {
        console.error('Error in restock:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to restock item'
        });
    }
};

const generateInventoryStockReport = async (req, res) => {
    try {
        // Fetch all inventory items
        const inventory = await inventoryModel.find();

        if (!inventory.length) {
            return res.status(404).json({
                success: false,
                message: "No inventory items found"
            });
        }

        // Generate PDF
        const pdfBuffer = await generateInventoryStockPDF(inventory);

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=inventory-stock-report.pdf');
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send the PDF buffer
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error generating inventory stock PDF",
            error: error.message
        });
    }
};

export {
    addInventory,
    lowStock,
    expiringItems,
    stockOut,
    displayAllInventory,
    displaySingleItem,
    deleteSingleItem,
    updateItem,
    orderLowStock,
    getOrderedItems,
    restock,
    generateInventoryStockReport
};