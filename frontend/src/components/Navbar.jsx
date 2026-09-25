import React, { useState } from 'react';
import { 
  Plane, 
  Bell, 
  Bot, 
  Luggage, 
  Compass, 
  Globe, 
  Heart, 
  HelpCircle, 
  User, 
  Radio,
  RefreshCw,
  Search,
  Sparkles,
  Building2,
  ChevronDown,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  myTripsCount = 0, 
  wishlistCount = 0,
  unreadNotificationsCount = 0,
  currency = 'INR', 
  setCurrency, 
  language = 'EN',
  setLanguage,
  currentUser = null,
  onOpenAlerts,
  onOpenWishlist,
  onOpenNotifications,
  onOpenHelpDesk,
  onOpenRefundTracker,
  onOpenFeatureLauncher,
  onOpenAuth,
  onOpenProfile,
  onLogout
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'search', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Building2, badge: 'NEW', badgeColor: '#f5af19' },
    { id: 'itinerary', label: 'AI TripCraft', icon: Sparkles },
    { id: 'status', label: 'Live Status', icon: Radio, badge: 'RADAR', badgeColor: '#00e676' },
    { id: 'refund_action', label: 'Refund Tracker', icon: RefreshCw, badge: 'PNR', badgeColor: '#f5af19', action: onOpenRefundTracker },
    { id: 'ai', label: 'SkyGenie AI', icon: Bot },
    { id: 'explore', label: 'Destinations', icon: Compass },
    { id: 'map', label: 'Route Map', icon: Globe },
    { id: 'trips', label: 'My Trips', icon: Luggage, count: myTripsCount }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 15, 29, 0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0, 210, 255, 0.15)',
      padding: '8px 16px'
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        {/* Left: Brand Logo & Live Beacon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div 
            onClick={() => handleNavClick('search')} 
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0, 210, 255, 0.35)',
              flexShrink: 0
            }}>
              <Plane size={20} color="#ffffff" style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 3, lineHeight: 1.1 }}>
                <span style={{ color: '#fff' }}>SelectMy</span>
                <span style={{ 
                  background: 'linear-gradient(135deg, #00d2ff, #f5af19)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800
                }}>Flight</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <span className="live-dot" style={{ width: 5, height: 5 }} />
                <span style={{ fontSize: 8, color: '#00e676', letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 800 }}>
                  LIVE OPERATIONS
                </span>
              </div>
            </div>
          </div>

          {/* Quick Feature Command Palette (Desktop Only) */}
          <button
            type="button"
            onClick={onOpenFeatureLauncher}
            className="desktop-only"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 20,
              padding: '6px 12px',
              color: '#94a3b8',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Search any feature, route, or task (Ctrl+K)"
          >
            <Search size={13} color="#00d2ff" />
            <span style={{ color: '#cbd5e1', fontWeight: 500 }}>Find Features...</span>
            <kbd style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1px 5px',
              borderRadius: 4,
              fontSize: 9,
              color: '#94a3b8'
            }}>Ctrl K</kbd>
          </button>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => item.action ? item.action() : handleNavClick(item.id)}
                style={{
                  background: isActive ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
                  color: isActive ? '#00d2ff' : '#cbd5e1',
                  border: isActive ? '1px solid rgba(0, 210, 255, 0.4)' : '1px solid transparent',
                  padding: '7px 11px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={14} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: 9,
                    background: `${item.badgeColor}22`,
                    color: item.badgeColor,
                    border: `1px solid ${item.badgeColor}55`,
                    padding: '1px 5px',
                    borderRadius: 4,
                    fontWeight: 800
                  }}>
                    {item.badge}
                  </span>
                )}
                {item.count > 0 && (
                  <span style={{
                    background: '#00e676',
                    color: '#090f1d',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 10
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Tools & User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Wishlist Icon */}
          <button 
            type="button"
            onClick={onOpenWishlist}
            title="Saved Flights / Wishlist"
            style={{
              background: wishlistCount > 0 ? 'rgba(255, 59, 48, 0.12)' : 'rgba(255, 255, 255, 0.05)',
              color: wishlistCount > 0 ? '#ff4d6d' : '#cbd5e1',
              border: wishlistCount > 0 ? '1px solid rgba(255, 59, 48, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
              padding: '6px 9px',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Heart size={15} fill={wishlistCount > 0 ? '#ff4d6d' : 'none'} color="#ff4d6d" />
            {wishlistCount > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, color: '#ff4d6d' }}>{wishlistCount}</span>
            )}
          </button>

          {/* Notifications */}
          <button 
            type="button"
            onClick={onOpenNotifications}
            title="Notifications"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '6px 9px',
              borderRadius: 8,
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Bell size={15} color="#00d2ff" />
            {unreadNotificationsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -3,
                right: -3,
                background: '#00d2ff',
                color: '#090f1d',
                fontSize: 9,
                fontWeight: 900,
                width: 15,
                height: 15,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Desktop Currency / Language */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#00d2ff',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '5px 8px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                minHeight: 34
              }}
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '5px 8px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 34
              }}
            >
              <option value="EN">EN</option>
              <option value="HI">HI</option>
              <option value="ES">ES</option>
              <option value="FR">FR</option>
            </select>
          </div>

          {/* User Account / Profile */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button 
                type="button"
                onClick={onOpenProfile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(0, 210, 255, 0.1)',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  padding: '5px 10px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600
                }}
              >
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#fff'
                }}>
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <span className="desktop-only">{currentUser.name ? currentUser.name.split(' ')[0] : 'User'}</span>
              </button>
            </div>
          ) : (
            <button 
              type="button"
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                color: '#ffffff',
                border: 'none',
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0, 210, 255, 0.25)'
              }}
            >
              <User size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              width: 38,
              height: 38,
              borderRadius: 8,
              cursor: 'pointer'
            }}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} color="#00d2ff" /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Quick Tab Bar */}
      <div className="mobile-menu-btn scroll-touch-x" style={{ display: 'none', marginTop: 8, paddingBottom: 4 }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => item.action ? item.action() : handleNavClick(item.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'rgba(255, 255, 255, 0.06)',
                color: isActive ? '#fff' : '#cbd5e1',
                border: isActive ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                flexShrink: 0,
                cursor: 'pointer'
              }}
            >
              <Icon size={13} />
              <span>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 8, background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: 4, fontWeight: 800 }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Slide-Down Drawer Menu */}
      {isMobileMenuOpen && (
        <div style={{
          marginTop: 10,
          background: '#0d1629',
          border: '1px solid rgba(0, 210, 255, 0.25)',
          borderRadius: 14,
          padding: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          animation: 'slideUp 0.2s ease-out'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => item.action ? item.action() : handleNavClick(item.id)}
                  style={{
                    background: isActive ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#00d2ff' : '#f8fafc',
                    border: isActive ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={16} color={isActive ? '#00d2ff' : '#94a3b8'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Currency & Language Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '12px',
            borderRadius: 10,
            marginBottom: 12,
            gap: 10
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', fontSize: 13, fontWeight: 700 }}
              >
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="GBP">£ GBP (British Pound)</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', fontSize: 13 }}
              >
                <option value="EN">English (EN)</option>
                <option value="HI">हिन्दी (HI)</option>
                <option value="ES">Español (ES)</option>
                <option value="FR">Français (FR)</option>
              </select>
            </div>
          </div>

          {/* Quick Help & Logout */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenHelpDesk();
              }}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '10px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer'
              }}
            >
              <HelpCircle size={15} /> Help Desk
            </button>

            {currentUser && onLogout && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer'
                }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
