import { Tab, Nav, Form, Button } from 'react-bootstrap';
import React, { useState } from 'react';
export default function RegistrationForm() {
  const [key, setKey] = useState('customer');

  const handleRegistration = (event) => {
    event.preventDefault();
    // Registration logic for different user types based on `key`
  };

  return (
    <div className="container py-5">
      <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
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
            <RegistrationFormFields userType="customer" handleRegistration={handleRegistration} />
          </Tab.Pane>
          <Tab.Pane eventKey="business">
            <RegistrationFormFields userType="business" handleRegistration={handleRegistration} />
          </Tab.Pane>
          <Tab.Pane eventKey="admin">
            <RegistrationFormFields userType="admin" handleRegistration={handleRegistration} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

function RegistrationFormFields({ userType, handleRegistration }) {
  return (
    <Form onSubmit={handleRegistration}>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>

      {/* Add additional fields based on user type here */}
      {userType === 'business' && (
        <Form.Group className="mb-3">
          <Form.Label>Business Name</Form.Label>
          <Form.Control type="text" placeholder="Business name" />
        </Form.Group>
      )}

      {/* ... other fields for admin or customer ... */}

      <Button variant="primary" type="submit">
        Register as {userType}
      </Button>
    </Form>
  );
}
