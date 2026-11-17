import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Check, 
  ShieldCheck, 
  Calendar, 
  Users, 
  Coffee, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Printer, 
  ArrowRight, 
  Info, 
  Eye, 
  Sliders, 
  Maximize2, 
  KeyRound, 
  Plus, 
  Minus 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import RoomInteriorModal from './RoomInteriorModal';
import HotelManageModal from './HotelManageModal';
import { api } from '../services/api';

// High-definition interior palettes for real hotels and themed suites
const ROOM_INTERIOR_PALETTES = [
  // 0: Themed / Playful / Family Suite (e.g., LEGOLAND, Family Kingdom Rooms)
  {
    bedroom: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80',
    bathroom: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80',
    lounge: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    balcony: 'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=1200&q=80'
  },
  // 1: Signature Panoramic Terrace Suite
  {
    bedroom: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
    bathroom: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80',
    lounge: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    balcony: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80'
  },
  // 2: Presidential Penthouse Sky Villa
  {
    bedroom: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80',
    bathroom: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80',
    lounge: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    balcony: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80'
  },
  // 3: Executive Grand Deluxe
  {
    bedroom: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
    bathroom: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
    lounge: 'https://images.unsplash.com/photo-1545083036-b175dd155a1d?w=1200&q=80',
    balcony: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200&q=80'
  },
  // 4: Royal Heritage Palace Suite
  {
    bedroom: 'https://images.unsplash.com/photo-1596701062351-8ac031b88a5c?w=1200&q=80',
    bathroom: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80',
    lounge: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
    balcony: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'
  }
];

const getEnrichedRoom = (rm, idx = 0, hotel = null) => {
  const isThemed = (rm?.name && /theme|kingdom|kid|family|adventure|lego/i.test(rm.name)) || 
                   (hotel?.name && /legoland|disney|theme/i.test(hotel.name));
  const isPanoramic = rm?.name && /panoramic|sky|view|sunset|ocean/i.test(rm.name);
  const isPenthouse = rm?.name && /penthouse|presidential|villa|royal/i.test(rm.name);

  let paletteIndex = idx % ROOM_INTERIOR_PALETTES.length;
  if (isThemed && idx === 0) paletteIndex = 0;
  else if (isPanoramic) paletteIndex = 1;
  else if (isPenthouse) paletteIndex = 2;

  const palette = ROOM_INTERIOR_PALETTES[paletteIndex];

  return {
    ...rm,
    bedroomImage: rm?.bedroomImage || palette.bedroom,
    bathroomImage: rm?.bathroomImage || palette.bathroom,
    loungeImage: rm?.loungeImage || palette.lounge,
    balconyImage: rm?.balconyImage || palette.balcony
  };
};

export default function HotelDetailsModal({ 
  hotel, 
  checkInDate, 
  checkOutDate, 
  guests, 
  currency, 
  onClose, 
  onConfirmBooking 
}) {
  const initialRooms = useMemo(() => {
    // Safe fallback for room types if undefined in live API
    const defaultRoomTypes = [
      { 
        id: 'std', 
        name: 'Deluxe Premier King Suite', 
        bed: '1 King Bed', 
        size: '48 sqm', 
        capacity: '2 Adults', 
        price: hotel?.pricePerNight || 12500, 
        view: 'City / Ocean View',
        bedroomImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
        bathroomImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
        loungeImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
        balconyImage: 'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=1200&q=80'
      },
      { 
        id: 'exec', 
        name: 'Executive Club Lounge Suite', 
        bed: '1 King Bed + Lounge', 
        size: '65 sqm', 
        capacity: '2 Adults + 1 Child', 
        price: Math.round((hotel?.pricePerNight || 12500) * 1.35), 
        view: 'Panoramic Skyline',
        bedroomImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
        bathroomImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80',
        loungeImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        balconyImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80'
      },
      { 
        id: 'pres', 
        name: 'Presidential Penthouse Villa', 
        bed: '2 King Beds + Jacuzzi', 
        size: '120 sqm', 
        capacity: '4 Guests', 
        price: Math.round((hotel?.pricePerNight || 12500) * 2.1), 
        view: '360° Oceanfront',
        bedroomImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80',
        bathroomImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80',
        loungeImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
        balconyImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80'
      }
    ];

    return ((hotel?.roomTypes && hotel.roomTypes.length > 0) ? hotel.roomTypes : defaultRoomTypes)
      .map((rm, idx) => getEnrichedRoom(rm, idx, hotel));
  }, [hotel]);

  const [availableRooms, setAvailableRooms] = useState(initialRooms);
  const [hasLivePhotos, setHasLivePhotos] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(initialRooms[0]);

  // Sync availableRooms if hotel prop changes
  useEffect(() => {
    setAvailableRooms(initialRooms);
    setSelectedRoom(initialRooms[0]);
    setHasLivePhotos(false);
  }, [initialRooms]);

  // Fetch genuine property room photos from Booking.com CDN
  useEffect(() => {
    const rawId = hotel?.rawHotelId || (hotel?.id && String(hotel.id).startsWith('live-htl-') ? String(hotel.id).replace('live-htl-', '') : null);
    if (!rawId) return;

    let isCancelled = false;
    api.getHotelLivePhotos(rawId).then((photos) => {
      if (isCancelled || !photos) return;
      const { bedrooms, bathrooms, lounges, views, allPhotos } = photos;
      if (bedrooms.length === 0 && allPhotos.length === 0) return;

      setAvailableRooms((prev) => {
        const updated = prev.map((rm, idx) => {
          const realBed = bedrooms[idx] || (idx === 0 ? allPhotos[0] : allPhotos[Math.min(idx + 1, allPhotos.length - 1)]) || rm.bedroomImage;
          const realBath = bathrooms[idx] || bathrooms[0] || rm.bathroomImage;
          const realLounge = lounges[idx] || lounges[0] || rm.loungeImage;
          const realBalcony = views[idx] || views[0] || rm.balconyImage;

          return {
            ...rm,
            bedroomImage: realBed,
            bathroomImage: realBath,
            loungeImage: realLounge,
            balconyImage: realBalcony,
            isLiveVerified: true
          };
        });
        setHasLivePhotos(true);
        setSelectedRoom((curr) => {
          const match = updated.find(r => r.id === curr?.id);
          return match || updated[0];
        });
        return updated;
      });
    }).catch(err => console.warn('Could not load live hotel photos:', err));

    return () => { isCancelled = true; };
  }, [hotel]);

  // Interior View & Stay Management States
  const [roomForInteriorModal, setRoomForInteriorModal] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);

  // Room Configuration & Management Controls
  const [roomCount, setRoomCount] = useState(1);
  const [bedPreference, setBedPreference] = useState('1 Super King Bed');
  const [floorPreference, setFloorPreference] = useState('High Floor (Skyline View)');
  const [addOnEarlyCheckIn, setAddOnEarlyCheckIn] = useState(false);
  const [addOnLateCheckOut, setAddOnLateCheckOut] = useState(false);
  const [addOnLimo, setAddOnLimo] = useState(false);

  const [guestForm, setGuestForm] = useState({
    name: localStorage.getItem('smf_verified_name') || 'Thiru',
    email: localStorage.getItem('smf_verified_email') || 'thiru1511@gmail.com',
    phone: '+91 98765 43210',
    specialRequest: 'Quiet high-floor room preferred'
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!hotel) return null;

  // Calculate nights
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffTime = Math.abs(d2 - d1);
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) || 3;

  // Pricing with room count and selected management add-ons
  const addOnsTotal = (addOnEarlyCheckIn ? 1200 : 0) + (addOnLateCheckOut ? 1500 : 0) + (addOnLimo ? 2800 : 0);
  const basePricePerNight = selectedRoom ? selectedRoom.price : (hotel.pricePerNight || 12500);
  const subtotal = (basePricePerNight * nights * roomCount) + addOnsTotal;
  const taxesAndFees = Math.round(subtotal * 0.12);
  const discountAmount = Math.round(subtotal * 0.10);
  const grandTotal = subtotal + taxesAndFees - discountAmount;

  const convertPrice = (inr) => {
    if (currency === 'USD') return Math.round(inr / 85);
    if (currency === 'EUR') return Math.round(inr / 92);
    if (currency === 'GBP') return Math.round(inr / 108);
    return inr;
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      const confirmationId = `HTL-${hotel.cityCode || 'SMF'}-${Math.floor(1000 + Math.random() * 9000)}`;
      const confirmationPayload = {
        bookingId: confirmationId,
        type: 'HOTEL',
        bookingType: 'HOTEL',
        hotelName: hotel.name,
        location: hotel.location,
        cityName: hotel.cityName || hotel.location,
        destinationCity: hotel.cityName || hotel.cityCode || 'Destination',
        roomName: selectedRoom ? selectedRoom.name : 'Deluxe Premier Suite',
        roomNumber: `Room #${Math.floor(1000 + Math.random() * 8999)} (Floor ${floorPreference.includes('High') ? '24' : '8'})`,
        roomCount,
        bedChoice: bedPreference,
        floorPreference,
        addOns: {
          earlyCheckIn: addOnEarlyCheckIn,
          lateCheckOut: addOnLateCheckOut,
          airportLimo: addOnLimo
        },
        checkInDate,
        checkOutDate,
        nights,
        guests,
        totalAmount: grandTotal,
        guestName: guestForm.name,
        guestEmail: guestForm.email,
        guestPhone: guestForm.phone,
        specialRequest: guestForm.specialRequest,
        status: 'CONFIRMED',
        bookingDate: new Date().toISOString()
      };

      setBookingConfirmed(confirmationPayload);
      setIsProcessing(false);
      if (onConfirmBooking) {
        onConfirmBooking(confirmationPayload);
      }
    }, 1000);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      style={{
        zIndex: 1600,
        padding: 'clamp(10px, 2vw, 24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          width: '100%',
          maxWidth: 940,
          maxHeight: '94vh',
          background: 'var(--modal-bg, #ffffff)',
          border: '1px solid var(--card-border, #e2e8f0)',
          borderRadius: 20,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          boxShadow: '0 25px 70px rgba(0,0,0,0.35)',
          position: 'relative',
          color: 'var(--text-main, #0f172a)'
        }}
      >
        {/* Top Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--card-border, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--card-subtle-bg, #f8fafc)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(16px)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                background: 'linear-gradient(135deg, #f5af19, #e65100)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: 4
              }}>
                ⭐ {hotel.starRating || 5}-STAR VERIFIED
              </span>
              <span style={{ fontSize: 13, color: 'var(--accent-cyan, #0284c7)', fontWeight: 700 }}>
                {hotel.reviewScore || 9.2}/10 • {hotel.reviewLabel || 'Exceptional'} ({hotel.reviewCount?.toLocaleString() || 1850} reviews)
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 23px)', fontWeight: 900, color: 'var(--text-main, #0f172a)', margin: '4px 0 2px 0' }}>
              {hotel.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted, #475569)' }}>
              <MapPin size={14} color="var(--accent-cyan, #0284c7)" />
              <span>{hotel.location}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--card-subtle-bg, #f1f5f9)',
              border: '1px solid var(--card-border, #cbd5e1)',
              color: 'var(--text-main, #334155)',
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Confirmation Screen */}
        {bookingConfirmed ? (
          <div style={{ padding: '36px 24px', textAlign: 'center' }}>
            <div style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: 'rgba(0, 230, 118, 0.15)',
              border: '2px solid #00e676',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto',
              boxShadow: '0 0 30px rgba(0, 230, 118, 0.3)'
            }}>
              <CheckCircle2 size={38} color="#00e676" />
            </div>

            <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main, #0f172a)', marginBottom: 6 }}>
              Hotel Reservation Confirmed!
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted, #475569)', maxWidth: 500, margin: '0 auto 24px auto' }}>
              Your luxury suite booking voucher is ready. A confirmation SMS & email have been dispatched to <b>{bookingConfirmed.guestEmail}</b>.
            </p>

            {/* Voucher Card */}
            <div style={{
              maxWidth: 620,
              margin: '0 auto 28px auto',
              background: 'var(--card-subtle-bg, #f8fafc)',
              border: '1px dashed var(--card-border, #cbd5e1)',
              borderRadius: 16,
              padding: '24px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--card-border, #e2e8f0)', paddingBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #475569)', fontWeight: 700 }}>RESERVATION CODE</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-cyan, #0284c7)', letterSpacing: 1 }}>{bookingConfirmed.bookingId}</div>
                </div>
                <div style={{
                  background: 'rgba(5, 150, 105, 0.12)',
                  color: 'var(--accent-green, #059669)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800
                }}>
                  GUARANTEED STAY
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #475569)' }}>Guest Name</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>{bookingConfirmed.guestName}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #475569)' }}>Check-In</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>{bookingConfirmed.checkInDate} (2:00 PM)</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #475569)' }}>Check-Out</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>{bookingConfirmed.checkOutDate} (12:00 PM)</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #475569)' }}>Total Paid</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent-green, #059669)' }}>
                    {currencySymbol}{convertPrice(bookingConfirmed.totalAmount).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-main, #0f172a)', background: 'var(--card-subtle-bg, #f1f5f9)', border: '1px solid var(--card-border, #e2e8f0)', padding: '10px 14px', borderRadius: 8 }}>
                🏨 <b>Room:</b> {bookingConfirmed.roomName} • {bookingConfirmed.nights} Night(s) • {bookingConfirmed.guests} Guest(s)<br/>
                ✨ <b>Special Perks:</b> Complimentary Luxury Breakfast • Free High-Speed WiFi • 24h Concierge
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowManageModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #00d2ff, #0052cc)',
                  border: 'none',
                  color: '#fff',
                  padding: '11px 22px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 15px rgba(0, 210, 255, 0.35)'
                }}
              >
                <Sliders size={16} /> Manage Room & Digital Keycard
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  background: 'var(--card-subtle-bg, #f1f5f9)',
                  border: '1px solid var(--card-border, #cbd5e1)',
                  color: 'var(--text-main, #0f172a)',
                  padding: '11px 22px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <Printer size={16} /> Print Voucher
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary"
                style={{
                  padding: '11px 26px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Return to Hotels
              </button>
            </div>
          </div>
        ) : (
          /* Booking Body */
          <div className="hotel-modal-grid" style={{ padding: 'clamp(14px, 2.5vw, 24px)' }}>
            {/* Left: Rooms & Amenities */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main, #0f172a)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Sparkles size={16} color="#f5af19" /> 1. Select Luxury Room Category & View Interior
                {hasLivePhotos && (
                  <span style={{
                    background: 'rgba(5, 150, 105, 0.12)',
                    color: 'var(--accent-green, #059669)',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 12,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <CheckCircle2 size={11} /> Live Property Photos
                  </span>
                )}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                {availableRooms.map((rm) => {
                  const isSelected = selectedRoom?.id === rm.id;
                  const roomImg = rm.bedroomImage;
                  return (
                    <div
                      key={rm.id}
                      onClick={() => setSelectedRoom(rm)}
                      style={{
                        padding: '16px',
                        borderRadius: 14,
                        cursor: 'pointer',
                        border: isSelected ? '2px solid var(--accent-cyan, #0284c7)' : '1px solid var(--card-border, #e2e8f0)',
                        background: isSelected ? 'rgba(2, 132, 199, 0.1)' : 'var(--card-subtle-bg, #f8fafc)',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 4px 18px rgba(2, 132, 199, 0.2)' : 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        {/* Room Interior Thumbnail */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setRoomForInteriorModal(rm);
                          }}
                          style={{
                            width: 100,
                            height: 80,
                            borderRadius: 10,
                            overflow: 'hidden',
                            position: 'relative',
                            flexShrink: 0,
                            border: '1px solid var(--card-border, rgba(0, 210, 255, 0.3))',
                            cursor: 'pointer'
                          }}
                          title="Click to view full 360° Room Interior"
                        >
                          <img 
                            src={roomImg} 
                            alt={rm.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {rm.isLiveVerified && (
                            <div style={{
                              position: 'absolute',
                              top: 4,
                              left: 4,
                              background: '#059669',
                              color: '#fff',
                              fontSize: 8,
                              fontWeight: 900,
                              padding: '1px 5px',
                              borderRadius: 4,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              zIndex: 2
                            }}>
                              REAL PHOTO
                            </div>
                          )}
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(9, 15, 30, 0.85)',
                            padding: '2px 4px',
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 800,
                            color: '#00d2ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 3
                          }}>
                            <Eye size={10} /> 360° Interior
                          </div>
                        </div>

                        {/* Room Meta */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 800, color: isSelected ? 'var(--accent-cyan, #0284c7)' : 'var(--text-main, #0f172a)' }}>
                                {rm.name}
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted, #475569)', marginTop: 2 }}>
                                🛏️ {rm.bed} • 📐 {rm.size} • 👥 {rm.capacity}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--accent-green, #059669)' }}>
                                {currencySymbol}{convertPrice(rm.price).toLocaleString()}
                              </div>
                              <div style={{ fontSize: 10, color: 'var(--text-muted, #475569)' }}>/ night + taxes</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 11, color: 'var(--accent-cyan, #0284c7)', fontWeight: 600 }}>
                              <span>🌅 {rm.view}</span>
                              <span>☕ Gourmet Breakfast</span>
                              <span>🛡️ Free Cancellation</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRoomForInteriorModal(rm);
                              }}
                              style={{
                                background: 'rgba(2, 132, 199, 0.12)',
                                border: '1px solid var(--accent-cyan, #0284c7)',
                                color: 'var(--accent-cyan, #0284c7)',
                                padding: '4px 10px',
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <Eye size={12} /> View Interior Photos
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 2. Room & Stay Management Controls ("How it manage") */}
              <div style={{
                background: 'var(--card-subtle-bg, #f8fafc)',
                border: '1px solid var(--card-border, #e2e8f0)',
                borderRadius: 14,
                padding: '18px 20px',
                marginBottom: 20
              }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent-cyan, #0284c7)', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sliders size={16} /> 2. Room Configuration & Stay Management
                </h4>

                {/* Number of Rooms Selector */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--card-border, #e2e8f0)', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>Number of Rooms</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted, #475569)' }}>Each room accommodates up to 2 Adults</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      type="button"
                      disabled={roomCount <= 1}
                      onClick={() => setRoomCount(prev => Math.max(1, prev - 1))}
                      style={{
                        background: 'var(--card-subtle-bg, #f1f5f9)',
                        border: '1px solid var(--card-border, #cbd5e1)',
                        color: 'var(--text-main, #0f172a)',
                        width: 30,
                        height: 30,
                        borderRadius: 6,
                        cursor: roomCount <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--accent-cyan, #0284c7)', minWidth: 60, textAlign: 'center' }}>
                      {roomCount} {roomCount === 1 ? 'Room' : 'Rooms'}
                    </span>
                    <button
                      type="button"
                      disabled={roomCount >= 4}
                      onClick={() => setRoomCount(prev => Math.min(4, prev + 1))}
                      style={{
                        background: 'var(--card-subtle-bg, #f1f5f9)',
                        border: '1px solid var(--card-border, #cbd5e1)',
                        color: 'var(--text-main, #0f172a)',
                        width: 30,
                        height: 30,
                        borderRadius: 6,
                        cursor: roomCount >= 4 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Bedding & Floor Dropdowns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted, #475569)', marginBottom: 4, fontWeight: 700 }}>Bed Preference</label>
                    <select
                      value={bedPreference}
                      onChange={(e) => setBedPreference(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: 'var(--input-bg, #ffffff)',
                        border: '1px solid var(--card-border, #cbd5e1)',
                        borderRadius: 6,
                        color: 'var(--text-main, #0f172a)',
                        fontSize: 12
                      }}
                    >
                      <option value="1 Super King Bed">👑 1 Super King Bed</option>
                      <option value="2 Twin Luxury Beds">🛏️🛏️ 2 Twin Beds</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted, #475569)', marginBottom: 4, fontWeight: 700 }}>Floor Preference</label>
                    <select
                      value={floorPreference}
                      onChange={(e) => setFloorPreference(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: 'var(--input-bg, #ffffff)',
                        border: '1px solid var(--card-border, #cbd5e1)',
                        borderRadius: 6,
                        color: 'var(--text-main, #0f172a)',
                        fontSize: 12
                      }}
                    >
                      <option value="High Floor (Skyline View)">🌆 High Floor (Floors 18+)</option>
                      <option value="Quiet Wing (Soundproof)">🤫 Quiet Wing (Garden View)</option>
                      <option value="Accessible (Lower Floor)">♿ Lower Floor / Accessible</option>
                    </select>
                  </div>
                </div>

                {/* Stay Customization Add-Ons */}
                <div style={{ fontSize: 12, color: 'var(--text-main, #0f172a)', marginBottom: 8, fontWeight: 700 }}>
                  Customize Stay Add-Ons:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-main, #0f172a)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={addOnEarlyCheckIn}
                      onChange={(e) => setAddOnEarlyCheckIn(e.target.checked)}
                      style={{ accentColor: 'var(--accent-cyan, #0284c7)' }}
                    />
                    <span>🌅 Early Check-In at 10:00 AM (+{currencySymbol}{convertPrice(1200).toLocaleString()})</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-main, #0f172a)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={addOnLateCheckOut}
                      onChange={(e) => setAddOnLateCheckOut(e.target.checked)}
                      style={{ accentColor: 'var(--accent-cyan, #0284c7)' }}
                    />
                    <span>🌙 Late Check-Out until 4:00 PM (+{currencySymbol}{convertPrice(1500).toLocaleString()})</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-main, #0f172a)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={addOnLimo}
                      onChange={(e) => setAddOnLimo(e.target.checked)}
                      style={{ accentColor: 'var(--accent-cyan, #0284c7)' }}
                    />
                    <span>🚘 VIP Mercedes Airport Limousine Transfer (+{currencySymbol}{convertPrice(2800).toLocaleString()})</span>
                  </label>
                </div>
              </div>

              {/* Hotel Amenities Matrix */}
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main, #0f172a)', marginBottom: 10 }}>
                Included Resort Perks
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginBottom: 16 }}>
                {(hotel.amenities || ['Free WiFi', 'Breakfast Included', 'Infinity Pool', '24h Concierge']).map((am, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-main, #0f172a)', background: 'var(--card-subtle-bg, #f1f5f9)', border: '1px solid var(--card-border, #e2e8f0)', padding: '7px 10px', borderRadius: 6 }}>
                    <Check size={14} color="var(--accent-green, #059669)" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Guest Info & Price Summary */}
            <div style={{
              background: 'var(--card-subtle-bg, #f8fafc)',
              border: '1px solid var(--card-border, #e2e8f0)',
              borderRadius: 16,
              padding: 'clamp(14px, 2vw, 20px)'
            }}>
              <form onSubmit={handleBookingSubmit}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main, #0f172a)', marginBottom: 14 }}>
                  3. Primary Guest Details
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted, #475569)', marginBottom: 4, fontWeight: 700 }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={guestForm.name}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--input-bg, #ffffff)',
                        border: '1px solid var(--card-border, #cbd5e1)',
                        borderRadius: 8,
                        color: 'var(--text-main, #0f172a)',
                        fontSize: 13,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted, #475569)', marginBottom: 4, fontWeight: 700 }}>Email ID *</label>
                      <input
                        type="email"
                        required
                        value={guestForm.email}
                        onChange={(e) => setGuestForm(prev => ({ ...prev, email: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'var(--input-bg, #ffffff)',
                          border: '1px solid var(--card-border, #cbd5e1)',
                          borderRadius: 8,
                          color: 'var(--text-main, #0f172a)',
                          fontSize: 13,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted, #475569)', marginBottom: 4, fontWeight: 700 }}>Phone *</label>
                      <input
                        type="tel"
                        required
                        value={guestForm.phone}
                        onChange={(e) => setGuestForm(prev => ({ ...prev, phone: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'var(--input-bg, #ffffff)',
                          border: '1px solid var(--card-border, #cbd5e1)',
                          borderRadius: 8,
                          color: 'var(--text-main, #0f172a)',
                          fontSize: 13,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div style={{
                  borderTop: '1px solid var(--card-border, #e2e8f0)',
                  paddingTop: 14,
                  marginBottom: 18
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted, #475569)', marginBottom: 6 }}>
                    <span>{selectedRoom?.name || 'Room'} x {nights} Night(s) {roomCount > 1 && `x ${roomCount} Rooms`}</span>
                    <span>{currencySymbol}{convertPrice(basePricePerNight * nights * roomCount).toLocaleString()}</span>
                  </div>

                  {addOnsTotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--accent-cyan, #0284c7)', marginBottom: 6, fontWeight: 600 }}>
                      <span>Selected Stay Add-Ons</span>
                      <span>+{currencySymbol}{convertPrice(addOnsTotal).toLocaleString()}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted, #475569)', marginBottom: 6 }}>
                    <span>Hospitality Taxes & GST (12%)</span>
                    <span>+{currencySymbol}{convertPrice(taxesAndFees).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--accent-green, #059669)', marginBottom: 10, fontWeight: 600 }}>
                    <span>Special SelectMyFlight Discount (10%)</span>
                    <span>-{currencySymbol}{convertPrice(discountAmount).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: 'var(--text-main, #0f172a)', borderTop: '1px dashed var(--card-border, #cbd5e1)', paddingTop: 8 }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--accent-green, #059669)' }}>{currencySymbol}{convertPrice(grandTotal).toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 20px rgba(0, 210, 255, 0.35)',
                    transition: 'all 0.2s'
                  }}
                >
                  {isProcessing ? 'Confirming Stay...' : (
                    <>
                      <span>Instant Confirm & Reserve</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div style={{ fontSize: 11, color: 'var(--text-muted, #64748b)', textAlign: 'center', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <ShieldCheck size={14} color="#059669" />
                  <span>Free cancellation up to 24 hours prior to check-in.</span>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Room Interior 360° Modal */}
      {roomForInteriorModal && (
        <RoomInteriorModal
          room={roomForInteriorModal}
          hotel={hotel}
          currency={currency}
          onClose={() => setRoomForInteriorModal(null)}
          onSelectRoom={(rm) => setSelectedRoom(rm)}
        />
      )}

      {/* Post-Booking Stay Management Modal */}
      {showManageModal && bookingConfirmed && (
        <HotelManageModal
          booking={bookingConfirmed}
          currency={currency}
          onClose={() => setShowManageModal(false)}
          onUpdateBooking={(updated) => setBookingConfirmed(updated)}
        />
      )}
    </div>
  );
}
