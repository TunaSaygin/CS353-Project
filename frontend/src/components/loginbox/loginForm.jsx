import React from 'react'
import { useAuth } from '../../context/authcontext';
export default function LoginFormComponent({handleForm, setUsername, setPassword, errors}) {
    return(
        <form onSubmit={handleForm} className="mt-3">
      <h1>Login</h1>
      {errors.form && <div className="alert alert-danger">{errors.form}</div>}
      <div className="mb-3">
        <label htmlFor="loginUsername" className="form-label">Username</label>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          id="loginUsername"
          placeholder="Enter username"
        />
        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="loginPassword" className="form-label">Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          id="loginPassword"
          placeholder="Password"
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        <a href='/forgot_password'>Forgot password?</a>
      </div>
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
);
}
