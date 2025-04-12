# Secure Sign - Authentication System

A complete and secure authentication system with user registration, login, email verification, and password reset functionality. This project consists of a Spring Boot backend and a React frontend.

## Project Structure

- **Backend**: Spring Boot application with JWT authentication, password hashing, and secure endpoints
- **Frontend**: React application with form validation, protected routes, and responsive UI

## Features

- User registration with validation
- JWT-based authentication
- Secure password storage with BCrypt
- Email verification
- Password reset functionality
- Account lockout after failed login attempts
- Form validation
- Protected routes
- Responsive design

## Prerequisites

### Backend
- Java 11 or higher
- Maven
- MariaDB

### Frontend
- Node.js 14.x or higher
- npm 6.x or higher

## Setup Instructions

### Database Setup
1. Install MariaDB if not already installed
2. Start the MariaDB service:
   - Windows: Via Services app or run `net start mysql` (if using MySQL service name)
   - Linux: `sudo systemctl start mariadb`
   - macOS: `brew services start mariadb`

3. Connect to MariaDB:
   ```bash
   # For default root access (you may need to use your specific credentials)
   mysql -u root -p
   ```

4. Create the database:
   ```sql
   CREATE DATABASE secure_sign_db;
   
   # Optionally verify the database was created
   SHOW DATABASES;
   
   # Exit MySQL client
   EXIT;
   ```

5. Verify your database configuration in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mariadb://localhost:3306/secure_sign_db
   spring.datasource.username=root
   spring.datasource.password=password
   ```
   
   Update the username and password to match your MariaDB credentials.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the application:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on port 8084.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
   If you encounter any errors, try:
   ```bash
   npm install --legacy-peer-deps
   ```
   
   If react-scripts is missing, explicitly install it:
   ```bash
   npm install react-scripts
   ```

3. Run the application:
   ```bash
   npm start
   ```
   
   If you still get the "react-scripts not recognized" error, try running:
   ```bash
   npx react-scripts start
   ```
   
   The frontend will start on port 3000 and automatically proxy API requests to the backend.

## Default Users

The application will automatically create the necessary roles (USER, ADMIN) when it first starts. You will need to register users through the registration form.

## Testing the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account through the registration form
3. Check the console output for the verification link (since this is a demo without actual email sending)
4. Use the verification link to verify your email
5. Login with your credentials
6. Test the password reset functionality if needed

## API Testing with Postman

A Postman collection file `secure_sign_postman_collection.json` is included in the project root. This collection contains all the API endpoints for testing the backend directly.

### Importing the Collection
1. Open Postman
2. Click on "Import" button
3. Select the `secure_sign_postman_collection.json` file
4. The collection will be imported with all requests configured

### Using the Collection
1. Start the backend application
2. Use the "Register User" request to create a new account
3. Use the "Login User" request to get a JWT token
4. Copy the token from the response
5. Update the `authToken` variable in the collection with your JWT token
6. Now you can test protected endpoints

### Variables to Update
- `authToken`: JWT token received after login
- `verificationToken`: Email verification token (check server logs)
- `resetToken`: Password reset token (check server logs)

## Troubleshooting

### Common Issues
- **Unknown database 'secure_sign_db'**: This error occurs if you haven't created the database yet. Follow the database setup steps above.
- **Connection refused**: Make sure MariaDB is running and listening on the default port (3306).
- **Access denied for user**: Check that the username and password in `application.properties` match your MariaDB credentials.
- **Maven command not found**: Ensure Maven is properly installed and added to your PATH.
- **Email verification links**: In this demo version, verification links are printed to the console instead of being sent via email.

### Frontend Issues
- **'react-scripts' is not recognized**: This is usually due to incomplete NPM installation. Try the solutions in the Frontend Setup section.
- **Module not found errors**: Make sure all dependencies are properly installed with `npm install`.
- **Network errors when calling API**: Verify the backend is running and the proxy is correctly set up in package.json.

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/signin`: Authenticate a user
- `GET /api/auth/verify-email`: Verify email address
- `POST /api/auth/forgot-password`: Request a password reset
- `POST /api/auth/reset-password`: Reset password

### Test Endpoints
- `GET /api/test/all`: Public content
- `GET /api/test/user`: Protected content (USER role)
- `GET /api/test/admin`: Admin content (ADMIN role)

## Security Features

- Password hashing using BCrypt
- JWT token-based authentication
- Email verification
- Password reset functionality
- Account lockout after failed login attempts
- CSRF and XSS protection
- Input validation
- Rate limiting

## License

This project is open source and available under the [MIT License](LICENSE). 