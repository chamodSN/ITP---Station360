import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Services = () => {
    const { services, setLoading, getAllServices } = useContext(AdminContext);
    const navigate = useNavigate();

    useEffect(() => {
        getAllServices();
    }, []);

    if (setLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">All Services</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                            onClick={() => navigate(`/admin/bookings/${service._id}`)}
                        >
                            <div className="relative h-48">
                                <img
                                    src={service.displayImage}
                                    alt={service.serviceName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {service.serviceName}
                                </h2>
                                <p className="text-gray-600 mb-4">{service.category}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-primary">
                                        ${service.price}
                                    </span>
                                    <button className="text-sm text-primary hover:text-primary-dark transition-colors">
                                        View Bookings →
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

export default Services; 