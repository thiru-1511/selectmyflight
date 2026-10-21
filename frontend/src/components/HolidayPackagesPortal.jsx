import React, { useState } from 'react';
import { 
  Palmtree, 
  Calendar, 
  MapPin, 
  Star, 
  CheckCircle2, 
  X, 
  Clock, 
  Sparkles, 
  Send, 
  ArrowRight, 
  Plane, 
  Building2, 
  Coffee, 
  Car, 
  ShieldCheck, 
  PhoneCall, 
  Check, 
  Filter
} from 'lucide-react';
import { HOLIDAY_PACKAGES } from '../data/mockPackages';

export default function HolidayPackagesPortal({ currency = 'INR', onClose, onPackageBooked, onNavigateToMyTrips }) {
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [activePackageModal, setActivePackageModal] = useState(null);
  const [isCustomQuoteOpen, setIsCustomQuoteOpen] = useState(false);
  const [quoteSuccessId, setQuoteSuccessId] = useState(null);

  // Custom Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    name: localStorage.getItem('smf_verified_name') || 'Thiru Selvan',
    email: localStorage.getItem('smf_verified_email') || 'thiru1511@gmail.com',
    phone: '+91 98765 43210',
    destination: 'Dubai & Abu Dhabi',
    travelDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    adults: 2,
    children: 0,
    budgetPerPerson: '₹40,000 – ₹60,000',
    specialNotes: 'Looking for 4-star family hotel near city center with breakfast & desert safari.'
  });

  const formatPrice = (amount) => {
    if (currency === 'USD') return `$${Math.round(amount / 83)}`;
    if (currency === 'EUR') return `€${Math.round(amount / 90)}`;
    if (currency === 'GBP') return `£${Math.round(amount / 105)}`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredPackages = HOLIDAY_PACKAGES.filter(pkg => {
    if (selectedDestination === 'All') return true;
    return pkg.destinationCode === selectedDestination || pkg.destination.toLowerCase().includes(selectedDestination.toLowerCase());
  });

  const handleBookPackage = (pkg) => {
    const bookingPnr = 'SMF-PKG-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: Date.now(),
      pnr: bookingPnr,
      bookingType: 'HOLIDAY_PACKAGE',
      flightNumber: `SMF-${pkg.destinationCode}-PKG`,
      airlineName: 'SelectMyFlight Holidays',
      airlineCode: 'SMF',
      originCode: 'DEL',
      destinationCode: pkg.destinationCode,
      originCity: 'New Delhi',
      destinationCity: pkg.destination,
      departureDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      departureTime: '08:30',
      arrivalTime: '13:00',
      totalAmount: pkg.pricePerPerson * 2, // Default 2 travelers
      passengersCount: 2,
      packageTitle: pkg.title,
      duration: pkg.duration,
      status: 'CONFIRMED',
      paymentMethod: 'UPI Instant / Verified',
      bookedAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('smf_bookings') || '[]');
      localStorage.setItem('smf_bookings', JSON.stringify([newBooking, ...existing]));
      window.dispatchEvent(new Event('smf_data_updated'));
    } catch {
      // ignore
    }

    if (onPackageBooked) {
      onPackageBooked(newBooking);
    }

    alert(`🎉 Holiday Package Confirmed!\n\nPackage: ${pkg.title}\nBooking Reference: ${bookingPnr}\nTotal: ${formatPrice(newBooking.totalAmount)} (2 Guests)\n\nTrip voucher and detailed flight/hotel vouchers have been saved to "My Trips"!`);
    setActivePackageModal(null);
  };

  const handleCustomQuoteSubmit = (e) => {
    e.preventDefault();
    const quoteRef = 'SMF-QUOTE-' + Math.floor(10000 + Math.random() * 90000);
    setQuoteSuccessId(quoteRef);
  };

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', padding: '16px 8px 60px 8px' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(9, 15, 29, 0.95), rgba(15, 23, 42, 0.98))',
        border: '1px solid rgba(245, 175, 25, 0.3)',
        borderRadius: 20,
        padding: '32px 24px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 24,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 175, 25, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ maxWidth: 740 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(245, 175, 25, 0.12)',
              border: '1px solid rgba(245, 175, 25, 0.35)',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              color: '#f5af19',
              marginBottom: 10
            }}>
              <Palmtree size={13} />
              <span>HANDPICKED TOUR VACATIONS</span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: -0.5 }}>
              All-Inclusive Holiday Packages & Escapes
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>
              Bundled luxury holidays with guaranteed flights, handpicked 4-star & 5-star hotels, daily breakfast, private airport transfers, and guided sightseeing. Zero hidden costs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsCustomQuoteOpen(true);
              setQuoteSuccessId(null);
            }}
            style={{
              background: 'linear-gradient(135deg, #f5af19, #f12711)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 22px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 18px rgba(245, 175, 25, 0.35)'
            }}
          >
            <Sparkles size={16} />
            <span>Request Custom Tour Quote</span>
          </button>
        </div>
      </div>

      {/* Destination Filters Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 10,
        marginBottom: 20
      }}>
        {[
          { id: 'All', label: 'All Packages (5)' },
          { id: 'DXB', label: '🇦🇪 Dubai Extravaganza' },
          { id: 'COK', label: '🌴 Magical Kerala' },
          { id: 'SIN', label: '🇸🇬 Singapore & Sentosa' },
          { id: 'DPS', label: '🌺 Bali Tropical Romance' },
          { id: 'JAI', label: '🏰 Royal Rajasthan' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedDestination(filter.id)}
            style={{
              background: selectedDestination === filter.id ? 'rgba(245, 175, 25, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedDestination === filter.id ? '#f5af19' : '#94a3b8',
              border: selectedDestination === filter.id ? '1px solid #f5af19' : '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Holiday Package Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: 24
      }}>
        {filteredPackages.map(pkg => (
          <div
            key={pkg.id}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 18,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245, 175, 25, 0.5)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Package Image & Badge Header */}
            <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
              <img
                src={pkg.heroImage}
                alt={pkg.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(9, 15, 29, 0.2) 0%, rgba(9, 15, 29, 0.9) 100%)'
              }} />

              {/* Badges on Image */}
              <div style={{
                position: 'absolute',
                top: 14,
                left: 14,
                display: 'flex',
                gap: 6
              }}>
                <span style={{
                  background: pkg.badgeColor,
                  color: '#090f1d',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 900
                }}>
                  {pkg.badge}
                </span>
                <span style={{
                  background: 'rgba(9, 15, 29, 0.85)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Clock size={11} /> {pkg.duration}
                </span>
              </div>

              {/* Rating */}
              <div style={{
                position: 'absolute',
                bottom: 12,
                left: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(9, 15, 29, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '3px 8px',
                borderRadius: 20,
                fontSize: 11,
                color: '#fff'
              }}>
                <Star size={12} fill="#f5af19" color="#f5af19" />
                <span style={{ fontWeight: 800 }}>{pkg.rating}</span>
                <span style={{ color: '#94a3b8' }}>({pkg.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Package Body */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#f5af19', fontWeight: 700, marginBottom: 4 }}>
                  <MapPin size={12} />
                  <span>{pkg.destination}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                  {pkg.title}
                </h3>
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 16 }}>
                  {pkg.overview}
                </p>

                {/* Key Inclusions Icons Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 6,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '10px 8px',
                  textAlign: 'center',
                  marginBottom: 16
                }}>
                  <div>
                    <Plane size={15} color="#00d2ff" style={{ margin: '0 auto 2px auto' }} />
                    <div style={{ fontSize: 10, color: '#cbd5e1', fontWeight: 600 }}>Flights</div>
                  </div>
                  <div>
                    <Building2 size={15} color="#f5af19" style={{ margin: '0 auto 2px auto' }} />
                    <div style={{ fontSize: 10, color: '#cbd5e1', fontWeight: 600 }}>4★ Hotel</div>
                  </div>
                  <div>
                    <Coffee size={15} color="#00e676" style={{ margin: '0 auto 2px auto' }} />
                    <div style={{ fontSize: 10, color: '#cbd5e1', fontWeight: 600 }}>Breakfast</div>
                  </div>
                  <div>
                    <Car size={15} color="#c084fc" style={{ margin: '0 auto 2px auto' }} />
                    <div style={{ fontSize: 10, color: '#cbd5e1', fontWeight: 600 }}>Transfers</div>
                  </div>
                </div>

                {/* Top Inclusions checklist */}
                <div style={{ marginBottom: 16 }}>
                  {pkg.inclusions.slice(0, 3).map((inc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#cbd5e1', marginBottom: 4 }}>
                      <CheckCircle2 size={13} color="#00e676" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action Footer */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: 10, color: '#94a3b8', textDecoration: 'line-through', display: 'block' }}>
                    {formatPrice(pkg.originalPrice)}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#00d2ff' }}>
                      {formatPrice(pkg.pricePerPerson)}
                    </span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>/ person</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setActivePackageModal(pkg)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    View Itinerary
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBookPackage(pkg)}
                    style={{
                      background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: DAY-BY-DAY ITINERARY & PACKAGE DETAILS */}
      {activePackageModal && (
        <div className="modal-overlay" onClick={() => setActivePackageModal(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 740, maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Header */}
            <div style={{
              position: 'relative',
              height: 200,
              backgroundImage: `url(${activePackageModal.heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'flex-end',
              padding: 24
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(9,15,29,0.3) 0%, rgba(9,15,29,0.95) 100%)'
              }} />
              <button
                type="button"
                onClick={() => setActivePackageModal(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  color: '#fff',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                <X size={18} />
              </button>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ background: '#f5af19', color: '#090f1d', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 900 }}>
                  {activePackageModal.duration}
                </span>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '6px 0 0 0' }}>
                  {activePackageModal.title}
                </h2>
              </div>
            </div>

            <div style={{ padding: 24 }}>
              {/* Day-by-day Itinerary */}
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#00d2ff', marginBottom: 14 }}>
                📅 Day-by-Day Journey Schedule
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {activePackageModal.itinerary.map(day => (
                  <div
                    key={day.day}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 12,
                      padding: '14px 16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: 12
                      }}>
                        DAY {day.day}
                      </span>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>
                        {day.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                      {day.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Inclusions & Exclusions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ background: 'rgba(0, 230, 118, 0.05)', border: '1px solid rgba(0, 230, 118, 0.2)', padding: 16, borderRadius: 12 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: '#00e676', margin: '0 0 10px 0' }}>
                    ✓ Inclusions
                  </h4>
                  {activePackageModal.inclusions.map((inc, i) => (
                    <div key={i} style={{ fontSize: 11, color: '#cbd5e1', marginBottom: 6, display: 'flex', gap: 6 }}>
                      <Check size={13} color="#00e676" style={{ flexShrink: 0 }} />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: 16, borderRadius: 12 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: '#f87171', margin: '0 0 10px 0' }}>
                    ✕ Exclusions
                  </h4>
                  {activePackageModal.exclusions.map((exc, i) => (
                    <div key={i} style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6, display: 'flex', gap: 6 }}>
                      <X size={13} color="#f87171" style={{ flexShrink: 0 }} />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Booking Bar */}
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Package Price per adult</span>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#00d2ff' }}>
                    {formatPrice(activePackageModal.pricePerPerson)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBookPackage(activePackageModal)}
                  style={{
                    background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0, 210, 255, 0.35)'
                  }}
                >
                  Confirm & Reserve Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REQUEST CUSTOM TOUR QUOTATION */}
      {isCustomQuoteOpen && (
        <div className="modal-overlay" onClick={() => setIsCustomQuoteOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 580 }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: 11, color: '#f5af19', fontWeight: 800 }}>TAILORED TRAVEL DESK</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '2px 0 0 0' }}>
                  Request Custom Holiday Quotation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomQuoteOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#cbd5e1',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {quoteSuccessId ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <CheckCircle2 size={46} color="#00e676" style={{ margin: '0 auto 12px auto' }} />
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                    Custom Quote Dispatched!
                  </h3>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#f5af19', margin: '8px 0' }}>
                    Quote Reference: {quoteSuccessId}
                  </div>
                  <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 420, margin: '0 auto 20px auto', lineHeight: 1.5 }}>
                    Our senior holiday planner has received your request. A tailored PDF itinerary with confirmed flight seats and hotel options will be emailed to <strong>{quoteForm.email}</strong> within 3 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCustomQuoteOpen(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      padding: '10px 22px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomQuoteSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Destination Wishlist</label>
                      <input
                        type="text"
                        required
                        value={quoteForm.destination}
                        onChange={(e) => setQuoteForm({ ...quoteForm, destination: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Email Address</label>
                      <input
                        type="email"
                        required
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>WhatsApp / Mobile No.</label>
                      <input
                        type="tel"
                        required
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Target Travel Date</label>
                      <input
                        type="date"
                        required
                        value={quoteForm.travelDate}
                        onChange={(e) => setQuoteForm({ ...quoteForm, travelDate: e.target.value })}
                        style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Budget per person</label>
                      <select
                        value={quoteForm.budgetPerPerson}
                        onChange={(e) => setQuoteForm({ ...quoteForm, budgetPerPerson: e.target.value })}
                        style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      >
                        <option value="₹25,000 – ₹40,000">₹25,000 – ₹40,000 (Value)</option>
                        <option value="₹40,000 – ₹60,000">₹40,000 – ₹60,000 (Comfort 4★)</option>
                        <option value="₹60,000 – ₹1,00,000">₹60,000 – ₹1,00,000 (Luxury 5★)</option>
                        <option value="₹1,00,000+">₹1,00,000+ (Ultra VIP)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Specific Requests / Inclusions</label>
                    <textarea
                      rows="3"
                      value={quoteForm.specialNotes}
                      onChange={(e) => setQuoteForm({ ...quoteForm, specialNotes: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13, resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #f5af19, #f12711)',
                      color: '#fff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    <Send size={15} /> Send Custom Quote Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
