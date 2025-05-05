import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';


import NavBar from './components/NavBar'
import Footer from './components/Footer'
import UserNotifications from './pages/UserNotifications';
import Login from './pages/Login';

function App() {
  
  return (
    <div>
      <ToastContainer />
      <NavBar />
      <Routes>
        
        <Route path="/notifications/:audience" element={<UserNotifications />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
