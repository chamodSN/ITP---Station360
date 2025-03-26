import  express,{Router} from 'express'
import {addExpence, displayAllExpence, displaySingleExpence,deleteSingleExpence,updateExpence,loginAdmin} from '../Controllers/adminController.js'
import authAdmin from '../middleware/authAdmin.js'


const adminRoute = express.Router()

adminRoute.post('/add-expence',  addExpence)
adminRoute.get('/all-expence', displayAllExpence)
adminRoute.get('/expence/:id', displaySingleExpence)
adminRoute.delete('/expence/:id', deleteSingleExpence)
adminRoute.post('/login', loginAdmin)
adminRoute.put('/expence/:id', updateExpence)

export default adminRoute

