import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/authAdmin';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { login } = useAdminAuthStore();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            await login(email, password);
            toast.success("Login successful");
            navigate('/');
        } catch (error) {
            console.error(error.message);
            toast.error(error?.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-2">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl"
            >
                {/* Left side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-primary flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Station 360</h1>
                    <p className="text-white mb-8">Admin Dashboard</p>

                    <form onSubmit={onSubmitHandler} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white">
                                Email
                            </label>
                            <input
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="mt-1 p-3 w-full rounded-md bg-primary-light border border-white/20 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-white"
                                type="email"
                                required
                                placeholder="admin@station360.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white">
                                Password
                            </label>
                            <input
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type="password"
                                className="mt-1 p-3 w-full rounded-md bg-primary-light border border-white/20 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-white"
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-white text-primary py-3 px-4 rounded-md font-medium transition duration-200 hover:bg-primary hover:text-white"
                        >
                            Login
                        </button>
                </form>
        </div>
                
                {/* Right side - Admin Image */ }
    <div className="w-full md:w-1/2 bg-gray-300 hidden md:flex items-center justify-center p-8">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-full h-full"
        >
            <div className="w-full h-full bg-white rounded-lg shadow-md flex items-center justify-center">
                <img
                    src={assets.logo}
                    alt="Station 360 Admin"
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white rounded-b-lg">
                <h3 className="font-bold text-center">Station 360</h3>
                <p className="text-sm text-center">Your Trusted Vehicle Service Booking Platform</p>
            </div>
        </motion.div>
    </div>
            </motion.div >
        </div >
    );
};

export default Login;