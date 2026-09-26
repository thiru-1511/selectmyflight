import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Tag, Zap, Filter, Check, ChevronDown, ChevronUp } from 'lucide-react';
import FlightCard from './FlightCard';

export default function FlightList({ flights = [], currency, onSelectFlight, onViewRules, wishlist = [], onToggleWishlist }) {
  // Advanced Filter States
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedStops, setSelectedStops] = useState('all'); // 'all', '0', '1'
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [departureSlot, setDepartureSlot] = useState('all'); // 'all', 'morning', 'afternoon', 'evening'
  const [sortBy, setSortBy] = useState('price_asc'); // 'price_asc', 'duration_asc', 'departure_asc'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const safeFlights = useMemo(() => Array.isArray(flights) ? flights : [], [flights]);

  // Extract unique airlines
  const airlines = useMemo(() => {
    const map = new Map();
    safeFlights.forEach(f => {
      map.set(f.airlineName, (map.get(f.airlineName) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [safeFlights]);

  // Identify Cheapest and Fastest flights
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
      if (f.basePrice > maxPrice) return false;
      if (selectedStops !== 'all' && f.stops !== parseInt(selectedStops)) return false;
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airlineName)) return false;
      if (refundableOnly && !f.refundable) return false;
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

  const activeFiltersCount = (selectedStops !== 'all' ? 1 : 0) + 
    selectedAirlines.length + 
    (refundableOnly ? 1 : 0) + 
    (departureSlot !== 'all' ? 1 : 0) + 
    (maxPrice < 100000 ? 1 : 0);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px 60px 16px' }}>
      {/* Flight Comparison Header Banner */}
      <div className="glass-card" style={{
        padding: '14px 18px',
        marginBottom: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        background: 'linear-gradient(135deg, rgba(17, 26, 51, 0.8), rgba(0, 210, 255, 0.08))',
        border: '1px solid rgba(0, 210, 255, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: 'rgba(0, 210, 255, 0.15)',
            color: '#00d2ff',
            padding: '6px 10px',
            borderRadius: 8,
            fontWeight: 800,
            fontSize: 14
          }}>
            ⚡ Comparison
          </div>
          <span style={{ fontSize: 13, color: '#f8fafc', fontWeight: 600 }}>
            Best Deals Found Across 5+ Airlines
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {cheapestFlight && (
            <div style={{
              background: 'rgba(0, 230, 118, 0.1)',
              border: '1px solid rgba(0, 230, 118, 0.3)',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 12
            }}>
              <span style={{ color: '#94a3b8' }}>Cheapest: </span>
              <strong style={{ color: '#00e676' }}>
                {currencySymbol}{convertPrice(cheapestFlight.basePrice).toLocaleString()}
              </strong>
              <span style={{ color: '#cbd5e1' }}> ({cheapestFlight.airlineName})</span>
            </div>
          )}

          {fastestFlight && (
            <div style={{
              background: 'rgba(0, 210, 255, 0.1)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              padding: '4px 10px',
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

      {/* Mobile Filter Toggle Button */}
      <div style={{ display: 'none', marginBottom: 14 }} className="mobile-menu-btn">
        <button
          type="button"
          onClick={() => setShowMobileFilters(prev => !prev)}
          style={{
            width: '100%',
            minHeight: 44,
            background: 'rgba(0, 210, 255, 0.12)',
            border: '1px solid rgba(0, 210, 255, 0.35)',
            color: '#00d2ff',
            borderRadius: 10,
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SlidersHorizontal size={16} />
            <span>Filter & Sort Flights</span>
            {activeFiltersCount > 0 && (
              <span style={{ background: '#00d2ff', color: '#090f1d', fontSize: 11, padding: '1px 6px', borderRadius: 10, fontWeight: 900 }}>
                {activeFiltersCount}
              </span>
            )}
          </div>
          {showMobileFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Filter and Sorting Layout */}
      <div className="responsive-flight-layout">
        {/* Filter Sidebar (Desktop or when toggled on Mobile) */}
        <div 
          className="glass-card sticky-sidebar" 
          style={{ 
            padding: '18px', 
            display: (typeof window !== 'undefined' && window.innerWidth < 992 && !showMobileFilters) ? 'none' : 'block'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal size={16} color="#00d2ff" />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Filter Flights</h3>
            </div>
            <button
              onClick={() => {
                setMaxPrice(100000);
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
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
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
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
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
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
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
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
              Airlines
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {airlines.map(airline => {
                const isSelected = selectedAirlines.includes(airline.name);
                return (
                  <label
                    key={airline.name}
                    onClick={() => toggleAirline(airline.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isSelected ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1px solid rgba(0, 210, 255, 0.3)' : '1px solid transparent',
                      padding: '6px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: isSelected ? '#fff' : '#cbd5e1',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        border: isSelected ? '1px solid #00d2ff' : '1px solid #64748b',
                        background: isSelected ? '#00d2ff' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isSelected && <Check size={10} color="#090f1d" strokeWidth={4} />}
                      </div>
                      <span>{airline.name}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>({airline.count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 5. Refundable Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>
              Refundable Flights Only
            </span>
            <input
              type="checkbox"
              checked={refundableOnly}
              onChange={(e) => setRefundableOnly(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#00d2ff', cursor: 'pointer' }}
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
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 14,
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '8px 14px',
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              Showing <strong>{filteredFlights.length}</strong> flights
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowUpDown size={14} color="#00d2ff" />
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  minHeight: 32
                }}
              >
                <option value="price_asc" style={{ background: '#111a33' }}>Cheapest First</option>
                <option value="duration_asc" style={{ background: '#111a33' }}>Fastest (Shortest)</option>
                <option value="departure_asc" style={{ background: '#111a33' }}>Earliest Departure</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          {filteredFlights.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🛫</div>
              <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 6 }}>No Flights Match Your Filters</h3>
              <p style={{ color: '#94a3b8', fontSize: 13, maxWidth: 360, margin: '0 auto 16px auto' }}>
                Try relaxing the price slider or clearing filters to see flights.
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
                style={{ padding: '8px 16px', fontSize: 13 }}
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
