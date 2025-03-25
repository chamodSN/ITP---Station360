import React, { useState } from 'react'
import axios from 'axios';

const AddNotification = () => {

    const [Title, setTitle] = useState('');
    const [Body, setBody] = useState('');


    const onSubmitHandaler = async (e) => {
        e.preventDefault();

        try {

            const formData = {
                Title,
                Body,

            };

            const { data } = await axios.post('http://localhost:4200/api/admin/notification/add-notifications', formData)

            if (data) {
                console.log("Notification added successfully");
            }

            console.log(data)


        } catch (error) {
            console.error(error);

        };

    }

    return (
        <form onSubmit={onSubmitHandaler}>

            <label>Title</label>
            <br></br>
            <input type="text" placeholder="Title" required onChange={(e) => setTitle(e.target.value)} value={Title} />
            <br>
            </br>
            <label>Body</label>
            <br></br>
            <input type="text" placeholder="Body" required onChange={(e) => setBody(e.target.value)} value={Body} />
            <br>
            </br>

            <button type="submit">Submit</button>
        </form>
    )
}


export default AddNotification;