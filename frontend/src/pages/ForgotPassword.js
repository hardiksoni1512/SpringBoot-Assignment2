import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AuthService from '../services/auth.service';

const ForgotPassword = () => {
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('This is not a valid email')
      .required('Email is required'),
  });

  const handleForgotPassword = (formValues, { setSubmitting }) => {
    const { email } = formValues;
    setMessage('');
    setSuccessful(false);
    setLoading(true);

    AuthService.forgotPassword(email).then(
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
        setSubmitting(false);
      }
    );
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-heading">Forgot Password</h2>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleForgotPassword}
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
            {!successful && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your registered email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button variant="primary" type="submit" disabled={isSubmitting || loading}>
                    {loading ? "Processing..." : "Reset Password"}
                  </Button>
                </div>
              </>
            )}

            {message && (
              <Alert variant={successful ? "success" : "danger"}>
                {message}
              </Alert>
            )}

            <div className="text-center">
              <Link to="/login">Back to Login</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword; 