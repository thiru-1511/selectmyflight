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
        // 4. Holiday Planner & Vacation Package Inquiries
        else if (queryLower.contains("holiday") || queryLower.contains("package") || queryLower.contains("vacation") || 
                 queryLower.contains("tour") || queryLower.contains("honeymoon") || queryLower.contains("bali") || 
                 queryLower.contains("kerala") || queryLower.contains("maldives") || queryLower.contains("rajasthan") ||
                 queryLower.contains("beach") || queryLower.contains("getaway")) {
            
            List<Map<String, Object>> holidayPackages = getMatchingHolidayPackages(queryLower);
            response.put("recommendedPackages", holidayPackages);

            if (queryLower.contains("bali")) {
                replyText = "🌴 **Tropical Bali Escape (6 Days / 5 Nights)**\n• Includes: Roundtrip flights + Private Pool Villa in Ubud + 5★ Seminyak beachfront stay\n• Highlights: Nusa Penida speedboat tour, Rice Terrace swing, Tanah Lot sunset\n• Fares from **₹49,800/person** (Save 18% bundled).";
            } else if (queryLower.contains("dubai")) {
                replyText = "✨ **Dubai Extravaganza & Desert Wonder (5 Days / 4 Nights)**\n• Includes: Return flights + 4★ Downtown Hotel + UAE Visa included\n• Highlights: Burj Khalifa 124th floor, Red Dune 4x4 Desert Safari & BBQ, Marina Dhow Dinner Cruise\n• Fares from **₹42,500/person**.";
            } else if (queryLower.contains("kerala")) {
                replyText = "🌿 **Magical Kerala — Backwaters & Tea Hills (6 Days / 5 Nights)**\n• Includes: Return flights to Cochin + Private Houseboat in Alleppey + Munnar tea hills resort\n• Highlights: Periyar spice plantation, private chauffeur sedan, all houseboat meals\n• Fares from **₹28,900/person**.";
            } else if (queryLower.contains("singapore")) {
                replyText = "🏙️ **Futuristic Singapore & Sentosa (5 Days / 4 Nights)**\n• Includes: Roundtrip flights + 4★ City Hotel + Universal Studios & Gardens by the Bay passes\n• Fares from **₹54,000/person**.";
            } else if (queryLower.contains("beach") || queryLower.contains("honeymoon")) {
                replyText = "🏖️ **Top Recommended Beach & Honeymoon Holidays:**\n1. **Bali Private Pool Villa Escape** (6D/5N) – ₹49,800\n2. **Goa Luxury Coastal Retreat** (4D/3N) – ₹18,500\n3. **Dubai Extravaganza & Marina Cruise** (5D/4N) – ₹42,500\n\nAll packages include confirmed return flights, certified 4★/5★ stays, breakfast & private airport transfers!";
            } else {
                replyText = "🌴 **AI-Curated Holiday Packages Available:**\nHere are our top rated all-inclusive holiday packages with guaranteed flights, handpicked 4★/5★ luxury stays, and guided sightseeing:";
            }

            // Also attach flights matching destination if available
            String dest = extractDestination(queryLower);
            if (dest != null) {
                recommendedFlights = flightRepository.findByDestinationCode(dest).stream().limit(2).collect(Collectors.toList());
            }
        }
        // 5. Personalized Trip Recommendations query ("recommend trips for me", "suggest", "personalized")
        else if (queryLower.contains("personal") || queryLower.contains("recommend") || queryLower.contains("for me") || 
                 queryLower.contains("suggest") || queryLower.contains("idea") || queryLower.contains("where to go")) {
            
            replyText = "🎯 **Personalized Trip Recommendations for You:**\nBased on popular departures and trending seasonal weather, here are personalized top picks matching your profile:\n\n• **Weekend Beach Escape:** Goa (GOI) — 2h 35m non-stop, starting ₹5,800\n• **International Luxury:** Dubai (DXB) — 4h 05m non-stop with Emirates, starting ₹14,800\n• **All-Inclusive Holiday:** 6-Day Bali Ubud Villa & Beach Package — ₹49,800\n\nClick any package or flight card below to explore or book instantly!";
            
            response.put("recommendedPackages", getAllHolidayPackages().stream().limit(3).collect(Collectors.toList()));
            recommendedFlights = allFlights.stream()
                    .sorted(Comparator.comparing(Flight::getBasePrice))
                    .limit(3)
                    .collect(Collectors.toList());
        }
        // 6. Baggage or Refund inquiries
        else if (queryLower.contains("baggage") || queryLower.contains("luggage") || queryLower.contains("weight")) {
            replyText = "🧳 **SelectMyFlight Baggage Policy:**\n• Cabin Baggage: 1 bag up to 7 kg is free across all flights.\n• Checked Baggage: 15 kg - 30 kg depending on airline & cabin class.\n• Pre-booking extra baggage saves up to 45% compared to airport check-in desks!";
        } else if (queryLower.contains("cancel") || queryLower.contains("refund") || queryLower.contains("change")) {
            replyText = "🛡️ **Fare & Refund Terms:**\n• Most flights on SelectMyFlight are refundable up to 24 hours prior to departure.\n• Standard cancellation fee is ₹1,500 and date change fee is ₹1,000.\n• Instant refunds are processed directly in your **My Trips** dashboard!";
        } else {
            // General Travel greeting & smart recommendation
            replyText = "Hello! I am **SkyGenie AI**, your 24/7 personal travel & holiday planner assistant. You can ask me:\n• *\"Plan a 5-day holiday in Bali or Dubai\"*\n• *\"Recommend personalized trips for me\"*\n• *\"Find a cheap weekend trip under ₹15,000\"*\n• *\"Which flight has the shortest duration to London?\"*\n\nHere are some trending holiday & flight picks:";
            
            response.put("recommendedPackages", getAllHolidayPackages().stream().limit(2).collect(Collectors.toList()));
            recommendedFlights = allFlights.stream()
                    .sorted(Comparator.comparing(Flight::getBasePrice))
                    .limit(2)
                    .collect(Collectors.toList());
        }

        response.put("reply", replyText);
        response.put("recommendedFlights", recommendedFlights);
        response.put("timestamp", new Date());

        return response;
    }

    private List<Map<String, Object>> getMatchingHolidayPackages(String query) {
        List<Map<String, Object>> all = getAllHolidayPackages();
        if (query.contains("bali")) {
            return all.stream().filter(p -> "DPS".equals(p.get("destinationCode"))).collect(Collectors.toList());
        } else if (query.contains("dubai")) {
            return all.stream().filter(p -> "DXB".equals(p.get("destinationCode"))).collect(Collectors.toList());
        } else if (query.contains("kerala")) {
            return all.stream().filter(p -> "COK".equals(p.get("destinationCode"))).collect(Collectors.toList());
        } else if (query.contains("singapore")) {
            return all.stream().filter(p -> "SIN".equals(p.get("destinationCode"))).collect(Collectors.toList());
        } else if (query.contains("rajasthan")) {
            return all.stream().filter(p -> "JAI".equals(p.get("destinationCode"))).collect(Collectors.toList());
        }
        return all.stream().limit(3).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getAllHolidayPackages() {
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> pkg1 = new HashMap<>();
        pkg1.put("id", "pkg-dubai-5d");
        pkg1.put("title", "Dubai Extravaganza & Desert Wonder");
        pkg1.put("destination", "Dubai, UAE");
        pkg1.put("destinationCode", "DXB");
        pkg1.put("duration", "5 Days / 4 Nights");
        pkg1.put("pricePerPerson", 42500);
        pkg1.put("originalPrice", 49900);
        pkg1.put("rating", 4.9);
        pkg1.put("badge", "BESTSELLER");
        pkg1.put("badgeColor", "#00d2ff");
        pkg1.put("heroImage", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80");
        pkg1.put("highlights", "Return Flights + 4★ Downtown Hotel + Burj Khalifa + 4x4 Desert Safari BBQ");
        list.add(pkg1);

        Map<String, Object> pkg2 = new HashMap<>();
        pkg2.put("id", "pkg-bali-6d");
        pkg2.put("title", "Tropical Bali — Ubud Jungle & Beach Luxury");
        pkg2.put("destination", "Bali, Indonesia");
        pkg2.put("destinationCode", "DPS");
        pkg2.put("duration", "6 Days / 5 Nights");
        pkg2.put("pricePerPerson", 49800);
        pkg2.put("originalPrice", 58000);
        pkg2.put("rating", 4.9);
        pkg2.put("badge", "HONEYMOON SPECIAL");
        pkg2.put("badgeColor", "#f5af19");
        pkg2.put("heroImage", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80");
        pkg2.put("highlights", "Return Flights + Private Pool Villa + Beach Resort + Nusa Penida Speedboat");
        list.add(pkg2);

        Map<String, Object> pkg3 = new HashMap<>();
        pkg3.put("id", "pkg-kerala-6d");
        pkg3.put("title", "Magical Kerala — Backwaters & Tea Hills");
        pkg3.put("destination", "Kerala, India");
        pkg3.put("destinationCode", "COK");
        pkg3.put("duration", "6 Days / 5 Nights");
        pkg3.put("pricePerPerson", 28900);
        pkg3.put("originalPrice", 34500);
        pkg3.put("rating", 4.8);
        pkg3.put("badge", "NATURE RETREAT");
        pkg3.put("badgeColor", "#00e676");
        pkg3.put("heroImage", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80");
        pkg3.put("highlights", "Return Flights + Alleppey Private Houseboat + Munnar Tea Hills + Chauffeur AC Car");
        list.add(pkg3);

        Map<String, Object> pkg4 = new HashMap<>();
        pkg4.put("id", "pkg-singapore-5d");
        pkg4.put("title", "Futuristic Singapore & Sentosa Wonderland");
        pkg4.put("destination", "Singapore");
        pkg4.put("destinationCode", "SIN");
        pkg4.put("duration", "5 Days / 4 Nights");
        pkg4.put("pricePerPerson", 54000);
        pkg4.put("originalPrice", 62000);
        pkg4.put("rating", 4.9);
        pkg4.put("badge", "FAMILY FAVORITE");
        pkg4.put("badgeColor", "#c084fc");
        pkg4.put("heroImage", "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=80");
        pkg4.put("highlights", "Return Flights + 4★ City Hotel + Universal Studios Pass + Gardens by the Bay");
        list.add(pkg4);

        return list;
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
