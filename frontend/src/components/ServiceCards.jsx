import assets from '../assets/assets'
import { useState } from 'react'
const ServiceCards = () => {

    const [expanded, setExpanded] = useState(null);


    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="flex gap-4 w-4/5">
                {assets.services.map(service => (
                    <div
                        key={service.id}
                        className={`service-card ${expanded === service.id ? 'w-2/5' : 'w-1/5'} bg-blue-500 text-white p-4 rounded-lg cursor-pointer transition-all duration-300`}
                        onClick={() => setExpanded(expanded === service.id ? null : service.id)}
                    >
                        <img src={service.img} alt={service.title} className="w-full h-32 object-cover mb-2" />
                        <h3 className="text-lg font-bold">{service.title}</h3>
                        {expanded === service.id && <p className="mt-2">{service.description}</p>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ServiceCards