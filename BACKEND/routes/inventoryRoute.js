import express, { Router } from 'express'
import { addInventory, lowStock, expiringItems, stockOut, displayAllInventory, displaySingleItem, deleteSingleItem, updateItem, orderLowStock, getOrderedItems, restock } from '../Controllers/inventoryController.js'
import upload from '../middleware/multer.js'

const inventoryRoute = express.Router()

inventoryRoute.post('/add-inventory', upload.single('image'), addInventory)
inventoryRoute.get('/low-stock', lowStock)
inventoryRoute.get('/expiring-items', expiringItems)
inventoryRoute.post('/stock-out', stockOut)
inventoryRoute.post('/restock', restock)
inventoryRoute.post('/order-low-stock', orderLowStock)
inventoryRoute.get('/all-inventory', displayAllInventory)
inventoryRoute.get('/ordered-items', getOrderedItems)
inventoryRoute.get('/:id', displaySingleItem)
inventoryRoute.delete('/:id', deleteSingleItem)
inventoryRoute.put('/:id', updateItem)

export default inventoryRoute