import React, { useEffect, useState } from "react";
import image from '../../DB_html/assets/img/dogs/image2.jpeg';
import axios from "axios";
import { useAuth } from "../context/authcontext";

export default function ShoppingCart() {
    const [prods, setProds] = useState([]);
    const [error, setError] = useState(null);
    const {reloadProfileChanges} = useAuth();
    const baseURL = "http://localhost:8080/purchase/";
    const token = window.localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const imageURL = "http://localhost:8080/product/photo/";
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseURL}get-shopping-cart/`);
                console.log("here");
                console.log(response.data);
                setProds(response.data);
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, []);

    async function deleteItem(id) {
        try {
            const r1 = await axios.delete(`${baseURL}delete-from-shopping-cart/`, { data: { p_id: id } });
            const r2 = await axios.get(`${baseURL}get-shopping-cart/`);
            setProds(r2.data);
        }
        catch(error) {
            setError(error);
        }
    }

    async function handleIncrease(id) {
        try {
            const response = await axios.post(`${baseURL}add-to-cart/`, {product_id: id, quantity: 1});
            const r = await axios.get(`${baseURL}get-shopping-cart/`);
            setProds(r.data);
        }
        catch(error) {
            setError(error);
        }
    }

    async function handleDecrease(id) {
        try {
            const r1 = await axios.put(`${baseURL}decrease-cart-item/`, {p_id: id});
            const r2 = await axios.get(`${baseURL}get-shopping-cart/`);
            setProds(r2.data);
        }
        catch(error) {
            setError(error);
        }
    }

    async function handlePurchase() {
        try {
            const res = await axios.post(`${baseURL}purchase/`);
            const r = await axios.get(`${baseURL}get-shopping-cart/`);
            setProds(r.data);
            reloadProfileChanges();
        }
        catch(error) {
            setError(error)
        }
    }

    if (error) {
        return (
            <div>
                <h2>Error: {error.message}</h2>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="row justify-content-center d-flex">
                <div className="col-md-10 cart">
                    <div className="title">
                        <div className="row">
                            <div className="col"><h4><b>Shopping Cart</b></h4></div>
                            {/* <div className="col align-self-center text-right text-muted">3 items</div> */}
                        </div>
                    </div>
                    <div className="row-md-6">
                        {prods.length > 0 ? (
                            prods.map((product) => (
                                // <Item 
                                //     key={product.p_id} 
                                //     id = {product.p_id}
                                //     name={product.name} 
                                //     price={product.current_price} 
                                //     count={product.quantity} 
                                // />
                                <div key={product.p_id} className="row border-top border-bottom">
                                    <div className="row main align-items-center">
                                        <div className="col-2">
                                            {product.photo_name ? 
                                            <img className="img-fluid rounded-start rounded-end" src={`${imageURL}${product.photo_name}/`} alt={product.name} />
                                            :<img className="img-fluid rounded-start rounded-end" src={image} alt={product.name} />}
                                        </div>
                                        <div className="col">
                                            {/* <div className="row text-muted">Shirt</div> */}
                                            <div className="row">{product.name}</div>
                                        </div>
                                        <div className="col">
                                            <h4>
                                                <a onClick={() => handleDecrease(product.p_id)} style={{ cursor: "pointer", textDecoration: "none" }} className="m-2">-</a>
                                                <a>{product.quantity}</a>
                                                <a onClick={()=>handleIncrease(product.p_id)} style={{ cursor: "pointer", textDecoration: "none" }} className="m-2">+</a>
                                            </h4>
                                        </div>
                                        <div className="col">{product.current_price}₺<a onClick={() => deleteItem(product.p_id)} style={{ cursor: "pointer", textDecoration: "none" }} className="close m-2">&#10005;</a></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div><h2>You have no products in your cart.</h2></div>
                        )}
                    </div>
                    {prods.length > 0 && (
                    <div className="row">
                        <div className="col text-right">
                            <button onClick={handlePurchase} className="btn btn-primary">Proceed to Purchase</button>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}