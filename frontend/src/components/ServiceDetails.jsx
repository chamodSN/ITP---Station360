import { AppContext } from '../context/AppContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RelatedServices from './RelatedServices';
import { FaTag, FaList, FaCheckCircle } from "react-icons/fa";

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
        <div className="container mx-auto p-4">

            <div className="text-3xl font-bold text-gray-800 mb-6">
                <p>{service.serviceName.toUpperCase()}</p>
                <hr className="border-2 border-primary w-20 mt-2" />
            </div>

            <div className="mb-4">
                <div className="text-gray-600">
                    <p>{service.category}</p>
                    <hr className="border-1 border-primary w-20 mt-2" />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-1/3">
                    <img src={service.displayImage} alt={service.serviceName} className="w-full max-w-[350px] rounded-lg shadow-md" />
                </div>

                <div className="w-full sm:w-2/3 p-4 sm:p-8 text-center bg-gray-100">
                    <p className="text-lg font-semibold text-gray-700 flex justify-center items-center gap-2 mb-4">
                        <FaTag className="text-red-700" /> Price:
                    </p>
                    <p className="text-gray-600">Starting From<b> ${service.price}</b></p>
                </div>

                <div className="w-full sm:w-2/3 p-4 sm:p-8 bg-gray-100">
                    <p className="text-lg font-bold text-gray-700 flex items-center gap-2 mb-4">
                        <FaList className="text-gray-700 " /> SPECIFICATIONS:
                    </p>
                    {service.specifications.map((spec, index) => (
                        <p key={index} className="text-gray-600 flex items-center gap-2">
                            <FaCheckCircle className="text-green-500" />
                            <span className="text-gray-800">{spec}</span>
                        </p>
                    ))}
                </div>

            </div>

            <div className="mb-4">
                <p className="text-lg font-semibold text-gray-700">Description:</p>
                <p className="text-gray-600">{service.description}</p>
            </div>





            <RelatedServices serviceId={id} category={service.category} />
        </div >
    )
}

export default ServiceDetails;
