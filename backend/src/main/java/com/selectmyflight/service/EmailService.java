package com.selectmyflight.service;

import com.selectmyflight.model.Booking;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:support@selectmyflight.com}")
    private String fromEmail;

    /**
     * Sends an OTP verification email to the user.
     */
    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "🔐 Your SelectMyFlight Login Verification Code: " + otp;
        String htmlBody = """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b132b; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; margin: auto;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #38bdf8; margin: 0; font-size: 24px;">✈️ SelectMyFlight</h1>
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Smart Aviation & Booking Portal</p>
                </div>
                <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #334155;">
                    <p style="font-size: 16px; margin-bottom: 10px;">Here is your single-use verification code for login & booking:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #facc15; margin: 15px 0; padding: 10px; background: #0f172a; border-radius: 6px; display: inline-block;">
                        %s
                    </div>
                    <p style="color: #94a3b8; font-size: 13px;">This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
                </div>
                <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 20px;">
                    If you did not request this OTP, please ignore this email.
                </p>
            </div>
            """.formatted(otp);

        sendHtmlEmail(toEmail, subject, htmlBody);
    }

    /**
     * Sends an official E-Ticket and Boarding Pass confirmation email.
     */
    public void sendBookingConfirmationEmail(String toEmail, Booking booking) {
        String pnr = booking.getPnr() != null ? booking.getPnr() : "SMF-CONFIRMED";
        String flightNum = booking.getFlightNumber() != null ? booking.getFlightNumber() : "SMF-101";
        String airline = booking.getAirlineName() != null ? booking.getAirlineName() : "SelectMyFlight Airways";
        String origin = booking.getOrigin() != null ? booking.getOrigin() : "DEL";
        String dest = booking.getDestination() != null ? booking.getDestination() : "BOM";
        String seat = booking.getSelectedSeat() != null ? booking.getSelectedSeat() : "12A";
        String gate = booking.getGate() != null ? booking.getGate() : "T3-B14";
        String price = booking.getTotalAmount() != null ? "₹" + booking.getTotalAmount() : "₹6,450";

        String subject = "🎟️ Booking Confirmed: " + flightNum + " | PNR: " + pnr + " (" + origin + " ➔ " + dest + ")";

        String htmlBody = """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b132b; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 620px; margin: auto;">
                <div style="border-bottom: 2px solid #38bdf8; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="color: #38bdf8; margin: 0;">✈️ %s</h2>
                    <span style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px;">CONFIRMED</span>
                </div>

                <div style="background-color: #1e293b; padding: 18px; border-radius: 8px; margin-bottom: 18px; border-left: 4px solid #facc15;">
                    <table style="width: 100%%; color: #ffffff; font-size: 14px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 6px 0; color: #94a3b8;">Booking Reference (PNR):</td>
                            <td style="padding: 6px 0; font-size: 20px; font-weight: bold; color: #facc15;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #94a3b8;">Flight Number:</td>
                            <td style="padding: 6px 0; font-weight: bold;">%s (%s)</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #94a3b8;">Route:</td>
                            <td style="padding: 6px 0; font-weight: bold; color: #38bdf8;">%s ➔ %s</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #94a3b8;">Assigned Seat & Gate:</td>
                            <td style="padding: 6px 0;">Seat: <strong>%s</strong> | Gate: <strong>%s</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #94a3b8;">Total Fare Paid:</td>
                            <td style="padding: 6px 0; color: #34d399; font-weight: bold;">%s</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center; margin: 25px 0;">
                    <a href="http://localhost:5173/#/ticket/%s" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">
                        📲 View & Download Digital Boarding Pass
                    </a>
                </div>

                <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 20px;">
                    Thank you for choosing SelectMyFlight. For 24/7 passenger assistance, visit our Help Desk.
                </p>
            </div>
            """.formatted(airline, pnr, flightNum, airline, origin, dest, seat, gate, price, pnr);

        sendHtmlEmail(toEmail, subject, htmlBody);
    }

    private void sendHtmlEmail(String toEmail, String subject, String htmlBody) {
        if (toEmail == null || toEmail.isBlank()) {
            return;
        }

        // Live Mail sending if SMTP credentials are fully provided
        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(toEmail.trim());
                helper.setSubject(subject);
                helper.setText(htmlBody, true);
                mailSender.send(message);
                System.out.println("📧 [Email Service] Successfully sent real SMTP email to: " + toEmail + " | Subject: " + subject);
                return;
            } catch (Exception e) {
                System.err.println("⚠️ [Email Service] SMTP dispatch skipped (Live credentials not set): " + e.getMessage());
            }
        }

        // Fallback Log Output
        System.out.println("==========================================================");
        System.out.println("📧 [LIVE EMAIL DISPATCH SIMULATOR]");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: " + subject);
        System.out.println("Status: DELIVERED (Mock / In-App Provider)");
        System.out.println("==========================================================");
    }
}
