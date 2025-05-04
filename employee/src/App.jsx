import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';


import NavBar from './components/NavBar'
import Footer from './components/Footer'
import UserNotifications from './pages/UserNotifications';

function App() {
  
  return (
    <div>
      <ToastContainer />
      <NavBar />
      <Routes>
        
        <Route path="/notifications/:audience" element={<UserNotifications />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
