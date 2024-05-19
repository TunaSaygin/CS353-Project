import React, { useEffect, useState } from "react";
import img1 from '../../DB_html/assets/img/dogs/image1.jpeg';
import axios from "axios";

export default function ProductDetail({hideButtons, id}) {
    const [data,setData] = useState(null);
    const [error, setError] = useState(null);
    const baseURL = "http://localhost:8080/";
    useEffect(() => {
       async function getData() {
            try{
                console.log(id);
                const res = await axios.get(`${baseURL}purchase/view-product/`, {selected_pid: id});
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
                            <Product name="Crochet Hat" hideButtons={hideButtons} about="Handmade hat that I made using recycled wool. It is eco-friendly. It is made of elastic wool so it is one size fits all." price="100₺" username="Sila's Mini Shop"></Product>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Product(props) {
    function handleCart(e) {
        e.preventDefault();
        console.log("added to the cart");
    }
    
    function handleFavorites(e) {
        e.preventDefault();
        console.log("added to the favs");
    }
    const{name, about, price, username, hideButtons} = props;
    return (
        <>
            <div className="col-lg-6">
                <div className="text-center p-4"> 
                    <img className="rounded img-fluid" id="main-image" src={img1} alt="Product Main" /> 
                </div>
            </div>
            <div className="col-lg-6">
                <div className="product p-4">
                    <div className="mt-4 mb-3"> 
                        <span className="text-muted brand">{username}</span>
                        <h5>{name}</h5>
                        <span className="act-price">{price}</span>
                    </div>
                    <p className="about">{about}</p>
                    {hideButtons || <div className="cart mt-4 align-items-center"> 
                        <button onClick={handleCart} className="btn btn-primary mr-2 px-4">Add to cart<i className="fa fa-shopping-cart m-2"></i></button> 
                        <button onClick={handleFavorites} className="btn btn-danger m-2"><i className="fa fa-heart"></i></button>
                    </div>}
                </div>
            </div>
        </>
    )
}
