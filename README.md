# SelectMyFlight — Next-Gen Aviation & AI Travel Platform

An enterprise-grade, visually stunning flight booking and travel management platform custom-crafted for **SelectMyFlight**. The platform delivers a state-of-the-art aviation experience built with a **React 18** frontend, a high-performance **Java 21 / Spring Boot 3.2** backend, and a robust **MySQL** schema.

---

## 🏛️ Comprehensive 5-Pillar Feature Matrix

### Pillar 1: Core Flight Search & Booking
1. 🔎 **Smart Flight Search**: Search One-Way, Round-Trip, and Multi-City flights with airport autocomplete, travel dates, passenger counts, and cabin classes (Economy, Premium Economy, Business, First Class).
2. 💰 **Side-by-Side Comparison**: Automatic identification and badging of **Cheapest Available** and **Fastest Flight** options.
3. 🎯 **Advanced Filters & Real-Time Sorting**: Price slider, stops (Non-Stop, 1-Stop), departure slots (Morning, Afternoon, Evening), airline checkboxes with count indicators, and refundable-only filter.
4. 📅 **Flexible Date Matrix**: Price heatmap across nearby travel dates helping travelers locate cheaper departures and save up to 25%.
5. 💺 **Interactive 3D Seat Map & Add-ons**: Visual aircraft layout with Business Suites, Extra Legroom, Standard seats, baggage upgrades (+5kg, +10kg), and gourmet in-flight dining (Royal Rajasthani Thali, Herb Grilled Chicken, Vegan, Jain).
6. 💳 **Multiple Payment Methods & Checkout**: Instant UPI / QR code payment, Credit/Debit cards, Net Banking, Digital Wallets, and EMI.
7. 🎁 **Offers & Promo Codes**: Instant discount engine with voucher support (`FLYSMF10` for 10% off, `STUDENT` for ₹1,200 discount, `FESTIVE` for ₹1,500 off).
8. 🎫 **Electronic Boarding Pass & Tax Invoices**: Digital boarding pass with scannable QR code, gate, seat assignment, PDF download, and official GST tax invoice.

### Pillar 2: Smart AI & Dynamic Insights
9. 🤖 **SkyGenie AI Travel Concierge**: 24/7 neural travel assistant handling complex queries like *"Find me a cheap flight to Dubai under ₹15,000"* or *"Which flight has the shortest duration?"* with interactive 1-click bookable flight cards embedded in chat.
10. 🔔 **Flight Price Alerts**: Route price tracker allowing customers to track routes and receive instant notifications when fares drop.

### Pillar 3: Travel Intelligence & Exploration
11. 🌍 **Explore Global Destinations**: High-definition curated guides for Dubai, London, Singapore, Paris, and Goa with live weather, top attractions, best travel seasons, average airfares, and 1-click booking.
12. 📍 **Nearby Alternative Airport Search**: Proactively suggests alternative departure hubs around Delhi, Mumbai, and London (e.g. Hindon, Navi Mumbai, London Gatwick) with distance and fare savings.
13. ✈️ **Real-Time Flight Status Tracker**: Live telemetry tracking flight delays, gate announcements, terminal assignments, boarding countdowns, and baggage claim carousel numbers.
14. 🗺️ **Interactive Global Flight Map**: SVG-powered flight radar showcasing international flight corridors with animated aircraft arcs and click-to-book routing.

### Pillar 4: Account & Personalization
15. 🔐 **Secure Login & Mobile OTP**: Seamless verification with simulated SMS/Email OTP code (`7890`).
16. 👤 **User Profile & Preferences**: Stored passenger information, Frequent Flyer Gold Elite status, meal preferences, and preferred seat types.
17. ❤️ **Wishlist / Saved Flights**: Bookmark favorite flights and monitor price drops in a slide-out drawer with direct checkout.
18. 🔔 **In-App Notification Center**: Real-time alerts for booking confirmations, gate updates, and promotional drops with unread badges.
19. 🌐 **Multi-Currency & Multi-Language**: Instant currency conversion across **₹ INR, $ USD, € EUR, £ GBP** and multilingual selector (**English, हिन्दी, Español, Français**).

### Pillar 5: Customer Support & Assurance
20. 🔄 **Step-by-Step Live Refund Tracker**: Visual 4-step progress tracker (*Request Received ➔ Airline Approval ➔ Gateway Dispatched ➔ Bank Account Credit*) with PNR lookup and exact refund calculation.
21. 🎧 **Customer Support Help Desk**: Comprehensive FAQ accordion, instant 24/7 support ticket submission, and direct hotline contact details.
22. 📱 **My Trips Dashboard**: Full self-service dashboard managing upcoming and past trips with 1-click cancellation and e-ticket reprints.

### Pillar 6: Production Authentication & Dedicated Admin Portal
23. 🚪 **Visitor Authentication Gate**: Visitors opening the site are first asked to sign in or create an account before entering the main flight search portal.
24. 🔗 **Single Customer Entry**: Top navigation features a single unified **"Sign In / Register"** button, preventing visual clutter.
25. 🛡️ **Dedicated Separate Admin Link**: Only the **Admin Dashboard** is provided as a separate, distinct link in the navigation header, leading to the restricted operations center.
26. 📊 **Executive Admin Operations**: Real-time KPI analytics (Revenue, Bookings, Active Flights, Registered Travelers, Top Corridors), commercial fleet scheduler, passenger manifest with 1-click refund override, and user directory at `#/admin`.

---

### 🔑 Authentication Portals & Direct Routes

| Portal | Route | Access Type | Primary Role | Destination View |
|---|---|---|---|---|
| **Customer Authentication** | `#/auth` | Public | Traveler / Passenger | **Main Flight Booking Portal** |
| **Admin Operations Gateway** | `#/admin-login` | Restricted | Flight Operations / Staff | **Enterprise Admin Dashboard** |
| **Admin Operations Dashboard** | `#/admin` | Protected (ROLE_ADMIN) | System Administrator | **Fleet & Timetable Console** |

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Canvas Confetti, Vanilla CSS Design System with Glassmorphism, CSS grid/flexbox layouts.
- **Backend**: Java 21, Spring Boot 3.2.5, Spring Data JPA, Hibernate, embedded Tomcat, RESTful APIs with CORS.
- **Database**:
  - **MySQL 8.0+** production DDL & DML (`database/selectmyflight_schema.sql` and `database/selectmyflight_seed_data.sql`).
  - Embedded H2 in-memory mode configured for instant, frictionless zero-configuration demonstration.

---

## 🚀 Running the Application Locally

Both the backend and frontend are already running and active in the development environment:

### Frontend
- **URL**: [http://localhost:5173/](http://localhost:5173/)
- **Command**:
  ```cmd
  set PATH=C:\Users\SMF\.tools\node;%PATH%
  cd frontend
  npm run dev -- --port 5173 --host
  ```

### Backend
- **URL**: [http://localhost:8080/api/flights](http://localhost:8080/api/flights)
- **Command**:
  ```cmd
  set JAVA_HOME=C:\Users\SMF\.tools\jdk
  set PATH=%JAVA_HOME%\bin;C:\Users\SMF\.tools\maven\bin;%PATH%
  java -jar backend\target\selectmyflight-backend-1.0.0.jar
  ```

---

## 🗄️ MySQL Database Setup (Production)

To connect directly to your local MySQL instance:
1. Open MySQL Workbench or MySQL CLI:
   ```sql
   source database/selectmyflight_schema.sql;
   source database/selectmyflight_seed_data.sql;
   ```
2. Run backend with the MySQL profile:
   ```cmd
   java -jar -Dspring.profiles.active=mysql backend\target\selectmyflight-backend-1.0.0.jar
   ```

---

## 👔 Presentation Guide for the CEO

When presenting to executive leadership:
1. **Show the Hero Banner & Brand Identity**: The high-contrast dark-mode glassmorphic theme with vibrant cyan and gold accents establishes a luxury aviation aesthetic.
2. **Demonstrate SkyGenie AI**: Click the floating "Ask SkyGenie AI" button and select *"Find me a cheap flight to Dubai"*. Watch the AI instantly recommend flights and allow 1-click seat booking.
3. **Showcase 3D Interactive Cabin Seat Map**: Click "Select Seats & Book" on any flight. Switch between Business Class and Economy to experience seat pitch specs, legroom highlights, and gourmet dining add-ons.
4. **Complete an End-to-End Booking**: Apply promo code `FLYSMF10`, choose UPI or Card, complete payment with confetti celebration, and display the official Digital Boarding Pass with QR code.
5. **Explore Destinations & Route Map**: Switch to the **Explore** tab to view Dubai, London, and Paris with live weather and average fares, then open the **Route Map** to see animated global flight corridors.
6. **Showcase Support & Refund Tracking**: Navigate to **My Trips**, cancel a trip to display the instant airline cancellation fee breakdown, and launch the **Live Refund Status Tracker** to show the 4-step bank credit timeline.
