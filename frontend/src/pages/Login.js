import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AuthService from '../services/auth.service';

const Login = ({ setCurrentUser }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('This is not a valid email')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const handleLogin = (formValues, { setSubmitting }) => {
    const { email, password } = formValues;
    setMessage('');
    setLoading(true);

    AuthService.login(email, password).then(
      (response) => {
        setCurrentUser(response);
        navigate('/profile');
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
        setSubmitting(false);
      }
    );
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-heading">Login</h2>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.email && !!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.password && !!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid mb-3">
              <Button variant="primary" type="submit" disabled={isSubmitting || loading}>
                {loading ? "Loading..." : "Login"}
              </Button>
            </div>

            <div className="text-center mb-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {message && (
              <Alert variant="danger">
                {message}
              </Alert>
            )}

            <div className="text-center">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login; 