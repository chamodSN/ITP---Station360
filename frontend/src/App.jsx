import { Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllServices from './pages/AllServices'
import Service from './pages/Service'
import Home from './pages/Home'
import Navbar from './components/NavBar'
import Footer from './components/Footer'
import MyBookings from './pages/MyBookings'

function App() {

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/services" element={<AllServices />} />
        <Route path="/services/:category" element={<AllServices />} />
        <Route path="/service/:id" element={<Service />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
