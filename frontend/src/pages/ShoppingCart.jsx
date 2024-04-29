import React from "react";
import image from '../../DB_html/assets/img/dogs/image2.jpeg';

export default function ShoppingCart() {
    return (
        <div className="card">
            <div className="row">
                <div className="col-md-6 cart">
                    <div className="title">
                        <div className="row">
                            <div className="col"><h4><b>Shopping Cart</b></h4></div>
                            {/* <div className="col align-self-center text-right text-muted">3 items</div> */}
                        </div>
                    </div>
                    <div className="row-md-6">
                        <Item name="Crochet Hat" price="10₺" count="1" />
                        <Item name="Hat" price="10₺" count="5" />
                        <Item name="Knitted sweater" price="10₺" count="4" />
                    </div>
                </div>
                <CreditCardDetails></CreditCardDetails>
            </div>
        </div>

    );
}

function CreditCardDetails() {
    return (
        <>
            <div className="col-md-6 d-flex justify-content-center">
                <div className="card-details">
                    <h3 className="title">Credit Card Details</h3>
                    <div className="row">
                        <div className="form-group col-sm-8">
                            <label htmlFor="card-holder">Card Holder</label>
                            <input id="card-holder" type="text" className="form-control" placeholder="Card Holder" aria-label="Card Holder" aria-describedby="basic-addon1" />
                            <label htmlFor="card-number">Card Number</label>
                            <input id="card-number" type="text" className="form-control" placeholder="Card Number" aria-label="Card Holder" aria-describedby="basic-addon1" />
                        </div>
                        <div className="form-group col-sm-4 d-flex flex-column">
                            <label htmlFor="cvc">CVC</label>
                            <input id="cvc" type="text" className="form-control" placeholder="CVC" aria-label="Card Holder" aria-describedby="basic-addon1" />
                            <label htmlFor="">Expiration Date</label>
                            <div className="input-group expiration-date">
                                <input type="text" className="form-control" placeholder="MM" aria-label="MM" aria-describedby="basic-addon1" />
                                <span className="date-separator m-2">/</span>
                                <input type="text" className="form-control" placeholder="YY" aria-label="YY" aria-describedby="basic-addon1" />
                            </div>
                        </div>
                        <div className="form-group col-sm-12">
                            <button type="button" className="btn btn-primary btn-block">Proceed</button>
                        </div>
                    </div>
                    {/* <div className="back-to-shop"><a href="#">&leftarrow;</a><span className="text-muted">Back to shop</span></div> */}
                </div>
            </div>
        </>
    );
}

function Item(props) {
    const { name, price, count } = props;
    return (
        <div className="row border-top border-bottom">
            <div className="row main align-items-center">
                <div className="col-2"><img className="img-fluid rounded-start rounded-end" src={image}></img></div>
                <div className="col">
                    {/* <div className="row text-muted">Shirt</div> */}
                    <div className="row">{name}</div>
                </div>
                <div className="col">
                    <h5><a className="m-2">-</a><a>{count}</a><a className="m-2" >+</a></h5>
                </div>
                <div className="col">{price}<span className="close m-2">&#10005;</span></div>
            </div>
        </div>
    );
}