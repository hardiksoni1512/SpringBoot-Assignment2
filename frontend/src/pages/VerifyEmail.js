import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Alert, Button, Container, Spinner } from 'react-bootstrap';
import AuthService from '../services/auth.service';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get token from URL
    const token = searchParams.get('token');
    if (!token) {
      setMessage('Invalid verification link. Token is missing.');
      setSuccessful(false);
      setLoading(false);
      return;
    }

    // Verify email with token
    AuthService.verifyEmail(token).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setLoading(false);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setSuccessful(false);
        setLoading(false);
      }
    );
  }, [searchParams]);

  return (
    <Container className="auth-form-container">
      <h2 className="auth-heading">Email Verification</h2>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Verifying your email...</span>
          </Spinner>
          <p className="mt-2">Verifying your email, please wait...</p>
        </div>
      ) : (
        <div className="text-center">
          <Alert variant={successful ? "success" : "danger"}>
            {message}
          </Alert>

          <div className="mt-4">
            {successful ? (
              <Button as={Link} to="/login" variant="primary">
                Go to Login
              </Button>
            ) : (
              <Button as={Link} to="/" variant="secondary">
                Return to Home
              </Button>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}

export default VerifyEmail; 