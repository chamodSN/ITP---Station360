import { Routes, Route } from 'react-router-dom'
import AllServices from './pages/AllServices'
import Service from './pages/Service'
import ApplyLeave from './pages/Employees/ApplyLeave'
import DisplayEmployeeLeave from './pages/Employees/DisplayEmployeeLeave'


function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<></>} />
        <Route path="/service/all-services" element={<AllServices />} />
        <Route path="/service/:id" element={<Service />} />
        <Route path="/leaves/apply" element={<ApplyLeave />} />
        <Route path="/leaves" element={<DisplayEmployeeLeave />} />
      </Routes>
    </div>
  )
}

export default App
