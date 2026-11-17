import React, { useState, useEffect } from 'react';
import { X, Bell, BellRing, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';
import { AIRPORTS } from '../data/mockFlights';
import { api } from '../services/api';

export default function PriceAlertModal({ isOpen, onClose, currentOrigin, currentDestination, currency, onAlertCreated }) {
  const [origin, setOrigin] = useState(currentOrigin || 'DEL');
  const [destination, setDestination] = useState(currentDestination || 'DXB');
  const [targetPrice, setTargetPrice] = useState(12000);
  const [email, setEmail] = useState('');
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
    const created = await api.createAlert({
      origin,
      destination,
      targetPrice,
      email
    });
    setSubmitted(true);
    if (onAlertCreated) {
      onAlertCreated({
        origin,
        destination,
        targetPrice,
        email,
        alertStatus: created?.alertStatus || (targetPrice >= 4850 ? 'TRIGGERED' : 'ACTIVE')
      });
    }
    loadAlerts();
    setTimeout(() => setSubmitted(false), 5000);
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
          borderBottom: '1px solid var(--card-border, #cbd5e1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--card-subtle-bg, #f8fafc)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: 'rgba(245, 175, 25, 0.15)',
              color: 'var(--accent-gold, #d97706)',
              padding: 8,
              borderRadius: 8
            }}>
              <BellRing size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                🔔 Track Route & Set Price Alert
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted, #475569)' }}>
                We monitor fare fluctuations 24/7 and notify you the moment prices drop to your target.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--card-subtle-bg, #f1f5f9)',
              border: '1px solid var(--card-border, #cbd5e1)',
              color: 'var(--text-main, #0f172a)',
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
              background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15), rgba(0, 210, 255, 0.15))',
              border: '1px solid #00e676',
              borderRadius: 10,
              padding: '14px 18px',
              color: '#00e676',
              fontSize: 13,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800 }}>
                <CheckCircle2 size={18} /> Price Alert successfully activated for {origin} ➔ {destination}!
              </div>
              <div style={{ fontSize: 12, color: '#cbd5e1', paddingLeft: 26 }}>
                📧 Automated fare tracking alerts will be delivered to <strong style={{ color: '#00d2ff' }}>{email}</strong>.
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted, #475569)', marginBottom: 6, fontWeight: 700 }}>Origin</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--input-bg, #ffffff)',
                  border: '1.5px solid var(--input-border, #cbd5e1)',
                  color: 'var(--input-text, #0f172a)',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 14
                }}
              >
                {AIRPORTS.map(a => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted, #475569)', marginBottom: 6, fontWeight: 700 }}>Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--input-bg, #ffffff)',
                  border: '1.5px solid var(--input-border, #cbd5e1)',
                  color: 'var(--input-text, #0f172a)',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 14
                }}
              >
                {AIRPORTS.map(a => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted, #475569)', marginBottom: 6, fontWeight: 700 }}>
              Target Maximum Price: <strong style={{ color: 'var(--accent-cyan, #0284c7)' }}>{currencySymbol}{convertPrice(targetPrice).toLocaleString()}</strong>
            </label>
            <input
              type="range"
              min="3000"
              max="45000"
              step="500"
              value={targetPrice}
              onChange={(e) => setTargetPrice(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan, #0284c7)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted, #475569)', fontWeight: 700 }}>Email for Notifications</label>
              <span style={{ fontSize: 11, color: 'var(--accent-cyan, #0284c7)', fontWeight: 600 }}>✦ Enter your real Gmail to receive alerts</span>
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
              style={{
                width: '100%',
                background: 'var(--input-bg, #ffffff)',
                border: '1.5px solid var(--input-border, #cbd5e1)',
                color: 'var(--input-text, #0f172a)',
                padding: '11px 14px',
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
            borderTop: '1px solid var(--card-border, #cbd5e1)',
            background: 'var(--card-subtle-bg, #f8fafc)'
          }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main, #0f172a)', marginBottom: 12 }}>
              Your Monitored Routes
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
              {alerts.map(a => (
                <div
                  key={a.id}
                  style={{
                    background: 'var(--card-bg, #ffffff)',
                    border: '1px solid var(--card-border, #cbd5e1)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 13
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--text-main, #0f172a)' }}>{a.origin || a.originCode} ➔ {a.destination || a.destinationCode}</strong>
                    <div style={{ fontSize: 11, color: 'var(--text-muted, #475569)' }}>Target: {currencySymbol}{convertPrice(a.targetPrice).toLocaleString()}</div>
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 12,
                    background: a.alertStatus === 'TRIGGERED' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(2, 132, 199, 0.15)',
                    color: a.alertStatus === 'TRIGGERED' ? 'var(--accent-green, #059669)' : 'var(--accent-cyan, #0284c7)'
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
