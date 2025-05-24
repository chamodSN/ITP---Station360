import { useState } from 'react';
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmployeeAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login } = useEmployeeAuthStore();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      await login(email, password);
      toast.success("Login successful");
      navigate("/employee-profile");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 mx-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-4xl font-semibold text-center">Employee Login</p>
        <p className="text-center">Login to service your vehicle</p>

        <div className="w-full">
          <p>Email</p>
          <Mail className="mr-2 text-zinc-500" />
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <Lock className="mr-2 text-zinc-500" />
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
