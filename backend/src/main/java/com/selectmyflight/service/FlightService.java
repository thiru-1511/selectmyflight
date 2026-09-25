package com.selectmyflight.service;

import com.selectmyflight.model.Flight;
import com.selectmyflight.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public List<Flight> searchFlights(String origin, String destination, String cabinClass, String sortBy) {
        List<Flight> results;
        if (origin != null && !origin.isBlank() && destination != null && !destination.isBlank()) {
            results = flightRepository.findByOriginCodeAndDestinationCode(origin.toUpperCase(), destination.toUpperCase());
            if (results.isEmpty()) {
                // If direct route not found, provide flights matching destination
                results = flightRepository.findByDestinationCode(destination.toUpperCase());
            }
        } else {
            results = flightRepository.findAll();
        }

        if (cabinClass != null && !cabinClass.isBlank() && !cabinClass.equalsIgnoreCase("All")) {
            results = results.stream()
                    .filter(f -> f.getCabinClass().equalsIgnoreCase(cabinClass))
                    .collect(Collectors.toList());
        }

        // Apply Sorting
        if ("price_asc".equalsIgnoreCase(sortBy)) {
            results.sort(Comparator.comparing(Flight::getBasePrice));
        } else if ("duration_asc".equalsIgnoreCase(sortBy)) {
            results.sort(Comparator.comparing(Flight::getDurationMinutes));
        } else if ("departure_asc".equalsIgnoreCase(sortBy)) {
            results.sort(Comparator.comparing(Flight::getDepartureTime));
        } else if ("departure_desc".equalsIgnoreCase(sortBy)) {
            results.sort(Comparator.comparing(Flight::getDepartureTime).reversed());
        }

        return results;
    }

    public Map<String, Object> getFlightComparison(String origin, String destination) {
        List<Flight> flights = searchFlights(origin, destination, null, null);
        Map<String, Object> comparison = new HashMap<>();

        if (flights.isEmpty()) {
            comparison.put("cheapest", null);
            comparison.put("fastest", null);
            comparison.put("flights", Collections.emptyList());
            return comparison;
        }

        Flight cheapest = flights.stream().min(Comparator.comparing(Flight::getBasePrice)).orElse(null);
        Flight fastest = flights.stream().min(Comparator.comparing(Flight::getDurationMinutes)).orElse(null);

        comparison.put("cheapest", cheapest);
        comparison.put("fastest", fastest);
        comparison.put("totalOptions", flights.size());
        comparison.put("flights", flights);

        return comparison;
    }

    public List<Map<String, Object>> getFlexibleDatePrices(String origin, String destination, String baseDateStr) {
        LocalDate baseDate = (baseDateStr != null && !baseDateStr.isBlank()) 
                ? LocalDate.parse(baseDateStr) 
                : LocalDate.now().plusDays(3);

        List<Flight> directFlights = searchFlights(origin, destination, null, null);
        BigDecimal basePrice = directFlights.isEmpty() 
                ? new BigDecimal("5500.00") 
                : directFlights.stream().map(Flight::getBasePrice).min(BigDecimal::compareTo).orElse(new BigDecimal("5500.00"));

        List<Map<String, Object>> flexibleGrid = new ArrayList<>();
        // -3 days to +3 days
        double[] varianceFactors = {1.15, 0.92, 1.05, 1.00, 0.88, 1.20, 0.95};

        for (int i = -3; i <= 3; i++) {
            LocalDate date = baseDate.plusDays(i);
            double factor = varianceFactors[i + 3];
            BigDecimal price = basePrice.multiply(BigDecimal.valueOf(factor)).setScale(0, RoundingMode.HALF_UP);

            Map<String, Object> dayInfo = new HashMap<>();
            dayInfo.put("date", date.toString());
            dayInfo.put("dayOfWeek", date.getDayOfWeek().toString().substring(0, 3));
            dayInfo.put("price", price);
            dayInfo.put("isCheapest", factor <= 0.92);
            dayInfo.put("isCurrent", i == 0);
            flexibleGrid.add(dayInfo);
        }

        return flexibleGrid;
    }

    public Optional<Flight> getFlightById(Long id) {
        return flightRepository.findById(id);
    }

    // Real-Time Live Flight Telemetry Proxy
    public Map<String, Object> fetchLiveRealTimeFlight(String flightNumber, String apiKey, String provider) {
        Map<String, Object> result = new HashMap<>();
        String cleanFlight = flightNumber != null ? flightNumber.trim().toUpperCase().replace("-", "").replace(" ", "") : "";

        if (apiKey == null || apiKey.isBlank()) {
            result.put("success", false);
            result.put("message", "Please enter your API key from AviationStack (aviationstack.com) or AirLabs (airlabs.co).");
            result.put("provider", provider);
            return result;
        }

        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder()
                    .connectTimeout(java.time.Duration.ofSeconds(6))
                    .build();

            String targetUrl;
            if ("airlabs".equalsIgnoreCase(provider)) {
                targetUrl = "https://airlabs.co/api/v9/flight?flight_iata=" + cleanFlight + "&api_key=" + apiKey.trim();
            } else {
                // Default: AviationStack
                targetUrl = "http://api.aviationstack.com/v1/flights?access_key=" + apiKey.trim() + "&flight_iata=" + cleanFlight;
            }

            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create(targetUrl))
                    .timeout(java.time.Duration.ofSeconds(8))
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());

            result.put("statusCode", response.statusCode());
            result.put("flightNumber", cleanFlight);
            result.put("provider", provider);

            if (response.statusCode() == 200) {
                result.put("success", true);
                result.put("rawBody", response.body());
            } else {
                result.put("success", false);
                result.put("error", "API returned status " + response.statusCode() + ": " + response.body());
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to connect to " + provider + ": " + e.getMessage());
        }

        return result;
    }
}
