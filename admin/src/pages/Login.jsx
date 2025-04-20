import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [state, setState] = useState('Admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();


    const { setAToken, backendUrl } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if (state === 'Admin') {
                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });

                if (data.success) {
                    localStorage.setItem('aToken', data.token);
                    setAToken(data.token);
                    toast.success("Login Success");
                    navigate('/admin-dashboard');
                } else {
                    toast.error(data.message);
                }
            } 
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
                <p className="text-2xl font-semibold m-auto">
                    <span className="text-primary">{state}</span> Login
                </p>
                <div>
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="border-[#DADADA] border w-full p-2 mt-1"
                        type="email"
                        required
                    />
                </div>
                <div>
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        className="border-[#DADADA] border w-full p-2 mt-1"
                        required
                    />
                </div>

                <button className="bg-primary text-white w-full py-2 rounded-md text-base">Login</button>

                {state === 'Admin' ? (
                    <p>
                        Employee Login?{' '}
                        <span className="text-primary underline cursor-pointer" onClick={() => setState('employee')}>
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Admin Login?{' '}
                        <span className="text-primary underline cursor-pointer" onClick={() => setState('Admin')}>
                            Click here
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;
