import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AuthService from '../services/auth.service';

const ResetPassword = () => {
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(40, 'Password must be less than 40 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleResetPassword = (formValues, { setSubmitting }) => {
    const { password } = formValues;
    
    if (!token) {
      setMessage('Invalid reset link. Token is missing.');
      setSuccessful(false);
      setSubmitting(false);
      return;
    }

    setMessage('');
    setSuccessful(false);
    setLoading(true);

    AuthService.resetPassword(token, password).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setLoading(false);
        setTimeout(() => {
          navigate('/login');
        }, 8084);
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
      <h2 className="auth-heading">Reset Password</h2>

      {!token ? (
        <div className="text-center">
          <Alert variant="danger">
            Invalid reset link. Token is missing.
          </Alert>
          <div className="mt-4">
            <Button as={Link} to="/forgot-password" variant="primary">
              Request a New Reset Link
            </Button>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleResetPassword}
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
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter new password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && !!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
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
      )}
    </div>
  );
};

export default ResetPassword; 