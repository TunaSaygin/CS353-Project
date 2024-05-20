import React, { useState } from "react";
import axios from "axios";

export default function GiftCardForm() {
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState(null);
    const [done, setDone] = useState(false);
    const [error, setError] = useState(null);
    const token = window.localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/profile/generate-gift-card/", {gift_amount: amount, gift_message: message});
            setDone(true);
        }
        catch(error) {
            setError(error);
        }
    }
    if(done) {
        return(<><h3>Successfully generated.</h3></>);
    }

    if(error) {
        if (error.response.status === 404) {
            return(<h3>No customer found that bought from you.</h3>)
        }
        else {
            return(<h3>{error.message}</h3>);
        }
    }

    return(<form onSubmit={(e)=>handleSubmit(e)}>
    <div className="row justify-content-center d-flex">
        <div className="col-md-12 d-flex justify-content-center">
            <div className="card-details justify-content-center d-flex">
                <div className="row justify-content-center d-flex">
                    <div className="form-group col-sm-12 d-flex flex-column">
                        <h3 className="title">Generate Gift Card</h3>

                        <label htmlFor="amount" className="mb-2 mt-2">Gift Amount</label>
                        <input onChange={(e) => setAmount(e.target.value)} required id="amount" type="number" min={1} className="form-control" placeholder="Enter gift amount..."/>
                        <label htmlFor="message" className="mb-2 mt-2">Gift Message</label>
                        <input onChange={(e) => setMessage(e.target.value)} id="message" type="text" maxLength={100} className="form-control" placeholder="Enter Message..." />

                        <div className="form-group col justify-content-center d-flex">
                            <button type="submit" className="btn btn-primary btn-block mt-2">Generate!</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</form>);
}