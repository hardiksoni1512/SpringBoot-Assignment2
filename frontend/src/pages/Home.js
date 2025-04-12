import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserService from '../services/user.service';

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <Container>
      <div className="text-center mt-5">
        <h1>Welcome to Secure Sign</h1>
        <p className="lead">A secure authentication system with login, registration, and account management</p>
      </div>

      <Row className="mt-5">
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Register</Card.Title>
              <Card.Text>
                Sign up for a new account with secure password storage and email verification.
              </Card.Text>
              <Button as={Link} to="/register" variant="primary">
                Register Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Login</Card.Title>
              <Card.Text>
                Already have an account? Sign in securely with JWT authentication.
              </Card.Text>
              <Button as={Link} to="/login" variant="success">
                Login
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Reset Password</Card.Title>
              <Card.Text>
                Forgot your password? Reset it securely through email verification.
              </Card.Text>
              <Button as={Link} to="/forgot-password" variant="secondary">
                Reset Password
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-5 p-4 bg-light rounded">
        <h2>API Response Demo:</h2>
        <p>{content}</p>
      </div>
    </Container>
  );
};

export default Home; 