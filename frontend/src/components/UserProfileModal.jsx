import React, { useState } from 'react';
import { X, User, Award, Shield, CheckCircle2, Star, Save } from 'lucide-react';

export default function UserProfileModal({ isOpen, user, onClose, onUpdateUser, onSwitchAccount }) {
  const [formData, setFormData] = useState({
    name: user?.name || localStorage.getItem('smf_verified_name') || '',
    email: user?.email || localStorage.getItem('smf_verified_email') || '',
    phone: user?.phone || '',
    preferredSeat: user?.preferredSeat || 'Window',
    preferredClass: user?.preferredClass || 'Business',
    preferredMeal: user?.preferredMeal || 'Royal Rajasthani Thali (Veg)',
    homeAirport: user?.homeAirport || 'DEL'
  });

  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || localStorage.getItem('smf_verified_name') || '',
        email: user.email || localStorage.getItem('smf_verified_email') || '',
        phone: user.phone || '',
        preferredSeat: user.preferredSeat || 'Window',
        preferredClass: user.preferredClass || 'Economy',
        preferredMeal: user.preferredMeal || 'Royal Rajasthani Thali (Veg)',
        homeAirport: user.homeAirport || 'DEL'
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const userInitials = (formData.name || 'T')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--card-border, rgba(255, 255, 255, 0.1))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 17,
              flexShrink: 0
            }}>
              {userInitials || 'T'}
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main, #0f172a)', margin: 0 }}>
                {formData.name || 'Traveler Profile'}
              </h3>
              <div style={{ fontSize: 11, color: '#f5af19', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, marginTop: 2 }}>
                <Star size={12} fill="#f5af19" /> SelectMyFlight Gold Elite • 42,500 Miles
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--card-subtle-bg, rgba(255, 255, 255, 0.08))',
              border: '1px solid var(--card-border, rgba(255, 255, 255, 0.15))',
              color: 'var(--text-main, #cbd5e1)',
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

        {/* Profile Form */}
        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          {saved && (
            <div style={{
              background: 'rgba(0, 230, 118, 0.15)',
              border: '1px solid #00e676',
              borderRadius: 8,
              padding: '10px 14px',
              color: '#00e676',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16
            }}>
              <CheckCircle2 size={16} /> Traveler preferences successfully updated!
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #475569)', marginBottom: 6 }}>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  background: 'var(--input-bg, #ffffff)',
                  border: '1.5px solid var(--input-border, #cbd5e1)',
                  color: 'var(--input-text, #0f172a)',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #475569)', marginBottom: 6 }}>Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  background: 'var(--input-bg, #ffffff)',
                  border: '1.5px solid var(--input-border, #cbd5e1)',
                  color: 'var(--input-text, #0f172a)',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600
                }}
              />
            </div>
          </div>

          {/* Travel Preferences */}
          <div style={{
            background: 'var(--card-subtle-bg, rgba(255, 255, 255, 0.03))',
            border: '1px solid var(--card-border, rgba(255, 255, 255, 0.08))',
            borderRadius: 10,
            padding: '16px',
            marginBottom: 20
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-cyan, #0284c7)', textTransform: 'uppercase', marginBottom: 12 }}>
              Default Travel Preferences
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted, #475569)', marginBottom: 4 }}>Seat Preference</label>
                <select
                  value={formData.preferredSeat}
                  onChange={(e) => setFormData({ ...formData, preferredSeat: e.target.value })}
                  style={{ width: '100%', background: 'var(--input-bg, #ffffff)', border: '1.5px solid var(--input-border, #cbd5e1)', color: 'var(--input-text, #0f172a)', padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}
                >
                  <option value="Window">Window Seat</option>
                  <option value="Aisle">Aisle Seat</option>
                  <option value="Extra Legroom">Extra Legroom</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted, #475569)', marginBottom: 4 }}>Preferred Class</label>
                <select
                  value={formData.preferredClass}
                  onChange={(e) => setFormData({ ...formData, preferredClass: e.target.value })}
                  style={{ width: '100%', background: 'var(--input-bg, #ffffff)', border: '1.5px solid var(--input-border, #cbd5e1)', color: 'var(--input-text, #0f172a)', padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted, #475569)', marginBottom: 4 }}>Home Hub</label>
                <select
                  value={formData.homeAirport}
                  onChange={(e) => setFormData({ ...formData, homeAirport: e.target.value })}
                  style={{ width: '100%', background: 'var(--input-bg, #ffffff)', border: '1.5px solid var(--input-border, #cbd5e1)', color: 'var(--input-text, #0f172a)', padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}
                >
                  <option value="DEL">New Delhi (DEL)</option>
                  <option value="BOM">Mumbai (BOM)</option>
                  <option value="BLR">Bengaluru (BLR)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted, #475569)', marginBottom: 4 }}>Frequent Flyer ID</label>
                <input
                  type="text"
                  readOnly
                  value="SMF-GOLD-88902"
                  style={{ width: '100%', background: 'var(--card-subtle-bg, rgba(255, 255, 255, 0.04))', border: '1.5px solid var(--card-border, rgba(255, 255, 255, 0.1))', color: '#f5af19', padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 800 }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 2, padding: '12px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Save size={16} /> Save Preferences
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSwitchAccount) onSwitchAccount();
              }}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: 13,
                fontWeight: 700,
                background: 'rgba(2, 132, 199, 0.12)',
                border: '1.5px solid rgba(2, 132, 199, 0.35)',
                color: 'var(--accent-cyan, #0284c7)',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              Switch User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
