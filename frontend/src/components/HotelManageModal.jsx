import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  KeyRound, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  QrCode, 
  Eye, 
  Sliders, 
  Phone, 
  Mail, 
  Bed, 
  ShieldCheck, 
  RefreshCw, 
  ArrowUpRight,
  Coffee,
  Check,
  AlertTriangle
} from 'lucide-react';
import RoomInteriorModal from './RoomInteriorModal';

export default function HotelManageModal({ booking, currency = 'INR', onClose, onUpdateBooking, onCancelBooking }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'room-settings' | 'upgrade' | 'keycard'
  const [showInteriorModal, setShowInteriorModal] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  // Manageable room preferences
  const [bedChoice, setBedChoice] = useState(booking?.bedChoice || '1 King Bed');
  const [pillowType, setPillowType] = useState(booking?.pillowType || 'Memory Foam');
  const [floorPreference, setFloorPreference] = useState(booking?.floorPreference || 'High Floor (Skyline View)');
  const [roomTemp, setRoomTemp] = useState(booking?.roomTemp || '21°C');
  const [specialRequest, setSpecialRequest] = useState(booking?.specialRequest || 'Quiet room, non-smoking');

  if (!booking) return null;

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';
  const convertPrice = (inr) => (currency === 'USD' ? Math.round(inr / 85) : inr);

  const roomNumber = booking.roomNumber || 'Room #2408 (Floor 24)';
  const roomName = booking.roomName || booking.roomType?.name || 'Deluxe Premier Suite';

  const handleSavePreferences = (e) => {
    e.preventDefault();
    if (onUpdateBooking) {
      onUpdateBooking({
        ...booking,
        bedChoice,
        pillowType,
        floorPreference,
        roomTemp,
        specialRequest
      });
    }
    setSuccessNotice('Room interior and stay preferences successfully updated with the hotel front desk!');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  return (
    <>
      <div 
        className="modal-overlay" 
        onClick={onClose} 
        style={{
          zIndex: 1650,
          padding: 'clamp(8px, 2vw, 24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(3, 7, 18, 0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
      >
        <div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()} 
          style={{
            width: '100%',
            maxWidth: 880,
            maxHeight: '94vh',
            background: '#0d1527',
            border: '1px solid rgba(0, 210, 255, 0.4)',
            borderRadius: 20,
            overflowY: 'auto',
            boxShadow: '0 25px 70px rgba(0,0,0,0.9), 0 0 35px rgba(0, 210, 255, 0.2)',
            color: '#f8fafc',
            position: 'relative'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.12), rgba(245, 175, 25, 0.08))',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backdropFilter: 'blur(16px)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  background: 'linear-gradient(135deg, #00d2ff, #0052cc)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: 4
                }}>
                  🏨 STAY MANAGEMENT
                </span>
                <span style={{ fontSize: 13, color: '#00e676', fontWeight: 800 }}>
                  ● CONFIRMED & ALLOCATED
                </span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '4px 0 2px 0' }}>
                {booking.hotelName || 'Grand Luxury Resort & Spa'}
              </h2>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                Voucher Code: <strong style={{ color: '#00d2ff' }}>{booking.bookingId || booking.voucherCode || 'HTL-SMF-8921'}</strong> • {roomNumber}
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

          {/* Navigation Sub-Tabs */}
          <div style={{
            display: 'flex',
            gap: 6,
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            overflowX: 'auto'
          }}>
            {[
              { id: 'overview', label: 'Stay Overview', icon: <Building2 size={14} /> },
              { id: 'room-settings', label: 'Room & Interior Preferences', icon: <Sliders size={14} /> },
              { id: 'upgrade', label: 'Upgrade Suite', icon: <Sparkles size={14} /> },
              { id: 'keycard', label: 'Digital Keycard & QR', icon: <KeyRound size={14} /> }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
                    border: isActive ? '1px solid #00d2ff' : '1px solid transparent',
                    color: isActive ? '#00d2ff' : '#94a3b8',
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Notice Banner */}
          {successNotice && (
            <div style={{
              margin: '16px 24px 0 24px',
              padding: '12px 16px',
              borderRadius: 10,
              background: 'rgba(0, 230, 118, 0.15)',
              border: '1px solid #00e676',
              color: '#00e676',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <CheckCircle2 size={16} />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div style={{ padding: '24px' }}>
              {/* Room Card Showcase */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08), rgba(255, 255, 255, 0.02))',
                border: '1px solid rgba(0, 210, 255, 0.25)',
                borderRadius: 16,
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                marginBottom: 24
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#f5af19', fontWeight: 800, textTransform: 'uppercase' }}>
                    YOUR CONFIRMED SUITE
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '4px 0' }}>
                    {roomName}
                  </h3>
                  <div style={{ fontSize: 13, color: '#38bdf8', fontWeight: 700 }}>
                    {roomNumber} • {bedChoice} • {floorPreference}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                    Includes: Free High-Speed Wi-Fi 6 • Daily Gourmet Breakfast • Access to Executive Infinity Pool
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowInteriorModal(true)}
                    className="btn-primary"
                    style={{
                      padding: '10px 18px',
                      fontSize: 12,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Eye size={15} />
                    <span>View Room Interior (360°)</span>
                  </button>
                </div>
              </div>

              {/* Stay Itinerary Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 14,
                marginBottom: 24
              }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Check-In</span>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginTop: 2 }}>
                    {booking.checkInDate || 'Upcoming Stay'}
                  </div>
                  <span style={{ fontSize: 11, color: '#00e676' }}>2:00 PM (Early Check-In ready)</span>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Check-Out</span>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginTop: 2 }}>
                    {booking.checkOutDate || 'Confirmed'}
                  </div>
                  <span style={{ fontSize: 11, color: '#38bdf8' }}>12:00 PM (Late Check-Out optional)</span>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Primary Guest</span>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginTop: 2 }}>
                    {booking.guestName || 'Traveler'}
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{booking.guestEmail || 'Verified Guest'}</span>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Total Tariff Paid</span>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#00e676', marginTop: 2 }}>
                    {currencySymbol}{convertPrice(booking.totalAmount || 38500).toLocaleString()}
                  </div>
                  <span style={{ fontSize: 11, color: '#00d2ff' }}>Taxes & Amenities Paid</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '10px 18px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Printer size={15} />
                    <span>Print Hotel Voucher</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('keycard')}
                    style={{
                      background: 'rgba(0, 210, 255, 0.15)',
                      border: '1px solid #00d2ff',
                      color: '#00d2ff',
                      padding: '10px 18px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <KeyRound size={15} />
                    <span>Open Digital Keycard</span>
                  </button>
                </div>

                {onCancelBooking && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this hotel reservation? 100% full refund will be processed to your payment method.')) {
                        onCancelBooking(booking.bookingId || booking.id);
                        onClose();
                      }
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: '10px 16px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel Reservation & Full Refund
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Room & Interior Preferences */}
          {activeTab === 'room-settings' && (
            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
                Customize & Manage Your Room Setup
              </h3>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 20px 0' }}>
                Your room setup is synced directly with hotel housekeeping and reception ahead of your arrival.
              </p>

              <form onSubmit={handleSavePreferences}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                      Bed Configuration
                    </label>
                    <select
                      value={bedChoice}
                      onChange={(e) => setBedChoice(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 13
                      }}
                    >
                      <option value="1 Super King Bed">👑 1 Super King Bed (200x200 cm)</option>
                      <option value="2 Twin Luxury Beds">🛏️🛏️ 2 Separate Twin Luxury Beds</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                      Pillow Menu Preference
                    </label>
                    <select
                      value={pillowType}
                      onChange={(e) => setPillowType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 13
                      }}
                    >
                      <option value="Memory Foam Contour">💆 Memory Foam Ergonomic Contour</option>
                      <option value="Feather & Goose Down">🪶 Ultra-Soft Feather & Goose Down</option>
                      <option value="Organic Hypoallergenic">🌿 100% Organic Hypoallergenic</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                      Floor & Orientation
                    </label>
                    <select
                      value={floorPreference}
                      onChange={(e) => setFloorPreference(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 13
                      }}
                    >
                      <option value="High Floor (Skyline View)">🌆 High Floor (Floors 18+, Skyline View)</option>
                      <option value="Quiet Wing (Maximum Silence)">🤫 Quiet Wing (Soundproof Garden View)</option>
                      <option value="Accessible (Near Elevators)">♿ Accessible (Lower Floor / Near Lift)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                      Pre-Arrival Climate Setting
                    </label>
                    <select
                      value={roomTemp}
                      onChange={(e) => setRoomTemp(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 13
                      }}
                    >
                      <option value="19°C (Chilled Crisp)">❄️ 19°C (Chilled Crisp)</option>
                      <option value="21°C (Standard European)">🍃 21°C (Standard European)</option>
                      <option value="23°C (Cozy Ambient)">☀️ 23°C (Cozy Ambient)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                    Special In-Room Dietary / Arrival Requests
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="e.g. Extra feather towels, honeymoon welcome note, decaf coffee pods..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 13,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '11px 24px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Check size={16} />
                  <span>Update & Sync Room Setup</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 3: Upgrade Suite */}
          {activeTab === 'upgrade' && (
            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
                Exclusive Room Upgrade Offers
              </h3>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 20px 0' }}>
                As a SelectMyFlight guest, unlock promotional upgrade rates with VIP lounge privileges:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  {
                    name: 'Executive Club Skyline Villa',
                    size: '85 sq.m',
                    bed: '1 Super King Bed + Lounge',
                    extraPerNight: 4500,
                    perks: 'Free Club Lounge Cocktails, Private Check-in Desk, Complimentary Evening Hors d’oeuvres'
                  },
                  {
                    name: 'Presidential Penthouse Ocean Suite',
                    size: '140 sq.m',
                    bed: '2 Master King Beds + Jacuzzi',
                    extraPerNight: 9800,
                    perks: '24h Personal Butler, In-suite Steam Room, Mercedes Airport Transfer, Hermès Amenities'
                  }
                ].map((upg, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(245, 175, 25, 0.3)',
                      borderRadius: 14,
                      padding: '18px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 14
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#f5af19' }}>
                          ⭐ {upg.name}
                        </span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                          📐 {upg.size} • 🛏️ {upg.bed}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                        ✨ <b>VIP Privileges:</b> {upg.perks}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#00e676' }}>
                        +{currencySymbol}{convertPrice(upg.extraPerNight).toLocaleString()}
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}> / night</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSuccessNotice(`Suite upgraded to ${upg.name}! Your reservation has been updated.`);
                          setActiveTab('overview');
                        }}
                        style={{
                          marginTop: 6,
                          background: 'linear-gradient(135deg, #f5af19, #e65100)',
                          border: 'none',
                          color: '#000',
                          fontWeight: 900,
                          fontSize: 11,
                          padding: '6px 14px',
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                      >
                        Request Upgrade
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Digital Keycard & Express QR */}
          {activeTab === 'keycard' && (
            <div style={{ padding: '28px 24px', textAlign: 'center' }}>
              <div style={{
                maxWidth: 420,
                margin: '0 auto',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                border: '2px solid rgba(0, 210, 255, 0.4)',
                borderRadius: 20,
                padding: '24px',
                boxShadow: '0 15px 40px rgba(0, 210, 255, 0.2)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: '#00d2ff' }}>
                    SELECTMYFLIGHT LUXURY PASS
                  </span>
                  <KeyRound size={20} color="#f5af19" />
                </div>

                <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: 1, marginBottom: 4 }}>
                  {roomNumber}
                </div>
                <div style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 16 }}>
                  {booking.hotelName || 'Grand Resort'}
                </div>

                {/* QR Code Container */}
                <div style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '16px',
                  display: 'inline-block',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                }}>
                  <QrCode size={130} color="#000" />
                </div>

                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  Tap at Hotel Front Desk or Smartphone Door Lock for Express Entry.<br/>
                  Guest: <strong style={{ color: '#fff' }}>{booking.guestName || 'Verified Traveler'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Room Interior 360° Modal */}
      {showInteriorModal && (
        <RoomInteriorModal
          room={{
            name: roomName,
            bed: bedChoice,
            size: '54 sq.m',
            view: floorPreference,
            price: booking.totalAmount ? Math.round(booking.totalAmount / (booking.nights || 2)) : 18500
          }}
          hotel={{ name: booking.hotelName }}
          currency={currency}
          onClose={() => setShowInteriorModal(false)}
        />
      )}
    </>
  );
}

