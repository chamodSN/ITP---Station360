import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllServices = () => {

    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    const getAllServices = async () => {
        try {

            //{} not sending any data in the body
            const { data } = await axios.get('http://localhost:4200/api/admin/service/');
            //console.log(data)

            if (data.success) {
                setServices(data.allServices)
            } else {
                //toast notifications
            }

        } catch (error) {
            //toast notifications
        }
    }

    useEffect(() => {
        getAllServices();
    }, []);

    return (
        <div>
            <h1>All Services</h1>
            <div>
                {services.map((item, index) => (
                    <div key={item._id} onClick={() => navigate(`/service/${item._id}`)}>
                        <img src={item.displayImage} alt={item.serviceName} />
                        <h2>{item.serviceName}</h2>
                        <p>{item.category}</p>
                        <p>{item.price}</p>
                        <p>{item.available}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllServices;
