import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useEmployeeAuthStore } from './store/authStore'; // Assuming you have auth store like your first app

import MyTasks from './pages/MyTasks'
import ApplyLeave from './pages/ApplyLeave'
import DisplayEmployeeLeave from './pages/DisplayEmployeeLeave'
import Login from './pages/Login';
import EmployeeProfile from './pages/EmployeeProfile';
import TaskDetails from './pages/TaskDetails';
import DoneTasks from './pages/DoneTasks';
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import UserNotifications from './pages/UserNotifications';
// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useEmployeeAuthStore();

  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const { checkAuth } = useEmployeeAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <ToastContainer />
      <NavBar />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/leaves/apply" element={
          <ProtectedRoute>
            <ApplyLeave />
          </ProtectedRoute>
        } />
        <Route path="/leaves" element={
          <ProtectedRoute>
            <DisplayEmployeeLeave />
          </ProtectedRoute>
        } />
        <Route path="/employee-profile" element={
          <ProtectedRoute>
            <EmployeeProfile />
          </ProtectedRoute>
        } />
        <Route path="/tasks/:taskId" element={
          <ProtectedRoute>
            <TaskDetails />
          </ProtectedRoute>
        } />
        <Route path="/my-tasks" element={
          <ProtectedRoute>
            <MyTasks />
          </ProtectedRoute>
        } />
        <Route path="/done-tasks" element={
          <ProtectedRoute>
            <DoneTasks />
          </ProtectedRoute>
        } />
        <Route path="/notifications/:audience" element={<UserNotifications />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
