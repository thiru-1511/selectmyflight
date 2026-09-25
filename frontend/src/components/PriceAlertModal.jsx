import React, { useState, useEffect } from 'react';
import { X, Bell, BellRing, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';
import { AIRPORTS } from '../data/mockFlights';
import { api } from '../services/api';

export default function PriceAlertModal({ isOpen, onClose, currentOrigin, currentDestination, currency }) {
  const [origin, setOrigin] = useState(currentOrigin || 'DEL');
  const [destination, setDestination] = useState(currentDestination || 'DXB');
  const [targetPrice, setTargetPrice] = useState(12000);
  const [email, setEmail] = useState('user@selectmyflight.com');
  const [alerts, setAlerts] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAlerts();
    }
  }, [isOpen]);

  const loadAlerts = async () => {
    const list = await api.getAlerts();
    setAlerts(list);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.createAlert({
      origin,
      destination,
      targetPrice,
      email
    });
    setSubmitted(true);
    loadAlerts();
    setTimeout(() => setSubmitted(false), 3000);
  };

  const convertPrice = (inrPrice) => {
    return currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice;
  };
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: 'rgba(245, 175, 25, 0.15)',
              color: '#f5af19',
              padding: 8,
              borderRadius: 8
            }}>
              <BellRing size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                🔔 Track Route & Set Price Alert
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>
                We monitor fare fluctuations 24/7 and notify you the moment prices drop to your target.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#cbd5e1',
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Alert Form */}
        <form onSubmit={handleCreate} style={{ padding: '24px' }}>
          {submitted && (
            <div style={{
              background: 'rgba(0, 230, 118, 0.15)',
              border: '1px solid #00e676',
              borderRadius: 8,
              padding: '12px 16px',
              color: '#00e676',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16
            }}>
              <CheckCircle2 size={18} /> Price Alert successfully activated for {origin} ➔ {destination}!
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Origin</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 14
                }}
              >
                {AIRPORTS.map(a => (
                  <option key={a.code} value={a.code} style={{ background: '#111a33' }}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 14
                }}
              >
                {AIRPORTS.map(a => (
                  <option key={a.code} value={a.code} style={{ background: '#111a33' }}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
              Target Maximum Price: <strong style={{ color: '#00d2ff' }}>{currencySymbol}{convertPrice(targetPrice).toLocaleString()}</strong>
            </label>
            <input
              type="range"
              min="3000"
              max="45000"
              step="500"
              value={targetPrice}
              onChange={(e) => setTargetPrice(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#00d2ff', cursor: 'pointer' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Email for Notifications</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 14
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: 14 }}
          >
            <Bell size={16} />
            Set Price Drop Alert
          </button>
        </form>

        {/* Existing Alerts List */}
        {alerts.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.01)'
          }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
              Your Monitored Routes
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
              {alerts.map(a => (
                <div
                  key={a.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 13
                  }}
                >
                  <div>
                    <strong style={{ color: '#fff' }}>{a.origin || a.originCode} ➔ {a.destination || a.destinationCode}</strong>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Target: {currencySymbol}{convertPrice(a.targetPrice).toLocaleString()}</div>
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 12,
                    background: a.alertStatus === 'TRIGGERED' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(0, 210, 255, 0.2)',
                    color: a.alertStatus === 'TRIGGERED' ? '#00e676' : '#00d2ff'
                  }}>
                    {a.alertStatus === 'TRIGGERED' ? '🎯 TARGET REACHED' : '📡 MONITORING'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
