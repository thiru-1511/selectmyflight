import React, { useRef } from 'react';
import { Train, Printer, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export default function TransitTicketModal({ booking, onClose, currency = 'INR', currencyRates = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 } }) {
  const ticketRef = useRef(null);

  if (!booking) return null;

  const rate = currencyRates[currency] || 1;
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const formattedPrice = Math.round(booking.totalPrice * rate).toLocaleString();

  const isTrain = booking.transitType === 'TRAIN';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 680,
          background: '#0d1629',
          border: '1px solid rgba(0, 230, 118, 0.3)',
          borderRadius: 24,
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Top Glow bar */}
        <div style={{ height: 6, width: '100%', background: isTrain ? 'linear-gradient(to right, #00e676, #00b0ff)' : 'linear-gradient(to right, #f5af19, #e65c00)' }} />

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: isTrain ? 'rgba(0, 230, 118, 0.15)' : 'rgba(245, 175, 25, 0.15)',
              color: isTrain ? '#00e676' : '#f5af19',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}>
              {isTrain ? '🚆' : '🚌'}
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                {isTrain ? 'Rail Transit E-Ticket' : 'Luxury Coach Boarding Pass'}
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>PNR #{booking.pnr || 'SMF-TR-982143'} • Instant Confirmed</p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Voucher Body */}
        <div ref={ticketRef} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Main Voucher Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(17, 26, 51, 0.95), rgba(9, 15, 29, 0.95))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 18,
            padding: 20
          }}>
            {/* Operator and PNR row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: isTrain ? 'rgba(0, 230, 118, 0.2)' : 'rgba(245, 175, 25, 0.2)', color: isTrain ? '#00e676' : '#f5af19', textTransform: 'uppercase' }}>
                  {booking.operatorName || (isTrain ? 'Indian Railways' : 'IntrCity SmartBus')}
                </span>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginTop: 6 }}>{booking.serviceName}</h4>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Service #{booking.serviceNumber || 'EXP-2026'}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>PNR Number</span>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: '#00d2ff', letterSpacing: 1 }}>
                  {booking.pnr || 'SMF-982143'}
                </div>
                <span style={{ fontSize: 11, color: '#00e676', fontWeight: 700 }}>● CNF (Confirmed)</span>
              </div>
            </div>

            {/* Route & Timings */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16, padding: '18px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>{booking.originCity}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{booking.departureTime}</div>
                <div style={{ fontSize: 12, color: '#cbd5e1' }}>{booking.originCode}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{booking.travelDate || 'Today'}</div>
              </div>

              <div style={{ textAlign: 'center', padding: '0 12px' }}>
                <div style={{ fontSize: 12, color: '#00d2ff', fontWeight: 700, marginBottom: 4 }}>
                  {booking.durationMinutes ? `${Math.floor(booking.durationMinutes / 60)}h ${booking.durationMinutes % 60}m` : 'Direct Express'}
                </div>
                <div style={{ width: 120, height: 2, background: 'linear-gradient(to right, #00e676, #00d2ff)', position: 'relative', margin: '0 auto' }} />
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Direct Non-Stop</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>{booking.destinationCity}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{booking.arrivalTime}</div>
                <div style={{ fontSize: 12, color: '#cbd5e1' }}>{booking.destinationCode}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{booking.travelDate || 'Today'}</div>
              </div>
            </div>

            {/* Passenger & Berth Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14, paddingTop: 16 }}>
              <div>
                <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Passenger</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', display: 'block', marginTop: 2 }}>{booking.passengerName || 'Primary Traveler'}</span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{booking.passengerAge ? `${booking.passengerAge} yrs • ${booking.passengerGender}` : 'Adult (18+)'}</span>
              </div>

              <div>
                <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Class / Coach</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#00d2ff', display: 'block', marginTop: 2 }}>{booking.selectedClass?.name || 'Executive Car'}</span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Coach: <strong style={{ color: '#fff' }}>{booking.coachNumber || (isTrain ? 'C3' : 'B1')}</strong></span>
              </div>

              <div>
                <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Seat / Berth</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#00e676', display: 'block', marginTop: 2 }}>
                  {booking.seatNumber || (isTrain ? 'Seat 42 (Window)' : 'Lower Berth L4')}
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Status: Confirmed</span>
              </div>

              <div>
                <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Total Fare</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#f5af19', display: 'block', marginTop: 2 }}>
                  {symbol}{formattedPrice}
                </span>
                <span style={{ fontSize: 10, color: '#00e676' }}>● Paid via SelectPay</span>
              </div>
            </div>
          </div>

          {/* Travel Notice */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#cbd5e1' }}>
            <ShieldCheck size={20} color="#00e676" style={{ flexShrink: 0 }} />
            <span>Please carry a valid government-issued photo ID (Aadhaar/Passport). Platform details dispatched via SMS.</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#00e676' }}>
            <CheckCircle2 size={16} /> Digital E-Ticket saved to account
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handlePrint} className="btn-secondary" style={{ padding: '8px 14px', fontSize: 12 }}>
              <Printer size={14} /> Print Ticket
            </button>
            <button onClick={onClose} className="btn-primary" style={{ padding: '8px 20px', fontSize: 12, fontWeight: 800 }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
