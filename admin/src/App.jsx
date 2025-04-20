import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import AllExpences from './pages/expence/AllExpence'

import Expence from './pages/expence/Expence'
import AddExpence from './pages/expence/AddExpence'

import AddService from '../src/pages/services/AddService'
import AllServices from '../src/pages/services/AllServices'
import Service from '../src/pages/services/Service'


import AddSchedule from '../src/pages/shedule/AddSchedule'
import AllShedules from '../src/pages/shedule/AllShedule'
import Shedule from '../src/pages/shedule/Shedule'


import Expence from './pages/expence/Expence'
import AddInventory from './pages/inventories/AddInventory'
import AllInventory from './pages/inventories/AllInventory'
import Inventory from './pages/inventories/Inventory'


import AdminAttendance from '../src/pages/attendence/AdminAttendence'
import LeaveRequests from '../src/pages/attendence/LeaveRequests'


import AddNotification from './pages/notifications/AddNotification'
import AllNotification from './pages/notifications/AllNotifications'
import Notification from './pages/notifications/Notification'
import LowStocks from './pages/inventories/lowStock'



import AddInventory from './pages/AddInventory'


import Login from './pages/Login'
import AdmiDashboard from './pages/AdmiDashboard'


import AddNotification from './pages/notifications/AddNotification'
import AllNotification from './pages/notifications/AllNotifications'
import Notification from './pages/notifications/Notification'




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

        <Route path='/all-expences' element={<AllExpences />} />
        <Route path='/expence/:id' element={<Expence />} />

        <Route path='/all-shedules' element={<AllShedules />}/>
        <Route path='/displayShedule/:id' element={<Shedule />}/>
          
          
      <Route path='/all-expences' element={<AllExpences />} />
      <Route path='/expence/:id' element={<Expence />} />
        <Route path='/add-expence' element={<AddExpence />} />
          
          
        <Route path='/add-inventory' element={<AddInventory />} />


        <Route path='/employee-login' element={<Login />} />
        <Route path='/admin-dashboard' element={<AdmiDashboard />} />


        <Route path="/admin-attendance" element={<AdminAttendance />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        

        <Route path="/notification/all-notification" element={<AllNotification />} />
        <Route path="/notification/add-notification" element={<AddNotification />} />
        <Route path="/notification/:id" element={<Notification />} />

        <Route path='/add-inventory' element={<AddInventory />} />
        <Route path='/low-stocks' element={<LowStocks />} />
        <Route path='/inventories' element={<AllInventory />} />
        <Route path='/item/:id' element={<Inventory />} />


      </Routes>
    </div>
  )
}

export default App