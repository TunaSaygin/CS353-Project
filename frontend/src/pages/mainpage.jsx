import React from "react";
import image from '../../DB_html/assets/img/dogs/image3.jpeg';
import { Modal } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductDetail from "./ProductDetail";

export default function Mainpage() {
    return (
        <>
            <div className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        // value={searchQuery}
                        // onChange={handleSearchChange}
                        className="form-control mb-3"
                    />
                </div>
            </div>
            <div className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <Product name="Crochet Top" price="12.05₺" />
                    <Product name="Handmade Incense Holder" price="100.99₺" />
                    <Product name="Pottery" price="255₺" />
                    <Product name="Knitted Sweater" price="350₺" />
                    <Product name="Knitted Sweater" price="350₺" />
                </div>
            </div>
        </>

    );
}

function Product(props) {
    const [show, setShow] = useState(false);
    function hideModal() {
        setShow(false);
    }
    const handleDetails = (e) => {
        console.log("click");
        setShow(true);
    }
    const { name, price } = props;
    return (
        <>
            <div className="col-md-4 mb-2 justify-items-center">
                <div className="card col-md-9">
                    <div className="row-md-6">
                        <div >
                            <img src={image} className="img-fluid rounded-start rounded-end" alt="product" />


                            <div className="card-body">
                                <h5 className="card-title">{name}</h5>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4 className="card-price">{price}</h4>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <button className="btn btn-primary btn-sm mb-2" type="button" onClick={handleDetails}>Details</button>
                                        <button className="btn btn-outline-primary mb-2  btn-sm" type="button">Add to wishlist</button>
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
                    <ProductDetail></ProductDetail>
                </Modal.Body>
            </Modal>
        </>
    );
}
