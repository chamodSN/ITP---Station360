import { Routes, Route } from 'react-router-dom'
import AddVehicle from './pages/vehicle/AddVehicle'
import AllVehicles from './pages/vehicle/AllVehicles'
import Vehicle from './pages/vehicle/Vehicle' 
import Service from './pages/Service'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<></>} />
        <Route path="/service/:id" element={<Service />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/all-vehicles" element={<AllVehicles />} />
        <Route path="/vehicle/:id" element={<Vehicle/>}/>
        
      </Routes>
    </div>
  )
}

export default App
