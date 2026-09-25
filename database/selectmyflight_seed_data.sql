-- ==========================================================
-- SelectMyFlight Initial Seed Data (MySQL 8.0+)
-- ==========================================================

USE selectmyflight_db;

-- 1. Insert Airports
INSERT INTO airports (iata_code, city_name, airport_name, country) VALUES
('DEL', 'New Delhi', 'Indira Gandhi International Airport', 'India'),
('BOM', 'Mumbai', 'Chhatrapati Shivaji Maharaj International Airport', 'India'),
('BLR', 'Bengaluru', 'Kempegowda International Airport', 'India'),
('DXB', 'Dubai', 'Dubai International Airport', 'United Arab Emirates'),
('LHR', 'London', 'Heathrow Airport', 'United Kingdom'),
('SIN', 'Singapore', 'Singapore Changi Airport', 'Singapore'),
('JFK', 'New York', 'John F. Kennedy International Airport', 'United States'),
('GOI', 'Goa', 'Dabolim Airport', 'India'),
('MAA', 'Chennai', 'Chennai International Airport', 'India'),
('HYD', 'Hyderabad', 'Rajiv Gandhi International Airport', 'India')
ON DUPLICATE KEY UPDATE city_name=VALUES(city_name);

-- 2. Insert Add-ons (Meals, Baggage, Priority)
INSERT INTO addons (addon_type, name, code, price, description) VALUES
('MEAL', 'Royal Rajasthani Thali (Veg)', 'MEAL_VEG_THALI', 450.00, 'Freshly prepared paneer delicacy, dal makhani, warm rotis and dessert'),
('MEAL', 'Grilled Chicken Herb Platter', 'MEAL_CHICKEN_HERB', 550.00, 'Tender chicken breast with herb jus, roasted potatoes and vegetables'),
('MEAL', 'Jain Satvik Gourmet Meal', 'MEAL_JAIN_SPECIAL', 450.00, '100% vegetarian without root vegetables, cooked with pure ghee'),
('MEAL', 'Vegan Asian Noodle Box', 'MEAL_VEGAN_NOODLE', 400.00, 'Stir-fried noodles with edamame, tofu, and sesame ginger sauce'),
('BAGGAGE', 'Extra 5 KG Baggage', 'BAG_5KG', 1200.00, 'Pre-book extra check-in baggage at 40% discount'),
('BAGGAGE', 'Extra 10 KG Baggage', 'BAG_10KG', 2200.00, 'Pre-book extra check-in baggage at 45% discount'),
('PRIORITY', 'Express Fast Forward & Priority Baggage', 'PRIORITY_COMBO', 650.00, 'Skip airport queues and get bags first on conveyor belt');

-- 3. Insert Flights (Covering key domestic & international routes with different durations & prices)
INSERT INTO flights (flight_number, airline_name, airline_code, airline_logo, origin_code, destination_code, departure_time, arrival_time, duration_minutes, stops, base_price, cabin_class, cabin_baggage_kg, checked_baggage_kg, refundable, cancellation_fee, change_fee, aircraft_model) VALUES
-- Delhi to Mumbai (Busiest Domestic Corridor)
('6E-2041', 'IndiGo', '6E', 'indigo', 'DEL', 'BOM', '06:00', '08:15', 135, 0, 4850.00, 'Economy', 7, 15, TRUE, 1200.00, 800.00, 'Airbus A321neo'),
('AI-865', 'Air India', 'AI', 'airindia', 'DEL', 'BOM', '08:00', '10:10', 130, 0, 5600.00, 'Economy', 7, 20, TRUE, 1000.00, 500.00, 'Boeing 787-9 Dreamliner'),
('UK-943', 'Vistara', 'UK', 'vistara', 'DEL', 'BOM', '17:30', '19:40', 130, 0, 6200.00, 'Premium Economy', 10, 25, TRUE, 800.00, 400.00, 'Airbus A321neo'),
('6E-5321', 'IndiGo', '6E', 'indigo', 'DEL', 'BOM', '19:45', '23:30', 225, 1, 3950.00, 'Economy', 7, 15, FALSE, 2500.00, 1500.00, 'Airbus A320neo'),

-- Mumbai to Delhi
('AI-806', 'Air India', 'AI', 'airindia', 'BOM', 'DEL', '07:00', '09:15', 135, 0, 5200.00, 'Economy', 7, 20, TRUE, 1000.00, 500.00, 'Boeing 777-300ER'),
('6E-358', 'IndiGo', '6E', 'indigo', 'BOM', 'DEL', '14:20', '16:35', 135, 0, 4700.00, 'Economy', 7, 15, TRUE, 1200.00, 800.00, 'Airbus A321neo'),

-- Delhi / Mumbai to Dubai
('EK-511', 'Emirates', 'EK', 'emirates', 'DEL', 'DXB', '04:15', '06:50', 245, 0, 14800.00, 'Economy', 7, 30, TRUE, 2000.00, 1200.00, 'Boeing 777-300ER'),
('AI-995', 'Air India', 'AI', 'airindia', 'DEL', 'DXB', '19:50', '22:15', 235, 0, 12900.00, 'Economy', 7, 25, TRUE, 1500.00, 900.00, 'Airbus A321neo'),
('EK-501', 'Emirates', 'EK', 'emirates', 'BOM', 'DXB', '04:30', '06:15', 225, 0, 14200.00, 'Economy', 7, 30, TRUE, 2000.00, 1200.00, 'Airbus A380-800'),
('6E-1455', 'IndiGo', '6E', 'indigo', 'BOM', 'DXB', '18:15', '20:10', 235, 0, 11400.00, 'Economy', 7, 20, FALSE, 2500.00, 1500.00, 'Airbus A320neo'),

-- Delhi to London
('BA-142', 'British Airways', 'BA', 'ba', 'DEL', 'LHR', '03:15', '07:45', 540, 0, 48500.00, 'Economy', 8, 23, TRUE, 4000.00, 2000.00, 'Boeing 787-9 Dreamliner'),
('AI-161', 'Air India', 'AI', 'airindia', 'DEL', 'LHR', '02:45', '07:15', 540, 0, 42900.00, 'Economy', 8, 25, TRUE, 3500.00, 1800.00, 'Boeing 777-300ER'),

-- Delhi to Goa
('6E-6351', 'IndiGo', '6E', 'indigo', 'DEL', 'GOI', '11:15', '13:50', 155, 0, 5800.00, 'Economy', 7, 15, TRUE, 1200.00, 800.00, 'Airbus A320neo'),
('AI-883', 'Air India', 'AI', 'airindia', 'DEL', 'GOI', '15:40', '18:15', 155, 0, 6400.00, 'Economy', 7, 20, TRUE, 1000.00, 500.00, 'Airbus A321neo'),

-- Bengaluru to Singapore
('SQ-503', 'Singapore Airlines', 'SQ', 'singapore', 'BLR', 'SIN', '23:10', '06:10', 270, 0, 18900.00, 'Economy', 7, 25, TRUE, 2200.00, 1200.00, 'Airbus A350-900'),
('6E-1007', 'IndiGo', '6E', 'indigo', 'BLR', 'SIN', '10:45', '17:45', 270, 0, 13800.00, 'Economy', 7, 20, TRUE, 1500.00, 900.00, 'Airbus A320neo');

-- 4. Insert Sample Price Alerts
INSERT INTO price_alerts (origin_code, destination_code, target_price, current_lowest_price, email, alert_status) VALUES
('DEL', 'DXB', 12000.00, 12900.00, 'ceo@selectmyflight.com', 'ACTIVE'),
('DEL', 'BOM', 4000.00, 3950.00, 'traveler@selectmyflight.com', 'TRIGGERED'),
('BLR', 'SIN', 15000.00, 13800.00, 'user@selectmyflight.com', 'ACTIVE');

-- 5. Insert Default Users
INSERT INTO users (full_name, email, phone, password, role, frequent_flyer_tier, home_airport) VALUES
('Executive Administrator', 'admin@selectmyflight.com', '+91 98765 00000', 'admin123', 'ROLE_ADMIN', 'Executive Platinum', 'DEL'),
('Rahul Sharma', 'rahul.sharma@gmail.com', '+91 98765 43210', 'user123', 'ROLE_USER', 'Gold Elite', 'DEL')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

