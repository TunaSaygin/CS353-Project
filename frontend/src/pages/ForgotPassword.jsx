import React from "react";

export function PasswordForm() {
    function handlePassword(e) {
        e.preventDefault();
        console.log("heheh");
    }
    return(
        <div className="d-flex justify-content-center align-items-center">
        <div className="col-lg-6">
            <form onSubmit={handlePassword} className="mt-3">
                <h1 className="text-center mb-4">Enter a New Password</h1>
                <div className="col-md-12 mx-auto">
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Enter Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Enter password" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pw-reenter" className="form-label">Re-enter Password</label>
                        <input type="password" className="form-control" id="pw-reenter" placeholder="Re-enter password" />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Change</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    );
}

export default function ForgotPassword() {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="col-lg-6">
                <EmailForm></EmailForm>
            </div>
        </div>
    );
}

function EmailForm() {
    function handleEmail(e) {
        e.preventDefault();
        console.log("heyy")
    }
    return (
        <form onSubmit={handleEmail} className="mt-3">
            <h1 className="text-center mb-4">Enter Your Email</h1>
            <div className="col-md-12 mx-auto">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter email" />
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Send</button>
                </div>
            </div>
        </form>
    );
}
