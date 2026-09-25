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
      padding: '24px',
      marginBottom: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Highlight Ribbon for Cheapest or Fastest + Wishlist Heart */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {isCheapest && (
            <span className="badge-cheapest">
              🏷️ Cheapest Available
            </span>
          )}
          {isFastest && (
            <span className="badge-fastest">
              ⚡ Fastest Flight ({formatDuration(flight.durationMinutes)})
            </span>
          )}
        {flight.stops === 0 ? (
          <span style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#cbd5e1',
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 20
          }}>
            Direct Non-stop
          </span>
        ) : (
          <span style={{
            background: 'rgba(245, 175, 25, 0.15)',
            color: '#f5af19',
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 20
          }}>
            {flight.stops} Stop Layover
          </span>
        )}
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
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Heart size={18} fill={isSaved ? '#ff5252' : 'none'} />
        </button>
      </div>

      {/* Main Card Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
        alignItems: 'center'
      }}>
        {/* Airline Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: flight.airlineColor || '#0052cc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 16,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            {flight.airlineCode}
          </div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
          {/* Departure */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
              {flight.departureTime}
            </div>
            <div style={{ fontSize: 13, color: '#00d2ff', fontWeight: 700 }}>
              {flight.originCode}
            </div>
          </div>

          {/* Flight Path Line */}
          <div style={{ textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
              {formatDuration(flight.durationMinutes)}
            </div>
            <div style={{
              position: 'relative',
              height: 2,
              background: 'linear-gradient(90deg, #00d2ff, #f5af19)',
              margin: '0 8px'
            }}>
              <Plane size={14} color="#00d2ff" style={{
                position: 'absolute',
                top: -6,
                left: '50%',
                transform: 'translateX(-50%)'
              }} />
            </div>
            <div style={{ fontSize: 10, color: flight.stops === 0 ? '#00e676' : '#f5af19', fontWeight: 600, marginTop: 4 }}>
              {flight.stops === 0 ? 'Non-Stop' : `${flight.stops} Stop`}
            </div>
          </div>

          {/* Arrival */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
              {flight.arrivalTime}
            </div>
            <div style={{ fontSize: 13, color: '#00d2ff', fontWeight: 700 }}>
              {flight.destinationCode}
            </div>
          </div>
        </div>

        {/* Baggage & Policy Badges (Feature 7) */}
        <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Briefcase size={14} color="#00d2ff" />
            <span>Cabin: <strong>{flight.cabinBaggageKg} kg</strong> | Checked: <strong>{flight.checkedBaggageKg} kg</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {flight.refundable ? (
              <span style={{ color: '#00e676', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} /> Free Cancellation Available
              </span>
            ) : (
              <span style={{ color: '#f5af19', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Info size={13} /> Non-Refundable
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
              width: 'fit-content'
            }}
          >
            View Fare & Baggage Rules
          </button>
        </div>

        {/* Pricing & Booking Button */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Total per traveler
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
              {currencySymbol}{convertPrice(flight.basePrice).toLocaleString()}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectFlight(flight)}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: 14 }}
          >
            Select Seats & Book
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
