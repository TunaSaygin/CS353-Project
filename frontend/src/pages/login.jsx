import React from 'react'
import { useState } from 'react';
import './login.css'
import RegisterForm from '../components/loginbox/registerForm';
import LoginFormComponent from '../components/loginbox/loginForm';
import { useAuth } from '../context/authcontext';
import { useNavigate } from 'react-router-dom';
export default function LoginForm() {
  const [formType, setFormType] = useState('login'); // login or register
  const [accountType, setAccountType] = useState('customer'); // customer, business, admin
  const nav = useNavigate();
  const {login} = useAuth();
  const handleSubmit = (event) => {
    event.preventDefault();
    // Placeholder for submit logic
    login();
    nav("/admin_page")
    console.log(`Submitted ${formType} form for ${accountType} account.`);
    // You'd put your login or registration logic here
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="toggle-container mb-3">
            <button
              className={`toggle-button ${formType === 'login' ? 'active' : ''}`}
              onClick={() => setFormType('login')}
            >
              Login
            </button>
            <button
              className={`toggle-button ${formType === 'register' ? 'active' : ''}`}
              onClick={() => setFormType('register')}
            >
              Register
            </button>
          </div>
          <div className="form-container">
          <div className={`form-slide ${formType === 'login' ? 'form-slide-active' : 'form-slide-left'}`}>
            <LoginFormComponent handleForm={handleSubmit}/>
          </div>
          <div className={`form-slide ${formType === 'register' ? 'form-slide-active' : 'form-slide-right'}`}>
            <RegisterForm/>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
