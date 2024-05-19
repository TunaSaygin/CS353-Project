import React from 'react'
import { useAuth } from '../../context/authcontext';
export default function LoginFormComponent({handleForm, setUsername, setPassword}) {
    return(
        <form onSubmit={handleForm} className="mt-3">
                <h1>Login</h1>
                <div className="mb-3">
                <label htmlFor="loginUsername" className="form-label">Username</label>
                <input onChange={(e) => setUsername(e.target.value)} type="text" className="form-control" id="loginUsername" placeholder="Enter username" />
                </div>
                <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">Password</label>
                <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="loginPassword" placeholder="Password" />
                <a href='/forgot_password'>Forgot password?</a>
                </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
);
}
