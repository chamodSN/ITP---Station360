import React from 'react'
import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AllServices from '../src/pages/services/AllServices'
import AddService from '../src/pages/services/AddService'
import Service from '../src/pages/services/Service'
import AddSchedule from '../src/pages/shedule/AddSchedule'
import AllShedules from '../src/pages/shedule/AllShedule'
import Shedule from '../src/pages/shedule/Shedule'
import AddExpence from './pages/AddExpence'
import AddInventory from './pages/AddInventory'
import Login from './pages/Login'
import AdmiDashboard from './pages/AdmiDashboard'

function App() {

  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<></>} />
        <Route path="/service/add-service" element={<AddService />} />
        <Route path="/service/all-services" element={<AllServices />} />
        <Route path="/service/:id" element={<Service />} />
        <Route path='/add-schedule' element={<AddSchedule />} />
        <Route path='/all-shedules' element={<AllShedules />}/>
        <Route path='/displayShedule/:id' element={<Shedule />}/>
        <Route path='/add-expence' element={<AddExpence />} />
        <Route path='/add-inventory' element={<AddInventory />} />
        <Route path='/employee-login' element={<Login />} />
        <Route path='/admin-dashboard' element={<AdmiDashboard />} />
      </Routes>
    </div>
  )
}

export default App
