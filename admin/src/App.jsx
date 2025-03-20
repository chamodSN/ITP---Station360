import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AddService from './pages/AddService'
import AddSchedule from './pages/AddSchedule'
import AddExpence from './pages/AddExpence'
import AddInventory from './pages/AddInventory'
function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<></>} />
        <Route path='/add-service' element={<AddService />} />
        <Route path='/add-schedule' element={<AddSchedule />} />
        <Route path='/add-expence' element={<AddExpence />} />
        <Route path='/add-inventory' element={<AddInventory />} />
      </Routes>
    </div>
  )
}

export default App
