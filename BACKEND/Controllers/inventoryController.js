import validator from 'validator';
import {v2 as cloudinary } from 'cloudinary'
import inventoryModel from '../models/inventoryModel.js'

const addInventory = async (req, res) => {
    try{
        const {name, image, brand, quantity, unitPrice, expiryDate, supplierName, email} = req.body

        const imageFile = req.file

        if(!name || !brand || !quantity || !unitPrice || !expiryDate || !supplierName || !email || !imageFile){
            return res.json({sucess: false, message: " All fields are required."})
        }

        if(!validator.isEmail(email)){
            return res.json({sucess: false, message: " Invalid Email."})
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
        const imageUrl = imageUpload.secure_url;

        const inventoryData = {
            name, 
            image:imageUrl, 
            brand, 
            quantity, 
            unitPrice, 
            expiryDate, 
            supplierName, 
            email
            
        }

        const newInventory = new inventoryModel(inventoryData)
        await newInventory.save()

        return res.json({sucess: true, message: " Item added successfully."})
            

    }catch (error){
        return res.json({ sucess: false, message: error.message })
    }
}

const lowStock = async (req, res) => {
    try{

        const lowStockItems = await inventoryModel.find({quantity:{$lt: 15}})

        return res.json({success: true, lowStockItems})

    }catch (error){
        return res.json({ sucess: false, message: error.message })
    }
}

const displayAllInventory = async (req, res) => {
    try{

        const AllInventory = await inventoryModel.find()

        return res.json({success: true, AllInventory})

    }catch (error){
        return res.json({ sucess: false, message: error.message })
    }
}

const displaySingleItem = async (req, res) => {
    try{

        const itemId = req.params.id;

        const Item = await inventoryModel.findById(itemId)

        return res.json({success: true, Item})

    }catch (error){
        return res.json({ sucess: false, message: error.message })
    }
}

const deleteSingleItem = async (req, res) => {
    try{

        const itemId = req.params.id;

        await inventoryModel.findByIdAndDelete(itemId)

        return res.json({success: true, message: " Item deleted successfully."})

    }catch (error){
        return res.json({ sucess: false, message: error.message })
    }
}

const updateItem = async (req, res) => {
    try{

        const itemId = req.params.id;

        const {name, brand, quantity, unitPrice, expiryDate, supplierName, email} = req.body

        if(!name || !brand || !quantity || !unitPrice || !expiryDate || !supplierName || !email ){
            return res.json({sucess: false, message: " All fields are required."})
        }

        if(!validator.isEmail(email)){
            return res.json({sucess: false, message: " Invalid Email."})
        }

        await inventoryModel.findByIdAndUpdate(itemId, {$set: { name, brand, quantity, unitPrice, expiryDate, supplierName, email }})

        return res.json({success: true, message: " Item updated successfully."})

    }catch (error){
        return res.json({ sucess: false, message: error.message })
    }
}

export {addInventory, lowStock, displayAllInventory, displaySingleItem, deleteSingleItem, updateItem}