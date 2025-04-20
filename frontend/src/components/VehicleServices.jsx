import { FaTools, FaOilCan, FaCarCrash, FaBalanceScale, FaBroom, FaCarBattery, FaCogs, FaExchangeAlt, FaSnowflake, FaSprayCan } from "react-icons/fa";

const services = [
    { name: "General Maintenance & Inspection", icon: <FaTools /> },
    { name: "Oil Change & Lubrication", icon: <FaOilCan /> },
    { name: "Brake Repair & Replacement", icon: <FaCarCrash /> },
    { name: "Wheel Alignment & Balancing", icon: <FaBalanceScale /> },
    { name: "Vehicle Cleaning & Detailing", icon: <FaBroom /> },
    { name: "Battery & Electrical System Services", icon: <FaCarBattery /> },
    { name: "Engine Diagnostics & Repair", icon: <FaCogs /> },
    { name: "Transmission Repair & Service", icon: <FaExchangeAlt /> },
    { name: "AC & Heating System Services", icon: <FaSnowflake /> },
    { name: "Body & Paint Services", icon: <FaSprayCan /> },
];

export default function VehicleServices() {
    return (
        <div className=" text-white py-16 px-6">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Our Vehicle Services
                </h2>
                <p className="text-lg text-gray-900 mb-8">
                    We offer a variety of vehicle services to keep your car running smoothly and efficiently.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="group bg-gray-800 rounded-2xl p-6 shadow-lg text-center transition-all duration-300 hover:bg-blue-600"
                    >
                        <div className="text-5xl text-yellow-400 mx-auto mb-4 group-hover:text-white">
                            {service.icon}
                        </div>
                        <h3 className="text-2xl font-semibold text-white">{service.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}
