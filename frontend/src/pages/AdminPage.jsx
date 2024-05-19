import React, { useEffect, useState } from 'react';
import { Button, Table, InputGroup, FormControl, Container, Row, Col, Nav,Modal,Form } from 'react-bootstrap';
import Dashboard from '../components/graph';
import ProductDetail from './ProductDetail';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('businesses');
  const [searchQuery, setSearchQuery] = useState('');
  const token = window.localStorage.getItem("token");
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const [businessData, setBusinessData] = useState([]);
  const [productData,setProductData] = useState([]);
  const [customerData,setCustomerData] = useState([])
  const [transactionData, setTransactionData] = useState([])
  const [categoryData,setCategoryData] = useState([])
  const {user, baseUrl} = useAuth()
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/activity/get-all-businesses/`);
        console.log(response.data)
        setBusinessData(response.data);
      } catch (error) {
        console.error('Error fetching business data:', error);
      }
    };
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/purchase/all-products/`);
        console.log(response.data);
        setProductData(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/activity/get-all-customers/`);
        console.log("customerData",response.data);
        setCustomerData(response.data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/activity/get-all-purchases/`);
        console.log(response.data);
        setTransactionData(response.data);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/product/list-categories/`);
        setCategoryData(response.data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };
    fetchBusinessData();
    fetchProductData();
    fetchCustomerData();
    fetchTransactionData();
    fetchCategoryData();
  }, [baseUrl]);
  const reports = [
    { name: 'Admin1', date: '2023-04-21'},
    { name: 'Admin2', date: '2023-04-18'},
    { name: 'Admin3', date: '2023-04-15'},
  ];

  // const transactionData = [
  //   { name: 'Tuna Saygın', action: 'Purchased', business: 'Beymen', product: 'Pantalon', date: '24/3/2024' },
  //   { name: 'Sıla Özel', action: 'Purchased', business: 'Bershka', product: 'Etek', date: '23/3/2024' },
  //   { name: 'Ece Beyhan', action: 'Purchased', business: 'Boyner', product: 'Mont Mavi', date: '22/3/2024' },
  //   { name: 'Burhan Tabak', action: 'Purchased', business: 'Tepe Home', product: 'Sabun', date: '16/3/2024' },
  //   { name: 'Tuna Saygın', action: 'Returned', business: 'Tepe Home', product: 'Havlul', date: '14/3/2024' },
  //   { name: 'Işıl Özgü', action: 'Purchased', business: 'D&R', product: 'Masa Lambası x2', date: '29/2/2024' },
  //   { name: 'Tuna Cuma', action: 'Returned', business: 'M&S', product: 'Çorap', date: '21/2/2024' },
  // ];
  // const productData = [
  //   { name: 'Eco-Friendly Water Bottle', inventory: 150, sold: 200, price: '$15.99', category: 'Outdoor', business: 'Nature Goods Co.' },
  //   { name: 'Wireless Headphones', inventory: 75, sold: 50, price: '$89.99', category: 'Electronics', business: 'Tech Trends' },
  //   { name: 'Organic Cotton T-Shirt', inventory: 200, sold: 150, price: '$19.99', category: 'Apparel', business: 'EcoWear' },
  //   { name: 'Professional Yoga Mat', inventory: 80, sold: 120, price: '$34.99', category: 'Fitness', business: 'Yoga Essentials' },
  //   { name: 'Gourmet Coffee Beans', inventory: 300, sold: 250, price: '$12.99', category: 'Food', business: 'Aroma Brew' },
  //   { name: 'LED Desk Lamp', inventory: 50, sold: 100, price: '$45.99', category: 'Furniture', business: 'BrightLife' }
  // ];
  // const categoryData = [
  //   { name: 'Electronics', totalProducts: 320, image: 'imageURL1' },
  //   { name: 'Clothing', totalProducts: 150, image: 'imageURL2' },
  //   { name: 'Home & Garden', totalProducts: 215, image: 'imageURL3' },
  //   { name: 'Toys & Games', totalProducts: 89, image: 'imageURL4' },
  //   { name: 'Sports', totalProducts: 78, image: 'imageURL5' }
  // ];
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
           <CategoryTable categories={categoryData} setCategoryData = {setCategoryData}/>
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
            <td>{business.income}</td>
            <td>{business.product_name}</td>
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
          <tr key={customer.id}>
            <td>{customer.name}</td>
            <td>{customer.delivery_address}</td>
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
  console.log("transactions",transactions);
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
              <td>{transaction.customer_name}</td>
              <td>{transaction.return_date ?"Return":"Purchase"}</td>
              <td>{transaction.business_name}</td>
              <td>{transaction.product_name}</td>
              <td>{transaction.return_date ? transaction.return_date:transaction.p_date}</td>
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
            <th>Price</th>
            <th>Product Material</th>
            <th>Associated Business</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product[4]}</td>
              <td>{product[5]}</td>
              <td>{product[3]}</td>
              <td>{product[10]}</td>
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
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductDetail hideButtons={true}></ProductDetail>
        </Modal.Body>
      </Modal>
    </>
  );
}
function CategoryTable({categories, setCategoryData}){
  const {baseUrl} = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedCategory,setSelectedCategory] = useState(null);
  const handleView = (category = null) => {
    setModalContent('Update Category');
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleAddCategory = () => {
    setModalContent('Add Category');
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (modalContent === 'Add Category'){
      addCategory(name);
    }
    else if(modalContent === 'Update Category'){
      updateCategory(selectedCategory.category_id,name);
    }
    onSave({ name, image });
  };
  const addCategory = async (categoryName) => {
    try {
      const response = await axios.post(`${baseUrl}/product/add-category/`, {
        category_name: categoryName,
      });
      console.log('Category added:', response.data);
      fetch_response = await axios.get(`${baseUrl}/product/list-categories/`);
      setCategoryData(fetch_response.data);
      setShowModal(false)
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error.response ? error.response.data : error);
      throw error;
    }
  };
  
  // Method to update an existing category
  const updateCategory = async (categoryId, categoryName) => {
    try {
      const response = await axios.post(`${baseUrl}/product/update-category/`, {
        category_id: categoryId,
        category_name: categoryName,
      });
      console.log('Category updated:', response.data);
      fetch_response = await axios.get(`${baseUrl}/product/list-categories/`);
      setCategoryData(fetch_response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error.response ? error.response.data : error);
      throw error;
    }
  };
  
  // Method to delete a category
  const deleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(`${baseUrl}/product/delete-category/`, {
        data: { category_id: categoryId },
      });
      console.log('Category deleted:', response.data);
      fetch_response = await axios.get(`${baseUrl}/product/list-categories/`);
      setCategoryData(fetch_response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error.response ? error.response.data : error);
      throw error;
    }
  };

  return(
    <>
      <Button variant="primary" onClick={handleAddCategory}>Add Category</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Total Product Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index}>
              <td>{category.category_name}</td>
              <td>0</td>
              <td>
                <div>
                  <Button variant="outline-primary" onClick={() => handleView(category)}>Update</Button>
                  <Button variant="outline-primary" onClick={()=>{deleteCategory(category.category_id)}}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Category Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Save Category
      </Button>
     </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}