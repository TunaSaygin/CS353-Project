import React from 'react'
import { useAuth } from '../../context/authcontext';
export default function LoginFormComponent({handleForm}) {
    return(
        <form onSubmit={handleForm} className="mt-3">
                <h1>Login</h1>
                <div className="mb-3">
                <label htmlFor="loginUsername" className="form-label">Username</label>
                <input type="text" className="form-control" id="loginUsername" placeholder="Enter username" />
                </div>
                <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">Password</label>
                <input type="password" className="form-control" id="loginPassword" placeholder="Password" />
                </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
);
}
