import { AppContext } from '../context/AppContext';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AllServices = () => {

    const { category } = useParams();
    console.log(category);
    const [filterServices, setFilterServices] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const { services } = useContext(AppContext);
    console.log(services);

    const navigate = useNavigate();

    const applyFilter = () => {
        if (category) {
            setFilterServices(services.filter(service => service.category === category));

        } else {
            setFilterServices(services);
        }
    };

    useEffect(() => {
        applyFilter();
    }, [services, category]);

    return services && (
        <>
            <div>
                <div>
                    <p className='text-gray-600'>Browse through the service categories.</p>

                    <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

                        <div className='flex flex-col gap-4 text-sm text-gray-600'>
                            <p
                                onClick={() => category === 'General Maintenance & Inspection' ? navigate('/services') : navigate('/services/General Maintenance & Inspection')}
                                className={`'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer'
            ${category === "General Maintenance & Inspection" ? "bg-indigo-100 text-black" : ""}`}>
                                General Maintenance & Inspection
                            </p>
                            <p
                                onClick={() => category === 'Oil Change & Lubrication' ? navigate('/services') : navigate('/services/Oil Change & Lubrication')}
                                className={`'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer'
            ${category === "Oil Change & Lubrication" ? "bg-indigo-100 text-black" : ""}`}>
                                Oil Change & Lubrication
                            </p>
                            <p
                                onClick={() => category === 'Brake Repair & Replacement' ? navigate('/services') : navigate('/services/Brake Repair & Replacement')}
                                className={`'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer'
            ${category === "Brake Repair & Replacement" ? "bg-indigo-100 text-black" : ""}`}>
                                Brake Repair & Replacement
                            </p>
                            <p
                                onClick={() => category === 'Wheel Alignment & Balancing' ? navigate('/services') : navigate('/services/Wheel Alignment & Balancing')}
                                className={`'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer'
            ${category === "Wheel Alignment & Balancing" ? "bg-indigo-100 text-black" : ""}`}>
                                Wheel Alignment & Balancing
                            </p>
                            <p
                                onClick={() => category === 'Vehicle Cleaning & Detailing' ? navigate('/services') : navigate('/services/Vehicle Cleaning & Detailing')}
                                className={`'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer'
            ${category === "Vehicle Cleaning & Detailing" ? "bg-indigo-100 text-black" : ""}`}>
                                Vehicle Cleaning & Detailing
                            </p>
                            <p
                                onClick={() => category === 'Battery & Electrical System Services' ? navigate('/services') : navigate('/services/Battery & Electrical System Services')}
                                className={`'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer'
            ${category === "Battery & Electrical System Services" ? "bg-indigo-100 text-black" : ""}`}>
                                Battery & Electrical System Services
                            </p>
                            <p
                                onClick={() => category === 'Engine Diagnostics & Repair' ? navigate('/services') : navigate('/services/Engine Diagnostics & Repair')}
                                className={`'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer'
            ${category === "Engine Diagnostics & Repair" ? "bg-indigo-100 text-black" : ""}`}>
                                Engine Diagnostics & Repair
                            </p>
                            <p
                                onClick={() => category === 'Transmission Repair & Service' ? navigate('/services') : navigate('/services/Transmission Repair & Service')}
                                className={`'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer'
            ${category === "Transmission Repair & Service" ? "bg-indigo-100 text-black" : ""}`}>
                                Transmission Repair & Service
                            </p>
                            <p
                                onClick={() => category === 'AC & Heating System Services' ? navigate('/services') : navigate('/services/AC & Heating System Services')}
                                className={`'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer'
            ${category === "AC & Heating System Services" ? "bg-indigo-100 text-black" : ""}`}>
                                AC & Heating System Services
                            </p>
                            <p
                                onClick={() => category === 'Body & Paint Services' ? navigate('/services') : navigate('/services/Body & Paint Services')}
                                className={`'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer'
            ${category === "Body & Paint Services" ? "bg-indigo-100 text-black" : ""}`}>
                                Body & Paint Services
                            </p>
                        </div>
                        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                            {
                                filterServices.map((item, index) => (
                                    <div onClick={() => navigate(`/service/${item._id}`)} key={item._id} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer'>
                                        <img className='bg-blue-50' src={item.displayImage} alt={item.serviceName} />
                                        <div className='p-4'>
                                            {
                                                item.available ?
                                                    <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                                        <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                                                        <p>Available</p></div> :
                                                    <div className='flex items-center gap-2 text-sm text-center text-red-500'>
                                                        <p className='w-2 h-2 bg-red-500 rounded-full'></p><p>Not Available</p></div>
                                            }

                                            <p className='text-gray-900 text-lg font-medium'>{item.serviceName}</p>
                                            <p className='text-gray-600 text-sm'>{item.category}</p>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllServices
