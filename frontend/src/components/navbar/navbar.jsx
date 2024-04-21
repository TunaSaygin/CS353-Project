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
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="notifications-dropdown">
                      Notifications
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
