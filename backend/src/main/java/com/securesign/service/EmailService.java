package com.securesign.service;

import com.securesign.model.User;

public interface EmailService {
    void sendVerificationEmail(User user);
    
    void sendPasswordResetEmail(User user);
} 