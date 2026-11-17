import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Search 
} from 'lucide-react';
import { FEATURES_LIST } from '../data/featureList';

export default function FeatureHub({ onSelectFeature, activeFeatureId }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterQuery, setFilterQuery] = useState('');

  const categories = ['All', 'Holidays', 'Visas', 'Real-Time', 'Booking', 'AI Concierge', 'Savings', 'Experience', 'Assurance'];

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
      maxWidth: 1400,
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
            background: 'rgba(2, 132, 199, 0.12)',
            border: '1px solid rgba(2, 132, 199, 0.3)',
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--accent-cyan, #0284c7)',
            marginBottom: 6,
            letterSpacing: 0.5,
            textTransform: 'uppercase'
          }}>
            <Sparkles size={13} />
            <span>TRAVELER FEATURE DOCK</span>
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: -0.5 }}>
            Pick Any Feature & Launch Instantly
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            Real-time telemetry, direct refunds, 3D cabin layouts, AI concierge, or instant deals.
          </p>
        </div>

        {/* Quick Search in Features */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--card-subtle-bg, #f1f5f9)',
          border: '1px solid var(--card-border, #cbd5e1)',
          borderRadius: 20,
          padding: '8px 14px',
          width: '100%',
          maxWidth: 280
        }}>
          <Search size={14} color="var(--accent-cyan, #0284c7)" />
          <input
            type="text"
            placeholder="Filter features..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
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
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 8,
        marginBottom: 16
      }}>
        {categories.map((cat) => {
          const isCatActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: isCatActive 
                  ? 'linear-gradient(135deg, var(--accent-cyan, #0284c7), var(--accent-blue, #2563eb))' 
                  : 'var(--card-subtle-bg, #f1f5f9)',
                color: isCatActive ? '#ffffff' : 'var(--text-main, #334155)',
                border: isCatActive ? 'none' : '1px solid var(--card-border, #cbd5e1)',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: isCatActive ? 700 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s',
                boxShadow: isCatActive ? '0 4px 14px rgba(2, 132, 199, 0.25)' : 'none'
              }}
            >
              {cat === 'All' ? `⚡ All (${FEATURES_LIST.length})` : cat}
            </button>
          );
        })}
      </div>

      {/* Feature Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 14
      }}>
        {filteredFeatures.map((feat) => {
          const IconComp = feat.icon;
          const isActive = activeFeatureId === feat.id;

          return (
            <div
              key={feat.id}
              onClick={() => onSelectFeature(feat.id)}
              className="glass-card feature-hub-card"
              style={{
                padding: '16px',
                borderRadius: 14,
                cursor: 'pointer',
                border: isActive ? `1.5px solid ${feat.color}` : '1px solid var(--card-border, #e2e8f0)',
                background: 'var(--card-bg, #ffffff)',
                boxShadow: isActive ? `0 8px 24px ${feat.color}25` : '0 2px 8px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                minHeight: 185
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

              {/* Background flight image overlay (hidden in light mode via CSS) */}
              {feat.bgImage && (
                <div 
                  className="feature-card-dark-bg"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `linear-gradient(180deg, rgba(13, 22, 43, 0.72) 0%, rgba(9, 15, 29, 0.94) 100%), url('${feat.bgImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: isActive ? 0.95 : 0.82,
                    transition: 'opacity 0.3s ease',
                    zIndex: 0
                  }} 
                />
              )}

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header row: Icon & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: `${feat.color}15`,
                    border: `1px solid ${feat.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: feat.color,
                    flexShrink: 0
                  }}>
                    <IconComp size={19} />
                  </div>

                  <span 
                    className="feature-badge"
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 12,
                      background: `${feat.badgeColor || feat.color}15`,
                      color: feat.badgeColor || feat.color,
                      border: `1px solid ${feat.badgeColor || feat.color}40`,
                      letterSpacing: 0.5
                    }}
                  >
                    {feat.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: 'var(--text-main, #0f172a)',
                  marginBottom: 6,
                  lineHeight: 1.3
                }}>
                  {feat.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: 12,
                  color: 'var(--text-muted, #475569)',
                  lineHeight: 1.45,
                  marginBottom: 14
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
                borderTop: '1px solid var(--card-border, #e2e8f0)'
              }}>
                <span 
                  className="feature-action-label"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: feat.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  {feat.actionLabel || 'Launch Feature'}
                </span>
                <div style={{
                  background: `${feat.color}15`,
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
