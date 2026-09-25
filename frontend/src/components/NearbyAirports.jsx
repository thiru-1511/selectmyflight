import React from 'react';
import { MapPin, Navigation, ArrowRight, TrendingDown } from 'lucide-react';

const NEARBY_CLUSTERS = {
  DEL: [
    { code: 'DEL', name: 'Indira Gandhi Intl (DEL)', distance: '0 km (Current)', avgSavings: 0, isPrimary: true },
    { code: 'HDO', name: 'Hindon Airport (HDO)', distance: '28 km away', avgSavings: 850, isPrimary: false, note: 'Quick domestic departures' }
  ],
  BOM: [
    { code: 'BOM', name: 'CSMIA Mumbai (BOM)', distance: '0 km (Current)', avgSavings: 0, isPrimary: true },
    { code: 'NMI', name: 'Navi Mumbai Intl (NMI)', distance: '34 km away', avgSavings: 600, isPrimary: false, note: 'Less terminal congestion' }
  ],
  LHR: [
    { code: 'LHR', name: 'London Heathrow (LHR)', distance: '0 km (Current)', avgSavings: 0, isPrimary: true },
    { code: 'LGW', name: 'London Gatwick (LGW)', distance: '48 km away', avgSavings: 3500, isPrimary: false, note: 'Often cheaper budget flights' },
    { code: 'STN', name: 'London Stansted (STN)', distance: '62 km away', avgSavings: 4200, isPrimary: false, note: 'Low-cost European connections' }
  ]
};

export default function NearbyAirports({ currentOrigin, onSelectAirport, currency }) {
  const cluster = NEARBY_CLUSTERS[currentOrigin];
  if (!cluster || cluster.length <= 1) return null;

  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const convertPrice = (p) => (currency === 'USD' ? Math.round(p / 85) : p);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto 24px auto', padding: '0 24px' }}>
      <div className="glass-card" style={{
        padding: '16px 20px',
        border: '1px solid rgba(0, 210, 255, 0.25)',
        background: 'rgba(0, 210, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'rgba(0, 210, 255, 0.15)', padding: 8, borderRadius: 8, color: '#00d2ff' }}>
            <Navigation size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
              📍 Nearby Alternative Airports around {currentOrigin}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Compare fares from nearby hubs to find potentially cheaper flights.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: port.isPrimary ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>{port.name}</span>
              {!port.isPrimary && (
                <span style={{ fontSize: 10, background: '#00e676', color: '#090f1d', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>
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
