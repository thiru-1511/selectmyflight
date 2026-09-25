import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HotelDetailsModal({ 
  hotel, 
  checkInDate, 
  checkOutDate, 
  guests, 
  currency, 
  onClose, 
  onConfirmBooking 
}) {
  const [selectedRoom, setSelectedRoom] = useState(hotel.roomTypes[0] || null);
  const [guestForm, setGuestForm] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+91 98765 43210',
    specialRequest: 'Quiet high-floor room preferred'
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate nights
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));

  const basePricePerNight = selectedRoom ? selectedRoom.price : hotel.pricePerNight;
  const subtotal = basePricePerNight * nights;
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

      const confirmationId = `HTL-${hotel.cityCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      const confirmationPayload = {
        bookingId: confirmationId,
        type: 'HOTEL',
        hotelName: hotel.name,
        location: hotel.location,
        cityName: hotel.cityName,
        roomName: selectedRoom ? selectedRoom.name : 'Standard Luxury Room',
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
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 920,
        maxHeight: '92vh',
        background: '#0d1527',
        border: '1px solid rgba(0, 210, 255, 0.3)',
        borderRadius: 20,
        overflowY: 'auto',
        boxShadow: '0 25px 70px rgba(0,0,0,0.8), 0 0 35px rgba(0, 210, 255, 0.15)',
        position: 'relative',
        color: '#f8fafc'
      }}>
        {/* Top Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                background: 'linear-gradient(135deg, #f5af19, #e65100)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: 4
              }}>
                ⭐ {hotel.starRating}-STAR VERIFIED
              </span>
              <span style={{ fontSize: 13, color: '#38bdf8', fontWeight: 700 }}>
                {hotel.reviewScore}/10 • {hotel.reviewLabel} ({hotel.reviewCount.toLocaleString()} reviews)
              </span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '6px 0 2px 0' }}>
              {hotel.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8' }}>
              <MapPin size={14} color="#00d2ff" />
              <span>{hotel.location}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#cbd5e1',
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Confirmation Screen */}
        {bookingConfirmed ? (
          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
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

            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              Hotel Reservation Confirmed!
            </h3>
            <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 500, margin: '0 auto 24px auto' }}>
              Your luxury suite booking voucher is ready. A confirmation SMS & email have been dispatched to <b>{bookingConfirmed.guestEmail}</b>.
            </p>

            {/* Voucher Card */}
            <div style={{
              maxWidth: 620,
              margin: '0 auto 28px auto',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
              border: '1px dashed rgba(0, 210, 255, 0.4)',
              borderRadius: 16,
              padding: '24px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>RESERVATION CODE</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#00d2ff', letterSpacing: 1 }}>{bookingConfirmed.bookingId}</div>
                </div>
                <div style={{
                  background: 'rgba(0, 230, 118, 0.15)',
                  color: '#00e676',
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
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Guest Name</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{bookingConfirmed.guestName}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Check-In</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{bookingConfirmed.checkInDate} (2:00 PM)</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Check-Out</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{bookingConfirmed.checkOutDate} (12:00 PM)</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Total Paid</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#00e676' }}>
                    {currencySymbol}{convertPrice(bookingConfirmed.totalAmount).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: '#cbd5e1', background: 'rgba(0, 210, 255, 0.08)', padding: '10px 14px', borderRadius: 8 }}>
                🏨 <b>Room:</b> {bookingConfirmed.roomName} • {bookingConfirmed.nights} Night(s) • {bookingConfirmed.guests} Guest(s)<br/>
                ✨ <b>Special Perks:</b> Complimentary Luxury Breakfast • Free High-Speed WiFi • 24h Concierge
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  padding: '10px 20px',
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
                style={{
                  background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 24px',
                  borderRadius: 10,
                  fontSize: 13,
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
          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
            {/* Left: Rooms & Amenities */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={16} color="#f5af19" /> 1. Select Your Luxury Room Category
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {hotel.roomTypes.map((rm) => {
                  const isSelected = selectedRoom?.id === rm.id;
                  return (
                    <div
                      key={rm.id}
                      onClick={() => setSelectedRoom(rm)}
                      style={{
                        padding: '16px',
                        borderRadius: 12,
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: isSelected ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? '#00d2ff' : '#fff' }}>
                            {rm.name}
                          </div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>
                            🛏️ {rm.bed} • 📐 {rm.size} • 👥 {rm.capacity}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 16, fontWeight: 900, color: '#00e676' }}>
                            {currencySymbol}{convertPrice(rm.price).toLocaleString()}
                          </div>
                          <div style={{ fontSize: 10, color: '#94a3b8' }}>/ night + taxes</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#38bdf8', marginTop: 8 }}>
                        <span>🌅 {rm.view}</span>
                        <span>☕ Free Gourmet Breakfast</span>
                        <span>🛡️ Free Cancellation</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hotel Amenities Matrix */}
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                Included Resort Perks
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 16 }}>
                {hotel.amenities.map((am, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#cbd5e1', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6 }}>
                    <Check size={14} color="#00e676" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Guest Info & Price Summary */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: '20px'
            }}>
              <form onSubmit={handleBookingSubmit}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
                  2. Primary Guest Details
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={guestForm.name}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 13,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Email ID</label>
                      <input
                        type="email"
                        required
                        value={guestForm.email}
                        onChange={(e) => setGuestForm(prev => ({ ...prev, email: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: 8,
                          color: '#fff',
                          fontSize: 13,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Phone</label>
                      <input
                        type="tel"
                        required
                        value={guestForm.phone}
                        onChange={(e) => setGuestForm(prev => ({ ...prev, phone: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: 8,
                          color: '#fff',
                          fontSize: 13,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: 14,
                  marginBottom: 18
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                    <span>{selectedRoom?.name || 'Room'} x {nights} Night(s)</span>
                    <span>{currencySymbol}{convertPrice(subtotal).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                    <span>Hospitality Taxes & GST (12%)</span>
                    <span>+{currencySymbol}{convertPrice(taxesAndFees).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#00e676', marginBottom: 10 }}>
                    <span>Special SelectMyFlight Discount (10%)</span>
                    <span>-{currencySymbol}{convertPrice(discountAmount).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: '#fff', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: 8 }}>
                    <span>Total Amount</span>
                    <span style={{ color: '#00e676' }}>{currencySymbol}{convertPrice(grandTotal).toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #00d2ff, #0052cc)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 20px rgba(0, 210, 255, 0.3)',
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

                <div style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <ShieldCheck size={14} color="#00e676" />
                  <span>Free cancellation up to 24 hours prior to check-in.</span>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
