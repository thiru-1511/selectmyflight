-- ==========================================================
-- SelectMyFlight Database Schema (MySQL 8.0+)
-- Enterprise Airlines & Smart Booking Platform
-- ==========================================================

CREATE DATABASE IF NOT EXISTS selectmyflight_db;
USE selectmyflight_db;

-- 1. Airports Table
CREATE TABLE IF NOT EXISTS airports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    iata_code VARCHAR(3) NOT NULL UNIQUE,
    city_name VARCHAR(100) NOT NULL,
    airport_name VARCHAR(150) NOT NULL,
    country VARCHAR(100) NOT NULL,
    INDEX idx_iata (iata_code),
    INDEX idx_city (city_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Flights Table
CREATE TABLE IF NOT EXISTS flights (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL,
    airline_name VARCHAR(100) NOT NULL,
    airline_code VARCHAR(10) NOT NULL,
    airline_logo VARCHAR(255),
    origin_code VARCHAR(3) NOT NULL,
    destination_code VARCHAR(3) NOT NULL,
    departure_time VARCHAR(10) NOT NULL,    -- e.g. "06:30"
    arrival_time VARCHAR(10) NOT NULL,      -- e.g. "09:45"
    duration_minutes INT NOT NULL,          -- in minutes
    stops INT DEFAULT 0,                    -- 0 = Non-stop, 1 = 1 Stop, etc.
    base_price DECIMAL(10, 2) NOT NULL,     -- INR base price
    cabin_class VARCHAR(50) DEFAULT 'Economy', -- Economy, Premium Economy, Business, First
    cabin_baggage_kg INT DEFAULT 7,
    checked_baggage_kg INT DEFAULT 15,
    refundable BOOLEAN DEFAULT TRUE,
    cancellation_fee DECIMAL(10, 2) DEFAULT 1500.00,
    change_fee DECIMAL(10, 2) DEFAULT 1000.00,
    aircraft_model VARCHAR(100) DEFAULT 'Airbus A320neo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_route (origin_code, destination_code),
    INDEX idx_price (base_price),
    INDEX idx_airline (airline_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Aircraft Cabin Seats Table
CREATE TABLE IF NOT EXISTS seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flight_id BIGINT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,       -- e.g. "12A", "01B"
    seat_class VARCHAR(50) NOT NULL,        -- Economy, Extra Legroom, Business
    seat_type VARCHAR(20) NOT NULL,         -- Window, Aisle, Middle
    extra_legroom BOOLEAN DEFAULT FALSE,
    price_addon DECIMAL(10, 2) DEFAULT 0.00,
    is_booked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    UNIQUE KEY uq_flight_seat (flight_id, seat_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Travel Add-ons Table (Meals, Extra Baggage, Priority)
CREATE TABLE IF NOT EXISTS addons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    addon_type VARCHAR(50) NOT NULL,        -- MEAL, BAGGAGE, PRIORITY
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pnr VARCHAR(10) NOT NULL UNIQUE,
    flight_id BIGINT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    travel_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'CONFIRMED', -- CONFIRMED, CANCELLED
    payment_method VARCHAR(50) NOT NULL,    -- UPI, CREDIT_CARD, NET_BANKING
    payment_status VARCHAR(30) DEFAULT 'PAID',
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    flight_status VARCHAR(30) DEFAULT 'ON_TIME', -- ON_TIME, BOARDING, DELAYED, DEPARTED
    gate VARCHAR(10) DEFAULT 'T3-B22',
    terminal VARCHAR(10) DEFAULT 'T3',
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE RESTRICT,
    INDEX idx_pnr (pnr),
    INDEX idx_email (contact_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Passengers Table
CREATE TABLE IF NOT EXISTS passengers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    title VARCHAR(10) DEFAULT 'Mr',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) DEFAULT 'Male',
    seat_number VARCHAR(10),
    meal_preference VARCHAR(100) DEFAULT 'Regular',
    extra_baggage_kg INT DEFAULT 0,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Route Price Alerts Table
CREATE TABLE IF NOT EXISTS price_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    origin_code VARCHAR(3) NOT NULL,
    destination_code VARCHAR(3) NOT NULL,
    target_price DECIMAL(10, 2) NOT NULL,
    current_lowest_price DECIMAL(10, 2) NOT NULL,
    email VARCHAR(150) NOT NULL,
    alert_status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, TRIGGERED, DISABLED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_alert_route (origin_code, destination_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(120) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_USER', -- 'ROLE_USER' or 'ROLE_ADMIN'
    frequent_flyer_tier VARCHAR(50) DEFAULT 'Gold Elite',
    home_airport VARCHAR(10) DEFAULT 'DEL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

