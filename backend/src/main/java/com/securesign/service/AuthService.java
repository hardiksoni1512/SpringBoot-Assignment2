package com.securesign.service;

import com.securesign.payload.request.LoginRequest;
import com.securesign.payload.request.PasswordResetRequest;
import com.securesign.payload.request.SignupRequest;
import com.securesign.payload.response.JwtResponse;
import com.securesign.payload.response.MessageResponse;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    
    MessageResponse registerUser(SignupRequest signupRequest);
    
    MessageResponse verifyEmail(String token);
    
    MessageResponse forgotPassword(String email);
    
    MessageResponse resetPassword(PasswordResetRequest passwordResetRequest);
} 