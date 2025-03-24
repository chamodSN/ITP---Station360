import { AppContext } from '../context/AppContext';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AllServices = () => {

    const { services } = useContext(AppContext);
    const navigate = useNavigate();

    return services && (
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

export default AllServices