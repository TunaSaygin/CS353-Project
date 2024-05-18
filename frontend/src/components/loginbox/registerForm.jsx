import { Tab, Nav, Form, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import { useAuth } from '../../context/authcontext';
import axios from 'axios';
export default function RegistrationForm() {
  const {login,baseUrl} = useAuth()
  const [key, setKey] = useState('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    delivery_address: '',
    iban: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleRegistration = async (event) => {
    event.preventDefault();
    // Registration logic for different user types based on `key`
    const data = { ...formData, acc_type: key };

    try {
      const response = await axios.post(`${baseUrl}/profile/register/`, data);
      console.log('Registration successful:', response.data);
      // Redirect or show success message
      login(data.email,data.password); //redirecting
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container justify-content-start">
      <h1>Register</h1>
      <Tab.Container activeKey={key} onSelect={(k) => setKey(k)} className="mb-4">
        <Nav variant="pills" className="justify-content-center mb-4">
          <Nav.Item>
            <Nav.Link eventKey="customer">Customer</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="business">Business</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="admin">Admin</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="customer">
            <RegistrationFormFields userType="customer" handleRegistration={handleRegistration} handleChange={handleChange} formData={formData}/>
          </Tab.Pane>
          <Tab.Pane eventKey="business">
            <RegistrationFormFields userType="business" handleRegistration={handleRegistration} handleChange={handleChange} formData={formData}/>
          </Tab.Pane>
          <Tab.Pane eventKey="admin">
            <RegistrationFormFields userType="admin" handleRegistration={handleRegistration} handleChange={handleChange} formData={formData}/>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

function RegistrationFormFields({ userType, handleRegistration, handleChange, formData }) {
  return (
    <Form onSubmit={handleRegistration}>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name='email' placeholder="Enter email" value={formData.email} onChange={handleChange} />
      </Form.Group>

      {/* Add additional fields based on user type here */}
      {userType === 'customer' && (
        <Form.Group className="mb-3">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control type="text" name='name' placeholder="Customer name" />
        </Form.Group>
      )}
      {userType === 'customer' && (
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control as="textarea" rows={3} type="text" name="delivery_address" placeholder="Enter address" value={formData.delivery_address} onChange={handleChange} />
        </Form.Group>
      )}
      {userType === 'business' && (
        <Form.Group className="mb-3">
          <Form.Label>Business Name</Form.Label>
          <Form.Control type="text" name='name' placeholder="Business name" value={formData.name} onChange={handleChange}/>
        </Form.Group>
      )}
      {userType === 'business' && (
        <Form.Group className="mb-3">
          <Form.Label>IBAN</Form.Label>
          <Form.Control type="text" name="iban" placeholder="Enter IBAN" value={formData.iban} onChange={handleChange}/>
        </Form.Group>
      )}
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name='password' placeholder="Enter password" value={formData.password} onChange={handleChange}/>
      </Form.Group>
      {/* ... other fields for admin or customer ... */}

      <Button type="submit">
        Register as {userType}
      </Button>
    </Form>
  );
}
