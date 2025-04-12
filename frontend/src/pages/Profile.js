import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Container, Row, Col, Badge } from 'react-bootstrap';
import UserService from '../services/user.service';

const Profile = ({ currentUser }) => {
  const [userContent, setUserContent] = useState('');
  const [adminContent, setAdminContent] = useState('');
  const [userError, setUserError] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    UserService.getUserContent().then(
      (response) => {
        setUserContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setUserError(_content);
      }
    );

    // Only try to get admin content if user has admin role
    if (currentUser.roles && currentUser.roles.includes('ROLE_ADMIN')) {
      UserService.getAdminContent().then(
        (response) => {
          setAdminContent(response.data);
        },
        (error) => {
          const _content =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
          setAdminError(_content);
        }
      );
    }
  }, [currentUser]);

  return (
    <Container className="mt-4">
      <h2 className="auth-heading">Profile: {currentUser.name}</h2>

      <Card className="mb-4">
        <Card.Header as="h5">User Information</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Card.Text><strong>ID:</strong> {currentUser.id}</Card.Text>
              <Card.Text><strong>Name:</strong> {currentUser.name}</Card.Text>
              <Card.Text><strong>Email:</strong> {currentUser.email}</Card.Text>
            </Col>
            <Col md={6}>
              <Card.Text><strong>Roles:</strong></Card.Text>
              {currentUser.roles &&
                currentUser.roles.map((role, index) => (
                  <Badge
                    key={index}
                    bg={role === 'ROLE_ADMIN' ? 'danger' : 'primary'}
                    className="me-2"
                  >
                    {role.substring(5)}
                  </Badge>
                ))}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">User Content</Card.Header>
            <Card.Body>
              {userError ? (
                <Alert variant="danger">{userError}</Alert>
              ) : (
                <Card.Text>{userContent}</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>

        {currentUser.roles && currentUser.roles.includes('ROLE_ADMIN') && (
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header as="h5">Admin Content</Card.Header>
              <Card.Body>
                {adminError ? (
                  <Alert variant="danger">{adminError}</Alert>
                ) : (
                  <Card.Text>{adminContent}</Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      <div className="d-flex justify-content-center">
        <Button
          variant="primary"
          onClick={() => {
            window.print();
          }}
          className="me-2"
        >
          Print Profile
        </Button>
      </div>
    </Container>
  );
};

export default Profile; 