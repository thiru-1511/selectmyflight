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
      padding: '32px 24px 16px 24px'
    }}>
      {/* Header & Feature Picker Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0, 210, 255, 0.12)',
            border: '1px solid rgba(0, 210, 255, 0.3)',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            color: '#00d2ff',
            marginBottom: 8
          }}>
            <Sparkles size={14} />
            <span>ALL-IN-ONE TRAVELER FEATURE DOCK</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
            Pick Any Feature & Launch Instantly
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            Explore real-time telemetry, direct PNR refunds, 3D cabin layouts, AI concierge, or instant deals with 1-click.
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
          padding: '8px 14px',
          width: 260
        }}>
          <Search size={15} color="#94a3b8" />
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
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 8,
        marginBottom: 20,
        scrollbarWidth: 'none'
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
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: selectedCategory === cat ? '0 4px 15px rgba(0, 210, 255, 0.3)' : 'none'
            }}
          >
            {cat === 'All' ? '⚡ All Features (11)' : cat}
          </button>
        ))}
      </div>

      {/* Feature Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16
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
                padding: '20px',
                borderRadius: 14,
                cursor: 'pointer',
                border: isActive ? `1px solid ${feat.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                background: isActive ? 'rgba(18, 28, 54, 0.95)' : 'rgba(18, 28, 54, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = feat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = isActive ? feat.color : 'rgba(255, 255, 255, 0.08)';
              }}
            >
              {/* Top Accent glow bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${feat.color}, transparent)`
              }} />

              <div>
                {/* Header row: Icon & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${feat.color}20`,
                    border: `1px solid ${feat.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: feat.color
                  }}>
                    <IconComp size={20} />
                  </div>

                  <span style={{
                    background: `${feat.badgeColor}18`,
                    color: feat.badgeColor,
                    border: `1px solid ${feat.badgeColor}35`,
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 6,
                    letterSpacing: 0.5
                  }}>
                    {feat.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 16 }}>
                  {feat.description}
                </p>
              </div>

              {/* Action Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: feat.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  {feat.actionLabel}
                  <ArrowRight size={14} />
                </span>

                <span style={{ fontSize: 11, color: '#64748b' }}>
                  Click to launch
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
