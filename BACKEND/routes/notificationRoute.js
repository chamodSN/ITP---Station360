import express, { Router } from 'express'
import { addNotification, displayAllNotifications, displaySingleNotification, deleteSingleNotification, updateNotification } from '../Controllers/notificationController.js'

const notificationsRoute = express.Router()

notificationsRoute.post('/add-notifications', addNotification)
notificationsRoute.get('/all-notifications', displayAllNotifications)
notificationsRoute.get('/:id', displaySingleNotification)
notificationsRoute.delete('/:id', deleteSingleNotification)
notificationsRoute.put('/:id', updateNotification)

export default notificationsRoute 