import React from 'react';
import './navbar.css';
import { useAuth } from '../../context/authcontext';
import { Dropdown, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth(); // Use the useAuth hook
  const nav = useNavigate();
  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">BrandName</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end gap-3" id="navbarNav">
          <ul className="navbar-nav gap-3">
            {isLoggedIn ? (
              <>
                <li className="nav-item px-2">
                  <Dropdown>
                    <Dropdown.Toggle variant='success' id="notifications-dropdown">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>

                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#!">Notification 1</Dropdown.Item>
                      {/* Add more notifications here */}
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
                <li className="nav-item">
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="profile-dropdown">
                      Profile
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#profile">My Profile</Dropdown.Item>
                      <Dropdown.Item href="#purchases">Past Purchases</Dropdown.Item>
                      <Dropdown.Item href="#!" onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Nav.Link href="/login">Login</Nav.Link>
                </li>
                {/* Add any other public links here */}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
