import mongoose from 'mongoose'

const inventorySchema = new mongoose.Schema({
    name: {type:String, required: true},
    image: {type:String, required: true},
    brand: {type:String, required: true},
    quantity: {type:Number, required: true},
    unitPrice: {type:Number, required: true},
    expiryDate: {type:String, required: true},
    supplierName: {type:String, default: "Not Given"},
    email: {type:String, required: true},
    
})

const inventoryModel = mongoose.models.Inventory || mongoose.model('Inventory',inventorySchema)

export default inventoryModel