import pushNotificationModel from '../models/pushNotificationModel.js';

const addNotification = async (req, res) => {
    try {
        const { Title, Body } = req.body

        if (!Title || !Body || !Date || !Time) {
            return res.json({ success: false, message: "All fields are required." });
        }


        const notification = new pushNotificationModel({
            Title,
            Body,
            Date: new Date().toISOString().split('T')[0],
            Time: new Date().toISOString().split('T')[1]
        })

        await notification.save()

        return res.json({ success: true, message: "Notification added successfully" });

    } catch (error) {

        console.log(error)
        return res.json({ success: false, message: "Internal server error" })
    }
}

const displayAllNotifications = async (req, res) => {
    try {

        const notifications = await pushNotificationModel.find()
        return res.json({ success: true, notifications })

    } catch (error) {

        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

const displaySingleNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;

        const notification = await pushNotificationModel.findById(notificationId)

        return res.json({ success: true, notification })

    } catch (error) {

        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

const deleteSingleNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;

        await pushNotificationModel.findByIdAndDelete(notificationId)

        return res.json({ success: true, message: "Notification deleted successfully" });

    } catch (error) {

        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

const updateNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;

        const { Title, Body } = req.body;

        if (!Title || !Body) {
            return res.json({ success: false, message: "All fields are required." });
        }

        await pushNotificationModel.findByIdAndUpdate(notificationId, { $set: { Title, Body } })

        return res.json({ success: true, message: "Notification updated successfully" });

    } catch (error) {

        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export { addNotification, displayAllNotifications, displaySingleNotification, deleteSingleNotification, updateNotification }