import { Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllServices from './pages/AllServices'
import Service from './pages/Service'
import Home from './pages/Home'
import Navbar from './components/NavBar'
import Footer from './components/Footer'
import MyBookings from './pages/MyBookings'
import AddVehicle from './pages/vehicle/AddVehicle'
import AllVehicles from './pages/vehicle/AllVehicles'
import Vehicle from './pages/vehicle/Vehicle' 
import 'react-toastify/dist/ReactToastify.css';
import ContactUs from './pages/ContactUs'


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
        <Route path="/service/:id" element={<Service />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/all-vehicles" element={<AllVehicles />} />
        <Route path="/vehicle/:id" element={<Vehicle/>}/>
        <Route path="/contactus" element={<ContactUs />} />

        
      </Routes>
      <Footer />
    </div>
  )
}

export default App
