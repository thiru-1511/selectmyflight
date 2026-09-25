import React, { useState, useEffect } from 'react';
import { Radio, Plane, TrendingDown, RefreshCw, Clock, ShieldCheck } from 'lucide-react';

const LIVE_EVENTS = [
  {
    id: 1,
    type: 'radar',
    icon: Plane,
    color: '#00d2ff',
    badge: 'LIVE RADAR',
    text: 'Flight 6E-2041 (DEL ➔ BOM) FL360 • Speed 840 km/h • On-Time'
  },
  {
    id: 2,
    type: 'fare',
    icon: TrendingDown,
    color: '#00e676',
    badge: 'PRICE DROP',
    text: 'DEL ➔ DXB dropped to ₹14,890 (Save ₹1,400 today)'
  },
  {
    id: 3,
    type: 'refund',
    icon: RefreshCw,
    color: '#f5af19',
    badge: 'REFUNDS',
    text: '₹4.8L+ refunded today via RBI NACH/IMPS automated clearing'
  },
  {
    id: 4,
    type: 'gate',
    icon: Radio,
    color: '#00d2ff',
    badge: 'GATE CALL',
    text: 'AI-865 (DEL ➔ BOM): Boarding Gate B14, Terminal T3'
  },
  {
    id: 5,
    type: 'radar',
    icon: Plane,
    color: '#a855f7',
    badge: 'GLOBAL RADAR',
    text: 'AI-161 (DEL ➔ LHR) entering European Airspace corridor'
  }
];

export default function RealTimeTicker({ onOpenFeature }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [activeFlightsCount, setActiveFlightsCount] = useState(248);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
      setActiveFlightsCount((prev) => Math.min(265, Math.max(235, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const activeEvent = LIVE_EVENTS[currentIndex];
  const IconComponent = activeEvent.icon;

  return (
    <div style={{
      background: 'rgba(6, 11, 22, 0.96)',
      borderBottom: '1px solid rgba(0, 210, 255, 0.15)',
      color: '#cbd5e1',
      fontSize: 12,
      padding: '5px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      overflow: 'hidden',
      userSelect: 'none',
      zIndex: 99
    }}>
      {/* Left: System Status & Live Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700 }}>
          <span className="live-dot" style={{ width: 6, height: 6 }} />
          <span style={{ color: '#00e676', letterSpacing: 0.5, fontSize: 10 }}>AIR NETWORK</span>
        </div>

        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255, 255, 255, 0.05)', padding: '2px 6px', borderRadius: 4, color: '#94a3b8', fontSize: 11 }}>
          <Plane size={11} color="#00d2ff" />
          <span><strong>{activeFlightsCount}</strong> Airborne</span>
        </div>
      </div>

      {/* Center: Live Telemetry Event Feed */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 0,
          cursor: onOpenFeature ? 'pointer' : 'default',
          transition: 'all 0.3s ease'
        }}
        onClick={() => {
          if (onOpenFeature) {
            if (activeEvent.type === 'radar' || activeEvent.type === 'gate') onOpenFeature('status');
            else if (activeEvent.type === 'fare') onOpenFeature('search');
            else if (activeEvent.type === 'refund') onOpenFeature('refund');
          }
        }}
        title="Click to inspect this real-time stream"
      >
        <span style={{
          background: `${activeEvent.color}22`,
          color: activeEvent.color,
          border: `1px solid ${activeEvent.color}44`,
          padding: '1px 5px',
          borderRadius: 4,
          fontWeight: 800,
          fontSize: 9,
          letterSpacing: 0.5,
          flexShrink: 0
        }}>
          {activeEvent.badge}
        </span>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: '#e2e8f0',
          fontSize: 11,
          fontWeight: 500,
          minWidth: 0
        }}>
          <IconComponent size={12} color={activeEvent.color} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeEvent.text}
          </span>
        </div>
      </div>

      {/* Right: Quick Real-Time Controls (Desktop Only) */}
      <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % LIVE_EVENTS.length)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94a3b8',
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Next ({currentIndex + 1}/{LIVE_EVENTS.length})
        </button>
      </div>
    </div>
  );
}
