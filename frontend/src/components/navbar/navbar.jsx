import React, { useState } from 'react';
import './navbar.css';
import { useAuth } from '../../context/authcontext';
import { Dropdown, Nav, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CreditCardDetails from '../../pages/CreditCardForm';
import GiftCardForm from '../../pages/GiftCardForm';

export default function Navbar() {
  const acc_type = window.localStorage.getItem('acc_type');
  const { isLoggedIn, logout, user, baseUrl } = useAuth(); // Use the useAuth hook
  const [show, setShow] = useState(false);
  const [showCard, setShowCard] = useState(false);
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
  function handleShoppingCart() {
    nav('/shopping_cart');
  }
  function handleWishList() {
    nav("/wishlist");
  }
  function handleHome() {
    if(acc_type === 'customer') {
      nav("/home_customer");
    }
    else if(acc_type === 'business') {
      nav("/home_business");
    }
    else if(acc_type === 'admin') {
      nav("/admin_page");
    }
    else {
      nav("/login");
    }
  }
  function handleGiftCard() {
    setShowCard(true);
  }
  function hideGiftCardForm() {
    setShowCard(false);
  }
  const [profile, setProfile] = useState({
    // username: 'johndoe',
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
                {/* <li className="nav-item px-2">
                  <Dropdown>
                    <Dropdown.Toggle variant='success' id="notifications-dropdown">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '40px', height: '40px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                      </svg>

                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#!">Notification 1</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li> */}
                {acc_type === 'customer' ? (
                <><li className='nav-item px-2'>
                  <Nav.Link onClick={handleBalance} className='my-auto'>Add Balance</Nav.Link>
                </li>
                <li className='nav-item px-2'>
                  <Nav.Link onClick={handleShoppingCart} className='my-auto'>Shopping Cart</Nav.Link>
                </li>
                <li className='nav-item px-2'>
                  <Nav.Link className='my-auto' onClick={handleWishList}>Wishlist</Nav.Link>
                </li>
                </>): <></>}
                {acc_type === 'business' ? (
                  <>
                    <li className='nav-item px-2'>
                      <Nav.Link onClick={handleGiftCard} className='my-auto'>Generate Gift Card</Nav.Link>
                    </li>
                  </>
                ): <></>}
                <li className='nav-item px-2'>
                  <Nav.Link onClick={handleHome}>Home</Nav.Link>
                </li>
                <li className="nav-item">
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="profile-dropdown" className="d-flex justify-content-center align-items-center ">
                      <div className="d-flex">
                        {user.image_name ?  
                        <img
                        src={`${baseUrl}/profile/image/${user.image_name}/`} // Your profile image URL
                        className="rounded-circle"
                        alt="Profile"
                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                      />
                        :<img
                          src={profile.image} // Your profile image URL
                          className="rounded-circle"
                          alt="Profile"
                          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                        />}
                        <div className="ms-2 align-items-center flex-column align-items-start justify-content-center text-left">
                          <div>{user.name}</div> {/* User's name */}
                          {user.acc_type === 'customer' && <div className="text-muted" style={{ fontSize: '0.8em' }}>balance: ${user.balance}</div> }{/* User's balance */}
                          {user.acc_type === 'business' && <div className="text-muted" style={{ fontSize: '0.8em' }}>income: ${user.income}</div>}
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

<Modal show={showCard} onHide={hideGiftCardForm} size="lg" centered>
    <Modal.Header closeButton>
        <Modal.Title>Generate Gift Card</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <GiftCardForm></GiftCardForm>
    </Modal.Body>
</Modal>
</>
  );
}
