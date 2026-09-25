import React, { useState } from 'react';
import { X, CheckCircle2, Download, Printer, FileText, QrCode, Plane, ShieldCheck } from 'lucide-react';

export default function ETicketModal({ booking, currency, onClose, onViewMyTrips }) {
  const [showInvoice, setShowInvoice] = useState(Boolean(booking?.initialShowInvoice));
  if (!booking) return null;

  const { flight, passengers, pnr, travelDate, gate, terminal, totalAmount, discountAmount, paymentMethod } = booking;
  const passenger = passengers && passengers.length > 0 ? passengers[0] : { title: 'Mr', firstName: 'Traveler', lastName: '', seatNumber: '04A', mealPreference: 'Standard' };

  const convertPrice = (inrPrice) => (currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice);
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 740 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.1), rgba(0, 210, 255, 0.05))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(0, 230, 118, 0.2)', color: '#00e676', padding: 6, borderRadius: '50%' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                {showInvoice ? 'Official Tax Invoice & Receipt' : 'E-Ticket & Digital Boarding Pass'}
              </h3>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                PNR: <strong style={{ color: '#00d2ff' }}>{pnr}</strong> • SelectMyFlight Verified
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setShowInvoice(!showInvoice)}
              style={{
                background: showInvoice ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: showInvoice ? '#00d2ff' : '#cbd5e1',
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <FileText size={14} />
              {showInvoice ? 'View Boarding Pass' : 'View Tax Invoice'}
            </button>

            <button
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
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {!showInvoice ? (
            /* Boarding Pass View */
            <div style={{
              background: 'linear-gradient(135deg, #16223f 0%, #0d1527 100%)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
              {/* Header Bar */}
              <div style={{
                background: 'linear-gradient(90deg, #00d2ff, #3a7bd5)',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#090f1d'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800 }}>
                  <Plane size={18} style={{ transform: 'rotate(-45deg)' }} />
                  <span>SelectMyFlight FastTrack Pass</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>
                  PNR: {pnr}
                </div>
              </div>

              {/* Route & Times */}
              <div style={{ padding: '20px', borderBottom: '1px dashed rgba(255, 255, 255, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>ORIGIN</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{flight.originCode}</div>
                    <div style={{ fontSize: 13, color: '#00d2ff' }}>{flight.departureTime}</div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{Math.floor(flight.durationMinutes / 60)}h {flight.durationMinutes % 60}m</div>
                    <div style={{ width: 100, height: 2, background: '#00d2ff', position: 'relative', margin: '4px auto' }}>
                      <Plane size={12} color="#00d2ff" style={{ position: 'absolute', top: -5, left: '45%' }} />
                    </div>
                    <div style={{ fontSize: 10, color: '#00e676', fontWeight: 700 }}>NON-STOP</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>DESTINATION</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{flight.destinationCode}</div>
                    <div style={{ fontSize: 13, color: '#00d2ff' }}>{flight.arrivalTime}</div>
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, background: 'rgba(255, 255, 255, 0.02)' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>PASSENGER</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{passenger.title} {passenger.firstName} {passenger.lastName}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>SEAT</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#00d2ff' }}>{passenger.seatNumber || '04A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>GATE / TERMINAL</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{gate || 'T3-B14'} ({terminal || 'T3'})</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>DATE</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{travelDate}</div>
                </div>
              </div>

              {/* Barcode / QR */}
              <div style={{ padding: '14px 20px', borderTop: '1px dashed rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[3, 1, 4, 2, 5, 2, 1, 4, 3, 2, 5, 1, 3, 4, 2, 1, 3, 5, 2, 4, 1].map((w, i) => (
                    <div key={i} style={{ width: w, height: 32, background: '#00d2ff', opacity: 0.8 }} />
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <QrCode size={30} color="#00d2ff" />
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>Scan for automated baggage & security</div>
                </div>
              </div>
            </div>
          ) : (
            /* Tax Invoice View */
            <div style={{
              background: '#0d1527',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 12,
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 16, marginBottom: 16 }}>
                <div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>TAX INVOICE / RECEIPT</h4>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Invoice No: INV-2026-{pnr} • GSTIN: 07AAACS9821L1Z4</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, color: '#cbd5e1' }}>
                  <div>SelectMyFlight Technologies Ltd.</div>
                  <div style={{ color: '#94a3b8', fontSize: 11 }}>Date: {new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Passenger & Billing Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18, fontSize: 12 }}>
                <div>
                  <div style={{ color: '#94a3b8' }}>Billed To:</div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{passenger.title} {passenger.firstName} {passenger.lastName}</div>
                  <div style={{ color: '#cbd5e1' }}>{booking.contactEmail}</div>
                  <div style={{ color: '#cbd5e1' }}>{booking.contactPhone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#94a3b8' }}>Payment Reference:</div>
                  <div style={{ fontWeight: 700, color: '#00e676' }}>Status: PAID IN FULL</div>
                  <div style={{ color: '#cbd5e1' }}>Method: {paymentMethod || 'Razorpay UPI'}</div>
                  <div style={{ color: '#00d2ff', fontSize: 11, fontFamily: 'monospace' }}>Razorpay ID: {booking.paymentId || `pay_rzp_${Date.now().toString().slice(-8)}`}</div>
                </div>
              </div>

              {/* Itemized Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'left', color: '#94a3b8' }}>
                    <th style={{ padding: '8px 0' }}>Description</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#cbd5e1' }}>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '8px 0' }}>Airfare ({flight.airlineName} {flight.flightNumber} • {flight.originCode} to {flight.destinationCode})</td>
                    <td style={{ padding: '8px 0', textAlign: 'right' }}>{currencySymbol}{convertPrice(flight.basePrice)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '8px 0' }}>Seat Allocation ({passenger.seatNumber}) & Add-ons</td>
                    <td style={{ padding: '8px 0', textAlign: 'right' }}>{currencySymbol}{convertPrice(Math.max(0, totalAmount - flight.basePrice + (discountAmount || 0)))}</td>
                  </tr>
                  {discountAmount > 0 && (
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#00e676' }}>
                      <td style={{ padding: '8px 0' }}>Promotional Discount Applied</td>
                      <td style={{ padding: '8px 0', textAlign: 'right' }}>-{currencySymbol}{convertPrice(discountAmount)}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ padding: '12px 0', fontWeight: 800, color: '#fff', fontSize: 14 }}>Total Paid (inclusive of all taxes)</td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 800, color: '#00d2ff', fontSize: 16 }}>{currencySymbol}{convertPrice(totalAmount).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ fontSize: 11, color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 10 }}>
                This is a computer-generated tax invoice. No physical signature is required.
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={handlePrint} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: 13 }}>
              <Printer size={15} /> {showInvoice ? 'Print / Download Tax Invoice' : 'Print / Download E-Ticket'}
            </button>
            <button onClick={onViewMyTrips} className="btn-secondary" style={{ flex: 1, padding: '12px', fontSize: 13, justifyContent: 'center' }}>
              <Plane size={15} /> View in My Trips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
