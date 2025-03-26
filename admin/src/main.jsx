import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppContextProvider from './context/AppContext.jsx';
import EmployeeContextProvider from './context/EmployeeContext.jsx';
import AdminContextProvider from './context/AdminContext.jsx';

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AdminContextProvider>
      <EmployeeContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </EmployeeContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)
