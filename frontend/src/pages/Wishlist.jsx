import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import ProductDetail from './ProductDetail';
import axios from 'axios';
const mockProducts = [
    { id: 1, name: "Wireless Mouse", inventory: 15, inCart: false },
    { id: 2, name: "Keyboard", inventory: 8, inCart: false },
    { id: 3, name: "HD Monitor", inventory: 11, inCart: false },
    { id: 4, name: "Desk Lamp", inventory: 5, inCart: false }
];

function Wishlist() {
    const token = window.localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const [products, setProducts] = useState([]);
    const baseURL = "http://localhost:8080/purchase/";
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try{
                const response = await axios.get(`${baseURL}get-wishlist/`);
                setProducts(response.data);
            }
            catch(error) {
                setError(error);
            }
        }
        fetchData();
    }, [])
    const handleClose = () => {
        setShowModal(false);
      };
    const handleDetails = () =>{
        setShowModal(true);
    };
    const removeFromWishlist = async (id) => {
            async function deleteItem(id) {
                try {
                    console.log(id);
                    const r1 = await axios.delete(`${baseURL}delete-from-wishlist/`,{ data: {p_id: id}});
                    const response = await axios.get(`${baseURL}get-wishlist/`);
                    setProducts(response.data);
                }
                catch(error) {
                    setError(error.message);
                }
            }
            deleteItem(id);
    };

    const addToCart = id => {
        setProducts(products.map(product => {
            if (product.id === id) {
                return { ...product, inCart: true };
            }
            return product;
        }));
    };

    if(error) {
        return(
            <div>
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="my-4">Wishlist</h1>
            <div className="list-group">
                {products.length > 0 ? (products.map(product => (
                    <div key={product.p_id} className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{product.name}</h5>
                            <small>Inventory: {product.inventory}</small>
                        </div>
                        <p className="mb-1">Description or more details can go here if needed.</p>
                        <div>
                            <button className="btn btn-primary" onClick={() => addToCart(product.p_id)}>
                                Add to cart
                            </button>
                            <button className="btn btn-primary ms-2" onClick={handleDetails} >
                                View Details
                            </button>
                            <button className="btn btn-danger ms-2" onClick={() => removeFromWishlist(product.p_id)}>
                                Remove
                            </button>
                        </div>
                        <Modal show={showModal} onHide={handleClose} size="lg" centered>
                            <Modal.Header closeButton>
                            <Modal.Title>Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ProductDetail hideButtons={true}></ProductDetail>
                            </Modal.Body>
                        </Modal>
                    </div>
                ))): <div><h2>You do not have items in your wishlist.</h2></div>}
            </div>
        </div>
    );
}

export default Wishlist;
