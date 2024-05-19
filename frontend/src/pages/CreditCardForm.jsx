import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext";

export default function CreditCardDetails() {
    const {reloadProfileChanges} = useAuth();
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState(null);
    const [done, setDone] = useState(false);
    async function handleSubmit(e) {
        console.log("clicked");
        e.preventDefault();
        const token = window.localStorage.getItem("token");
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const response = await axios.post("http://localhost:8080/profile/update-balance/", {amount: amount});
            setDone(true);
            reloadProfileChanges();
        }
        catch(error) {
            setError(error);
        }
    }
    if (error) {
        return (
            <div>
                <h2>Error: {error.message}</h2>
            </div>
        );
    }
    if(done) {
        return(
            <>
                <h2>Balance Updated</h2>
            </>
        );
    }
    return (
        <form onSubmit={(e)=>handleSubmit(e)}>
            <div className="row justify-content-center d-flex">
                <div className="col-md-12 d-flex justify-content-center">
                    <div className="card-details justify-content-center d-flex">
                        <div className="row justify-content-center d-flex">
                            <div className="form-group col-sm-12 d-flex flex-column">
                                <h3 className="title">Credit Card Details</h3>
                                <label htmlFor="card-holder" className="mb-2 mt-2">Card Holder</label>
                                <input required id="card-holder" type="text" className="form-control" placeholder="Card Holder"/>
                                <label htmlFor="card-number" className="mb-2 mt-2">Card Number</label>
                                <input required id="card-number" type="text" minLength={16} maxLength={16} className="form-control" placeholder="Card Number" aria-label="Card Holder" aria-describedby="basic-addon1" />
                                <label htmlFor="cvc" className="mb-2 mt-2">CVC</label>
                                <input required id="cvc" type="text" className="form-control" maxLength={3} minLength={3} placeholder="CVC" aria-label="Card Holder" aria-describedby="basic-addon1" />
                                <label htmlFor="expiration" className="mb-2 mt-2">Expiration Date</label>
                                <div id="expiration" className="input-group expiration-date">
                                    <input type="text" className="form-control" minLength={2} maxLength={2} placeholder="MM" aria-label="MM" aria-describedby="basic-addon1" />
                                    <span className="date-separator m-2">/</span>
                                    <input type="text" className="form-control" minLength={2} maxLength={2} placeholder="YY" aria-label="YY" aria-describedby="basic-addon1" />
                                </div>
                                <label htmlFor="amount" className="mb-2 mt-2">Amount</label>
                                <input onChange={(e) => setAmount(e.target.value)} required className="form-control" type="number" placeholder="Enter Amount" min={1}></input>
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