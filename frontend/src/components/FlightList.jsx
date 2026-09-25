import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Tag, Zap, Filter, Check } from 'lucide-react';
import FlightCard from './FlightCard';

export default function FlightList({ flights = [], currency, onSelectFlight, onViewRules, wishlist = [], onToggleWishlist }) {
  // Advanced Filter States (Feature 5)
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedStops, setSelectedStops] = useState('all'); // 'all', '0', '1'
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [departureSlot, setDepartureSlot] = useState('all'); // 'all', 'morning', 'afternoon', 'evening'
  const [sortBy, setSortBy] = useState('price_asc'); // 'price_asc', 'duration_asc', 'departure_asc'

  const safeFlights = useMemo(() => Array.isArray(flights) ? flights : [], [flights]);

  // Extract unique airlines
  const airlines = useMemo(() => {
    const map = new Map();
    safeFlights.forEach(f => {
      map.set(f.airlineName, (map.get(f.airlineName) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [safeFlights]);

  // Identify Cheapest and Fastest flights (Feature 2)
  const cheapestFlight = useMemo(() => {
    if (safeFlights.length === 0) return null;
    return [...safeFlights].sort((a, b) => a.basePrice - b.basePrice)[0];
  }, [safeFlights]);

  const fastestFlight = useMemo(() => {
    if (safeFlights.length === 0) return null;
    return [...safeFlights].sort((a, b) => a.durationMinutes - b.durationMinutes)[0];
  }, [safeFlights]);

  // Filtered and Sorted Flights
  const filteredFlights = useMemo(() => {
    return safeFlights.filter(f => {
      // Price filter
      if (f.basePrice > maxPrice) return false;

      // Stops filter
      if (selectedStops !== 'all' && f.stops !== parseInt(selectedStops)) return false;

      // Airline filter
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airlineName)) return false;

      // Refundable filter
      if (refundableOnly && !f.refundable) return false;

      // Departure time slot filter
      if (departureSlot !== 'all') {
        const hour = parseInt(f.departureTime.split(':')[0]);
        if (departureSlot === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (departureSlot === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (departureSlot === 'evening' && hour < 18) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.basePrice - b.basePrice;
      if (sortBy === 'duration_asc') return a.durationMinutes - b.durationMinutes;
      if (sortBy === 'departure_asc') return a.departureTime.localeCompare(b.departureTime);
      return 0;
    });
  }, [safeFlights, maxPrice, selectedStops, selectedAirlines, refundableOnly, departureSlot, sortBy]);

  const toggleAirline = (airline) => {
    setSelectedAirlines(prev =>
      prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]
    );
  };

  const convertPrice = (inrPrice) => {
    return currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice;
  };
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 60px 24px' }}>
      {/* Flight Comparison Header Banner (Feature 2) */}
      <div className="glass-card" style={{
        padding: '18px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        background: 'linear-gradient(135deg, rgba(17, 26, 51, 0.8), rgba(0, 210, 255, 0.08))',
        border: '1px solid rgba(0, 210, 255, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'rgba(0, 210, 255, 0.15)',
            color: '#00d2ff',
            padding: '8px 12px',
            borderRadius: 8,
            fontWeight: 800,
            fontSize: 16
          }}>
            {filteredFlights.length} Flights Found
          </div>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>
            Instant comparison across all airlines with live baggage and refund terms.
          </span>
        </div>

        {/* Quick Highlights */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {cheapestFlight && (
            <div style={{
              background: 'rgba(0, 230, 118, 0.1)',
              border: '1px solid rgba(0, 230, 118, 0.3)',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12
            }}>
              <span style={{ color: '#94a3b8' }}>Cheapest: </span>
              <strong style={{ color: '#00e676' }}>{currencySymbol}{convertPrice(cheapestFlight.basePrice).toLocaleString()}</strong>
              <span style={{ color: '#cbd5e1' }}> ({cheapestFlight.airlineName})</span>
            </div>
          )}
          {fastestFlight && (
            <div style={{
              background: 'rgba(0, 210, 255, 0.1)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12
            }}>
              <span style={{ color: '#94a3b8' }}>Fastest: </span>
              <strong style={{ color: '#00d2ff' }}>
                {Math.floor(fastestFlight.durationMinutes / 60)}h {fastestFlight.durationMinutes % 60}m
              </strong>
              <span style={{ color: '#cbd5e1' }}> ({fastestFlight.airlineName})</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Sorting Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left Filter Sidebar (Feature 5) */}
        <div className="glass-card" style={{ padding: '20px', position: 'sticky', top: 90 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal size={18} color="#00d2ff" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Filter Flights</h3>
            </div>
            <button
              onClick={() => {
                setMaxPrice(50000);
                setSelectedStops('all');
                setSelectedAirlines([]);
                setRefundableOnly(false);
                setDepartureSlot('all');
              }}
              style={{ background: 'none', border: 'none', color: '#00d2ff', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
            >
              Reset All
            </button>
          </div>

          {/* 1. Max Price Range Slider */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>Max Price</span>
              <span style={{ color: '#00d2ff', fontWeight: 700 }}>
                {currencySymbol}{convertPrice(maxPrice).toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="3000"
              max="60000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#00d2ff', cursor: 'pointer' }}
            />
          </div>

          {/* 2. Flight Stops */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>
              Stops
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { label: 'All', value: 'all' },
                { label: 'Non-Stop', value: '0' },
                { label: '1 Stop', value: '1' }
              ].map(stop => (
                <button
                  key={stop.value}
                  onClick={() => setSelectedStops(stop.value)}
                  style={{
                    flex: 1,
                    background: selectedStops === stop.value ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedStops === stop.value ? '#00d2ff' : '#cbd5e1',
                    border: selectedStops === stop.value ? '1px solid rgba(0, 210, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '6px 0',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {stop.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Departure Time Slots */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>
              Departure Time
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { label: 'Anytime', value: 'all' },
                { label: 'Morning (6-12)', value: 'morning' },
                { label: 'Afternoon (12-18)', value: 'afternoon' },
                { label: 'Night (18+)', value: 'evening' }
              ].map(slot => (
                <button
                  key={slot.value}
                  onClick={() => setDepartureSlot(slot.value)}
                  style={{
                    background: departureSlot === slot.value ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: departureSlot === slot.value ? '#00d2ff' : '#cbd5e1',
                    border: departureSlot === slot.value ? '1px solid rgba(0, 210, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '6px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Airlines Checkbox List */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>
              Airlines
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {airlines.map(a => {
                const checked = selectedAirlines.includes(a.name);
                return (
                  <label
                    key={a.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 13,
                      cursor: 'pointer',
                      color: checked ? '#00d2ff' : '#cbd5e1'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAirline(a.name)}
                        style={{ accentColor: '#00d2ff', cursor: 'pointer' }}
                      />
                      <span>{a.name}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>({a.count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 5. Free Cancellation Toggle */}
          <div style={{
            paddingTop: 14,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>
              Refundable Only
            </span>
            <input
              type="checkbox"
              checked={refundableOnly}
              onChange={(e) => setRefundableOnly(e.target.checked)}
              style={{ accentColor: '#00e676', width: 16, height: 16, cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Right Flights List & Sort Bar */}
        <div>
          {/* Sorting Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '10px 16px',
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>
              Showing <strong>{filteredFlights.length}</strong> available options
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ArrowUpDown size={16} color="#00d2ff" />
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="price_asc" style={{ background: '#111a33' }}>Cheapest First</option>
                <option value="duration_asc" style={{ background: '#111a33' }}>Fastest (Shortest Duration)</option>
                <option value="departure_asc" style={{ background: '#111a33' }}>Earliest Departure</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          {filteredFlights.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛫</div>
              <h3 style={{ fontSize: 20, color: '#fff', marginBottom: 8 }}>No Flights Match Your Filters</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 400, margin: '0 auto 20px auto' }}>
                Try relaxing the price slider or clearing the airline filters to see available flights.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMaxPrice(100000);
                  setSelectedStops('all');
                  setSelectedAirlines([]);
                  setRefundableOnly(false);
                  setDepartureSlot('all');
                }}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFlights.map(flight => (
              <FlightCard
                key={flight.id}
                flight={flight}
                isCheapest={cheapestFlight?.id === flight.id}
                isFastest={fastestFlight?.id === flight.id}
                currency={currency}
                onSelectFlight={onSelectFlight}
                onViewRules={onViewRules}
                isSaved={wishlist.some(w => w.id === flight.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
