import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/navbar/navbar'
import LoginForm from './pages/login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NotFoundPage from './pages/Not_Found'
import CustomerHome from './pages/Customer_Home'
import BussinessHome from './pages/Bussiness_Home'
import AdminPage from './pages/AdminPage'
import { AuthProvider, useAuth } from './context/authcontext'
import Profile from './pages/Profile'
import Dashboard from './components/graph'



// Authentication check function (placeholder)
const isAuthenticated = () => {
  // Replace with actual authentication check
  const { isLoggedIn, logout } = useAuth();
  return isLoggedIn !== false;
};

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  
  console.log(`is Auth = ${isAuthenticated()}`)
  return isAuthenticated() ? children : <Navigate to="/login"/>;
};
function App() {
  return (
    <>
    <AuthProvider> {/* Wrap your routes with AuthProvider */}
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/home_cust" element={<CustomerHome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/chart" element={<Dashboard />} />
        <Route path='/not_found' element={<NotFoundPage/>}/>
        <Route path='/admin_page' element={<PrivateRoute><AdminPage/></PrivateRoute>}/>
        <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>} />
        <Route path="/home_bussiness" element={<PrivateRoute><BussinessHome /></PrivateRoute>}/>
        <Route path="/home_bussiness" element={<PrivateRoute><BussinessHome /></PrivateRoute>}/>
        <Route path="*" element={<LoginForm />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App
