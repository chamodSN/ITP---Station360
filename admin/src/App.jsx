import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AllServices from './pages/services/AllServices'
import AddService from './pages/services/AddService'
import Service from './pages/services/Service'
import AddSchedule from './pages/AddSchedule'
import AddExpence from './pages/AddExpence'
import AddInventory from './pages/AddInventory'
function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<></>} />
        <Route path="/service/add-service" element={<AddService />} />
        <Route path="/service/all-services" element={<AllServices />} />
        <Route path="/service/:id" element={<Service />} />
        <Route path='/add-schedule' element={<AddSchedule />} />
        <Route path='/add-expence' element={<AddExpence />} />
        <Route path='/add-inventory' element={<AddInventory />} />
      </Routes>
    </div>
  )
}

export default App
