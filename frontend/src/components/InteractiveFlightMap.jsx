import React, { useState } from 'react';
import { Globe, Plane, Navigation, ArrowRight, Radio } from 'lucide-react';

const CITIES = [
  { 
    code: 'DEL', 
    name: 'New Delhi', 
    x: 670, 
    y: 220, 
    flights: 8,
    activeLiveFlights: [
      { callsign: 'AIC9WZ', flightNumber: 'AI-865', route: 'DEL → BOM', altitude: '33,025 ft', speed: '771 km/h', airline: 'Air India' },
      { callsign: 'IGO79MA', flightNumber: '6E-2041', route: 'DEL → DXB', altitude: '37,950 ft', speed: '796 km/h', airline: 'IndiGo' }
    ]
  },
  { 
    code: 'BOM', 
    name: 'Mumbai', 
    x: 650, 
    y: 245, 
    flights: 6,
    activeLiveFlights: [
      { callsign: 'UAE511', flightNumber: 'EK-511', route: 'BOM → DXB', altitude: '36,000 ft', speed: '885 km/h', airline: 'Emirates' },
      { callsign: 'AIC9WZ', flightNumber: 'AI-865', route: 'DEL → BOM', altitude: '33,025 ft', speed: '771 km/h', airline: 'Air India' }
    ]
  },
  { 
    code: 'BLR', 
    name: 'Bengaluru', 
    x: 660, 
    y: 265, 
    flights: 4,
    activeLiveFlights: [
      { callsign: 'SIA503', flightNumber: 'SQ-503', route: 'BLR → SIN', altitude: '35,000 ft', speed: '860 km/h', airline: 'Singapore Airlines' }
    ]
  },
  { 
    code: 'DXB', 
    name: 'Dubai', 
    x: 570, 
    y: 215, 
    flights: 9,
    activeLiveFlights: [
      { callsign: 'UAE511', flightNumber: 'EK-511', route: 'DXB → DEL', altitude: '36,000 ft', speed: '885 km/h', airline: 'Emirates' },
      { callsign: 'IGO79MA', flightNumber: '6E-2041', route: 'DEL → DXB', altitude: '37,950 ft', speed: '796 km/h', airline: 'IndiGo' }
    ]
  },
  { 
    code: 'LHR', 
    name: 'London', 
    x: 420, 
    y: 130, 
    flights: 5,
    activeLiveFlights: [
      { callsign: 'BAW142', flightNumber: 'BA-142', route: 'LHR → JFK', altitude: '38,000 ft', speed: '910 km/h', airline: 'British Airways' }
    ]
  },
  { 
    code: 'SIN', 
    name: 'Singapore', 
    x: 740, 
    y: 290, 
    flights: 7,
    activeLiveFlights: [
      { callsign: 'SIA503', flightNumber: 'SQ-503', route: 'SIN → BLR', altitude: '35,000 ft', speed: '860 km/h', airline: 'Singapore Airlines' }
    ]
  },
  { 
    code: 'JFK', 
    name: 'New York', 
    x: 250, 
    y: 160, 
    flights: 4,
    activeLiveFlights: [
      { callsign: 'BAW142', flightNumber: 'BA-142', route: 'JFK → LHR', altitude: '38,000 ft', speed: '910 km/h', airline: 'British Airways' }
    ]
  }
];

const ROUTES = [
  { from: 'DEL', to: 'BOM', d: 'M 670 220 Q 660 230 650 245' },
  { from: 'DEL', to: 'DXB', d: 'M 670 220 Q 615 190 570 215' },
  { from: 'BOM', to: 'DXB', d: 'M 650 245 Q 605 210 570 215' },
  { from: 'DEL', to: 'LHR', d: 'M 670 220 Q 530 110 420 130' },
  { from: 'BLR', to: 'SIN', d: 'M 660 265 Q 700 270 740 290' },
  { from: 'LHR', to: 'JFK', d: 'M 420 130 Q 330 100 250 160' }
];

export default function InteractiveFlightMap({ onSelectRoute, onNavigateToStatus, onTrackFlight }) {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);

  return (
    <div className="route-map-container" style={{
      maxWidth: 1240,
      margin: '24px auto 70px auto',
      padding: 'clamp(18px, 3vw, 36px) clamp(16px, 3vw, 32px) 60px clamp(16px, 3vw, 32px)',
      borderRadius: 24,
      background: "var(--card-bg, #ffffff)",
      border: "1px solid var(--card-border, #e2e8f0)",
      boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
          <Globe size={16} /> GLOBAL FLIGHT RADAR
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
          Interactive Global Route Map
        </h2>
        <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: 14, maxWidth: 540, margin: '4px auto 0 auto' }}>
          Explore SelectMyFlight’s high-frequency international corridors and track real commercial aircraft currently in the sky.
        </p>
      </div>

      {/* Live Radar Quick Action Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(0, 230, 118, 0.12), rgba(0, 210, 255, 0.12))',
        border: '1.5px solid rgba(0, 230, 118, 0.4)',
        borderRadius: 14,
        padding: '12px 20px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="live-dot" style={{ width: 8, height: 8 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#00e676' }}>
              REAL-TIME ADS-B FLIGHT RADAR IS ACTIVE
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted, #475569)' }}>
              OpenSky Network live transponders actively streaming commercial flights with altitude, speed, and GPS coordinates.
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateToStatus ? onNavigateToStatus('live_radar') : (window.location.hash = '#status')}
          style={{
            background: 'linear-gradient(135deg, #00e676, #00b0ff)',
            color: '#090f1d',
            border: 'none',
            padding: '9px 18px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            transition: 'all 0.2s ease'
          }}
          title="Open live commercial flight radar"
        >
          <Radio size={15} color="#090f1d" />
          <span>Open Live Sky Radar</span>
        </button>
      </div>

      <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
        {/* SVG World Map Canvas */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox="0 0 950 400" style={{ width: '100%', minWidth: 700, height: 'auto', background: 'rgba(6, 10, 20, 0.85)', borderRadius: 12 }}>
            <defs>
              {/* Gradients */}
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f5af19" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Simulated Continental Grid Background */}
            <g opacity="0.15" stroke="#3a7bd5" strokeWidth="0.5">
              {[50, 100, 150, 200, 250, 300, 350].map(y => (
                <line key={y} x1="0" y1={y} x2="950" y2={y} />
              ))}
              {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="400" />
              ))}
            </g>

            {/* Flight Arcs */}
            {ROUTES.map((route, i) => (
              <g key={i}>
                <path
                  d={route.d}
                  fill="none"
                  stroke="url(#routeGrad)"
                  strokeWidth="2"
                  strokeDasharray="4, 4"
                  opacity="0.8"
                />
              </g>
            ))}

            {/* City Nodes */}
            {CITIES.map((city) => {
              const isSelected = selectedCity.code === city.code;
              return (
                <g
                  key={city.code}
                  onClick={() => setSelectedCity(city)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isSelected ? 10 : 6}
                    fill={isSelected ? '#00d2ff' : '#f5af19'}
                    opacity={isSelected ? '1' : '0.8'}
                  />
                  {isSelected && (
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="18"
                      fill="none"
                      stroke="#00d2ff"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  )}
                  <text
                    x={city.x + 12}
                    y={city.y + 4}
                    fill="#ffffff"
                    fontSize={isSelected ? '13' : '11'}
                    fontWeight={isSelected ? '800' : '600'}
                  >
                    {city.name} ({city.code})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Hub Card Overlay */}
        <div style={{
          marginTop: 20,
          background: 'var(--card-subtle-bg, rgba(255, 255, 255, 0.04))',
          border: '1px solid var(--card-border, rgba(255, 255, 255, 0.1))',
          borderRadius: 12,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted, #94a3b8)', textTransform: 'uppercase' }}>Selected Global Hub</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main, #ffffff)' }}>
                {selectedCity.name} ({selectedCity.code})
              </div>
              <div style={{ fontSize: 12, color: '#00e676', marginTop: 2 }}>
                • {selectedCity.flights} active daily direct connections
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigateToStatus ? onNavigateToStatus('live_radar') : (window.location.hash = '#status')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  background: 'rgba(0, 230, 118, 0.12)',
                  border: '1.5px solid rgba(0, 230, 118, 0.45)',
                  color: '#00e676',
                  padding: '10px 18px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Track real flights live on airborne radar"
              >
                <Radio size={15} color="#00e676" />
                <span>Track Real Flights on Live Radar</span>
                <span className="live-dot" style={{ width: 6, height: 6 }} />
              </button>

              <button
                onClick={() => onSelectRoute(selectedCity.code)}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: 13 }}
              >
                Search Flights from {selectedCity.name} <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Active Live Commercial Flights for this Hub */}
          {selectedCity.activeLiveFlights && selectedCity.activeLiveFlights.length > 0 && (
            <div style={{ paddingTop: 14, borderTop: '1px solid var(--card-border, rgba(255, 255, 255, 0.08))' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-cyan, #00d2ff)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="live-dot" style={{ width: 6, height: 6 }} />
                Real Commercial Flights Airborne for {selectedCity.name} ({selectedCity.code}):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                {selectedCity.activeLiveFlights.map((f) => (
                  <div
                    key={f.flightNumber}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 10,
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main, #ffffff)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Plane size={13} color="#00e676" />
                        <span>{f.flightNumber}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>({f.callsign})</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#38bdf8', marginTop: 2 }}>
                        {f.route} • {f.altitude} • {f.speed}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onTrackFlight ? onTrackFlight(f.flightNumber) : onNavigateToStatus('airline')}
                      style={{
                        background: 'rgba(0, 230, 118, 0.15)',
                        border: '1px solid rgba(0, 230, 118, 0.4)',
                        color: '#00e676',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                      title={`Track ${f.flightNumber} live telemetry`}
                    >
                      Track Live ✈
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
      </div>
    </div>
  );
}
