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
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (key === 'customer' && !formData.delivery_address) {
      newErrors.delivery_address = 'Address is required';
    }
    if (key === 'business' && !formData.iban) {
      newErrors.iban = 'IBAN is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistration = async (event) => {
    setErrors({})
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    // Registration logic for different user types based on `key`
    const data = { ...formData, acc_type: key };

    try {
      console.log(data)
      const response = await axios.post(`${baseUrl}/profile/register/`, data);
      console.log('Registration successful:', response.data);
      // Redirect or show success message
      login(data.email,data.password); //redirecting
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      setErrors({ form: 'Registration failed. Please try again.' });
      console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container justify-content-start">
      <Tab.Container activeKey={key} onSelect={(k) => setKey(k)} className="mb-4">
        <Nav variant="pills" className="justify-content-center mb-4">
          <Nav.Item>
            <Nav.Link eventKey="customer">Customer</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="business">Business</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="customer">
            <RegistrationFormFields userType="customer" handleRegistration={handleRegistration} handleChange={handleChange} formData={formData} errors={errors} />
          </Tab.Pane>
          <Tab.Pane eventKey="business">
            <RegistrationFormFields userType="business" handleRegistration={handleRegistration} handleChange={handleChange} formData={formData} errors={errors} />
          </Tab.Pane>
          <Tab.Pane eventKey="admin">
            <RegistrationFormFields userType="admin" handleRegistration={handleRegistration} handleChange={handleChange} formData={formData} errors={errors} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

function RegistrationFormFields({ userType, handleRegistration, handleChange, formData, errors }) {
  return (
    <Form onSubmit={handleRegistration}>
      <h1>Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}</h1>
      {errors.form && <div className="alert alert-danger">{errors.form}</div>}
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          isInvalid={!!errors.email}
        />
        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
      </Form.Group>
      {userType === 'customer' && (
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            type="text"
            name="delivery_address"
            placeholder="Enter address"
            value={formData.delivery_address}
            onChange={handleChange}
            isInvalid={!!errors.delivery_address}
          />
          <Form.Control.Feedback type="invalid">{errors.delivery_address}</Form.Control.Feedback>
        </Form.Group>
      )}
      {userType === 'business' && (
        <Form.Group className="mb-3">
          <Form.Label>IBAN</Form.Label>
          <Form.Control
            type="text"
            name="iban"
            placeholder="Enter IBAN"
            value={formData.iban}
            onChange={handleChange}
            isInvalid={!!errors.iban}
          />
          <Form.Control.Feedback type="invalid">{errors.iban}</Form.Control.Feedback>
        </Form.Group>
      )}
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
      </Form.Group>
      <Button type="submit">
        Register as {userType}
      </Button>
    </Form>
  );
}
