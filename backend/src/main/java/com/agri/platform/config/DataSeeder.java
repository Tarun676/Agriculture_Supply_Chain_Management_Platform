package com.agri.platform.config;

import com.agri.platform.entity.User;
import com.agri.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds initial demo database values on application startup.
 * Specifically registers the required admin account: Tarun Penumudi / penumuditarun@gmail.com
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seeding the requested Admin account
        String adminEmail = "penumuditarun@gmail.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name("Tarun Penumudi")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Tarun@0607"))
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
            System.out.println("🌱 [AgriExchange Seeder] Admin User successfully seeded: " + adminEmail);
        }
    }
}
