package com.securesign.service.impl;

import com.securesign.model.User;
import com.securesign.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    @Value("${app.email.verification.enabled:false}")
    private boolean emailVerificationEnabled;

    @Value("${app.email.sender:no-reply@securesign.com}")
    private String emailSender;

    // In a production environment, we would inject an actual email sending service like JavaMailSender
    
    @Override
    public void sendVerificationEmail(User user) {
        if (!emailVerificationEnabled) {
            System.out.println("Email verification is disabled. Verification link for " + user.getEmail() + ": " +
                    "http://localhost:8080/api/auth/verify-email?token=" + user.getVerificationToken());
            return;
        }
        
        // In a real implementation, we would send an actual email with JavaMailSender
        System.out.println("Verification email sent to: " + user.getEmail());
    }
    
    @Override
    public void sendPasswordResetEmail(User user) {
        if (!emailVerificationEnabled) {
            System.out.println("Email verification is disabled. Password reset link for " + user.getEmail() + ": " +
                    "http://localhost:8080/api/auth/reset-password?token=" + user.getResetPasswordToken());
            return;
        }
        
        // In a real implementation, we would send an actual email with JavaMailSender
        System.out.println("Password reset email sent to: " + user.getEmail());
    }
} 