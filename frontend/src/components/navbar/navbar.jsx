import React, { useState } from 'react';
import './navbar.css';
import { useAuth } from '../../context/authcontext';
import { Dropdown, Nav, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CreditCardDetails from '../../pages/CreditCardForm';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth(); // Use the useAuth hook
  const [show, setShow] = useState(false);
  const nav = useNavigate();
  const handleLogout = () => {
    logout();
    nav("/login");
  };
  const handleProfile = () => {
    nav("/profile");
  }
  function hideModal() {
    setShow(false);
  }
  function handleBalance() {
    setShow(true);
  }
  const [profile, setProfile] = useState({
    username: 'johndoe',
    image: 'vite.svg',
    balance: 100,
    bio: 'A short bio here',
    email: 'john.doe@example.com',
  });
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">BrandName</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end gap-3" id="navbarNav">
          <ul className="navbar-nav gap-3 align-items-center">
            {isLoggedIn ? (
              <>
                <li className="nav-item px-2">
                  <Dropdown>
                    <Dropdown.Toggle variant='success' id="notifications-dropdown">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '40px', height: '40px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                      </svg>

                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#!">Notification 1</Dropdown.Item>
                      {/* Add more notifications here */}
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
                <li className='nav-item px-2'>
                  <Nav.Link onClick={handleBalance} className='my-auto'>Add Balance</Nav.Link>
                </li>
                <li className="nav-item">
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="profile-dropdown" className="d-flex justify-content-center align-items-center ">
                      <div className="d-flex">
                        <img
                          src={profile.image} // Your profile image URL
                          className="rounded-circle"
                          alt="Profile"
                          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                        />
                        <div className="ms-2 align-items-center flex-column align-items-start justify-content-center text-left">
                          <div>{profile.username}</div> {/* User's name */}
                          <div className="text-muted" style={{ fontSize: '0.8em' }}>balance: ${profile.balance}</div> {/* User's balance */}
                        </div>
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#profile" onClick={handleProfile}>My Profile</Dropdown.Item>
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
    <Modal show={show} onHide={hideModal} size="lg" centered>
    <Modal.Header closeButton>
        <Modal.Title>Add Balance</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <CreditCardDetails hideButtons={false}></CreditCardDetails>
    </Modal.Body>
</Modal>
</>
  );
}
