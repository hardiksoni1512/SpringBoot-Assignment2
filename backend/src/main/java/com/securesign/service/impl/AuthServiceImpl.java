package com.securesign.service.impl;

import com.securesign.model.ERole;
import com.securesign.model.Role;
import com.securesign.model.User;
import com.securesign.payload.request.LoginRequest;
import com.securesign.payload.request.PasswordResetRequest;
import com.securesign.payload.request.SignupRequest;
import com.securesign.payload.response.JwtResponse;
import com.securesign.payload.response.MessageResponse;
import com.securesign.repository.RoleRepository;
import com.securesign.repository.UserRepository;
import com.securesign.security.jwt.JwtUtils;
import com.securesign.security.services.UserDetailsImpl;
import com.securesign.service.AuthService;
import com.securesign.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION = 15; // minutes

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        // Find user
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        // Check if account is locked
        if (!user.isAccountNonLocked()) {
            throw new LockedException("Your account has been locked due to too many failed login attempts. " +
                    "Please try again later or reset your password.");
        }

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            // Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String jwt = jwtUtils.generateJwtToken(authentication);

            // Reset failed attempts on successful login
            if (user.getFailedLoginAttempts() > 0) {
                user.setFailedLoginAttempts(0);
                user.setAccountLockedUntil(null);
                userRepository.save(user);
            }

            // Get user details
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            // Return JWT response
            return new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getName(),
                    userDetails.getEmail(),
                    roles);
        } catch (BadCredentialsException e) {
            // Increase failed login attempts and lock if needed
            incrementFailedAttempts(user);
            throw e;
        }
    }

    @Override
    @Transactional
    public MessageResponse registerUser(SignupRequest signupRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return new MessageResponse("Error: Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        
        // Set verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiryDate(LocalDateTime.now().plusHours(24));

        // Set roles
        Set<String> strRoles = signupRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(user);
        } catch (Exception e) {
            // Log error but continue registration
            System.err.println("Failed to send verification email: " + e.getMessage());
        }

        return new MessageResponse("User registered successfully! Please check your email to verify your account.");
    }

    @Override
    @Transactional
    public MessageResponse verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        // Check if token has expired
        if (user.getVerificationTokenExpiryDate().isBefore(LocalDateTime.now())) {
            // Generate new token
            String newToken = UUID.randomUUID().toString();
            user.setVerificationToken(newToken);
            user.setVerificationTokenExpiryDate(LocalDateTime.now().plusHours(24));
            userRepository.save(user);

            // Send new verification email
            try {
                emailService.sendVerificationEmail(user);
            } catch (Exception e) {
                System.err.println("Failed to send verification email: " + e.getMessage());
            }

            return new MessageResponse("Verification token has expired. A new verification link has been sent to your email.");
        }

        // Verify user
        user.setEmailVerified(true);
        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiryDate(null);
        userRepository.save(user);

        return new MessageResponse("Email verified successfully. You can now login.");
    }

    @Override
    @Transactional
    public MessageResponse forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate password reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiryDate(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // Send password reset email
        try {
            emailService.sendPasswordResetEmail(user);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }

        return new MessageResponse("Password reset instructions sent to your email.");
    }

    @Override
    @Transactional
    public MessageResponse resetPassword(PasswordResetRequest passwordResetRequest) {
        User user = userRepository.findByResetPasswordToken(passwordResetRequest.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        // Check if token has expired
        if (user.getResetPasswordTokenExpiryDate().isBefore(LocalDateTime.now())) {
            return new MessageResponse("Password reset token has expired. Please request a new password reset link.");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(passwordResetRequest.getPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiryDate(null);
        user.setFailedLoginAttempts(0);
        user.setAccountLockedUntil(null);
        userRepository.save(user);

        return new MessageResponse("Password reset successfully. You can now login with your new password.");
    }

    private void incrementFailedAttempts(User user) {
        int currentAttempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(currentAttempts);
        
        if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
            lockAccount(user);
        }
        
        userRepository.save(user);
    }

    private void lockAccount(User user) {
        user.setAccountLockedUntil(LocalDateTime.now().plusMinutes(LOCK_TIME_DURATION));
        userRepository.save(user);
    }
} 