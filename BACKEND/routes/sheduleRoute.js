import express,{Router} from 'express'
import {addSchedule,displayAllShedules,displayShedule,updateShedule,deleteShedule} from '../Controllers/sheduleController.js'


const sheduleRoute = express.Router()

sheduleRoute.post('/add-shedule', addSchedule)
sheduleRoute.get('/shedules',displayAllShedules)
sheduleRoute.get('/displayShedule/:id', displayShedule)
sheduleRoute.put('/updateShedule/:id', updateShedule)
sheduleRoute.delete('/deleteShedule/:id', deleteShedule)

export default sheduleRoute