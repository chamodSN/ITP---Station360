import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AllServices from '../src/pages/services/AllServices'
import AddService from '../src/pages/services/AddService'
import Service from '../src/pages/services/Service'
import AddSchedule from '../src/pages/shedule/AddSchedule'
import AllShedules from '../src/pages/shedule/AllShedule'
import Shedule from '../src/pages/shedule/Shedule'
import AddExpence from '../src/pages/AddExpence'
import AddInventory from '../src/pages/AddInventory'
import AdminAttendance from '../src/pages/attendence/AdminAttendence'
import LeaveRequests from '../src/pages/attendence/LeaveRequests'



function App() {

  return (
    <div>
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
        <Route path="/admin-attendance" element={<AdminAttendance />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />

        
      </Routes>
    </div>
  )
}

export default App
