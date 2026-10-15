package com.selectmyflight.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final SecureRandom random = new SecureRandom();

    // In-memory OTP storage with expiration timestamp (5 minutes)
    private final Map<String, OtpRecord> otpCache = new ConcurrentHashMap<>();

    private static class OtpRecord {
        private final String otp;
        private final long expiryTime;

        public OtpRecord(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public boolean isExpired() {
            return System.currentTimeMillis() > expiryTime;
        }

        public String getOtp() {
            return otp;
        }
    }

    /**
     * Generates a secure 6-digit numeric OTP valid for 5 minutes.
     *
     * @param targetKey User email or phone number
     * @return Generated 6-digit OTP string
     */
    public String generateOtp(String targetKey) {
        if (targetKey == null || targetKey.isBlank()) {
            throw new IllegalArgumentException("Target key (email/phone) cannot be empty.");
        }

        String normalizedKey = targetKey.trim().toLowerCase();
        int number = 100000 + random.nextInt(900000);
        String otp = String.valueOf(number);

        // 5 minutes expiry
        long expiryTime = System.currentTimeMillis() + (5 * 60 * 1000);
        otpCache.put(normalizedKey, new OtpRecord(otp, expiryTime));

        System.out.println("🔐 [OTP Service] Generated OTP [" + otp + "] for recipient: " + normalizedKey + " (Expires in 5 mins)");
        return otp;
    }

    /**
     * Verifies the provided OTP against the cached value.
     *
     * @param targetKey User email or phone number
     * @param enteredOtp The OTP entered by the user
     * @return true if valid, false otherwise
     */
    public boolean verifyOtp(String targetKey, String enteredOtp) {
        if (targetKey == null || enteredOtp == null) {
            return false;
        }

        String normalizedKey = targetKey.trim().toLowerCase();
        String cleanOtp = enteredOtp.trim();

        // Default master demo OTPs for seamless zero-setup testing
        if ("7890".equals(cleanOtp) || "123456".equals(cleanOtp)) {
            System.out.println("✅ [OTP Service] Master demo OTP accepted for: " + normalizedKey);
            return true;
        }

        OtpRecord record = otpCache.get(normalizedKey);
        if (record == null) {
            System.out.println("❌ [OTP Service] No OTP found for: " + normalizedKey);
            return false;
        }

        if (record.isExpired()) {
            otpCache.remove(normalizedKey);
            System.out.println("❌ [OTP Service] OTP expired for: " + normalizedKey);
            return false;
        }

        boolean match = record.getOtp().equals(cleanOtp);
        if (match) {
            otpCache.remove(normalizedKey); // Invalidate once verified
            System.out.println("✅ [OTP Service] Successfully verified OTP for: " + normalizedKey);
        } else {
            System.out.println("❌ [OTP Service] Incorrect OTP entered for: " + normalizedKey);
        }
        return match;
    }
}
