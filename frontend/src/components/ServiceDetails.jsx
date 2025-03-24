import { AppContext } from '../context/AppContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ServiceDetails = ({ setIsBookable }) => {

    const { id } = useParams();
    const { services } = useContext(AppContext);
    const [service, setService] = useState(null);

    const fetchServiceInfo = async () => {
        const serviceInfo = services.find(singleService => singleService._id === id);
        setService(serviceInfo);

        if (serviceInfo) {
            setIsBookable(serviceInfo.isBookable);
        }
    };

    useEffect(() => {
        fetchServiceInfo();
    }, [services, id]);

    useEffect(() => {
        if (service) {
            setIsBookable(service.isBookable);
        }
    }, [service, setIsBookable, id]);

    return service && (
        <div>
            <div><h1>{service.serviceName}</h1></div>

            <p>Category:</p>

            <p>{service.category}</p>

            <br />
            <p>Price:</p>
            <p>{service.price}</p>
            <br />
            <p>Available:</p>
            <p>{service.available ? "Yes" : "No"}</p>
            <br />
            <p>Bookable:</p>
            <p>{service.isBookable ? "Yes" : "No"}</p>
            <br />
            <p>Description:</p>
            <p>{service.description}</p>
            <br />
            <p>Specifications:</p>
            <p>{service.specifications}</p>
            <br />
            <div>

                <p>Display Image:</p>
                <img src={service.displayImage} alt={service.serviceName} style={{ width: "300px" }} />
            </div>
        </div >
    )
}

export default ServiceDetails;