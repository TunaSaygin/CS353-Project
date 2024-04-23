import React, { useCallback, useState } from 'react';
import { Card, Button, Form, Container, Row, Col, Image, Nav, InputGroup, FormControl } from 'react-bootstrap';
export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(null);
  const [activeTab,setActiveTab] = useState("past_purchases");
  const [profile, setProfile] = useState({
    username: 'johndoe',
    image: 'vite.svg',
    bio: 'A short bio here',
    email: 'john.doe@example.com',
  });

  const [pastPurchases, setPastPurchases] = useState([
    // Mock data for past purchases
    { id: 1, title: "Purchase 1", date: "2023-01-01", isReturned:true },
    { id: 2, title: "Purchase 2", date: "2023-01-02", isReturned:false },
    // ... other purchases
  ]);

  const handleEditToggle = () => {
    editing || setEditableProfile(profile);
    setEditing(!editing);
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleEditedChange = (e) =>{
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  }

  const handleSave = () => {
    // Implement save logic here
    setProfile(editableProfile)
    setEditing(false);
  };
  const handleReturn = (id) =>{
    console.log(`Purchased product with ID ${id} is returned`);
  }
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
                  ) : (
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
                      <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control as="textarea" rows={3} name="bio" value={editableProfile.bio} onChange={handleEditedChange} />
                      </Form.Group>
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
                      <h2>{profile.username}</h2>
                      <p className="text-muted">{profile.bio}</p>
                      <p>{profile.email}</p>
                      <Button variant="primary" onClick={handleEditToggle}>Edit Profile</Button>
                    </>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
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
          {activeTab=="past_purchases" ?
          <>
          <h3>Past Purchases</h3>
          <Row xs={1} md={2} lg={3} className="g-4">
            {pastPurchases.filter(purchase=>!purchase.isReturned).map(purchase => (
              <Col key={purchase.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{purchase.title}</Card.Title>
                    <Card.Text>Date: {purchase.date}</Card.Text>
                    <Button variant='danger' onClick={()=>{handleReturn(purchase.id)}}> Return Product</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          </>:
          <>
          <h3>Returned Items</h3>
          <Row xs={1} md={2} lg={3} className="g-4">
            {pastPurchases.filter(purchase=>purchase.isReturned).map(purchase => (
              <Col key={purchase.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{purchase.title}</Card.Title>
                    <Card.Text>Date: {purchase.date}</Card.Text>
                    <Button variant='danger' onClick={()=>{handleReturn(purchase.id)}}> Return Product</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          </>
          }
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