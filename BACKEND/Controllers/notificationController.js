import pushNotificationModel from '../models/notificationsModel.js';

const addNotification = async (req, res) => {
    try {
        const { Title, Body, targetAudience, priority } = req.body

        if (!Title || !Body || !targetAudience || !priority) {
            return res.json({ success: false, message: "All fields are required." });
        }

        if (!['employees', 'users', 'all'].includes(targetAudience)) {
            return res.json({ success: false, message: "Invalid target audience. Must be 'employees', 'users', or 'all'." });
        }

        if (!['high', 'medium', 'low'].includes(priority)) {
            return res.json({ success: false, message: "Invalid priority. Must be 'high', 'medium', or 'low'." });
        }

        const notification = new pushNotificationModel({
            Title,
            Body,
            targetAudience,
            priority
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
        const { audience, priority } = req.query;
        let query = {};

        if (audience && ['employees', 'users', 'all'].includes(audience)) {
            query.targetAudience = audience;
        }

        if (priority && ['high', 'medium', 'low'].includes(priority)) {
            query.priority = priority;
        }

        const notifications = await pushNotificationModel.find(query).sort({ createdAt: -1 });
        return res.json({ success: true, notifications })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

const getNotificationsByAudience = async (req, res) => {
    try {
        const { audience } = req.params;

        if (!['employees', 'users', 'all'].includes(audience)) {
            return res.json({ success: false, message: "Invalid audience type. Must be 'employees', 'users', or 'all'." });
        }

        const notifications = await pushNotificationModel.find({
            $or: [
                { targetAudience: audience },
                { targetAudience: 'all' }
            ]
        }).sort({ createdAt: -1 });

        return res.json({ success: true, notifications });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal server error" });
    }
};

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

        const { Title, Body, targetAudience, priority } = req.body;

        if (!Title || !Body || !targetAudience || !priority) {
            return res.json({ success: false, message: "All fields are required." });
        }

        if (!['employees', 'users', 'all'].includes(targetAudience)) {
            return res.json({ success: false, message: "Invalid target audience. Must be 'employees', 'users', or 'all'." });
        }

        if (!['high', 'medium', 'low'].includes(priority)) {
            return res.json({ success: false, message: "Invalid priority. Must be 'high', 'medium', or 'low'." });
        }

        const updateData = {
            Title,
            Body,
            targetAudience,
            priority
        };

        await pushNotificationModel.findByIdAndUpdate(notificationId, { $set: updateData })

        return res.json({ success: true, message: "Notification updated successfully" });

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

const deleteOldNotifications = async () => {
    try {
        const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

        const result = await Notification.deleteMany({
            createdAt: { $lt: tenDaysAgo }
        });

        console.log(`${result.deletedCount} old notifications deleted.`);
    } catch (error) {
        console.error('Error deleting old notifications:', error);
    }
};

export {
    addNotification,
    displayAllNotifications,
    displaySingleNotification,
    deleteSingleNotification,
    updateNotification,
    getNotificationsByAudience,
    deleteOldNotifications
}