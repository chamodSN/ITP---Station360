import React from 'react'
import { Routes, Route } from 'react-router-dom'
<<<<<<< HEAD
import AllServices from './pages/services/AllServices'
import AddService from './pages/services/AddService'
import Service from './pages/services/Service'
import AddSchedule from './pages/AddSchedule'
import AddInventory from './pages/AddInventory'
import  AddExpence from './pages/expence/AddExpence'
import AllExpences from './pages/expence/AllExpence'
import Expence from './pages/expence/Expence'
<<<<<<< Updated upstream
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
import AllServices from '../src/pages/services/AllServices'
import AddService from '../src/pages/services/AddService'
import Service from '../src/pages/services/Service'
import AddSchedule from '../src/pages/shedule/AddSchedule'
import AllShedules from '../src/pages/shedule/AllShedule'
import Shedule from '../src/pages/shedule/Shedule'
import AddExpence from './pages/AddExpence'
import AddInventory from './pages/AddInventory'
import AddNotification from './pages/notifications/AddNotification'
import AllNotification from './pages/notifications/AllNotifications'
import Notification from './pages/notifications/Notification'

>>>>>>> main
function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<></>} />
        <Route path="/service/add-service" element={<AddService />} />
        <Route path="/service/all-services" element={<AllServices />} />
        <Route path="/service/:id" element={<Service />} />
        <Route path='/add-schedule' element={<AddSchedule />} />
<<<<<<< HEAD
        <Route path='/add-inventory' element={<AddInventory />} />
        <Route path='/add-expence' element={<AddExpence />} />
      <Route path='/all-expences' element={<AllExpences />} />
      <Route path='/expence/:id' element={<Expence />} />
=======
        <Route path='/all-shedules' element={<AllShedules />}/>
        <Route path='/displayShedule/:id' element={<Shedule />}/>
        <Route path='/add-expence' element={<AddExpence />} />
        <Route path='/add-inventory' element={<AddInventory />} />
        <Route path="/notification/all-notification" element={<AllNotification />} />
        <Route path="/notification/add-notification" element={<AddNotification />} />
        <Route path="/notification/:id" element={<Notification />} />
>>>>>>> main
      </Routes>
    </div>
  )
}

export default App
