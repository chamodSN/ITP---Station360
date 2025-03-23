import { Routes, Route } from 'react-router-dom'
import AllServices from './pages/AllServices'
import Service from './pages/Service'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<></>} />
        <Route path="/service/all-services" element={<AllServices />} />
        <Route path="/service/:id" element={<Service />} />
      </Routes>
    </div>
  )
}

export default App
