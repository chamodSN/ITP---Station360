import { Routes, Route } from 'react-router-dom'
import AddVehicle from './pages/vehicle/AddVehicle'
import AllVehicles from './pages/vehicle/AllVehicles'
import Vehicle from './pages/vehicle/Vehicle' 
import Service from './pages/Service'

import Login from './pages/Login'


import ApplyLeave from './pages/Employees/ApplyLeave'
import DisplayEmployeeLeave from './pages/Employees/DisplayEmployeeLeave'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContactUs from './pages/ContactUs'



function App() {

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<></>} />
        <Route path="/service/:id" element={<Service />} />

        <Route path="/login" element={<Login />} />
        <Route path="/leaves/apply" element={<ApplyLeave />} />
        <Route path="/leaves" element={<DisplayEmployeeLeave />} />

        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/all-vehicles" element={<AllVehicles />} />
        <Route path="/vehicle/:id" element={<Vehicle/>}/>
        <Route path="/contactus" element={<ContactUs />} />

        

      </Routes>
    </div>
  )
}

export default App
