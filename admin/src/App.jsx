import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AllServices from './pages/services/AllServices'
import AddService from './pages/services/AddService'
import Service from './pages/services/Service'
import AddSchedule from './pages/AddSchedule'
import AddExpence from './pages/expence/AddExpence'
import AddInventory from './pages/AddInventory'
import AllExpences from "./pages/expence/AllExpence";
import Expence from "./pages/expence/Expence"

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
        <Route path='/all-expences' element={<AllExpences />} />
        <Route path='/expence/:id' element={<Expence />} />
        <Route path='/add-inventory' element={<AddInventory />} />
      </Routes>
    </div>
  )
}

export default App
