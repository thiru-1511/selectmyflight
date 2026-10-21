import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plane, 
  Calendar, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  QrCode, 
  Clock, 
  RefreshCw, 
  Edit3, 
  Luggage,
  Sparkles
} from 'lucide-react';

export default function ManageBookingModal({ 
  isOpen, 
  onClose, 
  onViewETicket, 
  onTrackRefund, 
  currency = 'INR' 
}) {
  const [pnrInput, setPnrInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [searchError, setSearchError] = useState(null);
  const [foundBooking, setFoundBooking] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newTravelDate, setNewTravelDate] = useState('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);
  const [webCheckedIn, setWebCheckedIn] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (amount) => {
    if (currency === 'USD') return `$${Math.round(amount / 83)}`;
    if (currency === 'EUR') return `€${Math.round(amount / 90)}`;
    if (currency === 'GBP') return `£${Math.round(amount / 105)}`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleLookup = (e) => {
    if (e) e.preventDefault();
    setSearchError(null);
    setRescheduleSuccess(false);

    const cleanPnr = pnrInput.trim().toUpperCase();
    if (!cleanPnr) {
      setSearchError('Please enter a valid 6-character PNR reference.');
      return;
    }

    try {
      const savedBookings = JSON.parse(localStorage.getItem('smf_bookings') || '[]');
      
      // Look for match in localStorage
      let match = savedBookings.find(b => b.pnr && b.pnr.toUpperCase() === cleanPnr);

      // Fallback demo bookings if not found in custom list
      if (!match) {
        if (cleanPnr === 'SMF901') {
          match = {
            id: 901,
            pnr: 'SMF901',
            flightNumber: '6E-2041',
            airlineName: 'IndiGo',
            airlineCode: '6E',
            originCode: 'DEL',
            destinationCode: 'BOM',
            originCity: 'New Delhi',
            destinationCity: 'Mumbai',
            departureDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
            departureTime: '06:00',
            arrivalTime: '08:15',
            cabinClass: 'Economy',
            terminal: 'Terminal 3',
            gate: 'Gate B14',
            seatNumber: '04B (Window)',
            passengers: [
              { name: 'Rahul Sharma', seatNumber: '04B', type: 'Adult' }
            ],
            totalAmount: 6450,
            status: 'CONFIRMED',
            contactEmail: 'rahul.sharma@gmail.com',
            contactPhone: '+91 98765 43210'
          };
        } else if (cleanPnr === 'SMF204') {
          match = {
            id: 204,
            pnr: 'SMF204',
            flightNumber: 'EK-511',
            airlineName: 'Emirates',
            airlineCode: 'EK',
            originCode: 'DEL',
            destinationCode: 'DXB',
            originCity: 'New Delhi',
            destinationCity: 'Dubai',
            departureDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
            departureTime: '04:15',
            arrivalTime: '06:50',
            cabinClass: 'Business',
            terminal: 'Terminal 3',
            gate: 'Gate A08',
            seatNumber: '02A (Suite)',
            passengers: [
              { name: 'Thiru Selvan', seatNumber: '02A', type: 'Adult' }
            ],
            totalAmount: 18500,
            status: 'CONFIRMED',
            contactEmail: 'thiru1511@gmail.com',
            contactPhone: '+91 98765 43210'
          };
        }
      }

      if (match) {
        setFoundBooking(match);
        setWebCheckedIn(match.webCheckedIn || false);
      } else {
        setSearchError(`No booking found matching PNR "${cleanPnr}". Try quick demo PNR: SMF901 or SMF204`);
        setFoundBooking(null);
      }
    } catch (err) {
      setSearchError('Error loading booking data. Please try again.');
    }
  };

  const handleWebCheckIn = () => {
    if (!foundBooking) return;
    setWebCheckedIn(true);
    foundBooking.webCheckedIn = true;
    foundBooking.boardingZone = 'Zone 1 (Priority)';

    try {
      const savedBookings = JSON.parse(localStorage.getItem('smf_bookings') || '[]');
      const idx = savedBookings.findIndex(b => b.pnr === foundBooking.pnr);
      if (idx >= 0) {
        savedBookings[idx].webCheckedIn = true;
        savedBookings[idx].boardingZone = 'Zone 1 (Priority)';
        localStorage.setItem('smf_bookings', JSON.stringify(savedBookings));
      }
      window.dispatchEvent(new Event('smf_data_updated'));
    } catch {
      // ignore
    }

    alert(`✅ Web Check-In Completed for PNR ${foundBooking.pnr}!\n\nSeat ${foundBooking.seatNumber || '04B'} confirmed.\nBoarding Pass issued with Zone 1 Priority.`);
  };

  const handleConfirmReschedule = (e) => {
    e.preventDefault();
    if (!newTravelDate || !foundBooking) return;

    foundBooking.departureDate = newTravelDate;
    setRescheduleSuccess(true);
    setIsRescheduling(false);

    try {
      const savedBookings = JSON.parse(localStorage.getItem('smf_bookings') || '[]');
      const idx = savedBookings.findIndex(b => b.pnr === foundBooking.pnr);
      if (idx >= 0) {
        savedBookings[idx].departureDate = newTravelDate;
        localStorage.setItem('smf_bookings', JSON.stringify(savedBookings));
      }
      window.dispatchEvent(new Event('smf_data_updated'));
    } catch {
      // ignore
    }

    alert(`🔄 Travel Date Modified!\n\nYour flight ${foundBooking.flightNumber} has been rescheduled to ${newTravelDate}. A revised confirmation e-ticket has been generated.`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(9, 15, 29, 0.98)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(0, 210, 255, 0.15)', color: '#00d2ff', padding: 8, borderRadius: 8 }}>
              <Plane size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                Manage Booking & Web Check-In
              </h3>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                Retrieve your reservation, print boarding pass, modify dates, or check in
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
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
          {/* Lookup Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 14,
            padding: 18,
            marginBottom: 20
          }}>
            <form onSubmit={handleLookup}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                    PNR / Booking Reference
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SMF901"
                    value={pnrInput}
                    onChange={(e) => setPnrInput(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(0, 210, 255, 0.3)',
                      color: '#00d2ff',
                      fontWeight: 800,
                      padding: '10px 12px',
                      borderRadius: 8,
                      fontSize: 14,
                      letterSpacing: 1
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                    Last Name or Email (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma or email"
                    value={lastNameInput}
                    onChange={(e) => setLastNameInput(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '10px 12px',
                      borderRadius: 8,
                      fontSize: 13
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Test Demo PNRs:</span>
                  {['SMF901', 'SMF204'].map(demo => (
                    <button
                      key={demo}
                      type="button"
                      onClick={() => {
                        setPnrInput(demo);
                        setTimeout(() => {
                          const event = new Event('submit', { bubbles: true, cancelable: true });
                          document.querySelector('form')?.dispatchEvent(event);
                        }, 50);
                      }}
                      style={{
                        background: 'rgba(0, 210, 255, 0.12)',
                        border: '1px solid rgba(0, 210, 255, 0.3)',
                        color: '#00d2ff',
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {demo}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                    color: '#fff',
                    border: 'none',
                    padding: '9px 20px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Search size={14} /> Find Booking
                </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {searchError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 12,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <AlertCircle size={15} />
              <span>{searchError}</span>
            </div>
          )}

          {/* Found Booking Card */}
          {foundBooking && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(0, 210, 255, 0.35)',
              borderRadius: 16,
              padding: 20,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
            }}>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 14, marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    BOOKING CONFIRMED
                  </span>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#00d2ff', letterSpacing: 1 }}>
                    PNR: {foundBooking.pnr}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    background: webCheckedIn ? 'rgba(0, 230, 118, 0.18)' : 'rgba(0, 210, 255, 0.15)',
                    color: webCheckedIn ? '#00e676' : '#00d2ff',
                    border: webCheckedIn ? '1px solid #00e676' : '1px solid #00d2ff',
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    {webCheckedIn ? '✓ WEB CHECKED-IN' : 'CONFIRMED'}
                  </span>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
                    {foundBooking.airlineName} ({foundBooking.flightNumber})
                  </div>
                </div>
              </div>

              {/* Route & Timing Spec */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{foundBooking.originCode}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{foundBooking.originCity || 'Departure'}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#00d2ff', marginTop: 4 }}>{foundBooking.departureTime}</div>
                </div>

                <div style={{ textAlign: 'center', flex: 1, padding: '0 16px' }}>
                  <div style={{ fontSize: 11, color: '#f5af19', fontWeight: 700, marginBottom: 4 }}>
                    {foundBooking.departureDate}
                  </div>
                  <div style={{ height: 2, background: 'linear-gradient(to right, #00d2ff, #f5af19)', position: 'relative' }}>
                    <Plane size={14} color="#00d2ff" style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)' }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Non-Stop Scheduled Flight</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{foundBooking.destinationCode}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{foundBooking.destinationCity || 'Arrival'}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#00d2ff', marginTop: 4 }}>{foundBooking.arrivalTime}</div>
                </div>
              </div>

              {/* Passenger & Airport Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 10,
                padding: '10px',
                marginBottom: 20
              }}>
                <div>
                  <span style={{ fontSize: 9, color: '#64748b', display: 'block' }}>PRIMARY PASSENGER</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                    {foundBooking.passengers && foundBooking.passengers[0] ? foundBooking.passengers[0].name : 'Primary Traveler'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 9, color: '#64748b', display: 'block' }}>SEAT ASSIGNMENT</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#00e676' }}>
                    {foundBooking.seatNumber || (foundBooking.passengers && foundBooking.passengers[0]?.seatNumber) || '04B (Window)'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 9, color: '#64748b', display: 'block' }}>TERMINAL / GATE</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>
                    {foundBooking.terminal || 'T3'} • {foundBooking.gate || 'B14'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 9, color: '#64748b', display: 'block' }}>CABIN CLASS</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#00d2ff' }}>
                    {foundBooking.cabinClass || 'Economy'}
                  </span>
                </div>
              </div>

              {/* Action 1: Reschedule Date Section */}
              {isRescheduling ? (
                <form onSubmit={handleConfirmReschedule} style={{ background: 'rgba(245, 175, 25, 0.08)', border: '1px solid rgba(245, 175, 25, 0.3)', padding: 14, borderRadius: 10, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#f5af19', marginBottom: 6 }}>
                    Select New Departure Date
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={newTravelDate}
                      onChange={(e) => setNewTravelDate(e.target.value)}
                      style={{ flex: 1, background: '#111a33', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: 8, fontSize: 13 }}
                    />
                    <button
                      type="submit"
                      style={{ background: '#f5af19', color: '#090f1d', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                    >
                      Confirm Reschedule (+₹1,000 fee)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(false)}
                      style={{ background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}

              {/* 4 Action Buttons Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                {/* 1. View E-Ticket */}
                <button
                  type="button"
                  onClick={() => {
                    if (onViewETicket) onViewETicket(foundBooking);
                    onClose();
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <FileText size={14} /> E-Ticket (PDF)
                </button>

                {/* 2. Web Check-In */}
                <button
                  type="button"
                  onClick={handleWebCheckIn}
                  disabled={webCheckedIn}
                  style={{
                    background: webCheckedIn ? 'rgba(0, 230, 118, 0.15)' : 'linear-gradient(135deg, #00e676, #00b0ff)',
                    color: webCheckedIn ? '#00e676' : '#090f1d',
                    border: webCheckedIn ? '1px solid #00e676' : 'none',
                    padding: '10px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: webCheckedIn ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <QrCode size={14} /> {webCheckedIn ? 'Checked In' : 'Web Check-In'}
                </button>

                {/* 3. Reschedule Flight */}
                <button
                  type="button"
                  onClick={() => setIsRescheduling(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    padding: '10px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <Calendar size={14} /> Change Date
                </button>

                {/* 4. Cancel & Refund */}
                <button
                  type="button"
                  onClick={() => {
                    const refundAmt = Math.max(0, (foundBooking.totalAmount || 6450) - 1500);
                    if (window.confirm(`Cancel flight ${foundBooking.flightNumber} (PNR: ${foundBooking.pnr})?\n\nEstimated Refund: ${formatPrice(refundAmt)} (after ₹1,500 airline fee)`)) {
                      foundBooking.status = 'CANCELLED';
                      if (onTrackRefund) {
                        onTrackRefund(foundBooking.pnr, refundAmt);
                      }
                      onClose();
                    }
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '10px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <RefreshCw size={14} /> Cancel & Refund
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
