import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/navbar/navbar'
import LoginForm from './pages/login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NotFoundPage from './pages/Not_Found'
import CustomerHome from './pages/Customer_Home'
import BusinessHome from './pages/Bussiness_Home'
import AdminPage from './pages/AdminPage'
import Mainpage from './pages/mainpage'
import ShoppingCart from './pages/ShoppingCart'
import ProductDetail from './pages/ProductDetail'
import { AuthProvider, useAuth } from './context/authcontext'
import Profile from './pages/Profile'
import Dashboard from './components/graph'
import Wishlist from './pages/Wishlist'
import ForgotPassword, { PasswordForm } from './pages/ForgotPassword'



// Authentication check function (placeholder)
const isAuthenticated = () => {
  // Replace with actual authentication check
  const { isLoggedIn, logout, user } = useAuth();
  console.log(`isLoggedIn = ${isLoggedIn}, user = ${user}`);
  console.log(`user in isauth = ${user}`)
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
    <BrowserRouter>
      <AuthProvider> {/* Wrap your routes with AuthProvider */}
      <Navbar />
      <Routes>
        <Route path="/home_cust" element={<CustomerHome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/chart" element={<Dashboard />} />
        <Route path='/not_found' element={<NotFoundPage/>}/>
        <Route path='/admin_page' element={<PrivateRoute><AdminPage/></PrivateRoute>}/>
        <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>} />
        <Route path="/home_business" element={<PrivateRoute><BusinessHome /></PrivateRoute>}/>
        <Route path="/home_customer" element={<PrivateRoute><Mainpage /></PrivateRoute>}/>
        <Route path="/product_list" element={<Mainpage/>}/>
        <Route path='/forgot_password' element={<ForgotPassword></ForgotPassword>}></Route>
        <Route path='/enter_password' element={<PasswordForm></PasswordForm>}></Route>
        <Route path='/shopping_cart' element={<ShoppingCart/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path="*" element={<LoginForm />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
    </>
  )
}

export default App
