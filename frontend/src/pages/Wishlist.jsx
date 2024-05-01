import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import ProductDetail from './ProductDetail';
const mockProducts = [
    { id: 1, name: "Wireless Mouse", inventory: 15, inCart: false },
    { id: 2, name: "Keyboard", inventory: 8, inCart: false },
    { id: 3, name: "HD Monitor", inventory: 11, inCart: false },
    { id: 4, name: "Desk Lamp", inventory: 5, inCart: false }
];

function Wishlist() {
    const [products, setProducts] = useState(mockProducts);
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => {
        setShowModal(false);
      };
    const handleDetails = () =>{
        setShowModal(true);
    };
    const removeFromWishlist = id => {
        setProducts(products.filter(product => product.id !== id));
    };

    const addToCart = id => {
        setProducts(products.map(product => {
            if (product.id === id) {
                return { ...product, inCart: true };
            }
            return product;
        }));
    };

    return (
        <div className="container">
            <h1 className="my-4">Wishlist</h1>
            <div className="list-group">
                {products.map(product => (
                    <div key={product.id} className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{product.name}</h5>
                            <small>Inventory: {product.inventory}</small>
                        </div>
                        <p className="mb-1">Description or more details can go here if needed.</p>
                        <div>
                            <button className="btn btn-primary" onClick={() => addToCart(product.id)} disabled={product.inCart}>
                                {product.inCart ? 'In Cart' : 'Add to Cart'}
                            </button>
                            <button className="btn btn-primary ms-2" onClick={handleDetails} >
                                View Details
                            </button>
                            <button className="btn btn-danger ms-2" onClick={() => removeFromWishlist(product.id)}>
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
                ))}
            </div>
        </div>
    );
}

export default Wishlist;
