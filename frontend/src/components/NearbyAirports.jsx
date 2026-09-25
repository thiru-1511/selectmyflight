import React from 'react';
import { MapPin, Navigation, ArrowRight, TrendingDown } from 'lucide-react';

const NEARBY_CLUSTERS = {
  DEL: [
    { code: 'DEL', name: 'Indira Gandhi (DEL)', distance: '0 km', avgSavings: 0, isPrimary: true },
    { code: 'HDO', name: 'Hindon (HDO)', distance: '28 km', avgSavings: 850, isPrimary: false, note: 'Quick domestic departures' }
  ],
  BOM: [
    { code: 'BOM', name: 'CSMIA (BOM)', distance: '0 km', avgSavings: 0, isPrimary: true },
    { code: 'NMI', name: 'Navi Mumbai (NMI)', distance: '34 km', avgSavings: 600, isPrimary: false, note: 'Less terminal congestion' }
  ],
  LHR: [
    { code: 'LHR', name: 'Heathrow (LHR)', distance: '0 km', avgSavings: 0, isPrimary: true },
    { code: 'LGW', name: 'Gatwick (LGW)', distance: '48 km', avgSavings: 3500, isPrimary: false, note: 'Often cheaper budget flights' },
    { code: 'STN', name: 'Stansted (STN)', distance: '62 km', avgSavings: 4200, isPrimary: false, note: 'Low-cost European connections' }
  ]
};

export default function NearbyAirports({ currentOrigin, onSelectAirport, currency }) {
  const cluster = NEARBY_CLUSTERS[currentOrigin];
  if (!cluster || cluster.length <= 1) return null;

  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const convertPrice = (p) => (currency === 'USD' ? Math.round(p / 85) : p);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto 16px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{
        padding: '12px 16px',
        border: '1px solid rgba(0, 210, 255, 0.25)',
        background: 'rgba(0, 210, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: 'rgba(0, 210, 255, 0.15)', padding: 6, borderRadius: 8, color: '#00d2ff' }}>
            <Navigation size={16} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
              📍 Alternative Airports around {currentOrigin}
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>
              Compare nearby hubs to save on fares.
            </div>
          </div>
        </div>

        <div className="scroll-touch-x" style={{ display: 'flex', gap: 6, paddingBottom: 2 }}>
          {cluster.map((port) => (
            <button
              key={port.code}
              type="button"
              disabled={port.isPrimary}
              onClick={() => onSelectAirport(port.code)}
              style={{
                background: port.isPrimary ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 230, 118, 0.15)',
                border: port.isPrimary ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 230, 118, 0.35)',
                color: port.isPrimary ? '#94a3b8' : '#00e676',
                padding: '5px 10px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600,
                cursor: port.isPrimary ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <span>{port.name}</span>
              {!port.isPrimary && (
                <span style={{ fontSize: 9, background: '#00e676', color: '#090f1d', padding: '1px 4px', borderRadius: 4, fontWeight: 900 }}>
                  Save ~{currencySymbol}{convertPrice(port.avgSavings)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
