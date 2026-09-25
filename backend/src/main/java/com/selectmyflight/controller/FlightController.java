package com.selectmyflight.controller;

import com.selectmyflight.model.Airport;
import com.selectmyflight.model.Flight;
import com.selectmyflight.repository.AirportRepository;
import com.selectmyflight.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired
    private FlightService flightService;

    @Autowired
    private AirportRepository airportRepository;

    // Feature 1 & 5: Smart Flight Search, Advanced Filters & Sorting
    @GetMapping
    public ResponseEntity<List<Flight>> searchFlights(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String cabinClass,
            @RequestParam(required = false) String sortBy) {
        return ResponseEntity.ok(flightService.searchFlights(origin, destination, cabinClass, sortBy));
    }

    // Single Flight details
    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        return flightService.getFlightById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Feature 2: Flight Comparison (Cheapest & Fastest)
    @GetMapping("/compare")
    public ResponseEntity<Map<String, Object>> compareFlights(
            @RequestParam(required = false, defaultValue = "DEL") String origin,
            @RequestParam(required = false, defaultValue = "BOM") String destination) {
        return ResponseEntity.ok(flightService.getFlightComparison(origin, destination));
    }

    // Feature 4: Flexible Date Search (-3 to +3 days matrix)
    @GetMapping("/flexible-dates")
    public ResponseEntity<List<Map<String, Object>>> getFlexibleDatePrices(
            @RequestParam(required = false, defaultValue = "DEL") String origin,
            @RequestParam(required = false, defaultValue = "BOM") String destination,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(flightService.getFlexibleDatePrices(origin, destination, date));
    }

    // Airports Auto-complete List
    @GetMapping("/airports")
    public ResponseEntity<List<Airport>> getAllAirports() {
        return ResponseEntity.ok(airportRepository.findAll());
    }

    // Real-Time Live Flight Telemetry Proxy
    @GetMapping("/live-status")
    public ResponseEntity<Map<String, Object>> getLiveFlightStatus(
            @RequestParam String flightNumber,
            @RequestParam(required = false) String apiKey,
            @RequestParam(required = false, defaultValue = "aviationstack") String provider) {
        return ResponseEntity.ok(flightService.fetchLiveRealTimeFlight(flightNumber, apiKey, provider));
    }
}
