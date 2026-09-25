import React from 'react';
import { X, Heart, Trash2, ArrowRight, Plane } from 'lucide-react';

export default function WishlistDrawer({ isOpen, wishlist, onClose, onRemove, onSelectFlight, currency }) {
  if (!isOpen) return null;

  const convertPrice = (inrPrice) => (currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice);
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(255, 82, 82, 0.15)', color: '#ff5252', padding: 8, borderRadius: 8 }}>
              <Heart size={20} fill="#ff5252" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                Saved Flights Wishlist
              </h3>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                {wishlist.length} saved route{wishlist.length === 1 ? '' : 's'}
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

        {/* Content */}
        <div style={{ padding: '24px', maxHeight: '65vh', overflowY: 'auto' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <Heart size={44} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ color: '#fff', fontSize: 16 }}>No Saved Flights Yet</h4>
              <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                Click the heart icon on any flight card to save deals and easily access them later.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {wishlist.map(flight => (
                <div
                  key={flight.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>
                      {flight.airlineName} ({flight.flightNumber})
                    </div>
                    <div style={{ fontSize: 12, color: '#00d2ff', marginTop: 2 }}>
                      {flight.originCode} ➔ {flight.destinationCode} • Dep: {flight.departureTime}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#00e676', marginTop: 4 }}>
                      {currencySymbol}{convertPrice(flight.basePrice).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      onClick={() => onRemove(flight.id)}
                      title="Remove from saved"
                      style={{
                        background: 'rgba(255, 82, 82, 0.1)',
                        border: 'none',
                        color: '#ff5252',
                        padding: 8,
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        onSelectFlight(flight);
                        onClose();
                      }}
                      className="btn-primary"
                      style={{ padding: '8px 14px', fontSize: 12 }}
                    >
                      Book <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
