import express, { Router } from 'express'
import {addInventory, lowStock, displayAllInventory, displaySingleItem, deleteSingleItem, updateItem} from '../Controllers/adminController.js'
import upload from '../middleware/multer.js'

const adminRoute = express.Router()

adminRoute.post('/add-inventory', upload.single('image'), addInventory)
adminRoute.get('/low-stock',lowStock)
adminRoute.get('/all-inventory',displayAllInventory)
adminRoute.get('/inventory/:id',displaySingleItem)
adminRoute.delete('/inventory/:id',deleteSingleItem)
adminRoute.put('/inventory/:id',updateItem)

export default adminRoute