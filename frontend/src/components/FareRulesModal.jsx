import React from 'react';
import { X, Briefcase, RefreshCw, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function FareRulesModal({ flight, currency, onClose }) {
  if (!flight) return null;

  const convertPrice = (inrPrice) => {
    return currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice;
  };
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
              🧳 Baggage & Fare Policies
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>
              Flight {flight.airlineName} {flight.flightNumber} • {flight.cabinClass}
            </p>
          </div>
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

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Baggage Allowances */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#00d2ff', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={16} /> Baggage Allowances (Included in Fare)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: '14px'
              }}>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Cabin Baggage (Carry-on)</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                  {flight.cabinBaggageKg} KG
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>1 piece (max 55 x 35 x 25 cm) + 1 laptop bag</div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: '14px'
              }}>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Checked Baggage</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                  {flight.checkedBaggageKg} KG
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Standard check-in allowance included</div>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#00d2ff', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RefreshCw size={16} /> Cancellation & Date Change Conditions
            </h4>
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 10,
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontSize: 13
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1' }}>Cancellation Fee (up to 24h before flight):</span>
                <strong style={{ color: flight.refundable ? '#fff' : '#f5af19' }}>
                  {flight.refundable ? `${currencySymbol}${convertPrice(flight.cancellationFee)}` : 'Non-Refundable'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1' }}>Date Change / Rescheduling Fee:</span>
                <strong style={{ color: '#fff' }}>
                  {currencySymbol}{convertPrice(flight.changeFee)} + fare difference
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1' }}>Refund Processing Speed:</span>
                <strong style={{ color: '#00e676' }}>Instant via My Trips dashboard</strong>
              </div>
            </div>
          </div>

          {/* Transparent Guarantee */}
          <div style={{
            background: 'rgba(0, 230, 118, 0.08)',
            border: '1px solid rgba(0, 230, 118, 0.25)',
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <CheckCircle2 size={20} color="#00e676" />
            <div style={{ fontSize: 12, color: '#cbd5e1' }}>
              <strong>SelectMyFlight Transparency Guarantee:</strong> All airport government taxes and passenger service fees are already included in your ticket price. No checkout surprises.
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 24px' }}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
