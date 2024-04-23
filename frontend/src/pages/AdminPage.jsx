import React, { useState } from 'react';
import { Button, Table, InputGroup, FormControl, Container, Row, Col, Nav,Modal } from 'react-bootstrap';
import Dashboard from '../components/graph';
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('businesses');
  const [searchQuery, setSearchQuery] = useState('');

  const businessData = [
    { name: 'Beymen', totalIncome: '150.032,01 TL', mostSoldProduct: 'Pantalon' },
    { name: 'Bershka', totalIncome: '148.023,62 TL', mostSoldProduct: 'Etek' },
    // ... more business data
  ];
  const customerData = [
    {name:'Tuna', deliveryAddress:'Alacaatlı Mah. Ankara 06810',balance:'5'},
    {name:'Sıla', deliveryAddress:'Bilkent Dormitories 52',balance:'55'}
  ];
  const reports = [
    { name: 'Admin1', date: '2023-04-21'},
    { name: 'Admin2', date: '2023-04-18'},
    { name: 'Admin3', date: '2023-04-15'},
  ];

  const transactionData = [
    { name: 'Tuna Saygın', action: 'Purchased', business: 'Beymen', product: 'Pantalon', date: '24/3/2024' },
    { name: 'Sıla Özel', action: 'Purchased', business: 'Bershka', product: 'Etek', date: '23/3/2024' },
    { name: 'Ece Beyhan', action: 'Purchased', business: 'Boyner', product: 'Mont Mavi', date: '22/3/2024' },
    { name: 'Burhan Tabak', action: 'Purchased', business: 'Tepe Home', product: 'Sabun', date: '16/3/2024' },
    { name: 'Tuna Saygın', action: 'Returned', business: 'Tepe Home', product: 'Havlul', date: '14/3/2024' },
    { name: 'Işıl Özgü', action: 'Purchased', business: 'D&R', product: 'Masa Lambası x2', date: '29/2/2024' },
    { name: 'Tuna Cuma', action: 'Returned', business: 'M&S', product: 'Çorap', date: '21/2/2024' },
  ];
  const productData = [
    { name: 'Eco-Friendly Water Bottle', inventory: 150, sold: 200, price: '$15.99', category: 'Outdoor', business: 'Nature Goods Co.' },
    { name: 'Wireless Headphones', inventory: 75, sold: 50, price: '$89.99', category: 'Electronics', business: 'Tech Trends' },
    { name: 'Organic Cotton T-Shirt', inventory: 200, sold: 150, price: '$19.99', category: 'Apparel', business: 'EcoWear' },
    { name: 'Professional Yoga Mat', inventory: 80, sold: 120, price: '$34.99', category: 'Fitness', business: 'Yoga Essentials' },
    { name: 'Gourmet Coffee Beans', inventory: 300, sold: 250, price: '$12.99', category: 'Food', business: 'Aroma Brew' },
    { name: 'LED Desk Lamp', inventory: 50, sold: 100, price: '$45.99', category: 'Furniture', business: 'BrightLife' }
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
          <Nav.Link eventKey="products">Products</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="categories">Categories</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="purchases_returns">Purchases/Returns</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="reports">Reports</Nav.Link>
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

    {activeTab === 'customers' && (
        <Row>
          <Col>
           <CustomerTable customers={customerData} />
          </Col>
        </Row>
      )}
      {/* You can add similar conditional blocks for other tabs such as 'customers', 'actions', etc. */}
      {activeTab === 'reports' && (
        <Row>
          <Col>
           <ReportTable reports={reports} />
          </Col>
        </Row>
      )}
      {activeTab === 'purchases_returns' && (
        <Row>
          <Col>
           <ActionTable transactions={transactionData} />
          </Col>
        </Row>
      )}
      {activeTab === 'products' && (
        <Row>
          <Col>
           <ProductTable products={productData} />
          </Col>
        </Row>
      )}
      {activeTab === 'categories' && (
        <Row>
          <Col>
           <ProductTable products={productData} />
          </Col>
        </Row>
      )}
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

function CustomerTable({customers}){
  return(
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Delivery Address</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer, index) => (
          <tr key={index}>
            <td>{customer.name}</td>
            <td>{customer.deliveryAddress}</td>
            <td>{customer.balance}</td>
            <td>
              <div>
                <Button variant="outline-primary">Verify</Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
function ReportTable({reports}){
  const [showModal, setShowModal] = useState(false);
  const handleView = () => {
    setShowModal(true);
  };

  const handleDelete = (id) => {
    console.log("Delete button is clicked");
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return(
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Admin Name</th>
            <th>Report Date</th>
            <th>Report Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={index}>
              <td>{report.name}</td>
              <td>{report.date}</td>
              <td>
                <div>
                  <Button variant="outline-primary" onClick={handleView}>View</Button>
                  <Button variant="outline-primary" onClick={() => handleDelete(index)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dashboard />
        </Modal.Body>
      </Modal>
    </>
  );
}
function ActionTable({transactions}){

  return(
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Buyer Name</th>
            <th>Actions</th>
            <th>Bussinesses</th>
            <th>Product Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.name}</td>
              <td>{transaction.action}</td>
              <td>{transaction.business}</td>
              <td>{transaction.product}</td>
              <td>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

function ProductTable({products}){
  const [showModal, setShowModal] = useState(false);
  const handleView = () => {
    setShowModal(true);
  };

  const handleDelete = (id) => {
    console.log("Delete button is clicked");
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return(
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Inventory (Remaining)</th>
            <th>Sold</th>
            <th>Price</th>
            <th>Category Name</th>
            <th>Associated Business</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.inventory}</td>
              <td>{product.sold}</td>
              <td>{product.category}</td>
              <td>{product.business}</td>
              <td>
                <div>
                  <Button variant="outline-primary" onClick={handleView}>View Details</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>Sıla senin product detailin gelecek</h1>
        </Modal.Body>
      </Modal>
    </>
  );
}
function CategoryTable({categories}){
  return(
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Total Product Number</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td>{category.name}</td>
                <td>{category.inventory}</td>
                <td>{category.sold}</td>
                <td>{category.image}</td>
                <td>
                  <div>
                    <Button variant="outline-primary" onClick={handleView}>Update</Button>
                    <Button variant="outline-primary" onClick={handleView}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>Sıla senin product detailin gelecek</h1>
        </Modal.Body>
      </Modal>
    </>
  );
}