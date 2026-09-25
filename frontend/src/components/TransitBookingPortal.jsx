import React, { useState, useMemo } from 'react';
import { 
  Train, 
  MapPin, 
  Calendar, 
  Search, 
  Star, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Wifi,
  Coffee,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';
import { TRANSIT_STATIONS, INITIAL_TRANSIT_ROUTES } from '../data/mockTransit';
import TransitTicketModal from './TransitTicketModal';

export default function TransitBookingPortal({
  currency = 'INR',
  currencyRates = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 },
  currentUser = null,
  onBookingSuccess = () => {},
  onClose = () => {}
}) {
  const [transitType, setTransitType] = useState('ALL'); // 'ALL' | 'TRAIN' | 'BUS'
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedClassMap, setSelectedClassMap] = useState({});

  // Booking details modal
  const [activeBookingRoute, setActiveBookingRoute] = useState(null);
  const [passengerForm, setPassengerForm] = useState({
    name: currentUser?.name || 'Rahul Sharma',
    age: '28',
    gender: 'Male',
    berthPref: 'Window / Lower'
  });

  // Confirmed E-Ticket
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  const convertPrice = (inr) => {
    const rate = currencyRates[currency] || 1;
    return Math.round(inr * rate);
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';

  const filteredRoutes = useMemo(() => {
    return INITIAL_TRANSIT_ROUTES.filter(route => {
      if (transitType !== 'ALL' && route.transitType !== transitType) return false;
      if (originCity && !route.originCity.toLowerCase().includes(originCity.toLowerCase()) && !route.originCode.toLowerCase().includes(originCity.toLowerCase())) {
        return false;
      }
      if (destinationCity && !route.destinationCity.toLowerCase().includes(destinationCity.toLowerCase()) && !route.destinationCode.toLowerCase().includes(destinationCity.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [transitType, originCity, destinationCity]);

  const handleSwap = () => {
    const temp = originCity;
    setOriginCity(destinationCity);
    setDestinationCity(temp);
  };

  const handleSelectClass = (routeId, classId) => {
    setSelectedClassMap(prev => ({ ...prev, [routeId]: classId }));
  };

  const handleStartBooking = (route) => {
    const selectedClassId = selectedClassMap[route.id] || route.classes[0]?.id;
    const selectedClass = route.classes.find(c => c.id === selectedClassId) || route.classes[0];
    setActiveBookingRoute({ ...route, selectedClass });
  };

  const handleConfirmTransitBooking = (e) => {
    e.preventDefault();
    if (!activeBookingRoute) return;

    const pnr = `PNR-${Math.floor(100000 + Math.random() * 900000)}`;
    const coachNumber = activeBookingRoute.transitType === 'TRAIN' ? 'C' + Math.floor(1 + Math.random() * 8) : 'B' + Math.floor(1 + Math.random() * 4);
    const seatNumber = activeBookingRoute.transitType === 'TRAIN' ? `Seat ${Math.floor(1 + Math.random() * 60)}` : `Berth L${Math.floor(1 + Math.random() * 18)}`;

    const newBooking = {
      id: `bk-transit-${Date.now()}`,
      bookingType: 'TRANSIT',
      transitType: activeBookingRoute.transitType,
      pnr,
      serviceNumber: activeBookingRoute.serviceNumber,
      serviceName: activeBookingRoute.serviceName,
      operatorName: activeBookingRoute.operatorName,
      originCity: activeBookingRoute.originCity,
      originCode: activeBookingRoute.originCode,
      destinationCity: activeBookingRoute.destinationCity,
      destinationCode: activeBookingRoute.destinationCode,
      departureTime: activeBookingRoute.departureTime,
      arrivalTime: activeBookingRoute.arrivalTime,
      durationMinutes: activeBookingRoute.durationMinutes,
      travelDate,
      selectedClass: activeBookingRoute.selectedClass,
      coachNumber,
      seatNumber,
      passengerName: passengerForm.name,
      passengerAge: passengerForm.age,
      passengerGender: passengerForm.gender,
      berthPreference: passengerForm.berthPref,
      totalPrice: activeBookingRoute.selectedClass.price,
      currency,
      status: 'CONFIRMED',
      bookingDate: new Date().toISOString()
    };

    setConfirmedTicket(newBooking);
    setActiveBookingRoute(null);
    onBookingSuccess(newBooking);
  };

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 24px 80px 24px' }}>
      {/* Hero Transit Search Header */}
      <div style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        margin: '24px 0 32px 0',
        padding: '40px 32px',
        background: 'linear-gradient(135deg, rgba(9, 15, 29, 0.96) 0%, rgba(17, 26, 51, 0.95) 100%)',
        border: '1px solid rgba(0, 230, 118, 0.25)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(0, 230, 118, 0.15)',
              border: '1px solid rgba(0, 230, 118, 0.35)',
              color: '#00e676',
              padding: '5px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 12
            }}>
              <Train size={14} /> HIGH-SPEED RAIL & LUXURY BUS TRANSIT
            </div>

            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
              Book Vande Bharat & <span style={{ color: '#00e676' }}>Volvo 9600 Sleeper Coaches</span>
            </h1>
            <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 8 }}>
              Compare express rail routes & multi-axle luxury sleeper buses with live seat availability and instant PNR issuance.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div style={{ display: 'flex', gap: 8, background: 'rgba(0, 0, 0, 0.4)', padding: 6, borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              onClick={() => setTransitType('ALL')}
              style={{
                background: transitType === 'ALL' ? 'linear-gradient(135deg, #00e676, #00b0ff)' : 'transparent',
                color: transitType === 'ALL' ? '#090f1d' : '#cbd5e1',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              All Transit
            </button>
            <button
              onClick={() => setTransitType('TRAIN')}
              style={{
                background: transitType === 'TRAIN' ? 'linear-gradient(135deg, #00e676, #00b0ff)' : 'transparent',
                color: transitType === 'TRAIN' ? '#090f1d' : '#cbd5e1',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🚆 Trains Only
            </button>
            <button
              onClick={() => setTransitType('BUS')}
              style={{
                background: transitType === 'BUS' ? 'linear-gradient(135deg, #f5af19, #e65c00)' : 'transparent',
                color: transitType === 'BUS' ? '#fff' : '#cbd5e1',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🚌 Buses Only
            </button>
            {onClose && (
              <button
                onClick={onClose}
                style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none', borderRadius: 10, width: 32, cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search Controls Panel */}
        <div className="glass-card" style={{ marginTop: 24, padding: 24, background: 'rgba(9, 15, 29, 0.85)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'center' }}>
            {/* From */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <MapPin size={14} color="#00e676" /> From (City or Station)
              </label>
              <input
                type="text"
                placeholder="e.g. New Delhi, Mumbai, Bengaluru"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Swap */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 16 }}>
              <button
                type="button"
                onClick={handleSwap}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#00e676',
                  cursor: 'pointer',
                  fontWeight: 800
                }}
              >
                ⇄
              </button>
            </div>

            {/* To */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <MapPin size={14} color="#00e676" /> To (City or Station)
              </label>
              <input
                type="text"
                placeholder="e.g. Goa, Mumbai, Chennai"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Journey Date */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Calendar size={14} color="#00e676" /> Departure Date
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Quick Hub Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Popular Hubs:</span>
            {TRANSIT_STATIONS.slice(0, 6).map(st => (
              <button
                key={st.code}
                onClick={() => {
                  if (!originCity) setOriginCity(st.city);
                  else if (!destinationCity && originCity !== st.city) setDestinationCity(st.city);
                  else setOriginCity(st.city);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  cursor: 'pointer'
                }}
              >
                {st.city} ({st.code})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>Available Express & Luxury Transit Services</span>
            <span style={{ fontSize: 12, background: 'rgba(0, 230, 118, 0.15)', color: '#00e676', padding: '2px 10px', borderRadius: 12, border: '1px solid rgba(0, 230, 118, 0.3)' }}>
              {filteredRoutes.length} Schedules
            </span>
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Showing real-time availability and confirmed seat allocation</p>
        </div>
      </div>

      {/* Route Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filteredRoutes.map(route => {
          const isTrain = route.transitType === 'TRAIN';
          const selectedClassId = selectedClassMap[route.id] || route.classes[0]?.id;
          const currentClass = route.classes.find(c => c.id === selectedClassId) || route.classes[0];
          const displayPrice = convertPrice(currentClass.price);

          return (
            <div key={route.id} className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Card Header: Operator & Rating */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: isTrain ? 'rgba(0, 230, 118, 0.15)' : 'rgba(245, 175, 25, 0.15)',
                    color: isTrain ? '#00e676' : '#f5af19',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22
                  }}>
                    {isTrain ? '🚆' : '🚌'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: isTrain ? 'rgba(0, 230, 118, 0.2)' : 'rgba(245, 175, 25, 0.2)',
                        color: isTrain ? '#00e676' : '#f5af19',
                        letterSpacing: 0.5
                      }}>
                        {route.operatorName}
                      </span>
                      <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>#{route.serviceNumber}</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 2 }}>{route.serviceName}</h3>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', color: '#f5af19', fontWeight: 700, fontSize: 13 }}>
                    <Star size={14} fill="#f5af19" />
                    <span>{route.rating}</span>
                    <span style={{ color: '#94a3b8', fontWeight: 400 }}>({route.reviewsCount})</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{route.distanceKm} km • Max {route.speedMaxKmh} km/h</div>
                </div>
              </div>

              {/* Route Schedule Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: 16,
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '16px 20px',
                borderRadius: 14,
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{route.departureTime}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1' }}>{route.originCity}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{route.originCode}</div>
                </div>

                <div style={{ textAlign: 'center', padding: '0 12px' }}>
                  <div style={{ fontSize: 12, color: '#00e676', fontWeight: 700, marginBottom: 4 }}>
                    {Math.floor(route.durationMinutes / 60)}h {route.durationMinutes % 60}m
                  </div>
                  <div style={{ width: 140, height: 2, background: 'linear-gradient(to right, #00e676, #00b0ff)', position: 'relative', margin: '0 auto' }}>
                    <div style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#090f1d', border: '2px solid #00e676' }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>Runs: {route.runsOnDays.join(', ')}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{route.arrivalTime}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1' }}>{route.destinationCity}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{route.destinationCode}</div>
                </div>
              </div>

              {/* Amenities tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {route.features.map((feat, idx) => (
                  <span key={idx} style={{ fontSize: 11, background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={12} color="#00e676" /> {feat}
                  </span>
                ))}
              </div>

              {/* Class Buttons & Booking Action Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {/* Class selector */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {route.classes.map(cls => {
                    const isSel = cls.id === selectedClassId;
                    const classP = convertPrice(cls.price);
                    return (
                      <button
                        key={cls.id}
                        onClick={() => handleSelectClass(route.id, cls.id)}
                        style={{
                          background: isSel ? 'rgba(0, 230, 118, 0.15)' : 'rgba(0, 0, 0, 0.4)',
                          border: isSel ? '1px solid #00e676' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          padding: '8px 14px',
                          borderRadius: 10,
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 700, color: isSel ? '#00e676' : '#cbd5e1' }}>{cls.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#f5af19' }}>{currencySymbol}{classP.toLocaleString()}</span>
                          <span style={{ fontSize: 10, color: '#00e676' }}>● {cls.availableSeats} seats left</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Price & Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Total per passenger</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#f5af19' }}>{currencySymbol}{displayPrice.toLocaleString()}</div>
                  </div>

                  <button
                    onClick={() => handleStartBooking(route)}
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, #00e676, #00b0ff)', color: '#090f1d', fontWeight: 800, padding: '12px 24px' }}
                  >
                    <span>Book Instant</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Passenger Details Booking Modal Overlay */}
      {activeBookingRoute && (
        <div className="modal-overlay" onClick={() => setActiveBookingRoute(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 14, marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Passenger Details & Seat Selection</h3>
              <button onClick={() => setActiveBookingRoute(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: 'rgba(0, 230, 118, 0.1)', border: '1px solid rgba(0, 230, 118, 0.25)', padding: 14, borderRadius: 12, marginBottom: 18, fontSize: 13 }}>
              <div style={{ fontWeight: 800, color: '#00e676' }}>{activeBookingRoute.serviceName} ({activeBookingRoute.serviceNumber})</div>
              <div style={{ color: '#cbd5e1', marginTop: 2 }}>{activeBookingRoute.originCity} ➔ {activeBookingRoute.destinationCity} • {travelDate}</div>
              <div style={{ color: '#94a3b8', marginTop: 2 }}>Class: <strong style={{ color: '#fff' }}>{activeBookingRoute.selectedClass?.name}</strong></div>
            </div>

            <form onSubmit={handleConfirmTransitBooking} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: 6 }}>Full Name (Govt ID Match)</label>
                <input
                  type="text"
                  required
                  value={passengerForm.name}
                  onChange={(e) => setPassengerForm({ ...passengerForm, name: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: 6 }}>Age</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={passengerForm.age}
                    onChange={(e) => setPassengerForm({ ...passengerForm, age: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: 6 }}>Gender</label>
                  <select
                    value={passengerForm.gender}
                    onChange={(e) => setPassengerForm({ ...passengerForm, gender: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: 6 }}>Berth / Seat Preference</label>
                <select
                  value={passengerForm.berthPref}
                  onChange={(e) => setPassengerForm({ ...passengerForm, berthPref: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option>Window / Lower Berth</option>
                  <option>Upper Berth (Quiet)</option>
                  <option>Aisle / Middle</option>
                  <option>No Preference</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Total Amount:</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#f5af19' }}>
                    {currencySymbol}{convertPrice(activeBookingRoute.selectedClass.price).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={() => setActiveBookingRoute(null)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #00e676, #00b0ff)', color: '#090f1d', fontWeight: 800 }}>
                    Pay & Issue PNR
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmed E-Ticket Voucher Modal */}
      {confirmedTicket && (
        <TransitTicketModal
          booking={confirmedTicket}
          onClose={() => setConfirmedTicket(null)}
          currency={currency}
          currencyRates={currencyRates}
        />
      )}
    </div>
  );
}
