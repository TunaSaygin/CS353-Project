import React, { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext(null);
const baseUrl = "http://localhost:8080"
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
  const [user, setUser] = useLocalStorage("user",null);
  const navigate = useNavigate();
  const login = async (username,password) => {
    try {
      const response = await axios.post(`${baseUrl}/profile/login/`, { email: username, password: password });
      console.log(response.data);
      console.log(`response.token = ${response.token}`);
      console.log('response:', response);

      // Log the response data separately
      console.log('response.data:', response.data);
  
      const { token, id, name, acc_type } = response.data;
      console.log(`token = ${token}`)
      // Save the token and user data in local storage
      setIsLoggedIn(true);
      setUser(response.data);
      console.log(`user = ${user}`)
      window.localStorage.setItem('token', token); // Save the token in local storage
      if (acc_type === "admin") {
        navigate("/admin_page");
      } else if (acc_type === "customer") {
        navigate("/home_customer");
      } else if (acc_type === "business") {
        navigate("/home_business");
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      return { error: error.response ? error.response.data : 'Login failed' };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    window.localStorage.removeItem('isLoggedIn'); // Optional: Clear login state
    setIsLoggedIn(false);
    setUser(null);
  };
  const value = useMemo(()=>({isLoggedIn,user, login,logout, baseUrl}))
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
