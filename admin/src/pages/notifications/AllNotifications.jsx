import axios from "axios"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const AllNotification = () => {

  const [Notification, setNotification] = useState([]);
  const navigate = useNavigate();

  const getAllNotification = async () => {

    try {
      const { data } = await axios.get('http://localhost:4200/api/admin/notification/all-notifications');

      console.log(data)

      if (data.success) {
        setNotification(data.notifications)
      } else {
        console.log("error fetching data")
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllNotification()
  }, [])

  return Notification && (
    <div>
      <h1>AllNotification</h1>
      {Notification.map((item, index) => (
        <div key={index} onClick={() => navigate(`/notification/${item._id}`)}>
          <h2>{item.Title}</h2>
          <p>{item.Body}</p>
        </div>
      ))}

    </div>

  )
}

export default AllNotification