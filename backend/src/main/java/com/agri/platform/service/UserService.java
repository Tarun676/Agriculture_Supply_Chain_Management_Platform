package com.agri.platform.service;

import com.agri.platform.entity.User;
import com.agri.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already registered!");
        }
        // Securely hash password using BCrypt
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Normalize and validate role — supports FARMER, BUYER, ADMIN
        String role = (user.getRole() == null || user.getRole().trim().isEmpty()) ? "BUYER"
                : user.getRole().toUpperCase().trim();
        if (!role.equals("FARMER") && !role.equals("BUYER") && !role.equals("ADMIN")) {
            throw new IllegalArgumentException("Invalid role! Must be FARMER, BUYER, or ADMIN.");
        }
        user.setRole(role);
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No account registered with this email address!"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Incorrect password! Please check your credentials.");
        }
        return user;
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found!"));
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found!");
        }
        userRepository.deleteById(id);
    }
}
