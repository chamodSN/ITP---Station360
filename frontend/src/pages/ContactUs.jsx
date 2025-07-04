import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { assets } from '../assets/assets'


const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Refs for scroll animations
    const cardsRef = useRef(null);
    const mapRef = useRef(null);
    const formRef = useRef(null);

    // Check if elements are in view
    const cardsInView = useInView(cardsRef, { once: true });
    const mapInView = useInView(mapRef, { once: true });
    const formInView = useInView(formRef, { once: true });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { subject, message, email } = formData;

        if (subject.length > 20) {
            toast.error("Subject should not exceed 20 characters.");
            return;
        }

        if (message.length > 100) {
            toast.error("Message should not exceed 100 characters.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        emailjs.sendForm('service_lvw9tdh', 'template_1gmf4ww', e.target, 'n8WEHzkXsUsu_kN1U')
            .then((result) => {
                console.log("Email sent successfully!", result.text);
                toast.success("Your message has been sent!");
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            })
            .catch((error) => {
                console.error("Email failed to send:", error);
                toast.error("Failed to send the email. Please try again.");
            });
    };


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Background Image with Animation */}
            <div className="relative h-[400px] overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${assets.contactUs})`
                    }}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.h1
                                className="text-4xl md:text-6xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                Contact Station360
                            </motion.h1>
                            <motion.p
                                className="text-white text-lg md:text-xl max-w-2xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                Get in touch with us for all your vehicle service needs. Whether you need
                                maintenance, repairs, or expert advice, our team at Station360 is here to help
                                keep your vehicle running smoothly.
                            </motion.p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Contact Information Cards */}
                <motion.div
                    ref={cardsRef}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
                    initial={{ opacity: 0, y: 50 }}
                    animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8, staggerChildren: 0.2 }}
                >
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-primary/10 p-4 rounded-full mb-4">
                                <FaPhone className="text-primary text-2xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Phone</h3>
                            <p className="text-gray-600">+1 234 567 890</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-primary/10 p-4 rounded-full mb-4">
                                <FaEnvelope className="text-primary text-2xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
                            <p className="text-gray-600">info@station360.com</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-primary/10 p-4 rounded-full mb-4">
                                <FaMapMarkerAlt className="text-primary text-2xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
                            <p className="text-gray-600">123 Farm Street, Agriculture City, 12345</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-primary/10 p-4 rounded-full mb-4">
                                <FaClock className="text-primary text-2xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Working Hours</h3>
                            <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Map */}
                    <motion.div
                        ref={mapRef}
                        className="bg-white p-8 rounded-lg shadow-lg"
                        initial={{ opacity: 0, x: -50 }}
                        animate={mapInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Location</h2>
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31687.08218876141!2d79.96543225!3d6.90432065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae256d59601df81%3A0x31a1dd96e8d49ba!2sMalabe!5e0!3m2!1sen!2slk!4v1746538327842!5m2!1sen!2slk"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        ref={formRef}
                        className="bg-white p-8 rounded-lg shadow-lg"
                        initial={{ opacity: 0, x: 50 }}
                        animate={formInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary min-h-[48px]"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary min-h-[48px]"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary min-h-[48px]"
                                    maxLength={20}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary min-h-[100px]"
                                    rows={4}
                                    maxLength={100}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition"
                            >
                                Send Message
                            </button>
                        </form>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;