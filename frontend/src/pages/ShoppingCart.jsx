import React from "react";
import image from '../../DB_html/assets/img/dogs/image2.jpeg';

export default function ShoppingCart() {
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
                        <Item name="Crochet Hat" price="10₺" count="1" />
                        <Item name="Hat" price="10₺" count="5" />
                        <Item name="Knitted sweater" price="10₺" count="4" />
                    </div>
                </div>
            </div>
        </div>

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