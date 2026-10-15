package com.selectmyflight.service;

import com.selectmyflight.model.Booking;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;

@Service
public class MessageService {

    @Value("${twilio.account.sid:}")
    private String twilioSid;

    @Value("${twilio.auth.token:}")
    private String twilioAuthToken;

    @Value("${twilio.phone.number:+1234567890}")
    private String fromSmsNumber;

    @Value("${twilio.whatsapp.number:+14155238886}")
    private String fromWhatsAppNumber;

    @Value("${fast2sms.api.key:}")
    private String fast2smsApiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    /**
     * Sends an OTP via standard SMS (Fast2SMS for India or Twilio globally).
     */
    public void sendOtpSms(String phoneNumber, String otp) {
        if (phoneNumber == null || phoneNumber.isBlank()) return;

        // 1. Check for real Fast2SMS Gateway (Popular for instant SMS OTP in India)
        if (fast2smsApiKey != null && !fast2smsApiKey.isBlank()) {
            try {
                String rawDigits = phoneNumber.replaceAll("[^0-9]", "");
                final String target10Digit = (rawDigits.startsWith("91") && rawDigits.length() == 12)
                        ? rawDigits.substring(2)
                        : rawDigits;

                String fast2smsUrl = "https://www.fast2sms.com/dev/bulkV2?authorization=" + fast2smsApiKey
                        + "&route=otp&variables_values=" + otp + "&numbers=" + target10Digit;

                HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create(fast2smsUrl))
                        .header("authorization", fast2smsApiKey.trim())
                        .GET()
                        .build();

                httpClient.sendAsync(req, HttpResponse.BodyHandlers.ofString())
                        .thenAccept(res -> {
                            System.out.println("🚀 [Fast2SMS Gateway] Real SMS dispatched to " + target10Digit + "! HTTP: " + res.statusCode() + " | Response: " + res.body());
                        });
                return;
            } catch (Exception e) {
                System.err.println("⚠️ Fast2SMS Dispatch Error: " + e.getMessage());
            }
        }

        // 2. Check for real Twilio Gateway
        String message = "Your SelectMyFlight login verification code is " + otp + ". Valid for 5 minutes. Do not share with anyone.";
        dispatchTwilioMessage(phoneNumber, fromSmsNumber, message, false);
    }

    /**
     * Sends booking confirmation via standard SMS.
     */
    public void sendBookingSms(String phoneNumber, Booking booking) {
        if (phoneNumber == null || phoneNumber.isBlank()) return;

        String pnr = booking.getPnr() != null ? booking.getPnr() : "SMF-CONFIRMED";
        String flightNum = booking.getFlightNumber() != null ? booking.getFlightNumber() : "SMF-101";
        String origin = booking.getOrigin() != null ? booking.getOrigin() : "DEL";
        String dest = booking.getDestination() != null ? booking.getDestination() : "BOM";
        String seat = booking.getSelectedSeat() != null ? booking.getSelectedSeat() : "12A";
        String gate = booking.getGate() != null ? booking.getGate() : "T3";

        String message = "SelectMyFlight: Booking CONFIRMED! PNR: " + pnr + ", Flight: " + flightNum + " (" + origin + "->" + dest + "), Seat: " + seat + ", Gate: " + gate + ". Have a safe flight!";
        
        // 1. Fast2SMS Quick SMS Route for India
        if (fast2smsApiKey != null && !fast2smsApiKey.isBlank()) {
            try {
                String rawDigits = phoneNumber.replaceAll("[^0-9]", "");
                final String target10Digit = (rawDigits.startsWith("91") && rawDigits.length() == 12)
                        ? rawDigits.substring(2)
                        : rawDigits;

                String fast2smsUrl = "https://www.fast2sms.com/dev/bulkV2?authorization=" + fast2smsApiKey
                        + "&route=q&message=" + java.net.URLEncoder.encode(message, StandardCharsets.UTF_8)
                        + "&numbers=" + target10Digit;

                HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create(fast2smsUrl))
                        .header("authorization", fast2smsApiKey.trim())
                        .GET()
                        .build();

                httpClient.sendAsync(req, HttpResponse.BodyHandlers.ofString())
                        .thenAccept(res -> {
                            System.out.println("🚀 [Fast2SMS Gateway] Booking SMS dispatched to " + target10Digit + "! HTTP: " + res.statusCode() + " | Response: " + res.body());
                        });
                return;
            } catch (Exception e) {
                System.err.println("⚠️ Fast2SMS Booking SMS Error: " + e.getMessage());
            }
        }

        dispatchTwilioMessage(phoneNumber, fromSmsNumber, message, false);
    }

    /**
     * Sends rich booking confirmation and digital boarding pass link via WhatsApp.
     */
    public void sendBookingWhatsApp(String phoneNumber, Booking booking) {
        if (phoneNumber == null || phoneNumber.isBlank()) return;

        String pnr = booking.getPnr() != null ? booking.getPnr() : "SMF-CONFIRMED";
        String flightNum = booking.getFlightNumber() != null ? booking.getFlightNumber() : "SMF-101";
        String origin = booking.getOrigin() != null ? booking.getOrigin() : "DEL";
        String dest = booking.getDestination() != null ? booking.getDestination() : "BOM";
        String seat = booking.getSelectedSeat() != null ? booking.getSelectedSeat() : "12A";
        String gate = booking.getGate() != null ? booking.getGate() : "T3";
        String price = booking.getTotalAmount() != null ? "₹" + booking.getTotalAmount() : "₹6,450";

        String waMessage = """
            ✈️ *SelectMyFlight Ticket Confirmation*
            
            Dear Traveler, your flight is *CONFIRMED*!
            
            🏷️ *PNR:* %s
            ✈️ *Flight:* %s
            📍 *Route:* %s ➔ %s
            💺 *Seat:* %s | 🚪 *Gate:* %s
            💰 *Total Paid:* %s
            
            📲 *Digital Boarding Pass & QR:*
            http://localhost:5173/#/ticket/%s
            
            _Need assistance? Reply 'HELP' to chat with SkyGenie AI._
            """.formatted(pnr, flightNum, origin, dest, seat, gate, price, pnr);

        dispatchTwilioMessage(phoneNumber, fromWhatsAppNumber, waMessage, true);
    }

    private void dispatchTwilioMessage(String to, String from, String body, boolean isWhatsApp) {
        String formattedTo = isWhatsApp ? "whatsapp:" + formatPhone(to) : formatPhone(to);
        String formattedFrom = isWhatsApp ? "whatsapp:" + from : from;

        // If real Twilio credentials are configured in application.properties
        if (twilioSid != null && !twilioSid.isBlank() && twilioAuthToken != null && !twilioAuthToken.isBlank()) {
            try {
                String url = "https://api.twilio.com/2010-04-01/Accounts/" + twilioSid + "/Messages.json";
                String auth = Base64.getEncoder().encodeToString((twilioSid + ":" + twilioAuthToken).getBytes(StandardCharsets.UTF_8));

                String formBody = "To=" + formattedTo + "&From=" + formattedFrom + "&Body=" + java.net.URLEncoder.encode(body, StandardCharsets.UTF_8);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .header("Authorization", "Basic " + auth)
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .POST(HttpRequest.BodyPublishers.ofString(formBody))
                        .build();

                httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                        .thenAccept(res -> {
                            System.out.println("🚀 [" + (isWhatsApp ? "WhatsApp" : "SMS") + " Dispatch] Twilio API Status: " + res.statusCode());
                        });
                return;
            } catch (Exception e) {
                System.err.println("⚠️ Twilio API Call Error: " + e.getMessage());
            }
        }

        // Live Console Simulator Output
        System.out.println("==========================================================");
        System.out.println("💬 [LIVE " + (isWhatsApp ? "WHATSAPP" : "SMS") + " DISPATCH SIMULATOR]");
        System.out.println("Recipient: " + formattedTo);
        System.out.println("Payload: \n" + body);
        System.out.println("Delivery Status: INSTANTLY DELIVERED (Mock Provider)");
        System.out.println("==========================================================");
    }

    private String formatPhone(String phone) {
        String clean = phone.replaceAll("[^0-9+]", "");
        if (!clean.startsWith("+")) {
            // Default to India country code if not specified
            clean = "+91" + clean;
        }
        return clean;
    }
}
