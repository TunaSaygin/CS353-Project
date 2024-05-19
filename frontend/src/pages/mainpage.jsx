import React, { useEffect, useState } from "react";
import image from '../../DB_html/assets/img/dogs/image3.jpeg';
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import axios from "axios";

export default function Mainpage() {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(null);
    const [categories, setCategories] = useState([]);
    const baseURL = "http://localhost:8080/purchase/all-products/";
    const token = window.localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(baseURL);
                setProducts(response.data); // Set the data state with the fetched data
                setLoading(false); // Set loading to false since data is fetched
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        const fetchCategories = async () => {
            try {
              const response = await axios.get(`${baseUrl}/product/list-categories/`);
              setCategories(response.data);
            } catch (error) {
              console.error('Error fetching categories:', error);
            }
          };
        fetchData();
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h2>Error: {error.message}</h2>
            </div>
        );
    }

    async function handleSearch(e) {
        e.preventDefault();
        try {
            const res = await axios.get(`${baseURL}?search_str=${search}`);
            setProducts(res.data);
        }
        catch(error) {
            setError(error);
        }
    }
    const handleCategoryClick = async (categoryId) => {
        setSelectedCategory(categoryId);
        try {
          const response = await axios.get(`${baseUrl}/purchase/all-products/?product_type=${categoryId}&search_str=${search}`);
          setProducts(response.data);
        } catch (error) {
          console.error('Error filtering products:', error);
        }
      };
    return (
        <>
             <Container>
      <Row className="my-4">
        <Col>
          <h1 className="text-center">Product Categories</h1>
          <div className="d-flex justify-content-center flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.category_id}
                variant={selectedCategory === category.category_id ? 'primary' : 'outline-primary'}
                onClick={() => handleCategoryClick(category.category_id)}
                className="m-2"
              >
                {category.category_name}
              </Button>
            ))}
          </div>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search..."
            onChange={(e) => handleCategoryClick(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        {products.map((product) => (
          <Col key={product.p_id} md={4} className="mb-4">
            <div className="card">
              <img
                src={product.photo_metadata ? `${baseUrl}/product/photo/${product.photo_metadata}/` : 'default-image-url'}
                className="card-img-top"
                alt={product.name}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.current_price}₺</p>
                <Button variant="primary">Details</Button>
                <Button variant="secondary" className="ml-2">Add to Wishlist</Button>
                <Button variant="success" className="ml-2">Add to Cart</Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
        </>
    );
}

function Product(props) {
    const imageURL = "http://localhost:8080/product/photo/"
    const [show, setShow] = useState(false);

    function hideModal() {
        setShow(false);
    }

    const handleDetails = () => {
        setShow(true);
    }

    const { name, price, id, image_name } = props;

    return (
        <>
            <div className="col-md-4 mb-2 justify-items-center">
                <div className="card col-md-9">
                    <div className="row-md-6">
                        <div>
                            {image_name? <img src={`${imageURL}${image_name}/`} className="img-fluid rounded-start rounded-end" alt="product" />
                            :
                            <img src={image} className="img-fluid rounded-start rounded-end" alt="product" />}
                            <div className="card-body">
                                <h5 className="card-title">{name}</h5>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4 className="card-price">{price}₺</h4>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <button className="btn btn-primary btn-sm mb-2" type="button" onClick={handleDetails}>Details</button>
                                        <button className="btn btn-outline-primary mb-2 btn-sm" type="button">Add to wishlist</button>
                                        <button className="btn btn-outline-primary btn-sm" type="button">Add to cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={hideModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductDetail hideButtons={false} id={id} />
                </Modal.Body>
            </Modal>
        </>
    );
}
