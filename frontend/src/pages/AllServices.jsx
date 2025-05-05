import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AllServices = () => {
    const navigate = useNavigate();
    const { services, servicesLoading, getAllServices } = useAppContext();

    useEffect(() => {
        getAllServices();
    }, []);

    if (servicesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
            <div className="container mx-auto px-4">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold mb-2 text-center text-gray-800"
                >
                    Our Vehicle Services
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center text-gray-600 mb-12"
                >
                    Professional automotive care for your vehicle
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                            onClick={() => navigate(`/service/${service._id}`)}
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={service.displayImage}
                                    alt={service.serviceName}
                                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h2 className="text-2xl font-bold text-white mb-1">{service.serviceName}</h2>
                                    <p className="text-primary-300 font-semibold text-lg">Rs. {service.price}</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    {service.available ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            <span className="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
                                            Available
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                            <span className="w-2 h-2 mr-2 bg-red-500 rounded-full"></span>
                                            Not Available
                                        </span>
                                    )}
                                    <button className="text-primary hover:text-primary-600 font-medium transition-colors">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllServices;