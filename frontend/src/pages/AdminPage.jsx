import React, { useState } from 'react';
import { Button, Table, InputGroup, FormControl, Container, Row, Col, Nav } from 'react-bootstrap';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('businesses');
  const [searchQuery, setSearchQuery] = useState('');

  const businessData = [
    { name: 'Beymen', totalIncome: '150.032,01 TL', mostSoldProduct: 'Pantalon' },
    { name: 'Bershka', totalIncome: '148.023,62 TL', mostSoldProduct: 'Etek' },
    // ... more business data
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Container>
      <h1 className="my-4">Admin Dashboard</h1>
      <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Nav.Item>
          <Nav.Link eventKey="customers">Customers</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="businesses">Businesses</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="actions">Actions</Nav.Link>
        </Nav.Item>
      </Nav>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search..."
          onChange={handleSearch}
        />
      </InputGroup>

      {activeTab === 'businesses' && (
        <Row>
          <Col>
           <BussinessTable businessData={businessData} />
          </Col>
        </Row>
      )}

      {/* You can add similar conditional blocks for other tabs such as 'customers', 'actions', etc. */}
      
    </Container>
  );
}

function BussinessTable({businessData}){
  return(
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Business Names</th>
          <th>Total Income</th>
          <th>Most Sold Product</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {businessData.map((business, index) => (
          <tr key={index}>
            <td>{business.name}</td>
            <td>{business.totalIncome}</td>
            <td>{business.mostSoldProduct}</td>
            <td>
              <Button variant="outline-primary">Verify</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}