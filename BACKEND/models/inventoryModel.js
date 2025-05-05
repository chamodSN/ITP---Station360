import mongoose from 'mongoose'

const stockEntrySchema = new mongoose.Schema({
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    dateAdded: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true }
});

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    supplierName: { type: String, default: "Not Given" },
    email: { type: String, required: true },
    itemType: { type: String, enum: ['liquid', 'material'], required: true },
    unitType: { type: String, enum: ['liters', 'quantity'], required: true },
    forSale: { type: Boolean, default: false },
    stockEntries: [stockEntrySchema]
});

const inventoryModel = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);

export default inventoryModel;