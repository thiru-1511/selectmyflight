package com.selectmyflight.controller;

import com.selectmyflight.model.Addon;
import com.selectmyflight.model.Seat;
import com.selectmyflight.repository.AddonRepository;
import com.selectmyflight.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/cabin")
public class SeatAndAddonController {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private AddonRepository addonRepository;

    // Feature 8: Get interactive cabin seat map for a flight
    @GetMapping("/seats/{flightId}")
    public ResponseEntity<List<Seat>> getSeatsForFlight(@PathVariable Long flightId) {
        List<Seat> seats = seatRepository.findByFlightIdOrderBySeatNumber(flightId);
        if (seats.isEmpty()) {
            // Generate standard Airbus A321 layout (Rows 1 to 10, A-F)
            seats = generateDefaultSeats(flightId);
            seatRepository.saveAll(seats);
        }
        return ResponseEntity.ok(seats);
    }

    // Feature 8: Get available Meals, Extra Baggage, and Priority Add-ons
    @GetMapping("/addons")
    public ResponseEntity<List<Addon>> getAllAddons(@RequestParam(required = false) String type) {
        if (type != null && !type.isBlank()) {
            return ResponseEntity.ok(addonRepository.findByAddonType(type.toUpperCase()));
        }
        return ResponseEntity.ok(addonRepository.findAll());
    }

    private List<Seat> generateDefaultSeats(Long flightId) {
        List<Seat> list = new ArrayList<>();
        String[] cols = {"A", "B", "C", "D", "E", "F"};
        for (int row = 1; row <= 8; row++) {
            for (String col : cols) {
                String seatNum = String.format("%02d%s", row, col);
                String seatClass = (row <= 2) ? "Business" : (row == 3 ? "Extra Legroom" : "Economy");
                String seatType = (col.equals("A") || col.equals("F")) ? "Window" : (col.equals("C") || col.equals("D") ? "Aisle" : "Middle");
                boolean extraLeg = row <= 3;
                BigDecimal priceAddon = row <= 2 ? new BigDecimal("2500.00") : (row == 3 ? new BigDecimal("600.00") : (col.equals("A") || col.equals("F") ? new BigDecimal("250.00") : BigDecimal.ZERO));
                boolean booked = (row == 1 && col.equals("B")) || (row == 4 && col.equals("C")) || (row == 6 && col.equals("E"));

                list.add(new Seat(flightId, seatNum, seatClass, seatType, extraLeg, priceAddon, booked));
            }
        }
        return list;
    }
}
