import React, { useState } from 'react';
import { 
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2
} from 'lucide-react';
import { FEATURES_LIST } from '../data/featureList';

export default function FeatureHub({ onSelectFeature, activeFeatureId }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterQuery, setFilterQuery] = useState('');

  const categories = ['All', 'Real-Time', 'Booking', 'AI Concierge', 'Savings', 'Experience', 'Assurance'];

  const filteredFeatures = FEATURES_LIST.filter(f => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory || (selectedCategory === 'Real-Time' && ['status', 'refund', 'map'].includes(f.id));
    const matchesQuery = filterQuery === '' || 
      f.title.toLowerCase().includes(filterQuery.toLowerCase()) || 
      f.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      f.badge.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <section style={{
      maxWidth: 1360,
      margin: '0 auto',
      padding: '24px 16px 16px 16px'
    }}>
      {/* Header & Feature Picker Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16
      }}>
        <div style={{ flex: '1 1 280px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0, 210, 255, 0.12)',
            border: '1px solid rgba(0, 210, 255, 0.3)',
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            color: '#00d2ff',
            marginBottom: 6
          }}>
            <Sparkles size={13} />
            <span>TRAVELER FEATURE DOCK</span>
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
            Pick Any Feature & Launch Instantly
          </h2>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            Real-time telemetry, direct refunds, 3D cabin layouts, AI concierge, or instant deals.
          </p>
        </div>

        {/* Quick Search in Features */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 10,
          padding: '8px 12px',
          width: '100%',
          maxWidth: 280
        }}>
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Filter features..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: 13,
              width: '100%',
              padding: 0,
              minHeight: 'auto'
            }}
          />
        </div>
      </div>

      {/* Category Pills (Horizontal Touch Swipe) */}
      <div className="scroll-touch-x" style={{
        paddingBottom: 8,
        marginBottom: 16
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedCategory === cat ? '#fff' : '#cbd5e1',
              border: selectedCategory === cat ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
              padding: '6px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s',
              boxShadow: selectedCategory === cat ? '0 4px 15px rgba(0, 210, 255, 0.3)' : 'none'
            }}
          >
            {cat === 'All' ? '⚡ All (11)' : cat}
          </button>
        ))}
      </div>

      {/* Feature Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 12
      }}>
        {filteredFeatures.map((feat) => {
          const IconComp = feat.icon;
          const isActive = activeFeatureId === feat.id;

          return (
            <div
              key={feat.id}
              onClick={() => onSelectFeature(feat.id)}
              className="glass-card"
              style={{
                padding: '16px',
                borderRadius: 12,
                cursor: 'pointer',
                border: isActive ? `1px solid ${feat.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                background: isActive ? 'rgba(18, 28, 54, 0.95)' : 'rgba(18, 28, 54, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Top Accent glow bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${feat.color}, transparent)`,
                zIndex: 2
              }} />

              {/* Background flight image overlay */}
              {feat.bgImage && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `linear-gradient(180deg, rgba(13, 22, 43, 0.72) 0%, rgba(9, 15, 29, 0.94) 100%), url('${feat.bgImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: isActive ? 0.95 : 0.82,
                  transition: 'opacity 0.3s ease',
                  zIndex: 0
                }} />
              )}

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header row: Icon & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: `${feat.color}25`,
                    border: `1px solid ${feat.color}66`,
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: feat.color,
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${feat.color}33`
                  }}>
                    <IconComp size={19} />
                  </div>

                  <span style={{
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 12,
                    background: 'rgba(9, 15, 29, 0.85)',
                    backdropFilter: 'blur(6px)',
                    color: feat.badgeColor || feat.color,
                    border: `1px solid ${feat.badgeColor || feat.color}60`,
                    letterSpacing: 0.5
                  }}>
                    {feat.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 4,
                  lineHeight: 1.2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)'
                }}>
                  {feat.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: 12,
                  color: '#cbd5e1',
                  lineHeight: 1.4,
                  marginBottom: 12,
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}>
                  {feat.description}
                </p>
              </div>

              {/* Action Link Button */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 10,
                borderTop: '1px solid rgba(255, 255, 255, 0.12)'
              }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: feat.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  {feat.actionLabel || 'Launch Feature'}
                </span>
                <div style={{
                  background: `${feat.color}22`,
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowRight size={13} color={feat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
