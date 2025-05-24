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

    if (state === 'Signup') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
  
      if (password.length < 8) {
        toast.error("Password must be at least 9 characters long");
        return;
      }
    }

    try {
      if (state === 'Login') {
        await login(email, password);
        toast.success("Login successful");
        navigate("/");
      } else if (state === 'Signup') {
        await signup(email, password, name);
        toast.success("Signup successful. Please check your email to verify.");
        navigate("/verify-email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }    

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <span className="text-primary font-bold text-lg">Station</span>
            <span className="font-bold text-lg">360</span>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {state === 'Signup' ? "Create Account" : "Sign in to Account"}
            </h2>

            <div className="flex justify-center space-x-4 my-4">
              <button className="border rounded-full p-2 w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100">f</button>
              <button className="border rounded-full p-2 w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100">in</button>
              <button className="border rounded-full p-2 w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100">G</button>
            </div>

            <p className="text-gray-400 text-sm mb-4">or use your email account</p>
          </div>


          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            {state === "Signup" && (
              <div>
                <label className="text-sm">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    className="w-full pl-10 pr-3 py-2 border rounded bg-gray-100 focus:outline-none"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  className="w-full pl-10 pr-3 py-2 border rounded bg-gray-100 focus:outline-none"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  className="w-full pl-10 pr-3 py-2 border rounded bg-gray-100 focus:outline-none"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {state === "Login" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <span
                  className="text-primary hover:underline cursor-pointer"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              {state === 'Signup' ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="text-sm mt-4 text-center">
            {state === 'Signup' ? (
              <>
                Already have an account?{" "}
                <span
                  className="text-primary hover:underline cursor-pointer"
                  onClick={() => setState('Login')}
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span
                  className="text-primary hover:underline cursor-pointer"
                  onClick={() => setState('Signup')}
                >
                  Sign up here
                </span>
              </>
            )}
          </p>
        </div>

        {/* Right Side - Call to Action */}
        <div className="w-1/2 bg-primary text-white flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold mb-2">
            {state === 'Signup' ? "Welcome Back!" : "Hello, Friend!"}
          </h2>
          <p className="mb-6 text-center">
            {state === 'Signup'
              ? "To keep connected with us please login with your personal info"
              : "Fill up personal information and start journey with us."}
          </p>
          <button
            className="border border-white px-8 py-2 rounded font-semibold hover:bg-white hover:text-primary transition"
            onClick={() => setState(state === 'Signup' ? 'Login' : 'Signup')}
          >
            {state === 'Signup' ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
