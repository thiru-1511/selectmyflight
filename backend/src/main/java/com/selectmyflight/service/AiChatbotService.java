package com.selectmyflight.service;

import com.selectmyflight.model.Flight;
import com.selectmyflight.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AiChatbotService {

    @Autowired
    private FlightRepository flightRepository;

    public Map<String, Object> processQuery(String userQuery) {
        Map<String, Object> response = new HashMap<>();
        String queryLower = userQuery != null ? userQuery.toLowerCase().trim() : "";

        List<Flight> allFlights = flightRepository.findAll();
        List<Flight> recommendedFlights = new ArrayList<>();
        String replyText;

        // 1. Check for "shortest duration" or "fastest"
        if (queryLower.contains("shortest") || queryLower.contains("fastest") || queryLower.contains("quickest")) {
            // Check if a destination is mentioned
            String dest = extractDestination(queryLower);
            List<Flight> candidateFlights = (dest != null) 
                    ? flightRepository.findByDestinationCode(dest) 
                    : allFlights;

            Flight fastest = candidateFlights.stream()
                    .min(Comparator.comparing(Flight::getDurationMinutes))
                    .orElse(null);

            if (fastest != null) {
                recommendedFlights.add(fastest);
                int hours = fastest.getDurationMinutes() / 60;
                int mins = fastest.getDurationMinutes() % 60;
                replyText = String.format("✈️ The fastest flight is **%s** (%s) from %s to %s with a duration of only **%dh %02dm** at ₹%,.2f!",
                        fastest.getAirlineName(), fastest.getFlightNumber(), fastest.getOriginCode(), fastest.getDestinationCode(), hours, mins, fastest.getBasePrice());
            } else {
                replyText = "I found our direct express routes. Here are the top fastest options available right now:";
                recommendedFlights = allFlights.stream()
                        .sorted(Comparator.comparing(Flight::getDurationMinutes))
                        .limit(3)
                        .collect(Collectors.toList());
            }
        }
        // 2. Check for budget queries like "under 15000", "under ₹15,000", "under 10000"
        else if (queryLower.contains("under") || queryLower.contains("budget") || queryLower.contains("cheap") || queryLower.contains("cheapest")) {
            BigDecimal budget = extractBudget(queryLower);
            if (budget == null) {
                budget = new BigDecimal("15000.00");
            }

            final BigDecimal finalBudget = budget;
            String dest = extractDestination(queryLower);

            List<Flight> filtered = allFlights.stream()
                    .filter(f -> f.getBasePrice().compareTo(finalBudget) <= 0)
                    .filter(f -> dest == null || f.getDestinationCode().equalsIgnoreCase(dest))
                    .sorted(Comparator.comparing(Flight::getBasePrice))
                    .limit(4)
                    .collect(Collectors.toList());

            if (!filtered.isEmpty()) {
                recommendedFlights = filtered;
                replyText = String.format("🎉 Great news! I found %d great flight options under ₹%,.0f for you. Here are the best recommended deals:",
                        filtered.size(), finalBudget);
            } else {
                replyText = String.format("No direct flights found strictly below ₹%,.0f for that route, but here are the lowest priced flights starting shortly above your budget:", finalBudget);
                recommendedFlights = allFlights.stream()
                        .sorted(Comparator.comparing(Flight::getBasePrice))
                        .limit(3)
                        .collect(Collectors.toList());
            }
        }
        // 3. Destination queries like "flight to Dubai", "trip to London", "Singapore", "Goa"
        else if (containsDestination(queryLower)) {
            String dest = extractDestination(queryLower);
            List<Flight> destFlights = flightRepository.findByDestinationCode(dest);
            if (!destFlights.isEmpty()) {
                recommendedFlights = destFlights.stream()
                        .sorted(Comparator.comparing(Flight::getBasePrice))
                        .limit(3)
                        .collect(Collectors.toList());
                Flight lowest = recommendedFlights.get(0);
                replyText = String.format("🌟 Here are the best available flights to **%s**! Fares start from just **₹%,.2f** on %s.",
                        getCityName(dest), lowest.getBasePrice(), lowest.getAirlineName());
            } else {
                replyText = "Here are our most popular flight routes:";
                recommendedFlights = allFlights.stream().limit(3).collect(Collectors.toList());
            }
        }
        // 4. Baggage or Refund inquiries
        else if (queryLower.contains("baggage") || queryLower.contains("luggage") || queryLower.contains("weight")) {
            replyText = "🧳 **SelectMyFlight Baggage Policy:**\n• Cabin Baggage: 1 bag up to 7 kg is free across all flights.\n• Checked Baggage: 15 kg - 30 kg depending on airline & cabin class.\n• Pre-booking extra baggage saves up to 45% compared to airport check-in desks!";
        } else if (queryLower.contains("cancel") || queryLower.contains("refund") || queryLower.contains("change")) {
            replyText = "🛡️ **Fare & Refund Terms:**\n• Most flights on SelectMyFlight are refundable up to 24 hours prior to departure.\n• Standard cancellation fee is ₹1,500 and date change fee is ₹1,000.\n• Instant refunds are processed directly in your **My Trips** dashboard!";
        } else {
            // General Travel greeting & smart recommendation
            replyText = "Hello! I am **SkyGenie AI**, your 24/7 personal travel assistant. You can ask me:\n• *\"Find me a cheap flight to Dubai\"*\n• *\"Which flight has the shortest duration?\"*\n• *\"I want a weekend trip under ₹15,000\"*\n\nHere are some trending flight picks for you:";
            recommendedFlights = allFlights.stream()
                    .sorted(Comparator.comparing(Flight::getBasePrice))
                    .limit(3)
                    .collect(Collectors.toList());
        }

        response.put("reply", replyText);
        response.put("recommendedFlights", recommendedFlights);
        response.put("timestamp", new Date());

        return response;
    }

    private boolean containsDestination(String query) {
        return query.contains("dubai") || query.contains("dxb") ||
               query.contains("london") || query.contains("lhr") ||
               query.contains("singapore") || query.contains("sin") ||
               query.contains("mumbai") || query.contains("bom") ||
               query.contains("delhi") || query.contains("del") ||
               query.contains("goa") || query.contains("goi");
    }

    private String extractDestination(String query) {
        if (query.contains("dubai") || query.contains("dxb")) return "DXB";
        if (query.contains("london") || query.contains("lhr")) return "LHR";
        if (query.contains("singapore") || query.contains("sin")) return "SIN";
        if (query.contains("mumbai") || query.contains("bom")) return "BOM";
        if (query.contains("delhi") || query.contains("del")) return "DEL";
        if (query.contains("goa") || query.contains("goi")) return "GOI";
        return null;
    }

    private String getCityName(String code) {
        return switch (code) {
            case "DXB" -> "Dubai";
            case "LHR" -> "London";
            case "SIN" -> "Singapore";
            case "BOM" -> "Mumbai";
            case "DEL" -> "New Delhi";
            case "GOI" -> "Goa";
            default -> code;
        };
    }

    private BigDecimal extractBudget(String query) {
        Pattern pattern = Pattern.compile("(?:under|below|less than|budget of)?\\s*(?:rs\\.?|inr|₹)?\\s*(\\d+[,\\d]*)");
        Matcher matcher = pattern.matcher(query);
        if (matcher.find()) {
            String numStr = matcher.group(1).replace(",", "");
            try {
                return new BigDecimal(numStr);
            } catch (Exception ignored) {}
        }
        return null;
    }
}
