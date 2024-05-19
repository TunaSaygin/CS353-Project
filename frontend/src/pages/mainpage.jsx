import React, { useEffect, useState } from "react";
import image from '../../DB_html/assets/img/dogs/image3.jpeg';
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import axios from "axios";

export default function Mainpage() {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(null);
    const baseURL = "http://localhost:8080/purchase/all-products/";
    const token = window.localStorage.getItem("token");
    const [min,setMin] = useState(null);
    const [max, setMax] = useState(null);
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
        fetchData();
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
            console.log(`${baseURL}?search_str=${search}&min_price=${min ? min : ""}&max_price=${max ? max: ""}`);
            const res = await axios.get(`${baseURL}?search_str=${search ? search : ""}&min_price=${min ? min : ""}&max_price=${max ? max: ""}`);
            setProducts(res.data);
        }
        catch(error) {
            setError(error);
        }
    }

    return (
        <>
           <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-sm-12">
                    <div className="row">
                        <div className="col-sm-2 mb-3">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="form-control"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-2 mb-3">
                            <input onChange={(e) => setMin(e.target.value)} className="form-control" type="number" placeholder="Min"></input>
                        </div>
                        <div className="col-sm-2 mb-3">
                            <input onChange={(e) => setMax(e.target.value)} className="form-control" type="number" placeholder="Max"></input>
                        </div>
                        <div className="col-sm-2 mb-3">
                            <button onClick={(e) => handleSearch(e)} className="btn btn-primary w-100">Filter</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            <div className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    {products.map((product) => (
                        <Product key={product[1]} name={product[4]} price={product[3]} id={product[1]} image_name = {product[9]}/>
                    ))}
                </div>
            </div>
        </>
    );
}

function Product(props) {
    const imageURL = "http://localhost:8080/product/photo/";
    const purchaseURL = "http://localhost:8080/purchase/";
    const [show, setShow] = useState(false);
    const token = window.localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const [error, setError] = useState(null);

    function hideModal() {
        setShow(false);
    }

    const handleDetails = () => {
        setShow(true);
    }

    const { name, price, id, image_name } = props;

    const handleCart = async () => {
        try {
            const response = await axios.post(`${purchaseURL}add-to-cart/`, {product_id: id, quantity: 1});
        }
        catch(error) {
            setError(error);
        }
    }

    const handleWishList = async () => {
        try {
            const response = await axios.post(`${purchaseURL}add-to-wishlist/`, {p_id: id});
        }
        catch(error) {
            setError(error);
        }
    }

    if(error) {
        setError(null);
        return(
            <div>
                <h2>Error occurred while adding.</h2>
            </div>
        );
    }

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
                                        <button className="btn btn-outline-primary mb-2 btn-sm" type="button" onClick={handleWishList}>Add to wishlist</button>
                                        <button className="btn btn-outline-primary btn-sm" type="button" onClick={handleCart}>Add to cart</button>
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
