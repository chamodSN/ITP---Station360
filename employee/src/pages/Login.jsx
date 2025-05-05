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
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3f4f6] via-[#e9eefd] to-[#f3f4f6]">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white rounded-3xl shadow-2xl px-16 py-14 w-full max-w-xl relative flex flex-col gap-8"
      >
        {/* Company Logo/Name */}
        <div className="flex items-center gap-2 absolute left-12 top-8">
          <div className="w-8 h-8 bg-[#5F6FFF] rounded-full flex items-center justify-center text-white font-bold text-xl">C</div>
          <span className="text-2xl font-bold text-gray-700 tracking-tight">Station<span className="text-[#5F6FFF]">360</span></span>
        </div>
        {/* Heading */}
        <div className="mt-12 mb-4 text-center">
          <h2 className="text-4xl font-extrabold text-[#5F6FFF] mb-2 tracking-tight">Sign in to Account</h2>
          <p className="text-gray-400 text-lg">Welcome back! Please login to your account.</p>
        </div>
        {/* Social Buttons */}
        <div className="flex justify-center gap-6 mb-2">
          <button type="button" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 text-xl hover:bg-[#f3f4f6] transition"><span className="font-bold">f</span></button>
          <button type="button" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 text-xl hover:bg-[#f3f4f6] transition"><span className="font-bold">in</span></button>
          <button type="button" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 text-xl hover:bg-[#f3f4f6] transition"><span className="font-bold">G</span></button>
        </div>
        {/* Divider */}
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-base">or use your email account</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        {/* Email */}
        <div className="mb-2">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
            <input
              className="pl-14 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:border-[#5F6FFF] bg-gray-50 text-lg transition"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        {/* Password */}
        <div className="mb-2">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
            <input
              className="pl-14 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:border-[#5F6FFF] bg-gray-50 text-lg transition"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        {/* Options */}
       
        {/* Sign In Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-[#5F6FFF] text-white font-semibold text-2xl shadow hover:bg-[#4a56cc] transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login; 