// SelectMyFlight Hybrid API Client (Spring Boot Backend + Local Fallback)
import { INITIAL_FLIGHTS, INITIAL_BOOKINGS } from '../data/mockFlights';

export const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/+$/, '');

const loadLocalBookings = () => {
  const saved = localStorage.getItem('smf_bookings');
  return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
};

const saveLocalBookings = (bookings) => {
  localStorage.setItem('smf_bookings', JSON.stringify(bookings));
};

const loadLocalAlerts = () => {
  const saved = localStorage.getItem('smf_alerts');
  return saved ? JSON.parse(saved) : [];
};

const saveLocalAlerts = (alerts) => {
  localStorage.setItem('smf_alerts', JSON.stringify(alerts));
};

export const api = {
  // 1. Flight Search & Compare
  async searchFlights(origin, destination, cabinClass = 'Economy', sortBy = 'price_asc') {
    try {
      const query = new URLSearchParams();
      if (origin) query.append('origin', origin);
      if (destination) query.append('destination', destination);
      if (cabinClass) query.append('cabinClass', cabinClass);
      if (sortBy) query.append('sortBy', sortBy);

      const res = await fetch(`${API_BASE_URL}/flights?${query.toString()}`, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) return data;
      }
    } catch {
      // Backend unavailable, fallback to local dataset
    }

    // Fallback: Local filtering
    let results = [...INITIAL_FLIGHTS];
    if (origin && destination) {
      const match = results.filter(f => f.originCode === origin && f.destinationCode === destination);
      if (match.length > 0) results = match;
      else results = results.filter(f => f.destinationCode === destination || f.originCode === origin);
    }
    if (cabinClass && cabinClass !== 'All') {
      results = results.filter(f => f.cabinClass.toLowerCase() === cabinClass.toLowerCase());
    }

    if (sortBy === 'price_asc') results.sort((a, b) => a.basePrice - b.basePrice);
    else if (sortBy === 'duration_asc') results.sort((a, b) => a.durationMinutes - b.durationMinutes);
    else if (sortBy === 'departure_asc') results.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

    return results;
  },

  // 2. Flexible Dates Matrix (-3 to +3 days)
  async getFlexibleDates(origin = 'DEL', destination = 'BOM', date) {
    try {
      const res = await fetch(`${API_BASE_URL}/flights/flexible-dates?origin=${origin}&destination=${destination}`, { signal: AbortSignal.timeout(2500) });
      if (res.ok) return await res.json();
    } catch {
      // Backend unavailable, calculate locally
    }

    // Fallback calculation
    const baseDate = date ? new Date(date) : new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const factors = [1.12, 0.94, 1.05, 1.0, 0.89, 1.18, 0.95];
    const basePrice = 4850;

    return factors.map((factor, idx) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + (idx - 3));
      return {
        date: d.toISOString().split('T')[0],
        dayOfWeek: days[d.getDay()],
        price: Math.round(basePrice * factor),
        isCheapest: factor <= 0.94,
        isCurrent: idx === 3
      };
    });
  },

  // 3. AI Chatbot
  async askAiChat(query) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch {
      // Backend unavailable, fallback AI response
    }

    // Fallback AI engine
    const q = query.toLowerCase();
    let reply = '';
    let recommended = [];

    if (q.includes('shortest') || q.includes('fastest')) {
      const fastest = [...INITIAL_FLIGHTS].sort((a, b) => a.durationMinutes - b.durationMinutes)[0];
      recommended = [fastest];
      reply = `✈️ The fastest flight is **${fastest.airlineName}** (${fastest.flightNumber}) from ${fastest.originCode} to ${fastest.destinationCode} with a flight time of only **${Math.floor(fastest.durationMinutes / 60)}h ${fastest.durationMinutes % 60}m** at ₹${fastest.basePrice.toLocaleString()}!`;
    } else if (q.includes('15000') || q.includes('15,000') || q.includes('under') || q.includes('budget')) {
      recommended = INITIAL_FLIGHTS.filter(f => f.basePrice <= 15000).slice(0, 3);
      reply = `🎉 Found ${recommended.length} great flights under your budget of ₹15,000! Take a look at these popular options:`;
    } else if (q.includes('dubai') || q.includes('dxb')) {
      recommended = INITIAL_FLIGHTS.filter(f => f.destinationCode === 'DXB');
      reply = `🌟 Here are our top-rated flights to **Dubai (DXB)**. Fares start from just ₹${recommended[0]?.basePrice.toLocaleString()} on ${recommended[0]?.airlineName}!`;
    } else if (q.includes('baggage') || q.includes('weight')) {
      reply = `🧳 **SelectMyFlight Baggage Policy:**\n• Cabin Baggage: 1 bag up to 7 kg free across all flights.\n• Checked Baggage: 15 kg - 30 kg depending on airline & cabin class.\n• Pre-booking extra baggage saves up to 45% compared to airport counter!`;
    } else {
      recommended = INITIAL_FLIGHTS.slice(0, 3);
      reply = `Hello! I am **SkyGenie AI**, your 24/7 personal travel concierge. You can ask me:\n• *"Find me a cheap flight to Dubai"*\n• *"Which flight has the shortest duration?"*\n• *"I want a weekend trip under ₹15,000"*\n\nHere are some trending flight picks:`;
    }

    return { reply, recommendedFlights: recommended };
  },

  // 4. Create Booking & PNR
  async createBooking(bookingData) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback to local storage
    }

    // Fallback local storage
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pnr = 'SMF';
    for (let i = 0; i < 3; i++) pnr += chars.charAt(Math.floor(Math.random() * chars.length));

    const newBooking = {
      ...bookingData,
      id: Date.now(),
      pnr,
      bookingDate: new Date().toISOString(),
      status: 'CONFIRMED',
      flightStatus: 'ON_TIME',
      gate: 'T3-B' + (10 + Math.floor(Math.random() * 20)),
      terminal: 'T3'
    };

    const current = loadLocalBookings();
    const updated = [newBooking, ...current];
    saveLocalBookings(updated);
    return newBooking;
  },

  // 5. Get My Trips
  async getMyTrips(email) {
    try {
      const url = email ? `${API_BASE_URL}/bookings?email=${encodeURIComponent(email)}` : `${API_BASE_URL}/bookings`;
      const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback to local storage
    }

    return loadLocalBookings();
  },

  // 6. Cancel Booking with Refund Calculation
  async cancelBooking(pnr) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${pnr}/cancel`, {
        method: 'POST',
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback local cancellation
    }

    // Fallback local cancellation
    const bookings = loadLocalBookings();
    const found = bookings.find(b => b.pnr === pnr);
    if (!found) return { success: false, message: `Booking ${pnr} not found.` };

    found.status = 'CANCELLED';
    found.flightStatus = 'CANCELLED';
    saveLocalBookings(bookings);

    const fee = 1500;
    const refund = Math.max(0, found.totalAmount - fee);

    return {
      success: true,
      pnr,
      totalPaid: found.totalAmount,
      cancellationFee: fee,
      refundAmount: refund,
      refundTimeline: 'Refund will be credited back to your original payment method in 3-5 business days.'
    };
  },

  // 7. Price Alerts
  async createAlert(alertData) {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback local alerts
    }

    const alerts = loadLocalAlerts();
    const newAlert = {
      ...alertData,
      id: Date.now(),
      currentLowestPrice: 4850,
      alertStatus: alertData.targetPrice >= 4850 ? 'TRIGGERED' : 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    alerts.push(newAlert);
    saveLocalAlerts(alerts);
    return newAlert;
  },

  async getAlerts() {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts`, { signal: AbortSignal.timeout(2500) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback local alerts
    }
    return loadLocalAlerts();
  },

  // 8. Live Hotel Search with Booking.com RapidAPI & Configurable Profit Margin
  async searchLiveHotels(cityCode = 'DXB', checkInDate, checkOutDate, guests = 2, rooms = 1, profitMargin = 0.12) {
    const RAPIDAPI_KEY = '3797ffed48msh4456813e607e281p18040djsn2605e00fd899';
    const RAPIDAPI_HOST = 'booking-com.p.rapidapi.com';

    const DEST_MAP = {
      'DXB': { id: '-782831', name: 'Dubai', country: 'United Arab Emirates' },
      'LHR': { id: '-2601889', name: 'London', country: 'United Kingdom' },
      'CDG': { id: '-1456928', name: 'Paris', country: 'France' },
      'SIN': { id: '-73635', name: 'Singapore', country: 'Singapore' },
      'GOI': { id: '-2096350', name: 'Goa', country: 'India' },
      'DEL': { id: '-2106102', name: 'New Delhi', country: 'India' },
      'BOM': { id: '-2092174', name: 'Mumbai', country: 'India' },
      'BLR': { id: '-2090186', name: 'Bengaluru', country: 'India' },
      'NYC': { id: '-2601450', name: 'New York', country: 'United States' },
      'TYO': { id: '-246227', name: 'Tokyo', country: 'Japan' },
      'BKK': { id: '-3414440', name: 'Bangkok', country: 'Thailand' },
      'DPS': { id: '-2675576', name: 'Bali', country: 'Indonesia' },
      'FCO': { id: '-126693', name: 'Rome', country: 'Italy' },
      'MLE': { id: '-1744186', name: 'Maldives', country: 'Maldives' }
    };

    const dest = DEST_MAP[cityCode] || DEST_MAP['DXB'];

    // Default dates if missing
    const dIn = checkInDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
    const dOut = checkOutDate || new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0];

    try {
      const url = `https://${RAPIDAPI_HOST}/v1/hotels/search?dest_id=${dest.id}&dest_type=city&locale=en-gb&checkin_date=${dIn}&checkout_date=${dOut}&units=metric&adults_number=${guests}&order_by=popularity&filter_by_currency=INR&room_number=${rooms}&page_number=0`;
      
      const res = await fetch(url, {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST
        },
        signal: AbortSignal.timeout(8000)
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.result && data.result.length > 0) {
          // Accurate exchange rates to INR
          const rateMultiplier = {
            'AED': 23.2,
            'SGD': 65.5,
            'GBP': 110.0,
            'EUR': 93.0,
            'USD': 85.0,
            'THB': 2.5,
            'JPY': 0.58,
            'IDR': 0.0055,
            'MYR': 19.5,
            'INR': 1.0
          };

          const CITY_DEFAULT_PHOTOS = {
            'DXB': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
            'SIN': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80',
            'LHR': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',
            'CDG': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
            'NYC': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80',
            'TYO': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
            'BKK': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80',
            'DPS': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
            'FCO': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
            'MLE': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
            'GOI': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
            'DEL': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
            'BOM': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
            'BLR': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80'
          };

          // Filter out dummy/ad elements and keep only real hotels with names
          const validHotels = data.result.filter(h => {
            const hName = h.hotel_name || h.hotel_name_trans;
            return hName && hName.trim().length > 0;
          });

          return validHotels.slice(0, 30).map((h, idx) => {
            const rawCurrency = (h.currencycode || h.currency_code || 'INR').toUpperCase();
            const mult = rateMultiplier[rawCurrency] || 1;
            
            // Extract raw night price
            let rawNightPrice = 6500;
            if (h.composite_price_breakdown?.gross_amount_per_night?.value) {
              rawNightPrice = h.composite_price_breakdown.gross_amount_per_night.value * mult;
            } else if (h.min_total_price) {
              rawNightPrice = (h.min_total_price / 3) * mult;
            }

            // Normalise if base is small currency unit
            if (rawNightPrice < 2000 && rawCurrency !== 'INR') {
              rawNightPrice = rawNightPrice * 80;
            }

            // Apply SelectMyFlight Profit Margin (+12% default)
            const finalPricePerNight = Math.round(rawNightPrice * (1 + profitMargin));

            // Extract high-res photo from Booking.com CDN
            let photoUrl = h.max_photo_url || h.max_1440_photo_url;
            if (!photoUrl && h.main_photo_url) {
              photoUrl = h.main_photo_url.replace('/square60/', '/max1280x900/').replace('/square120/', '/max1280x900/');
            }
            if (!photoUrl) {
              photoUrl = CITY_DEFAULT_PHOTOS[cityCode] || CITY_DEFAULT_PHOTOS['DXB'];
            }

            const hotelName = h.hotel_name || h.hotel_name_trans || `${dest.name} Premier Hotel`;

            return {
              id: `live-htl-${h.hotel_id || idx}`,
              name: hotelName,
              cityCode: cityCode,
              cityName: dest.name,
              location: h.address || h.district || `${dest.name}, ${dest.country}`,
              starRating: Math.min(5, Math.max(3, Math.round(h.class || 4))),
              reviewScore: h.review_score ? parseFloat(h.review_score.toFixed(1)) : 8.8,
              reviewLabel: h.review_score_word || (h.review_score >= 9 ? 'Exceptional' : 'Fabulous'),
              reviewCount: h.review_nr || (950 + idx * 115),
              pricePerNight: finalPricePerNight,
              baseWholesalePrice: Math.round(rawNightPrice),
              profitAdded: Math.round(rawNightPrice * profitMargin),
              discountBadge: idx === 0 ? '🔥 LIVE BESTSELLER' : idx === 1 ? '⭐ TOP GUEST CHOICE' : idx === 2 ? '💎 LUXURY DEAL' : 'VERIFIED BOOKING.COM',
              image: photoUrl,
              galleryImages: [photoUrl].filter(Boolean),
              amenities: [
                h.has_swimming_pool ? '🏊 Infinity Pool' : '🏋️ 24/7 Fitness Club',
                h.has_free_parking ? '🚗 Complimentary Valet' : '📶 High-Speed WiFi',
                h.is_free_cancellable ? '🛡️ Free Cancellation' : '🍽️ Gourmet Dining',
                '🍸 Sky Lounge & Bar'
              ],
              freeCancellation: h.is_free_cancellable === 1,
              breakfastIncluded: h.hotel_include_breakfast === 1,
              isLiveFeed: true,
              liveSource: 'Booking.com Live API',
              roomTypes: [
                {
                  id: `rm-${h.hotel_id}-1`,
                  name: h.urgency_room_msg || 'Executive King Room',
                  price: finalPricePerNight,
                  bed: '1 Super King Bed',
                  view: `${dest.name} Skyline & City View`,
                  size: '45 sq.m',
                  capacity: `${guests} Adults`
                },
                {
                  id: `rm-${h.hotel_id}-2`,
                  name: 'Signature Panoramic Suite',
                  price: Math.round(finalPricePerNight * 1.5),
                  bed: '1 Grand Emperor Bed',
                  view: 'Panoramic Sunset View with Balcony',
                  size: '85 sq.m',
                  capacity: `${guests} Adults, 1 Child`
                }
              ]
            };
          });
        }
      }
    } catch (err) {
      console.warn('Live Booking.com RapidAPI fetch fallback:', err.message);
    }

    return null; // Return null to fallback to curated mock data
  }
};

