import React, { useState } from 'react';
import { Globe, Plane, Navigation, ArrowRight } from 'lucide-react';

const CITIES = [
  { code: 'DEL', name: 'New Delhi', x: 670, y: 220, flights: 8 },
  { code: 'BOM', name: 'Mumbai', x: 650, y: 245, flights: 6 },
  { code: 'BLR', name: 'Bengaluru', x: 660, y: 265, flights: 4 },
  { code: 'DXB', name: 'Dubai', x: 570, y: 215, flights: 9 },
  { code: 'LHR', name: 'London', x: 420, y: 130, flights: 5 },
  { code: 'SIN', name: 'Singapore', x: 740, y: 290, flights: 7 },
  { code: 'JFK', name: 'New York', x: 250, y: 160, flights: 4 }
];

const ROUTES = [
  { from: 'DEL', to: 'BOM', d: 'M 670 220 Q 660 230 650 245' },
  { from: 'DEL', to: 'DXB', d: 'M 670 220 Q 615 190 570 215' },
  { from: 'BOM', to: 'DXB', d: 'M 650 245 Q 605 210 570 215' },
  { from: 'DEL', to: 'LHR', d: 'M 670 220 Q 530 110 420 130' },
  { from: 'BLR', to: 'SIN', d: 'M 660 265 Q 700 270 740 290' },
  { from: 'LHR', to: 'JFK', d: 'M 420 130 Q 330 100 250 160' }
];

export default function InteractiveFlightMap({ onSelectRoute }) {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);

  return (
    <div style={{
      maxWidth: 1240,
      margin: '24px auto 70px auto',
      padding: '36px 32px 60px 32px',
      borderRadius: 24,
      background: "linear-gradient(135deg, rgba(6, 10, 20, 0.90), rgba(13, 22, 43, 0.95)), url('/assets/images/destination_newyork.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      border: '1px solid rgba(0, 210, 255, 0.25)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
          <Globe size={16} /> GLOBAL FLIGHT RADAR
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>
          Interactive Global Route Map
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 520, margin: '4px auto 0 auto' }}>
          Explore SelectMyFlight’s high-frequency international corridors with real-time flight routes.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
        {/* SVG World Map Canvas */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox="0 0 950 400" style={{ width: '100%', minWidth: 700, height: 'auto', background: 'rgba(6, 10, 20, 0.6)', borderRadius: 12 }}>
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
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>Selected Global Hub</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
              {selectedCity.name} ({selectedCity.code})
            </div>
            <div style={{ fontSize: 12, color: '#00e676', marginTop: 2 }}>
              • {selectedCity.flights} active daily direct connections
            </div>
          </div>

          <button
            onClick={() => onSelectRoute(selectedCity.code)}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: 13 }}
          >
            Search Flights from {selectedCity.name} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
