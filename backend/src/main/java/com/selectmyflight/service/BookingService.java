package com.selectmyflight.service;

import com.selectmyflight.model.Booking;
import com.selectmyflight.model.Flight;
import com.selectmyflight.model.Passenger;
import com.selectmyflight.repository.BookingRepository;
import com.selectmyflight.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private MessageService messageService;

    public Booking createBooking(Booking bookingRequest) {
        // Generate Unique 6-character PNR
        String pnr = generatePnr();
        bookingRequest.setPnr(pnr);
        bookingRequest.setBookingDate(LocalDateTime.now());
        if (bookingRequest.getTravelDate() == null) {
            bookingRequest.setTravelDate(LocalDate.now().plusDays(7));
        }
        bookingRequest.setStatus("CONFIRMED");
        bookingRequest.setPaymentStatus("PAID");
        bookingRequest.setFlightStatus("ON_TIME");
        bookingRequest.setGate("T3-B" + (10 + new Random().nextInt(20)));
        bookingRequest.setTerminal("T3");

        // Link passengers to this booking
        if (bookingRequest.getPassengers() != null) {
            for (Passenger p : bookingRequest.getPassengers()) {
                p.setBooking(bookingRequest);
                if (bookingRequest.getSelectedSeat() == null && p.getSeatNumber() != null) {
                    bookingRequest.setSelectedSeat(p.getSeatNumber());
                }
            }
        }

        // Fetch flight metadata for notifications
        if (bookingRequest.getFlightId() != null) {
            flightRepository.findById(bookingRequest.getFlightId()).ifPresent(f -> {
                bookingRequest.setFlightNumber(f.getFlightNumber());
                bookingRequest.setAirlineName(f.getAirlineName());
                bookingRequest.setOrigin(f.getOriginCode());
                bookingRequest.setDestination(f.getDestinationCode());
                bookingRequest.setDepartureTime(f.getDepartureTime());
            });
        }

        Booking saved = bookingRepository.save(bookingRequest);

        // Ensure transient fields remain populated in saved instance
        saved.setFlightNumber(bookingRequest.getFlightNumber());
        saved.setAirlineName(bookingRequest.getAirlineName());
        saved.setOrigin(bookingRequest.getOrigin());
        saved.setDestination(bookingRequest.getDestination());
        saved.setDepartureTime(bookingRequest.getDepartureTime());
        saved.setSelectedSeat(bookingRequest.getSelectedSeat() != null ? bookingRequest.getSelectedSeat() : "14B");
        enrichBookingWithFlight(saved);

        // 🚀 AUTOMATED MULTI-CHANNEL DISPATCH (Email, SMS & WhatsApp)
        dispatchBookingNotifications(saved);

        return saved;
    }

    private void dispatchBookingNotifications(Booking booking) {
        try {
            // 1. 📧 Email E-Ticket Confirmation
            if (booking.getContactEmail() != null && !booking.getContactEmail().isBlank()) {
                emailService.sendBookingConfirmationEmail(booking.getContactEmail(), booking);
            }

            // 2. 📱 SMS Booking Confirmation
            if (booking.getContactPhone() != null && !booking.getContactPhone().isBlank()) {
                messageService.sendBookingSms(booking.getContactPhone(), booking);
            }

            // 3. 💬 WhatsApp Interactive Boarding Pass
            if (booking.getContactPhone() != null && !booking.getContactPhone().isBlank()) {
                messageService.sendBookingWhatsApp(booking.getContactPhone(), booking);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Notification dispatch notice: " + e.getMessage());
        }
    }

    public void enrichBookingWithFlight(Booking booking) {
        if (booking != null && booking.getFlightId() != null) {
            flightRepository.findById(booking.getFlightId()).ifPresent(f -> {
                booking.setFlight(f);
                booking.setFlightNumber(f.getFlightNumber());
                booking.setAirlineName(f.getAirlineName());
                booking.setOrigin(f.getOriginCode());
                booking.setDestination(f.getDestinationCode());
                booking.setDepartureTime(f.getDepartureTime());
            });
        }
    }

    public Optional<Booking> getBookingByPnr(String pnr) {
        Optional<Booking> opt = bookingRepository.findByPnr(pnr.toUpperCase().trim());
        opt.ifPresent(this::enrichBookingWithFlight);
        return opt;
    }

    public List<Booking> getAllBookings() {
        List<Booking> list = bookingRepository.findAllByOrderByBookingDateDesc();
        list.forEach(this::enrichBookingWithFlight);
        return list;
    }

    public List<Booking> getBookingsByEmail(String email) {
        List<Booking> list = bookingRepository.findByContactEmailOrderByBookingDateDesc(email);
        list.forEach(this::enrichBookingWithFlight);
        return list;
    }

    public Map<String, Object> cancelBooking(String pnr) {
        Map<String, Object> response = new HashMap<>();
        Optional<Booking> opt = bookingRepository.findByPnr(pnr.toUpperCase().trim());
        if (opt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Booking with PNR " + pnr + " not found.");
            return response;
        }

        Booking booking = opt.get();
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            response.put("success", false);
            response.put("message", "Booking is already cancelled.");
            return response;
        }

        Flight flight = flightRepository.findById(booking.getFlightId()).orElse(null);
        BigDecimal cancellationFee = (flight != null && flight.getCancellationFee() != null) 
                ? flight.getCancellationFee() 
                : new BigDecimal("1500.00");

        BigDecimal totalPaid = booking.getTotalAmount();
        BigDecimal refundAmount = totalPaid.subtract(cancellationFee);
        if (refundAmount.compareTo(BigDecimal.ZERO) < 0) {
            refundAmount = BigDecimal.ZERO;
        }

        booking.setStatus("CANCELLED");
        booking.setFlightStatus("CANCELLED");
        bookingRepository.save(booking);

        response.put("success", true);
        response.put("message", "Booking cancelled successfully.");
        response.put("pnr", booking.getPnr());
        response.put("totalPaid", totalPaid);
        response.put("cancellationFee", cancellationFee);
        response.put("refundAmount", refundAmount);
        response.put("refundTimeline", "Refund will be credited back to your original payment method in 3-5 business days.");

        return response;
    }

    private String generatePnr() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder("SMF");
        Random random = new Random();
        for (int i = 0; i < 3; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
