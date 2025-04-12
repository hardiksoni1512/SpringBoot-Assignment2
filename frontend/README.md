# Secure Sign Frontend

This is the frontend application for the Secure Sign authentication system. It provides a user interface for registration, login, email verification, and password reset functionality.

## Technology Stack

- React 18
- React Router v6
- Axios for API requests
- Formik & Yup for form validation
- React Bootstrap for UI components
- JWT for authentication

## Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

## Setup

1. **Install dependencies**:
   ```
   npm install
   ```

2. **Run the development server**:
   ```
   npm start
   ```

   The application will start on port 3000 and automatically proxy API requests to the backend server at http://localhost:8084.

## Features

- User Registration with form validation
- User Login with JWT authentication
- Protected Routes for authenticated users
- Email Verification process
- Password Reset functionality
- Responsive design with Bootstrap

## Project Structure

- `/src/components`: Reusable UI components
- `/src/pages`: Page components for different routes
- `/src/services`: Services for API calls
- `/src/utils`: Utility functions
- `/src/App.js`: Main application component with routing
- `/src/index.js`: Entry point

## API Integration

The frontend integrates with the following backend API endpoints:

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/signin`: Authenticate a user
- `GET /api/auth/verify-email`: Verify email address
- `POST /api/auth/forgot-password`: Request a password reset
- `POST /api/auth/reset-password`: Reset password 