package com.selectmyflight.controller;

import com.selectmyflight.model.User;
import com.selectmyflight.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    public static class LoginRequest {
        private String email;
        private String password;
        private String otp;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }

    public static class RegisterRequest {
        private String fullName;
        private String email;
        private String phone;
        private String password;
        private String role; // ROLE_USER or ROLE_ADMIN

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req) {
        Map<String, Object> response = new HashMap<>();

        if (req.getEmail() == null || req.getEmail().isBlank()) {
            response.put("success", false);
            response.put("message", "Email is required.");
            return ResponseEntity.badRequest().body(response);
        }

        String email = req.getEmail().trim().toLowerCase();

        // 1. Check for Admin default login
        if ("admin@selectmyflight.com".equalsIgnoreCase(email) && ("admin123".equals(req.getPassword()) || "admin".equals(req.getPassword()) || "7890".equals(req.getOtp()))) {
            response.put("success", true);
            response.put("token", "SMF-ADMIN-TOKEN-" + System.currentTimeMillis());
            response.put("user", Map.of(
                    "name", "System Administrator",
                    "email", "admin@selectmyflight.com",
                    "phone", "+91 98765 00000",
                    "role", "ROLE_ADMIN",
                    "frequentFlyerTier", "Executive Platinum",
                    "homeAirport", "DEL"
            ));
            return ResponseEntity.ok(response);
        }

        // 2. Check Database User
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            // Validate password or OTP (default demo OTP: 7890)
            if (u.getPassword().equals(req.getPassword()) || "7890".equals(req.getOtp()) || req.getPassword() == null) {
                response.put("success", true);
                response.put("token", "SMF-USER-TOKEN-" + System.currentTimeMillis());
                response.put("user", Map.of(
                        "id", u.getId(),
                        "name", u.getFullName(),
                        "email", u.getEmail(),
                        "phone", u.getPhone() != null ? u.getPhone() : "",
                        "role", u.getRole(),
                        "frequentFlyerTier", u.getFrequentFlyerTier(),
                        "homeAirport", u.getHomeAirport()
                ));
                return ResponseEntity.ok(response);
            }
        }

        // 3. Fallback Demo Traveler (Rahul Sharma)
        if ("rahul.sharma@gmail.com".equalsIgnoreCase(email) || "7890".equals(req.getOtp())) {
            response.put("success", true);
            response.put("token", "SMF-DEMO-TOKEN-" + System.currentTimeMillis());
            response.put("user", Map.of(
                    "name", "Rahul Sharma",
                    "email", email,
                    "phone", "+91 98765 43210",
                    "role", "ROLE_USER",
                    "frequentFlyerTier", "Gold Elite",
                    "homeAirport", "DEL"
            ));
            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("message", "Invalid email or password. Please verify your credentials or register a new traveler account.");
        return ResponseEntity.status(401).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest req) {
        Map<String, Object> response = new HashMap<>();

        if (req.getEmail() == null || req.getEmail().isBlank()) {
            response.put("success", false);
            response.put("message", "Email address is required.");
            return ResponseEntity.badRequest().body(response);
        }

        String email = req.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "An account with this email address already exists.");
            return ResponseEntity.badRequest().body(response);
        }

        String role = (req.getRole() != null && req.getRole().equalsIgnoreCase("ROLE_ADMIN")) 
                ? "ROLE_ADMIN" 
                : "ROLE_USER";

        String name = req.getFullName() != null && !req.getFullName().isBlank() 
                ? req.getFullName() 
                : "SelectMyFlight Traveler";

        User newUser = new User(
                name,
                email,
                req.getPhone() != null ? req.getPhone() : "+91 98765 43210",
                req.getPassword() != null && !req.getPassword().isBlank() ? req.getPassword() : "user123",
                role
        );

        User saved = userRepository.save(newUser);

        response.put("success", true);
        response.put("token", "SMF-REGISTER-TOKEN-" + System.currentTimeMillis());
        response.put("user", Map.of(
                "id", saved.getId(),
                "name", saved.getFullName(),
                "email", saved.getEmail(),
                "phone", saved.getPhone(),
                "role", saved.getRole(),
                "frequentFlyerTier", saved.getFrequentFlyerTier(),
                "homeAirport", saved.getHomeAirport()
        ));
        return ResponseEntity.ok(response);
    }
}
