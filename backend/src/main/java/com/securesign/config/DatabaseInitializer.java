package com.securesign.config;

import com.securesign.model.ERole;
import com.securesign.model.Role;
import com.securesign.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        for (ERole role : ERole.values()) {
            if (!roleRepository.findByName(role).isPresent()) {
                roleRepository.save(new Role(role));
            }
        }
    }
} 