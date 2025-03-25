import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'

const Shedule = () => {

    const { id } = useParams();
    const [shedule, setShedule] = useState(null);
    const [isEdit, setIsEdit] = useState(false);


    const fetchShedule = async () => {
        try {
            const { data } = await axios.get(`http://localhost:4200/api/admin/shedule/displayShedule/${id}`);
            if (data.success) {
                setShedule(data.Shedule);
            }

        } catch (error) {
            console.error("Error fetching shedule details", error);
        }
    };


    const deleteShedule = async () => {
        if (window.confirm("Are you sure you want to delete this shedule?")) {
            try {
                await axios.delete(`http://localhost:4200/api/admin/shedule/deleteShedule/${id}`);
            } catch (error) {
                console.error("Error deleting shedule:", error);
            }
        }
    };

    const updateShedule = async () => {
        try {
            const updatedShedule = {
                employeeName: shedule.employeeName,
                date: shedule.date,
                time: shedule.time,
                taskType: shedule.taskType,
                taskDetails: shedule.taskDetails,
                taskStatus: shedule.taskStatus,
            };

            const { data } = await axios.put(`http://localhost:4200/api/admin/shedule/updateShedule/${id}`, updatedShedule);
            console.log("Response data:", data);
            if (data.success) {
                await fetchShedule();

                setIsEdit(false);
            } else {
                console.error(data.message);
            }

        } catch (error) {
            console.error("Error updating shedule:", error);
        }
    };


    useEffect(() => {
        fetchShedule();
    }, [id]);


return shedule && (
    <div>
        <div>{!isEdit ? <h1>{shedule.employeeName}</h1> :
            <input type="text" value={shedule.employeeName} onChange={(e) => setShedule(prev => ({ ...prev, employeeName: e.target.value }))} />
        }</div>



        <p>Date:</p>
        {!isEdit
            ? <p>{shedule.date}</p> :
            <input type="date" value={shedule.date ? new Date(shedule.date).toISOString().split('T')[0] : ''} onChange={(e) => setShedule(prev => ({ ...prev, date: e.target.value }))} />
        }
        <br />


        <p>Time:</p>
        {!isEdit ? (
            <p>{shedule.time}</p>
        ) : (
            <input type="time" value={shedule.time} onChange={(e) => setShedule(prev => ({ ...prev, time: e.target.value }))} />
        )}
        <br />

        <p>Task Type:</p>
        {!isEdit ? (
            <p>{shedule.taskType}</p>
        ) : (
            <input type="text" value={shedule.taskType} onChange={(e) => setShedule(prev => ({ ...prev, taskType: e.target.value }))} />
        )}
        <br />

        <p>Task Details:</p>
        {!isEdit ? (
            <p>{shedule.taskDetails}</p>
        ) : (
            <textarea value={shedule.taskDetails} onChange={(e) => setShedule(prev => ({ ...prev, taskDetails: e.target.value }))}></textarea>
        )}
        <br />

        <p>Task Status:</p>
        {!isEdit ? (
            <p>{shedule.taskStatus}</p>
        ) : (
            <select value={shedule.taskStatus} onChange={(e) => setShedule(prev => ({ ...prev, taskStatus: e.target.value }))}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
        )}
        <br />


        {isEdit ? (
            <button onClick={() => updateShedule()}>Save</button>
        ) : (
            <button onClick={() => setIsEdit(!isEdit)}>Edit</button>
        )}
        <br />
        <br />
        <button onClick={() => deleteShedule()}>Delete</button>
    </div >
)
}

export default Shedule;