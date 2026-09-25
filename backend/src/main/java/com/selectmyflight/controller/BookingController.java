package com.selectmyflight.controller;

import com.selectmyflight.model.Booking;
import com.selectmyflight.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Feature 9: Easy Booking & Payment -> Generates PNR and Confirmed E-Ticket
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking created = bookingService.createBooking(booking);
        return ResponseEntity.ok(created);
    }

    // Feature 9: Retrieve E-Ticket by PNR
    @GetMapping("/{pnr}")
    public ResponseEntity<Booking> getBookingByPnr(@PathVariable String pnr) {
        return bookingService.getBookingByPnr(pnr)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Feature 10: My Trips Dashboard (List upcoming and past bookings)
    @GetMapping
    public ResponseEntity<List<Booking>> getMyTrips(@RequestParam(required = false) String email) {
        if (email != null && !email.isBlank()) {
            return ResponseEntity.ok(bookingService.getBookingsByEmail(email));
        }
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // Feature 10: Manage & Cancel Booking with Instant Refund Calculation
    @PostMapping("/{pnr}/cancel")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable String pnr) {
        Map<String, Object> result = bookingService.cancelBooking(pnr);
        return ResponseEntity.ok(result);
    }
}
