import React from 'react';
import { Bell, CheckCircle2, AlertCircle, TrendingDown, Clock, X } from 'lucide-react';

export default function NotificationsPanel({ isOpen, onClose, notifications, onMarkAllAsRead }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 75,
      right: 24,
      width: 380,
      maxWidth: 'calc(100vw - 32px)',
      background: '#111a33',
      border: '1px solid rgba(0, 210, 255, 0.3)',
      borderRadius: 16,
      boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 25px rgba(0, 210, 255, 0.2)',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={18} color="#f5af19" />
          <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>
            Notifications & Alerts
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onMarkAllAsRead}
            style={{ background: 'none', border: 'none', color: '#00d2ff', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {notifications.map(n => (
          <div
            key={n.id}
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              background: n.read ? 'transparent' : 'rgba(0, 210, 255, 0.05)',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start'
            }}
          >
            <div style={{ marginTop: 2 }}>
              {n.type === 'booking' && <CheckCircle2 size={18} color="#00e676" />}
              {n.type === 'price' && <TrendingDown size={18} color="#f5af19" />}
              {n.type === 'gate' && <Clock size={18} color="#00d2ff" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                {n.title}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, lineHeight: 1.4 }}>
                {n.message}
              </div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
                {n.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
