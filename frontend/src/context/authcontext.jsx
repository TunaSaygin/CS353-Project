import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import axios from 'axios';
const AuthContext = createContext(null);
const baseUrl = "http://localhost:8080"
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
  const [user, setUser] = useLocalStorage("user",null);
  const login = async (username,password) => {
    try {
      const response = await axios.post(`${baseUrl}/profile/login/`, { name: username, password: password });
      console.log(response.data);
      console.log(`response.token = ${response.token}`);
      console.log('response:', response);

      // Log the response data separately
      console.log('response.data:', response.data);
  
      const { token, id, name, acc_type } = response.data;
      // Save the token and user data in local storage
      setIsLoggedIn(true);
      setUser({ id, name, acc_type, token });
      console.log(`user = ${user}`)
      window.localStorage.setItem('token', token); // Save the token in local storage
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

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
