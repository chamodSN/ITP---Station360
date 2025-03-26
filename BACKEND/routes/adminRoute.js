import  express,{Router} from 'express'
import {addExpence, displayAllExpence, displaySingleExpence,deleteSingleExpence,updateExpence} from '../Controllers/adminController.js'

const adminRoute = express.Router()

adminRoute.post('/add-expence',  addExpence)
adminRoute.get('/all-expence', displayAllExpence)
adminRoute.get('/expence/:id', displaySingleExpence)
adminRoute.delete('/expence/:id', deleteSingleExpence)
adminRoute.put('/expence/:id', updateExpence)

export default adminRoute