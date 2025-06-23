import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAdminAuthStore } from './store/authAdmin';

import ProtectedRoute from './components/ProtectedRoute';

// Expense pages
import AllExpences from './pages/expence/AllExpence';
import Expence from './pages/expence/Expence';
import AddExpence from './pages/expence/AddExpence';
import FinanceDashboard from './pages/expence/FinanceDashboard';
import AddBills from './pages/expence/AddBills';
import BookingDetails from './pages/expence/BookingDetails';
import ExpenseEmployeeList from './pages/expence/EmployeeList';
import EmployeeSalary from './pages/expence/EmployeeSalary';

// Services
import AddService from './pages/services/AddService';
import AllServices from './pages/services/AllServices';
import Service from './pages/services/Service';

// Schedule
import AddSchedule from './pages/shedule/AddSchedule';
import AllShedules from './pages/shedule/AllShedule';
import Shedule from './pages/shedule/Shedule';

// Inventory
import AddInventory from './pages/inventories/AddInventory';
import AllInventory from './pages/inventories/AllInventory';
import Inventory from './pages/inventories/Inventory';
import LowStocks from './pages/inventories/lowStock';
import ExpiringItems from './pages/inventories/ExpiringItems';
import OrderedItems from './pages/inventories/OrderedItems';
import StockManagement from './pages/inventories/StockManagement';

// Attendance
import AdminAttendance from './pages/attendence/AdminAttendence';
import LeaveRequests from './pages/attendence/LeaveRequests';
import AttendanceRecords from './pages/attendence/AttendanceRecords';

// Notifications
import AddNotification from './pages/notifications/AddNotification';
import AllNotification from './pages/notifications/AllNotifications';
import Notification from './pages/notifications/Notification';

// Navbars
import ServiceNavbar from './components/ServiceNavbar';
import UserNavbar from './components/UserNavbar';
import BookingNavbar from './components/BookingNavbar';
import FinanceNavbar from './components/FinanceNavbar';
import InventoryNavbar from './components/InventoryNavbar';
import NotificationNavbar from './components/NotificationNavbar';
import VehicleNavbar from './components/VehicleNavbar';
import ScheduleNavbar from './components/ScheduleNavbar';
import DefaultNavbar from './components/DefaultNavbar';
import EmployeeNavbar from './components/EmployeeNavbar';
import AttendenceNavBar from './components/AttendenceNavBar';

import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

// Employee
import AddEmployee from './pages/employee/AddEmployee';
import EmployeeList from './pages/employee/EmployeeList';
import EmployeeProfile from './pages/employee/EmployeeProfile';

// Vehicles
import AllVehicles from './pages/vehicles/AllVehicles';
import Vehicle from './pages/vehicles/Vehicle';

// Tasks
import AssignTasks from './pages/tasks/AssignTasks';
import AssignedTasks from './pages/tasks/AssignedTasks';
import TaskDetails from './pages/tasks/TaskDetails';

// Users
import UsersList from './pages/users/UsersList';
import User from './pages/users/User';
import UserReport from './pages/users/UserReport';

// Bookings
import BookingsSummary from './pages/bookings/BookingsSummary';
import Services from './pages/bookings/Services';
import Bookings from './pages/bookings/Bookings';

function App() {
  const location = useLocation();
  const checkAuth = useAdminAuthStore((state) => state.checkAuth);

  const getNavbarForPath = (pathname) => {
    if (pathname.startsWith('/service')) return <ServiceNavbar />;
    if (
      pathname.startsWith('/expence') ||
      pathname.startsWith('/add-expence') ||
      pathname.startsWith('/all-expences') ||
      pathname.startsWith('/finance-dashboard') ||
      pathname.startsWith('/booking-details') ||
      pathname.startsWith('/employee-salary') ||
      pathname.startsWith('/add-bills')
    ) return <FinanceNavbar />;
    if (
      pathname.startsWith('/all-inventory') ||
      pathname.startsWith('/item') ||
      pathname.includes('/stock') ||
      pathname.includes('/add-inventory') ||
      pathname.includes('/low-stock') ||
      pathname.includes('/expiring-items') ||
      pathname.includes('/ordered-items') ||
      pathname.includes('/stock-management')
    ) return <InventoryNavbar />;
    if (
      pathname.startsWith('/all-notifications') ||
      pathname.startsWith('/notification') ||
      pathname.startsWith('/notifications') ||
      pathname.startsWith('/add-notification')
    ) return <NotificationNavbar />;
    if (pathname.startsWith('/all-vehicles') || pathname.startsWith('/vehicle')) return <VehicleNavbar />;
    if (
      pathname.startsWith('/tasks') ||
      pathname.startsWith('/tasks/assigned')
    ) return <ScheduleNavbar />;
    if (
      pathname.startsWith('/employees') ||
      pathname.startsWith('/employee') ||
      pathname.startsWith('/add-employee')
    ) return <EmployeeNavbar />;
    if (pathname.startsWith('/users')) return <UserNavbar />;
    if (
      pathname.startsWith('/bookings-summary') ||
      pathname.startsWith('/admin/bookings')
    ) return <BookingNavbar />;
    if (pathname.startsWith('/admin-attendance') ||
      pathname.startsWith('/leave-requests') ||
      pathname.startsWith('/attendance-records')
    ) return <AttendenceNavBar />;
    if (pathname.startsWith('/')) return <DefaultNavbar />;
    return null;
  };

  const currentNavbar = getNavbarForPath(location.pathname);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      {currentNavbar}
      <ToastContainer />

      <Routes>
        {/* Unprotected */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        {/* Services */}
        <Route path="/service/add-service" element={<ProtectedRoute><AddService /></ProtectedRoute>} />
        <Route path="/service/all-services" element={<ProtectedRoute><AllServices /></ProtectedRoute>} />
        <Route path="/service/:id" element={<ProtectedRoute><Service /></ProtectedRoute>} />

        {/* Schedule */}
        <Route path="/add-schedule" element={<ProtectedRoute><AddSchedule /></ProtectedRoute>} />
        <Route path="/all-shedules" element={<ProtectedRoute><AllShedules /></ProtectedRoute>} />
        <Route path="/displayShedule/:id" element={<ProtectedRoute><Shedule /></ProtectedRoute>} />

        {/* Expense */}
        <Route path="/all-expences" element={<ProtectedRoute><AllExpences /></ProtectedRoute>} />
        <Route path="/expence/:id" element={<ProtectedRoute><Expence /></ProtectedRoute>} />
        <Route path="/add-expence" element={<ProtectedRoute><AddExpence /></ProtectedRoute>} />
        <Route path="/add-bills" element={<ProtectedRoute><AddBills /></ProtectedRoute>} />
        <Route path="/finance-dashboard" element={<ProtectedRoute><FinanceDashboard /></ProtectedRoute>} />
        <Route path="/booking-details/:id" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
        <Route path="/employee-salary" element={<ProtectedRoute><ExpenseEmployeeList /></ProtectedRoute>} />
        <Route path="/employee-salary/:id" element={<ProtectedRoute><EmployeeSalary /></ProtectedRoute>} />

        {/* Inventory */}
        <Route path="/all-inventory" element={<ProtectedRoute><AllInventory /></ProtectedRoute>} />
        <Route path="/item/:id" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/add-inventory" element={<ProtectedRoute><AddInventory /></ProtectedRoute>} />
        <Route path="/low-stock" element={<ProtectedRoute><LowStocks /></ProtectedRoute>} />
        <Route path="/expiring-items" element={<ProtectedRoute><ExpiringItems /></ProtectedRoute>} />
        <Route path="/ordered-items" element={<ProtectedRoute><OrderedItems /></ProtectedRoute>} />
        <Route path="/stock-management" element={<ProtectedRoute><StockManagement /></ProtectedRoute>} />

        {/* Notifications */}
        <Route path="/all-notifications" element={<ProtectedRoute><AllNotification /></ProtectedRoute>} />
        <Route path="/notification/:id" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
        <Route path="/add-notification" element={<ProtectedRoute><AddNotification /></ProtectedRoute>} />

        {/* Attendance */}
        <Route path="/admin-attendance" element={<ProtectedRoute><AdminAttendance /></ProtectedRoute>} />
        <Route path="/leave-requests" element={<ProtectedRoute><LeaveRequests /></ProtectedRoute>} />
        <Route path="/attendance-records" element={<ProtectedRoute><AttendanceRecords /></ProtectedRoute>} />
        {/* Employees */}
        <Route path="/add-employee" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
        <Route path="/employee/:id" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />

        {/* Vehicles */}
        <Route path="/all-vehicles" element={<ProtectedRoute><AllVehicles /></ProtectedRoute>} />
        <Route path="/vehicle/:id" element={<ProtectedRoute><Vehicle /></ProtectedRoute>} />

        {/* Tasks */}
        <Route path="/tasks/assign" element={<ProtectedRoute><AssignTasks /></ProtectedRoute>} />
        <Route path="/tasks/assigned" element={<ProtectedRoute><AssignedTasks /></ProtectedRoute>} />
        <Route path="/tasks/:taskId" element={<ProtectedRoute><TaskDetails /></ProtectedRoute>} />

        {/* Users */}
        <Route path="/users" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/user-report" element={<ProtectedRoute><UserReport /></ProtectedRoute>} />

        {/* Bookings */}
        <Route path="/bookings-summary" element={<ProtectedRoute><BookingsSummary /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/admin/bookings/:id" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
