import React, { useState } from 'react';
import { X, User, Award, Shield, CheckCircle2, Star, Save } from 'lucide-react';

export default function UserProfileModal({ isOpen, user, onClose, onUpdateUser, onSwitchAccount }) {
  const [formData, setFormData] = useState({
    name: user?.name || 'Rahul Sharma',
    email: user?.email || 'rahul.sharma@gmail.com',
    phone: user?.phone || '+91 98765 43210',
    preferredSeat: user?.preferredSeat || 'Window',
    preferredClass: user?.preferredClass || 'Business',
    preferredMeal: user?.preferredMeal || 'Royal Rajasthani Thali (Veg)',
    homeAirport: user?.homeAirport || 'DEL'
  });

  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f5af19, #e65c00)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 18
            }}>
              RS
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                {formData.name}
              </h3>
              <div style={{ fontSize: 11, color: '#f5af19', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                <Star size={12} fill="#f5af19" /> SelectMyFlight Gold Elite • 42,500 Miles
              </div>
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
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 13
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 13
                }}
              />
            </div>
          </div>

          {/* Travel Preferences */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 10,
            padding: '16px',
            marginBottom: 20
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#00d2ff', textTransform: 'uppercase', marginBottom: 12 }}>
              Default Travel Preferences
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Seat Preference</label>
                <select
                  value={formData.preferredSeat}
                  onChange={(e) => setFormData({ ...formData, preferredSeat: e.target.value })}
                  style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '8px', borderRadius: 6, fontSize: 12 }}
                >
                  <option value="Window">Window Seat</option>
                  <option value="Aisle">Aisle Seat</option>
                  <option value="Extra Legroom">Extra Legroom</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Preferred Class</label>
                <select
                  value={formData.preferredClass}
                  onChange={(e) => setFormData({ ...formData, preferredClass: e.target.value })}
                  style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '8px', borderRadius: 6, fontSize: 12 }}
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Home Hub</label>
                <select
                  value={formData.homeAirport}
                  onChange={(e) => setFormData({ ...formData, homeAirport: e.target.value })}
                  style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '8px', borderRadius: 6, fontSize: 12 }}
                >
                  <option value="DEL">New Delhi (DEL)</option>
                  <option value="BOM">Mumbai (BOM)</option>
                  <option value="BLR">Bengaluru (BLR)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Frequent Flyer ID</label>
                <input
                  type="text"
                  readOnly
                  value="SMF-GOLD-88902"
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f5af19', padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}
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
                background: 'rgba(0, 210, 255, 0.12)',
                border: '1px solid rgba(0, 210, 255, 0.35)',
                color: '#00d2ff',
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
