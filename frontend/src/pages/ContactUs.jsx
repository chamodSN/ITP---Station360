import React from 'react';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_lvw9tdh', 'template_1gmf4ww', e.target, 'n8WEHzkXsUsu_kN1U')
            .then((result) => {
                console.log("Email sent successfully!", result.text);
                alert("Your message has been sent!");
            })
            .catch((error) => {
                console.error("Email failed to send:", error);
                alert("Failed to send the email. Please try again.");
            });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Contact Us</h1>
                <form onSubmit={sendEmail} className="space-y-4">
                    <div>
                        <label htmlFor="emailFrom" className="block text-gray-600 font-medium">Your Email:</label>
                        <input 
                            type="email" 
                            name="email_from" 
                            id="emailFrom" 
                            required 
                            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-gray-600 font-medium">Message:</label>
                        <textarea 
                            name="message" 
                            id="message" 
                            required 
                            className="w-full p-2 border border-gray-300 rounded mt-1 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactUs;
