import React, { useState } from 'react';
import { Plane, Calendar, Users, ArrowRightLeft, Search, Sparkles, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import { AIRPORTS } from '../data/mockFlights';

export default function HeroSearch({ searchParams, setSearchParams, onSearch, onQuickPrompt, loading = false }) {
  const [tripType, setTripType] = useState('one-way'); // 'one-way', 'round-trip', 'multi-city'
  const [heroBg, setHeroBg] = useState('/assets/images/hero_flight_banner.jpg');

  const SCENES = [
    { label: '✈️ Sky Flight', image: '/assets/images/hero_flight_banner.jpg' },
    { label: '🏖️ Goa Palms', image: '/assets/images/destination_goa.jpg' },
    { label: '🌇 Dubai Skyline', image: '/assets/images/destination_dubai.jpg' },
    { label: '🌃 Manhattan', image: '/assets/images/destination_newyork.jpg' },
    { label: '🎡 London Thames', image: '/assets/images/destination_london.jpg' }
  ];

  const handleSwap = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Hero Banner */}
      <div style={{
        position: 'relative',
        minHeight: 460,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 16px 80px 16px',
        backgroundImage: `linear-gradient(to bottom, rgba(9, 15, 29, 0.45), rgba(9, 15, 29, 0.95)), url('${heroBg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.6s ease-in-out'
      }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', textAlign: 'center' }}>
          {/* Interactive Scene Switcher Dock (Swipeable on Mobile) */}
          <div className="scroll-touch-x" style={{ display: 'inline-flex', alignItems: 'center', maxWidth: '100%', background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '5px 10px', borderRadius: 25, marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#00d2ff', textTransform: 'uppercase', marginRight: 4, whiteSpace: 'nowrap' }}>Scene:</span>
            {SCENES.map((sc) => (
              <button
                key={sc.label}
                type="button"
                onClick={() => setHeroBg(sc.image)}
                style={{
                  background: heroBg === sc.image ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'rgba(255, 255, 255, 0.08)',
                  color: heroBg === sc.image ? '#fff' : '#cbd5e1',
                  border: heroBg === sc.image ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '3px 9px',
                  borderRadius: 16,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}
              >
                {sc.label}
              </button>
            ))}
          </div>

          <h1 className="hero-heading" style={{
            fontSize: 'clamp(28px, 5vw, 54px)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 12,
            letterSpacing: -0.5,
            textShadow: '0 4px 20px rgba(0,0,0,0.6)'
          }}>
            Fly Smarter. Compare Faster. <br />
            <span style={{
              background: 'linear-gradient(135deg, #00d2ff, #f5af19)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Zero Hidden Fees.
            </span>
          </h1>

          <p className="hero-subheading" style={{
            fontSize: 'clamp(13px, 2vw, 16px)',
            color: '#cbd5e1',
            maxWidth: 680,
            margin: '0 auto 24px auto',
            lineHeight: 1.5
          }}>
            Real-time multi-airline flight comparison, flexible date matrices, and AI travel concierge.
          </p>

          {/* Search Card Container */}
          <div className="glass-card" style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '20px',
            textAlign: 'left',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 210, 255, 0.15)'
          }}>
            {/* Trip Type Tabs & Cabin Class Selector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
              <div className="scroll-touch-x" style={{ display: 'flex', gap: 6, background: 'rgba(255, 255, 255, 0.05)', padding: 3, borderRadius: 10 }}>
                {['one-way', 'round-trip', 'multi-city'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTripType(type)}
                    style={{
                      background: tripType === type ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent',
                      color: tripType === type ? '#fff' : '#94a3b8',
                      border: 'none',
                      padding: '7px 14px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                  >
                    {type.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Cabin Class Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Class:</span>
                <select
                  value={searchParams.cabinClass}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, cabinClass: e.target.value }))}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                    minHeight: 36
                  }}
                >
                  <option value="All" style={{ background: '#111a33' }}>All Classes (Economy, Business...)</option>
                  <option value="Economy" style={{ background: '#111a33' }}>Economy</option>
                  <option value="Premium Economy" style={{ background: '#111a33' }}>Premium Economy</option>
                  <option value="Business" style={{ background: '#111a33' }}>Business Class</option>
                  <option value="First" style={{ background: '#111a33' }}>First Class</option>
                </select>
              </div>
            </div>

            {/* Main Search Inputs Grid (Responsive) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
              alignItems: 'center'
            }}>
              {/* Origin Dropdown */}
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' }}>
                  From (Origin)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 10,
                  padding: '8px 12px'
                }}>
                  <select
                    value={searchParams.origin}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, origin: e.target.value }))}
                    style={{
                      background: 'transparent',
                      color: '#fff',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      minHeight: 32
                    }}
                  >
                    {AIRPORTS.map(a => (
                      <option key={a.code} value={a.code} style={{ background: '#111a33' }}>
                        {a.city} ({a.code}) - {a.flag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0' }}>
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap Origin & Destination"
                  style={{
                    background: 'rgba(0, 210, 255, 0.15)',
                    border: '1px solid rgba(0, 210, 255, 0.3)',
                    color: '#00d2ff',
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(180deg)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* Destination Dropdown */}
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' }}>
                  To (Destination)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 10,
                  padding: '8px 12px'
                }}>
                  <select
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
                    style={{
                      background: 'transparent',
                      color: '#fff',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      minHeight: 32
                    }}
                  >
                    {AIRPORTS.map(a => (
                      <option key={a.code} value={a.code} style={{ background: '#111a33' }}>
                        {a.city} ({a.code}) - {a.flag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Departure Date */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' }}>
                  Departure Date
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  gap: 8
                }}>
                  <Calendar size={16} color="#00d2ff" />
                  <input
                    type="date"
                    value={searchParams.departureDate}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                    style={{
                      background: 'transparent',
                      color: '#fff',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      minHeight: 'auto'
                    }}
                  />
                </div>
              </div>

              {/* Return Date (Shown for Round-Trip) */}
              {tripType === 'round-trip' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' }}>
                    Return Date
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    padding: '8px 12px',
                    gap: 8
                  }}>
                    <Calendar size={16} color="#f5af19" />
                    <input
                      type="date"
                      value={searchParams.returnDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
                      style={{
                        background: 'transparent',
                        color: '#fff',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                        minHeight: 'auto'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Passengers Count */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' }}>
                  Travelers
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  gap: 8
                }}>
                  <Users size={16} color="#f5af19" />
                  <select
                    value={searchParams.passengers}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                    style={{
                      background: 'transparent',
                      color: '#fff',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      minHeight: 32
                    }}
                  >
                    <option value={1} style={{ background: '#111a33' }}>1 Adult (12+ yrs)</option>
                    <option value={2} style={{ background: '#111a33' }}>2 Adults</option>
                    <option value={3} style={{ background: '#111a33' }}>3 Adults (Family)</option>
                    <option value={4} style={{ background: '#111a33' }}>4+ Group</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 6 }}>
                <button
                  type="button"
                  id="hero-search-flights-btn"
                  onClick={() => {
                    onSearch();
                    setTimeout(() => {
                      document.getElementById('flight-results-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    minHeight: 48,
                    fontSize: 15,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.75 : 1
                  }}
                >
                  {loading ? <RefreshCw size={18} className="spin-anim" /> : <Search size={18} />}
                  <span>{loading ? 'Searching Flights...' : 'Search Flights'}</span>
                </button>
              </div>
            </div>

            {/* Quick Inspiration Chips (Swipeable on Mobile) */}
            <div style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Quick Searches:</span>
              <div className="scroll-touch-x" style={{ paddingBottom: 4 }}>
                <button
                  type="button"
                  onClick={() => onQuickPrompt('DEL', 'DXB')}
                  className="btn-secondary"
                  style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  ✈️ Delhi to Dubai (DXB)
                </button>
                <button
                  type="button"
                  onClick={() => onQuickPrompt('DEL', 'BOM')}
                  className="btn-secondary"
                  style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  ⚡ Delhi to Mumbai (Express)
                </button>
                <button
                  type="button"
                  onClick={() => onQuickPrompt('DEL', 'LHR')}
                  className="btn-secondary"
                  style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  🇬🇧 London Direct (LHR)
                </button>
                <button
                  type="button"
                  onClick={() => onQuickPrompt('BLR', 'SIN')}
                  className="btn-secondary"
                  style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  🇸🇬 Bengaluru to Singapore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
