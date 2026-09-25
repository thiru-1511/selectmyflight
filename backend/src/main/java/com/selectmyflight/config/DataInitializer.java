package com.selectmyflight.config;

import com.selectmyflight.model.*;
import com.selectmyflight.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AddonRepository addonRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (airportRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Seed Airports
        List<Airport> airports = Arrays.asList(
                new Airport("DEL", "New Delhi", "Indira Gandhi International Airport", "India"),
                new Airport("BOM", "Mumbai", "Chhatrapati Shivaji Maharaj International Airport", "India"),
                new Airport("BLR", "Bengaluru", "Kempegowda International Airport", "India"),
                new Airport("DXB", "Dubai", "Dubai International Airport", "United Arab Emirates"),
                new Airport("LHR", "London", "Heathrow Airport", "United Kingdom"),
                new Airport("SIN", "Singapore", "Singapore Changi Airport", "Singapore"),
                new Airport("JFK", "New York", "John F. Kennedy International Airport", "United States"),
                new Airport("GOI", "Goa", "Dabolim Airport", "India"),
                new Airport("MAA", "Chennai", "Chennai International Airport", "India"),
                new Airport("HYD", "Hyderabad", "Rajiv Gandhi International Airport", "India")
        );
        airportRepository.saveAll(airports);

        // 2. Seed Add-ons
        List<Addon> addons = Arrays.asList(
                new Addon("MEAL", "Royal Rajasthani Thali (Veg)", "MEAL_VEG_THALI", new BigDecimal("450.00"), "Paneer delicacy, dal makhani, warm rotis and dessert"),
                new Addon("MEAL", "Grilled Chicken Herb Platter", "MEAL_CHICKEN_HERB", new BigDecimal("550.00"), "Tender chicken breast with herb jus and roasted potatoes"),
                new Addon("MEAL", "Jain Satvik Gourmet Meal", "MEAL_JAIN_SPECIAL", new BigDecimal("450.00"), "100% vegetarian without root vegetables, cooked with pure ghee"),
                new Addon("MEAL", "Vegan Asian Noodle Box", "MEAL_VEGAN_NOODLE", new BigDecimal("400.00"), "Stir-fried noodles with edamame, tofu, and sesame ginger sauce"),
                new Addon("BAGGAGE", "Extra 5 KG Baggage", "BAG_5KG", new BigDecimal("1200.00"), "Pre-book extra check-in baggage at 40% discount"),
                new Addon("BAGGAGE", "Extra 10 KG Baggage", "BAG_10KG", new BigDecimal("2200.00"), "Pre-book extra check-in baggage at 45% discount"),
                new Addon("PRIORITY", "Express Fast Forward & Priority Baggage", "PRIORITY_COMBO", new BigDecimal("650.00"), "Skip airport queues and get bags first")
        );
        addonRepository.saveAll(addons);

        // 3. Seed Flights
        List<Flight> flights = Arrays.asList(
                // Delhi to Mumbai
                createFlight("6E-2041", "IndiGo", "6E", "indigo", "DEL", "BOM", "06:00", "08:15", 135, 0, new BigDecimal("4850.00"), "Economy", 7, 15, true, new BigDecimal("1200.00"), new BigDecimal("800.00"), "Airbus A321neo"),
                createFlight("AI-865", "Air India", "AI", "airindia", "DEL", "BOM", "08:00", "10:10", 130, 0, new BigDecimal("5600.00"), "Economy", 7, 20, true, new BigDecimal("1000.00"), new BigDecimal("500.00"), "Boeing 787-9 Dreamliner"),
                createFlight("UK-943", "Vistara", "UK", "vistara", "DEL", "BOM", "17:30", "19:40", 130, 0, new BigDecimal("6200.00"), "Premium Economy", 10, 25, true, new BigDecimal("800.00"), new BigDecimal("400.00"), "Airbus A321neo"),
                createFlight("6E-5321", "IndiGo", "6E", "indigo", "DEL", "BOM", "19:45", "23:30", 225, 1, new BigDecimal("3950.00"), "Economy", 7, 15, false, new BigDecimal("2500.00"), new BigDecimal("1500.00"), "Airbus A320neo"),

                // Mumbai to Delhi
                createFlight("AI-806", "Air India", "AI", "airindia", "BOM", "DEL", "07:00", "09:15", 135, 0, new BigDecimal("5200.00"), "Economy", 7, 20, true, new BigDecimal("1000.00"), new BigDecimal("500.00"), "Boeing 777-300ER"),
                createFlight("6E-358", "IndiGo", "6E", "indigo", "BOM", "DEL", "14:20", "16:35", 135, 0, new BigDecimal("4700.00"), "Economy", 7, 15, true, new BigDecimal("1200.00"), new BigDecimal("800.00"), "Airbus A321neo"),

                // Delhi / Mumbai to Dubai
                createFlight("EK-511", "Emirates", "EK", "emirates", "DEL", "DXB", "04:15", "06:50", 245, 0, new BigDecimal("14800.00"), "Economy", 7, 30, true, new BigDecimal("2000.00"), new BigDecimal("1200.00"), "Boeing 777-300ER"),
                createFlight("AI-995", "Air India", "AI", "airindia", "DEL", "DXB", "19:50", "22:15", 235, 0, new BigDecimal("12900.00"), "Economy", 7, 25, true, new BigDecimal("1500.00"), new BigDecimal("900.00"), "Airbus A321neo"),
                createFlight("EK-501", "Emirates", "EK", "emirates", "BOM", "DXB", "04:30", "06:15", 225, 0, new BigDecimal("14200.00"), "Economy", 7, 30, true, new BigDecimal("2000.00"), new BigDecimal("1200.00"), "Airbus A380-800"),
                createFlight("6E-1455", "IndiGo", "6E", "indigo", "BOM", "DXB", "18:15", "20:10", 235, 0, new BigDecimal("11400.00"), "Economy", 7, 20, false, new BigDecimal("2500.00"), new BigDecimal("1500.00"), "Airbus A320neo"),

                // Delhi to London
                createFlight("BA-142", "British Airways", "BA", "ba", "DEL", "LHR", "03:15", "07:45", 540, 0, new BigDecimal("48500.00"), "Economy", 8, 23, true, new BigDecimal("4000.00"), new BigDecimal("2000.00"), "Boeing 787-9 Dreamliner"),
                createFlight("AI-161", "Air India", "AI", "airindia", "DEL", "LHR", "02:45", "07:15", 540, 0, new BigDecimal("42900.00"), "Economy", 8, 25, true, new BigDecimal("3500.00"), new BigDecimal("1800.00"), "Boeing 777-300ER"),

                // Delhi to Goa
                createFlight("6E-6351", "IndiGo", "6E", "indigo", "DEL", "GOI", "11:15", "13:50", 155, 0, new BigDecimal("5800.00"), "Economy", 7, 15, true, new BigDecimal("1200.00"), new BigDecimal("800.00"), "Airbus A320neo"),
                createFlight("AI-883", "Air India", "AI", "airindia", "DEL", "GOI", "15:40", "18:15", 155, 0, new BigDecimal("6400.00"), "Economy", 7, 20, true, new BigDecimal("1000.00"), new BigDecimal("500.00"), "Airbus A321neo"),

                // Bengaluru to Singapore
                createFlight("SQ-503", "Singapore Airlines", "SQ", "singapore", "BLR", "SIN", "23:10", "06:10", 270, 0, new BigDecimal("18900.00"), "Economy", 7, 25, true, new BigDecimal("2200.00"), new BigDecimal("1200.00"), "Airbus A350-900"),
                createFlight("6E-1007", "IndiGo", "6E", "indigo", "BLR", "SIN", "10:45", "17:45", 270, 0, new BigDecimal("13800.00"), "Economy", 7, 20, true, new BigDecimal("1500.00"), new BigDecimal("900.00"), "Airbus A320neo")
        );
        flightRepository.saveAll(flights);

        // 4. Seed Initial Sample Bookings (For My Trips dashboard immediate preview)
        Booking sampleBooking = new Booking();
        sampleBooking.setPnr("SMF901");
        sampleBooking.setFlightId(1L);
        sampleBooking.setTravelDate(LocalDate.now().plusDays(5));
        sampleBooking.setTotalAmount(new BigDecimal("5300.00"));
        sampleBooking.setStatus("CONFIRMED");
        sampleBooking.setPaymentMethod("UPI");
        sampleBooking.setPaymentStatus("PAID");
        sampleBooking.setContactEmail("customer@selectmyflight.com");
        sampleBooking.setContactPhone("+91 98765 43210");
        sampleBooking.setFlightStatus("ON_TIME");
        sampleBooking.setGate("T3-B14");
        sampleBooking.setTerminal("T3");

        Passenger passenger = new Passenger("Mr", "Rahul", "Sharma", "Male", "04A", "Royal Rajasthani Thali (Veg)", 0);
        sampleBooking.addPassenger(passenger);
        bookingRepository.save(sampleBooking);

        // 5. Seed Users
        if (userRepository.count() == 0) {
            User admin = new User("Executive Administrator", "admin@selectmyflight.com", "+91 98765 00000", "admin123", "ROLE_ADMIN");
            User traveler = new User("Rahul Sharma", "rahul.sharma@gmail.com", "+91 98765 43210", "user123", "ROLE_USER");
            userRepository.saveAll(Arrays.asList(admin, traveler));
        }
    }

    private Flight createFlight(String number, String airline, String code, String logo, String origin, String dest,
                                String dep, String arr, int duration, int stops, BigDecimal price, String cabinClass,
                                int cabinBag, int checkedBag, boolean ref, BigDecimal cancelFee, BigDecimal changeFee, String model) {
        Flight f = new Flight();
        f.setFlightNumber(number);
        f.setAirlineName(airline);
        f.setAirlineCode(code);
        f.setAirlineLogo(logo);
        f.setOriginCode(origin);
        f.setDestinationCode(dest);
        f.setDepartureTime(dep);
        f.setArrivalTime(arr);
        f.setDurationMinutes(duration);
        f.setStops(stops);
        f.setBasePrice(price);
        f.setCabinClass(cabinClass);
        f.setCabinBaggageKg(cabinBag);
        f.setCheckedBaggageKg(checkedBag);
        f.setRefundable(ref);
        f.setCancellationFee(cancelFee);
        f.setChangeFee(changeFee);
        f.setAircraftModel(model);
        return f;
    }
}
