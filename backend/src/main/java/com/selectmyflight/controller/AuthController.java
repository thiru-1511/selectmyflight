package com.selectmyflight.controller;

import com.selectmyflight.model.User;
import com.selectmyflight.repository.UserRepository;
import com.selectmyflight.service.EmailService;
import com.selectmyflight.service.MessageService;
import com.selectmyflight.service.OtpService;
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

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private MessageService messageService;

    public static class OtpSendRequest {
        private String recipient; // Email or Phone number
        private String channel;   // "EMAIL", "SMS", "WHATSAPP"

        public String getRecipient() { return recipient; }
        public void setRecipient(String recipient) { this.recipient = recipient; }
        public String getChannel() { return channel; }
        public void setChannel(String channel) { this.channel = channel; }
    }

    public static class LoginRequest {
        private String email;
        private String phone;
        private String password;
        private String otp;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
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

    /**
     * 🔢 SEND OTP Endpoint
     * Generates a 6-digit OTP and dispatches it via Email, SMS, or WhatsApp.
     */
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestBody OtpSendRequest req) {
        Map<String, Object> response = new HashMap<>();

        if (req.getRecipient() == null || req.getRecipient().isBlank()) {
            response.put("success", false);
            response.put("message", "Recipient (Email or Mobile Number) is required.");
            return ResponseEntity.badRequest().body(response);
        }

        String recipient = req.getRecipient().trim();
        String channel = req.getChannel() != null ? req.getChannel().toUpperCase().trim() : "AUTO";

        // Generate 6-digit OTP
        String otp = otpService.generateOtp(recipient);

        // Auto-detect channel if not explicitly specified
        if ("AUTO".equals(channel)) {
            channel = recipient.contains("@") ? "EMAIL" : "SMS";
        }

        if ("EMAIL".equals(channel) || recipient.contains("@")) {
            emailService.sendOtpEmail(recipient, otp);
        } else if ("WHATSAPP".equals(channel)) {
            messageService.sendBookingWhatsApp(recipient, null); // or dedicated OTP template
        } else {
            messageService.sendOtpSms(recipient, otp);
        }

        response.put("success", true);
        response.put("message", "Verification OTP successfully dispatched to " + recipient + " via " + channel);
        response.put("channel", channel);
        response.put("otp", otp);
        response.put("expiresInSeconds", 300); // 5 minutes
        response.put("demoHint", "For instant zero-setup testing, OTP: " + otp + " or demo OTP 7890 can be used.");

        return ResponseEntity.ok(response);
    }

    /**
     * 🔐 LOGIN Endpoint (Supports Password OR OTP Verification)
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req) {
        Map<String, Object> response = new HashMap<>();

        String identifier = req.getEmail() != null && !req.getEmail().isBlank() 
                ? req.getEmail().trim().toLowerCase() 
                : (req.getPhone() != null ? req.getPhone().trim() : "");

        if (identifier.isBlank()) {
            response.put("success", false);
            response.put("message", "Email or Phone Number is required.");
            return ResponseEntity.badRequest().body(response);
        }

        // 1. Verify OTP if provided
        boolean isOtpValid = req.getOtp() != null && !req.getOtp().isBlank() 
                && otpService.verifyOtp(identifier, req.getOtp());

        // 2. Check for Admin default login
        if ("admin@selectmyflight.com".equalsIgnoreCase(identifier) && 
                ("admin123".equals(req.getPassword()) || "admin".equals(req.getPassword()) || isOtpValid || "7890".equals(req.getOtp()))) {
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

        // 3. Check Database User
        Optional<User> userOpt = identifier.contains("@") 
                ? userRepository.findByEmail(identifier) 
                : userRepository.findByPhone(identifier);

        if (userOpt.isPresent()) {
            User u = userOpt.get();
            boolean isPasswordMatch = req.getPassword() != null && req.getPassword().equals(u.getPassword());

            if (isOtpValid || isPasswordMatch || "7890".equals(req.getOtp())) {
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

        // 4. Fallback Demo Traveler (Rahul Sharma)
        if (isOtpValid || "7890".equals(req.getOtp()) || "rahul.sharma@gmail.com".equalsIgnoreCase(identifier)) {
            response.put("success", true);
            response.put("token", "SMF-DEMO-TOKEN-" + System.currentTimeMillis());
            response.put("user", Map.of(
                    "name", "Rahul Sharma",
                    "email", identifier.contains("@") ? identifier : "rahul.sharma@gmail.com",
                    "phone", !identifier.contains("@") ? identifier : "+91 98765 43210",
                    "role", "ROLE_USER",
                    "frequentFlyerTier", "Gold Elite",
                    "homeAirport", "DEL"
            ));
            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("message", "Invalid credentials or OTP. Please check your verification code.");
        return ResponseEntity.status(401).body(response);
    }

    /**
     * 📝 REGISTER Endpoint
     */
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

    public static class GoogleLoginRequest {
        private String email;
        private String name;
        private String picture;
        private String idToken;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPicture() { return picture; }
        public void setPicture(String picture) { this.picture = picture; }
        public String getIdToken() { return idToken; }
        public void setIdToken(String idToken) { this.idToken = idToken; }
    }

    /**
     * 🌐 GOOGLE / GMAIL 1-Click Sign-In Endpoint
     * Supports both real Google ID Token verification via Google OAuth2 tokeninfo API
     * and direct profile login.
     */
    @PostMapping("/google")
    public ResponseEntity<Map<String, Object>> googleLogin(@RequestBody(required = false) GoogleLoginRequest req) {
        Map<String, Object> response = new HashMap<>();
        String email = null;
        String name = null;

        // 1. Verify Real Google ID Token if passed from Google Identity Services
        if (req != null && req.getIdToken() != null && !req.getIdToken().isBlank()) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                java.net.http.HttpRequest gReq = java.net.http.HttpRequest.newBuilder()
                        .uri(java.net.URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + req.getIdToken().trim()))
                        .GET()
                        .build();

                java.net.http.HttpResponse<String> gRes = client.send(gReq, java.net.http.HttpResponse.BodyHandlers.ofString());
                if (gRes.statusCode() == 200 && gRes.body().contains("\"email\"")) {
                    // Extract email and name from Google's JSON response
                    String body = gRes.body();
                    int emailIdx = body.indexOf("\"email\":");
                    if (emailIdx != -1) {
                        int start = body.indexOf("\"", emailIdx + 8) + 1;
                        int end = body.indexOf("\"", start);
                        email = body.substring(start, end).toLowerCase();
                    }
                    int nameIdx = body.indexOf("\"name\":");
                    if (nameIdx != -1) {
                        int start = body.indexOf("\"", nameIdx + 7) + 1;
                        int end = body.indexOf("\"", start);
                        name = body.substring(start, end);
                    }
                    System.out.println("✅ [Google OAuth] Successfully verified real Google ID Token for: " + email);
                }
            } catch (Exception e) {
                System.err.println("⚠️ Google Token Verification warning: " + e.getMessage());
            }
        }

        // 2. Fallback to client provided email/name if token verification was skipped or offline
        if (email == null) {
            email = (req != null && req.getEmail() != null && !req.getEmail().isBlank()) 
                    ? req.getEmail().trim().toLowerCase() 
                    : "rahul.sharma@gmail.com";
        }
        if (name == null) {
            name = (req != null && req.getName() != null && !req.getName().isBlank()) 
                    ? req.getName() 
                    : "Rahul Sharma";
        }

        // Find or auto-register user
        String finalEmail = email;
        String finalName = name;
        User user = userRepository.findByEmail(finalEmail).orElseGet(() -> {
            User newUser = new User(
                    finalName,
                    finalEmail,
                    "+91 98765 43210",
                    "oauth_google_verified",
                    "ROLE_USER"
            );
            return userRepository.save(newUser);
        });

        response.put("success", true);
        response.put("provider", "GOOGLE");
        response.put("token", "SMF-GOOGLE-TOKEN-" + System.currentTimeMillis());
        response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getFullName(),
                "email", user.getEmail(),
                "phone", user.getPhone() != null ? user.getPhone() : "+91 98765 43210",
                "role", user.getRole(),
                "frequentFlyerTier", user.getFrequentFlyerTier() != null ? user.getFrequentFlyerTier() : "Gold Elite",
                "homeAirport", user.getHomeAirport() != null ? user.getHomeAirport() : "DEL"
        ));
        return ResponseEntity.ok(response);
    }
}
