import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

import EmailVerificationPage from './pages/EmailVerificationPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import AllServices from './pages/AllServices'
import Home from './pages/Home'
import Navbar from './components/NavBar'
import Footer from './components/Footer'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import MyProfile from './pages/Myprofile';
import ContactUs from './pages/ContactUs'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/services" element={<AllServices />} />
        <Route path="/services/:category" element={<AllServices />} />

        {/* Protected Routes */}
        <Route path="/my-bookings" element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path="/my-profile" element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        } />
        

        {/* Public Routes */}
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
