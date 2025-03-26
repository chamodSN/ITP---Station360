import express, { Router } from 'express'
import {addInventory, lowStock, displayAllInventory, displaySingleItem, deleteSingleItem, updateItem} from '../Controllers/inventoryController.js'
import upload from '../middleware/multer.js'

const inventoryRoute = express.Router()

inventoryRoute.post('/add-inventory', upload.single('image'), addInventory)
inventoryRoute.get('/low-stock',lowStock)
inventoryRoute.get('/all-inventory',displayAllInventory)
inventoryRoute.get('/:id',displaySingleItem)
inventoryRoute.delete('/:id',deleteSingleItem)
inventoryRoute.put('/:id',updateItem)

export default inventoryRoute