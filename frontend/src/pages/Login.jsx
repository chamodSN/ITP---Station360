import { useState } from 'react';
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();
  const { login, signup } = useAuthStore();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Login') {
        await login(email, password);
        setState('Signup');
        toast.success("Login successful");
        navigate("/");
      } else if (state === 'Signup') {
        await signup(email, password, name);
        navigate("/verify-email");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 mx-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-4xl font-semibold text-center">
          {state === 'Signup' ? "Create Account" : "Login"}
        </p>
        <p className="text-center">
          {state === 'Signup' ? "Sign up" : "Login"} to service your vehicle
        </p>

        {state === "Signup" && (
          <div className="w-full">
            <p>Full name</p>
            <User className="mr-2 text-zinc-500" />
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

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
          {state === 'Signup' ? "Create Account" : "Login"}
        </button>

        {state === "Signup" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState('Login')}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <>
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState('Signup')}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
          <p>
          Forgot Password?{" "}
          <span
            onClick={() => navigate('/forgot-password')}
            className="text-primary underline cursor-pointer"
          >
            Click here
          </span>
        </p>
        </>
        )}
      </div>
    </form>
  );
};

export default Login;
