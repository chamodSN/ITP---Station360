import express,{Router} from 'express'
import {addSchedule,displayAllShedules,displayShedule,updateShedule,deleteShedule} from '../Controllers/adminController.js'


const adminRoute= express.Router()

adminRoute.post('/add-shedule', addSchedule)
adminRoute.get('/shedules',displayAllShedules)
adminRoute.get('/displayShedule/:id', displayShedule)
adminRoute.post('/updateShedule/:id', updateShedule)
adminRoute.delete('/deleteShedule/:id', deleteShedule)


export default adminRoute