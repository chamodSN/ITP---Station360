import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

function Notification() {

    const { id } = useParams();
    const [Notification, setNotification] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const fetchNotification = async () => {

        try {
            const { data } = await axios.get(`http://localhost:4200/api/admin/Notification/${id}`);
            if (data.success) {
                setNotification(data.notification);
            }

        } catch (error) {
            console.error("Error", error)
        }
    };

    const updateNotification = async () => {
        try {
            const { data } = await axios.put(`http://localhost:4200/api/admin/notification/${id}`, Notification);
            if (data.success) {
                await fetchNotification();
                setIsEdit(false);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error", error)
        }
    }

    const deleteNotifications = async () => {
        if (window.confirm("Are you sure you want to delete this notification?")) {
            try {
                await axios.delete(`http://localhost:4200/api/admin/notification/${id}`);
            } catch (error) {
                console.error("Error", error)
            }
        }
    }

    useEffect(() => {
        fetchNotification();
    }, [id]);



    return Notification && (
        <div>{!isEdit ?
            <h2>Title: {Notification.Title}</h2> :
            <input type="text" value={Notification.Title} onChange={(e) => setNotification(prev => ({ ...prev, Title: e.target.value }))} />
        }
            <br></br><br></br><br></br>
            {!isEdit ?
                <h2>Title: {Notification.Body}</h2> :
                <input type="text" value={Notification.Body} onChange={(e) => setNotification(prev => ({ ...prev, Body: e.target.value }))} />
            }
            <p>Date: {Notification.Date}</p>
            <p>Time: {Notification.Time}</p>

            {isEdit ? (
                <button onClick={() => updateNotification()}>Save</button>
            ) : (
                <button onClick={() => setIsEdit(!isEdit)}>Edit</button>
            )}
            <br />
            <br />
            <button onClick={() => deleteNotifications()}>Delete</button>
        </div>




    )
}

export default Notification