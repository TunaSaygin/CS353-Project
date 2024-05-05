import React from "react";

export default function CreditCardDetails() {
    function handleSubmit(e) {
        console.log("clicked");
        e.preventDefault();
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="row justify-content-center d-flex">
                <div className="col-md-12 d-flex justify-content-center">
                    <div className="card-details justify-content-center d-flex">
                        <div className="row justify-content-center d-flex">
                            <div className="form-group col-sm-12 d-flex flex-column">
                                <h3 className="title">Credit Card Details</h3>
                                <label htmlFor="card-holder" className="mb-2 mt-2">Card Holder</label>
                                <input id="card-holder" type="text" className="form-control" placeholder="Card Holder"/>
                                <label htmlFor="card-number" className="mb-2 mt-2">Card Number</label>
                                <input id="card-number" type="text" minLength={16} maxLength={16} className="form-control" placeholder="Card Number" aria-label="Card Holder" aria-describedby="basic-addon1" />
                                <label htmlFor="cvc" className="mb-2 mt-2">CVC</label>
                                <input id="cvc" type="text" className="form-control" maxLength={3} minLength={3} placeholder="CVC" aria-label="Card Holder" aria-describedby="basic-addon1" />
                                <label htmlFor="expiration" className="mb-2 mt-2">Expiration Date</label>
                                <div id="expiration" className="input-group expiration-date">
                                    <input type="text" className="form-control" minLength={2} maxLength={2} placeholder="MM" aria-label="MM" aria-describedby="basic-addon1" />
                                    <span className="date-separator m-2">/</span>
                                    <input type="text" className="form-control" minLength={2} maxLength={2} placeholder="YY" aria-label="YY" aria-describedby="basic-addon1" />
                                </div>
                                <label htmlFor="amount" className="mb-2 mt-2">Amount</label>
                                <input className="form-control" type="number" placeholder="Enter Amount" min={1}></input>
                                <div className="form-group col justify-content-center d-flex">
                                    <button type="submit" className="btn btn-primary btn-block mt-2">Add Balance</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}