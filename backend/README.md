# Secure Sign Backend

This is the backend service for the Secure Sign application, which provides authentication services including user registration, login, email verification, and password reset functionality.

## Technology Stack

- Java 11
- Spring Boot 2.7.8
- Spring Security
- Spring Data JPA
- JWT Authentication
- MariaDB

## Prerequisites

- Java 11 or higher
- Maven
- MariaDB

## Setup

1. **Database Setup**:
   - Create a MariaDB database named `secure_sign_db`
   - Update database credentials in `src/main/resources/application.properties` if needed

2. **Build the Application**:
   ```
   mvn clean install
   ```

3. **Run the Application**:
   ```
   mvn spring-boot:run
   ```

The application will start on port 8084.

## API Endpoints

### Authentication

- `POST /api/auth/signup`: Register a new user
  - Required fields: name, email, password, phoneNumber
  - Optional: roles (default is USER)

- `POST /api/auth/signin`: Authenticate a user
  - Required fields: email, password
  - Returns: JWT token and user information

- `GET /api/auth/verify-email?token={token}`: Verify email address
  - Query parameter: token (received in email)

- `POST /api/auth/forgot-password?email={email}`: Request a password reset
  - Query parameter: email

- `POST /api/auth/reset-password`: Reset password
  - Required fields: token, password

### Test Endpoints

- `GET /api/test/all`: Public content (no authentication needed)
- `GET /api/test/user`: Protected content (USER or ADMIN role required)
- `GET /api/test/admin`: Admin content (ADMIN role required)

## Security Features

- Password hashing using BCrypt
- JWT token-based authentication
- Email verification
- Password reset functionality
- Account lockout after failed login attempts
- CSRF and XSS protection
- Input validation
- Rate limiting

## Further Improvements

- Add actual email sending functionality with JavaMailSender
- Implement refresh token mechanism
- Add more comprehensive logging
- Implement unit and integration tests 