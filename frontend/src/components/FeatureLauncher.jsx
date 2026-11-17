import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Plane, 
  Radio, 
  RefreshCw, 
  Bot, 
  Armchair, 
  BellRing, 
  Luggage, 
  Tag, 
  Globe, 
  Compass, 
  HelpCircle,
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { FEATURES_LIST } from '../data/featureList';

export default function FeatureLauncher({ isOpen, onClose, onSelectFeature, onQuickPrompt }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const QUICK_ACTIONS = [
    {
      id: 'quick_dubai',
      title: 'Search Delhi to Dubai Flights (DXB)',
      category: 'Fast Search',
      icon: Plane,
      color: '#00d2ff',
      handler: () => onQuickPrompt && onQuickPrompt('DEL', 'DXB')
    },
    {
      id: 'quick_mumbai',
      title: 'Search Delhi to Mumbai Express (BOM)',
      category: 'Fast Search',
      icon: Plane,
      color: '#00d2ff',
      handler: () => onQuickPrompt && onQuickPrompt('DEL', 'BOM')
    },
    {
      id: 'quick_london',
      title: 'Search Delhi to London Direct (LHR)',
      category: 'Fast Search',
      icon: Plane,
      color: '#00d2ff',
      handler: () => onQuickPrompt && onQuickPrompt('DEL', 'LHR')
    }
  ];

  const filteredFeatures = FEATURES_LIST.filter(f =>
    f.title.toLowerCase().includes(query.toLowerCase()) ||
    f.description.toLowerCase().includes(query.toLowerCase()) ||
    f.category.toLowerCase().includes(query.toLowerCase()) ||
    f.badge.toLowerCase().includes(query.toLowerCase())
  );

  const filteredQuickActions = QUICK_ACTIONS.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = [...filteredFeatures, ...filteredQuickActions];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (totalResults.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalResults.length) % (totalResults.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = totalResults[selectedIndex];
      if (item) {
        if (item.handler) {
          item.handler();
        } else {
          onSelectFeature(item.id);
        }
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: 640,
          background: 'var(--modal-bg, #ffffff)',
          backdropFilter: 'blur(24px)',
          border: '1px solid var(--card-border, #cbd5e1)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4), var(--glow-cyan)'
        }}
      >
        {/* Search Bar Input */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--card-border, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <Search size={20} color="var(--accent-cyan, #0284c7)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a feature, route, or task (e.g. 'refund', 'status', 'seat map', 'dubai')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main, #0f172a)',
              fontSize: 16,
              fontWeight: 600
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 11,
            color: '#94a3b8'
          }}>
            <span>ESC to close</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 4
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 420, overflowY: 'auto', padding: '12px 14px' }}>
          {totalResults.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted, #64748b)' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>No features found for "{query}"</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Try searching "refund", "status", "deals", or "seat".</p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', padding: '6px 12px', letterSpacing: 0.8 }}>
                Available Features & Quick Launchers
              </div>

              {totalResults.map((item, idx) => {
                const IconComp = item.icon || Sparkles;
                const isSelected = idx === selectedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.handler) item.handler();
                      else onSelectFeature(item.id);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(2, 132, 199, 0.12)' : 'transparent',
                      border: isSelected ? '1px solid rgba(2, 132, 199, 0.35)' : '1px solid transparent',
                      transition: 'all 0.15s ease',
                      marginBottom: 4
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: `${item.color || '#0284c7'}22`,
                        border: `1px solid ${item.color || '#0284c7'}44`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color || 'var(--accent-cyan, #0284c7)'
                      }}>
                        <IconComp size={18} />
                      </div>

                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? 'var(--accent-cyan, #0284c7)' : 'var(--text-main, #0f172a)' }}>
                          {item.title}
                        </div>
                        {item.description && (
                          <div style={{ fontSize: 12, color: 'var(--text-muted, #475569)', marginTop: 1 }}>
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {item.badge && (
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#94a3b8',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4
                        }}>
                          {item.badge}
                        </span>
                      )}
                      <ArrowRight size={15} color={isSelected ? '#00d2ff' : '#64748b'} />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{
          padding: '10px 18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11,
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Command size={12} />
            <span>SelectMyFlight Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}
