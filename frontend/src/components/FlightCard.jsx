import React from 'react';
import { Plane, Clock, Briefcase, Info, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function FlightCard({ flight, isCheapest, isFastest, currency, onSelectFlight, onViewRules, isSaved, onToggleWishlist }) {
  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const convertPrice = (inrPrice) => {
    if (currency === 'USD') return Math.round(inrPrice / 85);
    if (currency === 'EUR') return Math.round(inrPrice / 92);
    if (currency === 'GBP') return Math.round(inrPrice / 108);
    return inrPrice;
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';

  return (
    <div className="glass-card" style={{
      padding: '20px',
      marginBottom: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Header: Badge, Status, & Wishlist Heart */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {isCheapest && (
            <span className="badge-cheapest" style={{ fontSize: 10, padding: '3px 8px' }}>
              🏷️ Cheapest
            </span>
          )}
          {isFastest && (
            <span className="badge-fastest" style={{ fontSize: 10, padding: '3px 8px' }}>
              ⚡ Fastest ({formatDuration(flight.durationMinutes)})
            </span>
          )}
          <span style={{
            background: flight.stops === 0 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(245, 175, 25, 0.15)',
            color: flight.stops === 0 ? '#cbd5e1' : '#f5af19',
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 20
          }}>
            {flight.stops === 0 ? 'Non-Stop' : `${flight.stops} Stop`}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={() => onToggleWishlist(flight)}
          title={isSaved ? "Remove from Saved" : "Save Flight to Wishlist"}
          style={{
            background: isSaved ? 'rgba(255, 82, 82, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: isSaved ? '1px solid #ff5252' : '1px solid rgba(255, 255, 255, 0.15)',
            color: isSaved ? '#ff5252' : '#94a3b8',
            width: 34,
            height: 34,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
        >
          <Heart size={16} fill={isSaved ? '#ff5252' : 'none'} />
        </button>
      </div>

      {/* Main Content (Responsive Flex/Grid) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
        alignItems: 'center'
      }}>
        {/* Airline Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: flight.airlineColor || '#0052cc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 15,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            flexShrink: 0
          }}>
            {flight.airlineCode}
          </div>
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>
              {flight.airlineName}
            </h4>
            <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span>{flight.flightNumber}</span>
              <span>•</span>
              <span>{flight.aircraftModel}</span>
            </div>
          </div>
        </div>

        {/* Schedule & Times */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '10px 14px',
          borderRadius: 10
        }}>
          {/* Departure */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
              {flight.departureTime}
            </div>
            <div style={{ fontSize: 12, color: '#00d2ff', fontWeight: 700 }}>
              {flight.originCode}
            </div>
          </div>

          {/* Flight Path Line */}
          <div style={{ textAlign: 'center', flex: 1, padding: '0 8px' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 2 }}>
              {formatDuration(flight.durationMinutes)}
            </div>
            <div style={{
              position: 'relative',
              height: 2,
              background: 'linear-gradient(90deg, #00d2ff, #f5af19)',
              margin: '0 auto'
            }}>
              <Plane size={12} color="#00d2ff" style={{
                position: 'absolute',
                top: -5,
                left: '50%',
                transform: 'translateX(-50%)'
              }} />
            </div>
            <div style={{ fontSize: 10, color: flight.stops === 0 ? '#00e676' : '#f5af19', fontWeight: 600, marginTop: 2 }}>
              {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}
            </div>
          </div>

          {/* Arrival */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
              {flight.arrivalTime}
            </div>
            <div style={{ fontSize: 12, color: '#00d2ff', fontWeight: 700 }}>
              {flight.destinationCode}
            </div>
          </div>
        </div>

        {/* Baggage & Policies */}
        <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Briefcase size={13} color="#00d2ff" />
            <span>Cabin: <strong>{flight.cabinBaggageKg}kg</strong> | Check-in: <strong>{flight.checkedBaggageKg}kg</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {flight.refundable ? (
              <span style={{ color: '#00e676', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                <CheckCircle2 size={12} /> Free Cancellation Available
              </span>
            ) : (
              <span style={{ color: '#f5af19', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                <Info size={12} /> Non-Refundable
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onViewRules(flight)}
            style={{
              background: 'none',
              border: 'none',
              color: '#00d2ff',
              fontSize: 11,
              textAlign: 'left',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
              marginTop: 2
            }}
          >
            Fare & Baggage Rules
          </button>
        </div>

        {/* Pricing & Booking Button (Clear & Full-Width on Mobile) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 12
        }}>
          <div>
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Per Traveler
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
              {currencySymbol}{convertPrice(flight.basePrice).toLocaleString()}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectFlight(flight)}
            className="btn-primary"
            style={{
              minHeight: 44,
              padding: '10px 18px',
              fontSize: 14,
              fontWeight: 700,
              flex: '1 1 auto',
              maxWidth: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <span>Select Seats</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
