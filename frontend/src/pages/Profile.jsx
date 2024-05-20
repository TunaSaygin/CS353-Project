import React, { useCallback, useEffect, useState } from 'react';
import { Card, Button, Form, Container, Row, Col, Image, Nav, InputGroup, FormControl } from 'react-bootstrap';
import { useAuth } from '../context/authcontext';
import axios from 'axios';
export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(null);
  const {user, baseUrl,reloadProfileChanges} = useAuth()
  const [activeTab,setActiveTab] = useState("past_purchases");
  const token = window.localStorage.getItem("token");
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const [profile, setProfile] = useState({
    username: 'johndoe',
    image: 'vite.svg',
    // bio: 'A short bio here',
    email: 'john.doe@example.com',
  });
  const [pastPurchases, setPastPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        if (user.acc_type === 'customer'){
        const response = await axios.get(`${baseUrl}/purchase/get-purchase-hist`);
        setPastPurchases(response.data.purchases);
        console.log(response.data.purchases);
        }
        else if (user.acc_type === 'business'){
          const bresponse = await axios.get(`${baseUrl}/purchase/get-business-purchase-hist`);
          setPastPurchases(bresponse.data.purchases);
          console.log(bresponse.data.purchases);
        }
      } catch (error) {
        console.error('Error fetching purchase history:', error);
      }
    };

    fetchPurchaseHistory();
  }, [baseUrl]);

  const handleEditToggle = () => {
    editing || setEditableProfile({...user, username:user.name, image: user.image_name ? user.image_name : profile.image});
    setEditing(!editing);
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleEditedChange = (e) =>{
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  }

  const handleSave = async () => {
    try {
      const formData = new FormData();
      if(editableProfile.username){
        formData.append('username', editableProfile.username);

      }
      formData.append('email', editableProfile.email);
      if (editableProfile.imageFile) {
        formData.append('file', editableProfile.imageFile);
      }

      const response = await axios.post(`${baseUrl}/profile/update-profile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setProfile(editableProfile);
        setEditing(false);
      }
      reloadProfileChanges()
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  const handleReturn = async (p_id, p_date) => {
    console.log(`Purchased product with ID ${p_id} is returned`);
    try {
      if (user.acc_type === 'customer'){
          await axios.post(`${baseUrl}/product/returnProduct`, { p_id, p_date });
      }
      // Refetch purchase history
      const response = await axios.get(`${baseUrl}/purchase/get-purchase-hist`);
      setPastPurchases(response.data.purchases);
    } catch (error) {
      console.error('Error returning product:', error);
    }
  };
  return (
    <Container>
      <Row className="justify-content-md-center my-4">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4} className="d-flex align-items-center justify-content-center">
                  {editing ? (
                    <ImageLoader profile={editableProfile} setProfile={setEditableProfile}/>
                  ) : ( user.image_name ? 
                    <Image src={`${baseUrl}/profile/image/${user.image_name}/`} roundedCircle style={{ width: '150px', height: '150px' }} />
                    :
                    <Image src={profile.image} roundedCircle style={{ width: '150px', height: '150px' }} />
                  )}
                </Col>
                <Col md={8}>
                  {editing ? (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" value={editableProfile.username} onChange={handleEditedChange} />
                      </Form.Group>
                      {/* <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control as="textarea" rows={3} name="bio" value={editableProfile.bio} onChange={handleEditedChange} />
                      </Form.Group> */}
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={editableProfile.email} onChange={handleEditedChange} />
                      </Form.Group>
                      {/* Include password change fields here */}
                      <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                      <Button variant="secondary" onClick={handleEditToggle} className="ms-2">Cancel</Button>
                    </Form>
                  ) : (
                    <>
                      <h2>{user.name}</h2>
                      {/* <p className="text-muted">{profile.bio}</p> */}
                      <p>{user.email}</p>
                      {user.acc_type === 'business' && <p>{user.iban}</p>}
                      {user.acc_type === 'customer' && <p>{user.delivery_address}</p>}
                      <Button variant="primary" onClick={handleEditToggle}>Edit Profile</Button>
                    </>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
          {user.acc_type !== 'admin' && (
            <>
              <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="past_purchases">Past Purchase</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="returned_items">Returned Items</Nav.Link>
                </Nav.Item>
              </Nav>

              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search..."
                  onChange={handleSearch}
                />
              </InputGroup>

              {activeTab === "past_purchases" ?
                <>
                  <h3>Past Purchases</h3>
                  <Row xs={1} md={2} lg={3} className="g-4">
                    {pastPurchases.filter(purchase => (purchase.return_date == null)).map((purchase, index) => (
                      <Col key={index}>
                        <Card>
                          <Card.Body>
                            <Card.Title>{purchase.product_name}</Card.Title>
                            <Card.Text>Date: {purchase.p_date}</Card.Text>
                            {user.acc_type === 'customer' && <Button variant='danger' onClick={() => { handleReturn(purchase.p_id, purchase.p_date) }}> Return Product</Button>}
                            {user.acc_type === 'business' && <Card.Text>{purchase.delivery_address}</Card.Text>}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </> :
                <>
                  <h3>Returned Items</h3>
                  <Row xs={1} md={2} lg={3} className="g-4">
                    {pastPurchases.filter(purchase => !(purchase.return_date == null)).map((purchase, index) => (
                      <Col key={index}>
                        <Card>
                          <Card.Body>
                            <Card.Title>{purchase.product_name}</Card.Title>
                            <Card.Text>Date: {purchase.p_date}</Card.Text>
                            
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </>
              }
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

function  ImageLoader({profile,setProfile}){
  const [imageFile, setImageFile] = useState(null); // State to hold the uploaded file

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageFile(file);
    setProfile({ ...profile, image: URL.createObjectURL(file) }); // Create a URL for the file
  }, [profile]);
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onDrop(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    onDrop(e.target.files);
  };
  return (
    <Form.Group controlId="formFile" className="mb-3">
    <Form.Label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}
                  >
                    <p>Change Image</p>
                    {profile.image ? (
                      <img src={profile.image} alt="Profile" style={{ maxWidth: '100%' }} />
                    ) : (
                      'Drag and drop an image file here, or click to select a file'
                    )}
                    <Form.Control type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                  </div>
    </Form.Label>
    </Form.Group>
  );
}