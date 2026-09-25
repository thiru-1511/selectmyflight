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
            }
        }

        return bookingRepository.save(bookingRequest);
    }

    public Optional<Booking> getBookingByPnr(String pnr) {
        return bookingRepository.findByPnr(pnr.toUpperCase().trim());
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDesc();
    }

    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByContactEmailOrderByBookingDateDesc(email);
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
