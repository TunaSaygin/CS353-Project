import React, { useEffect, useState } from "react";
import img1 from '../assets/img_placeholder.png';
import axios from "axios";

export default function ProductDetail({hideButtons, id}) {
    const [data,setData] = useState(null);
    const [error, setError] = useState(null);
    const baseURL = "http://localhost:8080/";
    const token = window.localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    useEffect(() => {
       async function getData() {
            try{
                console.log("here id");
                console.log(id);
                const res = await axios.get(`${baseURL}purchase/view-product/${id}/`);
                setData(res.data);
                console.log(res.data);
            }
            catch(error) {
                setError(error);
            }
       }
       getData();
    }, [])
    
    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="row">
                            {data ? <Product name={data.name} hideButtons={hideButtons} price={data.current_price} image_name={data.photo_metadata} business_name={data.business_name} inventory={data.inventory} description={data.description}></Product>: <></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Product(props) {
    const imageURL = "http://localhost:8080/product/photo/";
    function handleCart(e) {
        e.preventDefault();
        console.log("added to the cart");
    }
    
    function handleFavorites(e) {
        e.preventDefault();
        console.log("added to the favs");
    }
    const{name, about, price, hideButtons, image_name, business_name, inventory, description} = props;
    return (
        <>
            <div className="col-lg-6">
                <div className="text-center p-4"> 
                {image_name? <img src={`${imageURL}${image_name}/`} className="img-fluid rounded-start rounded-end" alt="product" />
                            :
                            <img src={img1} className="img-fluid rounded-start rounded-end" alt="product" />}
                </div>
            </div>
            <div className="col-lg-6">
                <div className="product p-4">
                    <div className="mt-4 mb-3"> 
                        <span className="text-muted brand">Business: {business_name}</span>
                        <h5>{name}</h5>
                        <p className="act-price">Price: {price}₺</p>
                        <p className="act-price">Inventory: {inventory}</p>
                        {description ? <p className="act-price">Description: {description}</p>: <></>}
                    </div>
                    <p className="about">{about}</p>
                    {/* {hideButtons || <div className="cart mt-4 align-items-center"> 
                        <button onClick={handleCart} className="btn btn-primary mr-2 px-4">Add to cart<i className="fa fa-shopping-cart m-2"></i></button> 
                        <button onClick={handleFavorites} className="btn btn-danger m-2"><i className="fa fa-heart"></i></button>
                    </div>} */}
                </div>
            </div>
        </>
    )
}
