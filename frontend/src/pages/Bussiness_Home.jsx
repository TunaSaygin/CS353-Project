import React, { useCallback, useEffect, useState } from 'react'
import image from '../../DB_html/assets/img/dogs/image3.jpeg';
import img2 from '../../DB_html/assets/img/dogs/image2.jpeg';
import { useAuth } from '../context/authcontext';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';

export default function BusinessHome() {
  const {user, baseUrl} = useAuth()
  const [products, setProducts] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([])
  const token = window.localStorage.getItem("token");
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [newProduct, setNewProduct] = useState({
    inventory: '',
    current_price: '',
    name: '',
    return_period: '',
    description: '',
    recipient_type: '',
    materials: ''
  });
  const [imageFile, setImageFile] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/purchase/business-products`); // Update with your actual API endpoint
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      const fetchCategories = async () => {
        try {
          const response = await axios.get(`${baseUrl}/product/list-categories/`);
          setCategories(response.data);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
    
      fetchCategories();
    };

    fetchProducts();
  }, []);
  const handleShowModal = (product = null) => {
    setSelectedProduct(product);
    if (product) {
      setNewProduct({
        inventory: product.inventory,
        current_price: product.current_price,
        name: product.name,
        return_period: product.return_period,
        description: product.description,
        recipient_type: product.recipient_type,
        materials: product.materials,
      });
      setIsUpdating(true);
    } else {
      setNewProduct({
        inventory: '',
        current_price: '',
        name: '',
        return_period: '',
        description: '',
        recipient_type: '',
        materials: '',
      });
      setIsUpdating(false);
    }
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);
  const validateForm = () => {
    console.log("in validate")
    const newErrors = {};
    if (!newProduct.name) newErrors.name = 'Product Name is required';
    if (!newProduct.current_price || newProduct.current_price<=0) newErrors.current_price = 'Current Price is required';
    if (!newProduct.inventory || newProduct.inventory<=0) newErrors.inventory = 'Inventory is required';
    if (!newProduct.return_period || newProduct.return_period<=0) newErrors.return_period = 'Return Period is required';
    if (!newProduct.category_id ) newErrors.category_id = 'Category is required';
    if (!newProduct.description) newErrors.description = 'Description is required';
    if (!newProduct.recipient_type) newErrors.recipient_type = 'Recipient Type is required';
    if (!newProduct.materials) newErrors.materials = 'Materials are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach((key) => {
        formData.append(key, newProduct[key]);
      });
      if (imageFile) {
        formData.append('file', imageFile);
      }

      console.log("isUpdating",isUpdating, "/selectedProduct",selectedProduct)
      if (isUpdating && selectedProduct) {
        // Update the product
        formData.append('p_id', selectedProduct.p_id);
        console.log("formdata",formData)
        await axios.post(`http://localhost:8080/product/update-product/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Update the product photo if imageFile is available
        if (imageFile) {
          await axios.post('http://localhost:8080/product/update-photo/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
      } else {
        // Create the product
        const productResponse = await axios.post('http://localhost:8080/product/createProduct/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const p_id = productResponse.data.p_id;
        console.log("form data", formData)
        // Upload the product photo if imageFile is available
        if (imageFile) {
          const photoFormData = new FormData();
          photoFormData.append('p_id', p_id);
          photoFormData.append('file', imageFile);
          await axios.post('http://localhost:8080/product/upload_photo', photoFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
      }

      // Fetch updated products list
      const updatedProducts = await axios.get('http://localhost:8080/purchase/business-products');
      setProducts(updatedProducts.data);

      handleCloseModal();
    } catch (error) {
      console.error('Error adding/updating product:', error);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageFile(file);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onDrop(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    onDrop(e.target.files);
  };
  return (
    <div>
      <BusinessProfile compName={`${user.name}'s business`} email={user.email}  handleShowModal={handleShowModal}></BusinessProfile>
      <ProductList products={products} handleShowModal={handleShowModal}></ProductList>
      <AddProductModal
        show={showModal}
        isUpdating={isUpdating}
        handleClose={handleCloseModal}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        newProduct={newProduct}
        handleFileChange={handleFileChange}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        categories={categories}
        imageFile={imageFile}
        errors={errors}
      />
    </div>
  );
}

function BusinessProfile(props) {
  const { compName, email, handleShowModal } = props;
  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className='col-md-6'>
          <div className='card'>
            <div className='row-md-3 justify-content-center d-flex'>
              <div className='col-sm-5'>
                <img src={img2} className='img-fluid' style={{ borderRadius: '50%' }}></img>
              </div>
              <div className='col-sm-5'>
                <h4>{compName}</h4>
                <h6>{email}</h6>
                <Button variant="primary" onClick={()=>{handleShowModal(null)}}>
                  Add Product
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductList(props) {
  const { products, handleShowModal } = props;
  const imageURL = "http://localhost:8080/product/photo/"
  console.log(products);
  const productItems = products.map(product => (
    <div key={product.id} className="col-md-4 mb-2 justify-items-center">
      <div className="card">
        <div className="row-md-6">
          <div>
            {product.photo_metadata?
            <img src={`${imageURL}${product.photo_metadata}/`} className="img-fluid rounded-start rounded-end" alt="product" />
            :<img src={image} className="img-fluid rounded-start rounded-end" alt="product" />}
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="card-price">{product.current_price}$</h4>
                </div>
                <div className="d-flex flex-column">
                <button className="btn btn-outline-primary mb-2 btn-sm" type="button" onClick={() => handleShowModal(product)}>Update</button>
                <button className="btn btn-outline-primary btn-sm" type="button">Delete</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        {productItems}
      </div>
    </div>
  );
}
function AddProductModal({ errors, categories,show, handleClose, handleInputChange, handleFormSubmit, newProduct, handleFileChange, handleDragOver, handleDrop, imageFile, isUpdating }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isUpdating ? 'Update Product' : 'Add New Product'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formProductName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProductPrice">
            <Form.Label>Current Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter product price"
              name="current_price"
              value={newProduct.current_price}
              onChange={handleInputChange}
              isInvalid={!!errors.current_price}
            />
            <Form.Control.Feedback type="invalid">
              {errors.current_price}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProductInventory">
            <Form.Label>Inventory</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter product inventory"
              name="inventory"
              value={newProduct.inventory}
              onChange={handleInputChange}
              isInvalid={!!errors.inventory}
            />
            <Form.Control.Feedback type="invalid">
              {errors.inventory}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formReturnPeriod">
            <Form.Label>Return Period</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter return period"
              name="return_period"
              value={newProduct.return_period}
              onChange={handleInputChange}
              isInvalid={!!errors.return_period}
            />
            <Form.Control.Feedback type="invalid">
              {errors.return_period}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="category_id"
              value={newProduct.category_id}
              onChange={handleInputChange}
              isInvalid={!!errors.category_id}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.category_id}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProductDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter product description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              isInvalid={!!errors.description}
            />
             <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRecipientType">
            <Form.Label>Recipient Type</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter recipient type"
              name="recipient_type"
              value={newProduct.recipient_type}
              onChange={handleInputChange}
              isInvalid={!!errors.recipient_type}
            />
            <Form.Control.Feedback type="invalid">
              {errors.recipient_type}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMaterials">
            <Form.Label>Materials</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter materials"
              name="materials"
              value={newProduct.materials}
              onChange={handleInputChange}
              isInvalid={!!errors.materials}
            />
             <Form.Control.Feedback type="invalid">
              {errors.materials}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}
              >
                <p>Change Image</p>
                {imageFile ? (
                  <img src={URL.createObjectURL(imageFile)} alt="Product" style={{ maxWidth: '100%' }} />
                ) : (
                  'Drag and drop an image file here, or click to select a file'
                )}
                <Form.Control type="file" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
            </Form.Label>
          </Form.Group>

          <Button variant="primary" type="submit">
            {isUpdating ? 'Update Product' : 'Add Product'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}