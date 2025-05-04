import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Expenses
import AllExpences from './pages/expence/AllExpence';
import AddExpence from './pages/expence/AddExpence';
import Expence from './pages/expence/Expence';

// Services
import AddService from './pages/services/AddService';
import AllServices from './pages/services/AllServices';
import Service from './pages/services/Service';

// Schedules
import AddSchedule from './pages/shedule/AddSchedule';
import AllShedules from './pages/shedule/AllShedule';
import Shedule from './pages/shedule/Shedule';

// Inventories
import AddInventory from './pages/inventories/AddInventory';
import AllInventory from './pages/inventories/AllInventory';
import Inventory from './pages/inventories/Inventory';
import LowStocks from './pages/inventories/lowStock';

// Attendance
import AdminAttendance from './pages/attendence/AdminAttendence';
import LeaveRequests from './pages/attendence/LeaveRequests';

// Notifications
import AddNotification from './pages/notifications/AddNotification';
import AllNotification from './pages/notifications/AllNotifications';
import Notification from './pages/notifications/Notification';

// Users
import UsersList from './pages/users/UsersList';
import User from './pages/users/User';
import UserReport from './pages/users/UserReport';

// General
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import AdminDashBoard from './pages/AdminDashBoard';
import Login from './pages/Login';

function App() {
  return (
    <div>
      <Navbar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<AdminDashBoard />} />
        
        {/* Services */}
        <Route path="/service/add-service" element={<AddService />} />
        <Route path="/service/all-services" element={<AllServices />} />
        <Route path="/service/:id" element={<Service />} />
        
        {/* Schedules */}
        <Route path="/add-schedule" element={<AddSchedule />} />
        <Route path="/all-shedules" element={<AllShedules />} />
        <Route path="/displayShedule/:id" element={<Shedule />} />
        
        {/* Expenses */}
        <Route path="/all-expences" element={<AllExpences />} />
        <Route path="/add-expence" element={<AddExpence />} />
        <Route path="/expence/:id" element={<Expence />} />
        
        {/* Inventories */}
        <Route path="/add-inventory" element={<AddInventory />} />
        <Route path="/inventories" element={<AllInventory />} />
        <Route path="/item/:id" element={<Inventory />} />
        <Route path="/low-stocks" element={<LowStocks />} />
        
        {/* Attendance */}
        <Route path="/admin-attendance" element={<AdminAttendance />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        
        {/* Notifications */}
        <Route path="/notification/all-notification" element={<AllNotification />} />
        <Route path="/notification/add-notification" element={<AddNotification />} />
        <Route path="/notification/:id" element={<Notification />} />
        
        {/* Users */}
        <Route path="/users" element={<UsersList />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/user-report" element={<UserReport />} />
        
        {/* Login */}
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
