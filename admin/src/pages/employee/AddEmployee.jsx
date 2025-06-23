import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Phone, MapPin, Calendar, Briefcase, Image } from 'lucide-react';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState('');
    const [role, setRole] = useState('');
    const [image, setImage] = useState(null);

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        const validImageTypes = ['image/jpeg', 'image/png'];

        if (!nameRegex.test(name)) {
            toast.error('Please enter a valid name (letters only, 2–50 characters)');
            return false;
        }


        if (!image || !validImageTypes.includes(image.type)) {
            toast.error('Only JPG and PNG images are allowed');
            return false;
        }

        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return false;
        }

        if (!phoneRegex.test(phone)) {
            toast.error('Please enter a valid phone number (10–15 digits, optional +)');
            return false;
        }

        if (!role) {
            toast.error('Please select a role');
            return false;
        }

        return true;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phone', phone);
            formData.append('address', address);
            formData.append('dob', dob);
            formData.append('role', role);
            formData.append('image', image);

            const { data } = await axios.post(
                'http://localhost:4200/api/admin/employee/add-employee',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );

            if (data.success) {
                toast.success('Employee added successfully');
                navigate('/employees');
            } else {
                toast.error(data.message || 'Failed to add employee');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding employee');
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Add Employee</h1>

            <div className="mb-4">
                <p className="mb-1">Profile Image</p>
                <label htmlFor="image" className="cursor-pointer">
                    <div className="inline-block relative">
                        {image ? (
                            <img
                                className="w-36 h-36 rounded-full object-cover"
                                src={URL.createObjectURL(image)}
                                alt="Profile Preview"
                            />
                        ) : (
                            <div className="w-36 h-36 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <Image className="w-10 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </label>
            </div>

            <div className="mb-4">
                <p className="mb-1">Full Name</p>
                <div className="flex items-center">
                    <User className="mr-2 text-zinc-500" />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="mb-4">
                <p className="mb-1">Email</p>
                <div className="flex items-center">
                    <Mail className="mr-2 text-zinc-500" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="mb-4">
                <p className="mb-1">Password</p>
                <div className="flex items-center">
                    <Lock className="mr-2 text-zinc-500" />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="mb-4">
                <p className="mb-1">Phone Number</p>
                <div className="flex items-center">
                    <Phone className="mr-2 text-zinc-500" />
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="mb-4">
                <p className="mb-1">Address</p>
                <div className="flex items-center">
                    <MapPin className="mr-2 text-zinc-500" />
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="mb-4">
                <p className="mb-1">Date of Birth</p>
                <div className="flex items-center">
                    <Calendar className="mr-2 text-zinc-500" />
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="mb-6">
                <p className="mb-1">Role</p>
                <div className="flex items-center">
                    <Briefcase className="mr-2 text-zinc-500" />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="mechanic">Mechanic</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="electrician">Electrician</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-all"
            >
                Add Employee
            </button>
        </form>
    );
};

export default AddEmployee;
