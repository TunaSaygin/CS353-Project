import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/navbar/navbar'
import LoginForm from './pages/login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NotFoundPage from './pages/Not_Found'
import CustomerHome from './pages/Customer_Home'
import BussinessHome from './pages/Bussiness_Home'
import AdminPage from './pages/AdminPage'




// Authentication check function (placeholder)
const isAuthenticated = () => {
  // Replace with actual authentication check
  return localStorage.getItem('user') !== null;
};

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};
function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
      <Routes>
        <Route path="/home_cust" element={<CustomerHome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path='/not_found' element={<NotFoundPage/>}/>
        <Route path='admin_page' element={<AdminPage/>}/>
        <Route path="/home_bussiness" element={<PrivateRoute><BussinessHome /></PrivateRoute>}/>
        <Route path="/home_bussiness" element={<PrivateRoute><BussinessHome /></PrivateRoute>}/>
        <Route path="*" element={<LoginForm />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
