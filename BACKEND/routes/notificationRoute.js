import  express,{Router} from 'express'
import { addNotification, displayAllNotifications, displaySingleNotification, deleteSingleNotification, updateNotification} from '../Controllers/adminController.js'

const notificationsRoute = express.Router()

notificationsRoute.post('/add-notifications',  addNotification)
notificationsRoute.get('/all-notifications', displayAllNotifications)
notificationsRoute.get('/:id', displaySingleNotification)
notificationsRoute.delete('/:id', deleteSingleNotification)
notificationsRoute.post('/:id', updateNotification)

export default notificationsRoute 