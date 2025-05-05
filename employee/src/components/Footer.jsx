import React from 'react';
import { assets } from '../assets/assets';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="py-10 md:px-10">
            <div className="ml-4 mr-4 mx-auto flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-14 text-sm">

                {/* Left Section - About Service Center */}
                <div>
                    <img className="mb-5 w-40" src={assets.logo} alt="Service Center Logo" />
                    <p className="text-gray-600 leading-6">We provide top-notch automotive services, repairs, and maintenance to keep your vehicle running smoothly.</p>
                    <p className="mt-3 text-gray-600">Visit us for reliable service you can trust.</p>
                </div>

                {/* Center Section - Our Services */}
                <div>
                    <p className="text-xl font-medium mb-5 text-gray-800">OUR SERVICES</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>Vehicle Diagnostics</li>
                        <li>Oil Change & Maintenance</li>
                        <li>Brake & Tire Services</li>
                        <li>Battery Replacement</li>
                        <li>AC Repair & Maintenance</li>
                    </ul>
                </div>

                {/* Right Section - Contact Information */}
                <div>
                    <p className="text-xl font-medium mb-5 text-gray-800">CONTACT US</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li><strong>Phone:</strong> +1-212-456-7890</li>
                        <li><strong>Email:</strong> support@station360.com</li>
                        <li><strong>Location:</strong> 123 Service Road, NY, USA</li>
                        <li><strong>Working Hours:</strong> Mon-Sat: 8 AM - 6 PM</li>
                    </ul>
                </div>

                {/* New Section - Social Media */}
                <div>
                    <p className="text-xl font-medium mb-5 text-gray-800">FOLLOW US</p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-blue-600 hover:text-white transition duration-300">
                            <FaFacebookF size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-blue-400 hover:text-white transition duration-300">
                            <FaTwitter size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-pink-500 hover:text-white transition duration-300">
                            <FaInstagram size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-blue-700 hover:text-white transition duration-300">
                            <FaLinkedinIn size={18} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright & Divider */}
            <div className="mt-10 text-center text-gray-600">
                <hr className="border-gray-300" />
                <p className="py-5 text-sm">&copy; {currentYear} Station360 - All Rights Reserved</p>
            </div>
        </div>
    );
};

export default Footer;
