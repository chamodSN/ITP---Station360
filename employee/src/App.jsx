import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';


import EmployeeProfile from './pages/EmployeeProfile';
import ApplyLeave from './pages/ApplyLeave'
import DisplayEmployeeLeave from './pages/DisplayEmployeeLeave'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import UserNotifications from './pages/UserNotifications';

function App() {
  
  return (
    <div>
      <ToastContainer />
      <NavBar />
      <Routes>
        {/* Protected Routes */}
        <Route path="/leaves/apply" element={
            <ApplyLeave />
        } />
        <Route path="/leaves" element={
            <DisplayEmployeeLeave />
        } />
        <Route path="/employee-profile" element={ <EmployeeProfile />} />

        <Route path="/notifications/:audience" element={<UserNotifications />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
