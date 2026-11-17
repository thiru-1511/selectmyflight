import React, { useState, useEffect, useRef } from 'react';
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
  LogOut,
  Palmtree,
  FileCheck2,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  myTripsCount = 0, 
  wishlistCount = 0,
  unreadNotificationsCount = 0,
  currency = 'INR', 
  setCurrency, 
  theme = 'light',
  setTheme,
  language = 'EN',
  setLanguage,
  currentUser = null,
  onOpenAlerts,
  onOpenWishlist,
  onOpenNotifications,
  onOpenHelpDesk,
  onOpenRefundTracker,
  onOpenManageBooking,
  onOpenFeatureLauncher,
  onOpenAuth,
  onOpenProfile,
  onLogout
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef(null);

  const { t, language: contextLanguage, setLanguage: contextSetLanguage } = useLanguage();
  const currentLanguage = language || contextLanguage || 'EN';
  const handleLanguageChange = setLanguage || contextSetLanguage;

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setIsMoreMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMoreMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 1. Primary Travel Nav Items (Always visible on desktop in a single sleek row)
  const primaryNavItems = [
    { id: 'search', label: t('nav.flights', 'Flights'), icon: Plane },
    { id: 'hotels', label: t('nav.hotels', 'Hotels'), icon: Building2 },
    { id: 'packages', label: t('nav.holidays', 'Holidays'), icon: Palmtree, badge: 'HOT', badgeColor: '#f5af19' },
    { id: 'visa', label: t('nav.visa', 'Visa Desk'), icon: FileCheck2, badge: 'UAE', badgeColor: '#00e676' },
    { id: 'manage_booking_action', label: t('nav.manageBooking', 'Manage Booking'), icon: FileText, badge: 'PNR', badgeColor: '#0284c7', action: onOpenManageBooking },
    { id: 'trips', label: t('nav.myTrips', 'My Trips'), icon: Luggage, count: myTripsCount }
  ];

  // 2. Secondary Tools & Exploration (Organized in "More Services ▾" dropdown)
  const secondaryNavItems = [
    { id: 'ai', label: t('nav.skyGenie', 'SkyGenie AI Assistant'), icon: Bot, badge: 'AI 24/7', badgeColor: '#00d2ff', desc: 'Conversational travel concierge' },
    { id: 'status', label: t('nav.liveStatus', 'Live Flight Radar'), icon: Radio, badge: 'RADAR', badgeColor: '#00e676', desc: 'Real-time airborne telemetry' },
    { id: 'alerts_action', label: t('nav.priceAlerts', 'Price Alerts'), icon: Bell, badge: 'TRACK', badgeColor: '#f5af19', action: onOpenAlerts, desc: 'Instant fare drop alerts' },
    { id: 'refund_action', label: t('nav.refundTracker', 'Refund Tracker'), icon: RefreshCw, badge: 'PNR', badgeColor: '#f5af19', action: onOpenRefundTracker, desc: 'Instant bank refund audit' },
    { id: 'itinerary', label: t('nav.tripCraft', 'AI TripCraft Planner'), icon: Sparkles, desc: 'Personalized multi-day plans' },
    { id: 'explore', label: t('nav.destinations', 'Explore Destinations'), icon: Compass, desc: 'Curated world highlights' },
    { id: 'map', label: t('nav.routeMap', 'Interactive Route Map'), icon: Globe, desc: 'Global route visualizer' }
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];
  const activeSecondaryItem = secondaryNavItems.find(item => item.id === activeTab);
  const isSecondaryActive = Boolean(activeSecondaryItem);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--header-bg, rgba(9, 15, 29, 0.94))',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--header-border, rgba(0, 210, 255, 0.15))',
      padding: '7px 16px',
      transition: 'background-color 0.25s ease, border-color 0.25s ease'
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        {/* Left: Brand Logo & Live Beacon & Compact Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div 
            onClick={() => handleNavClick('search')} 
            style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}
          >
            <div className="navbar-logo-container" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              borderRadius: 8,
              flexShrink: 0
            }}>
              <img 
                src="/assets/images/selectmyflight_logo.png" 
                alt="SelectMyFlight" 
                style={{ height: 28, width: 28, borderRadius: 6, objectFit: 'contain', display: 'block', background: '#ffffff', padding: 2, border: '1px solid rgba(2, 132, 199, 0.2)' }} 
              />
              <span className="navbar-brand-title" style={{
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: -0.4,
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                Select<span style={{ color: '#0284c7' }}>My</span>Flight
              </span>
            </div>
            <div className="navbar-live-status-pill" style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              <span className="navbar-live-text" style={{ fontSize: 9, color: 'var(--accent-green, #059669)', letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 800 }}>
                {t('nav.liveOperations', 'LIVE')}
              </span>
            </div>
          </div>

          {/* Quick Feature Command Palette (Compact, responsive) */}
          <button
            type="button"
            onClick={onOpenFeatureLauncher}
            className="navbar-search-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'var(--card-subtle-bg, #f1f5f9)',
              border: '1px solid var(--card-border, #cbd5e1)',
              borderRadius: 20,
              padding: '4px 9px',
              color: 'var(--text-muted)',
              fontSize: 11.5,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              height: 30,
              transition: 'all 0.2s'
            }}
            title="Search features, routes, or tools (Ctrl+K)"
          >
            <Search size={13} color="var(--accent-cyan, #0284c7)" />
            <span className="navbar-search-text" style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 11.5 }}>{t('nav.findFeatures', 'Search')}</span>
            <kbd className="navbar-search-kbd" style={{
              background: 'var(--card-border, rgba(120, 130, 150, 0.15))',
              padding: '1px 4px',
              borderRadius: 4,
              fontSize: 8.5,
              color: 'var(--text-muted)',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}>Ctrl+K</kbd>
          </button>
        </div>

        {/* Center: Desktop Navigation Tabs (Strictly Single Row, Never Wraps) */}
        <nav className="desktop-nav-links" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3, 
          flexWrap: 'nowrap', 
          whiteSpace: 'nowrap' 
        }}>
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => item.action ? item.action() : handleNavClick(item.id)}
                className={`desktop-nav-btn ${isActive ? 'active' : ''}`}
                style={{
                  background: isActive ? 'rgba(2, 132, 199, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan, #0284c7)' : 'var(--text-main)',
                  border: isActive ? '1px solid var(--accent-cyan, rgba(0, 210, 255, 0.4))' : '1px solid transparent',
                  padding: '5px 8px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <Icon size={13.5} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="nav-badge" style={{
                    fontSize: 8.5,
                    background: `${item.badgeColor}22`,
                    color: item.badgeColor,
                    border: `1px solid ${item.badgeColor}55`,
                    padding: '1px 4px',
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
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: 10
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* More Services Dropdown */}
          <div ref={moreMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen(prev => !prev)}
              className={`desktop-nav-btn ${isSecondaryActive ? 'active' : ''}`}
              style={{
                background: isSecondaryActive ? 'rgba(2, 132, 199, 0.14)' : (isMoreMenuOpen ? 'var(--card-subtle-bg, #f1f5f9)' : 'transparent'),
                color: isSecondaryActive ? 'var(--accent-cyan, #0284c7)' : 'var(--text-main)',
                border: isSecondaryActive ? '1px solid var(--accent-cyan, rgba(0, 210, 255, 0.4))' : '1px solid transparent',
                padding: '5px 8px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: isSecondaryActive ? 700 : 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              title="More travel tools & services"
            >
              <span>{activeSecondaryItem ? activeSecondaryItem.label : t('nav.more', 'More Services')}</span>
              <ChevronDown 
                size={13} 
                style={{ 
                  transform: isMoreMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                  transition: 'transform 0.2s ease' 
                }} 
              />
            </button>

            {isMoreMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                minWidth: 260,
                background: 'var(--modal-bg, #ffffff)',
                border: '1px solid var(--card-border, #e2e8f0)',
                borderRadius: 12,
                boxShadow: '0 12px 36px rgba(15, 23, 42, 0.16)',
                padding: '8px',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: 3
              }}>
                {secondaryNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.action) item.action();
                        else handleNavClick(item.id);
                        setIsMoreMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: isActive ? 'rgba(2, 132, 199, 0.12)' : 'transparent',
                        color: isActive ? 'var(--accent-cyan, #0284c7)' : 'var(--text-main)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 500,
                        textAlign: 'left',
                        width: '100%',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'var(--card-subtle-bg, #f1f5f9)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: `${item.badgeColor || 'var(--accent-cyan, #0284c7)'}18`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Icon size={15} color={item.badgeColor || 'var(--accent-cyan, #0284c7)'} />
                        </div>
                        <div>
                          <div style={{ lineHeight: 1.2 }}>{item.label}</div>
                          {item.desc && (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontWeight: 400 }}>
                              {item.desc}
                            </div>
                          )}
                        </div>
                      </div>
                      {item.badge && (
                        <span style={{
                          fontSize: 9,
                          background: `${item.badgeColor}22`,
                          color: item.badgeColor,
                          border: `1px solid ${item.badgeColor}55`,
                          padding: '1px 5px',
                          borderRadius: 4,
                          fontWeight: 800,
                          flexShrink: 0
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Quick Tools & User Controls (Strictly pinned, never overflows or wraps) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          {/* Wishlist Icon */}
          <button 
            type="button"
            onClick={onOpenWishlist}
            title="Saved Flights / Wishlist"
            style={{
              background: wishlistCount > 0 ? 'rgba(255, 59, 48, 0.12)' : 'var(--card-subtle-bg, #f1f5f9)',
              color: wishlistCount > 0 ? '#ff4d6d' : 'var(--text-main)',
              border: wishlistCount > 0 ? '1px solid rgba(255, 59, 48, 0.3)' : '1px solid var(--card-border, #cbd5e1)',
              padding: '4px 7px',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              height: 30,
              flexShrink: 0
            }}
          >
            <Heart size={14} fill={wishlistCount > 0 ? '#ff4d6d' : 'none'} color="#ff4d6d" />
            {wishlistCount > 0 && (
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#ff4d6d' }}>{wishlistCount}</span>
            )}
          </button>

          {/* Notifications */}
          <button 
            type="button"
            onClick={onOpenNotifications}
            title="Notifications"
            style={{
              background: 'var(--card-subtle-bg, #f1f5f9)',
              color: 'var(--text-main)',
              border: '1px solid var(--card-border, #cbd5e1)',
              padding: '4px 7px',
              borderRadius: 8,
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: 30,
              flexShrink: 0
            }}
          >
            <Bell size={14} color="var(--accent-cyan, #0284c7)" />
            {unreadNotificationsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -3,
                right: -3,
                background: 'var(--accent-cyan, #0284c7)',
                color: '#ffffff',
                fontSize: 8.5,
                fontWeight: 900,
                width: 14,
                height: 14,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Desktop Currency / Language / Theme */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                background: 'var(--card-subtle-bg, #f1f5f9)',
                color: 'var(--accent-cyan, #0284c7)',
                border: '1px solid var(--card-border, #cbd5e1)',
                padding: '2px 5px',
                borderRadius: 8,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                height: 30
              }}
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>

            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                background: 'var(--card-subtle-bg, #f1f5f9)',
                color: 'var(--text-main)',
                border: '1px solid var(--card-border, #cbd5e1)',
                padding: '2px 5px',
                borderRadius: 8,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
                height: 30
              }}
            >
              <option value="EN">EN</option>
              <option value="HI">HI</option>
              <option value="ES">ES</option>
              <option value="FR">FR</option>
            </select>

            {/* Theme Selector */}
            <select
              value={theme}
              onChange={(e) => setTheme && setTheme(e.target.value)}
              title="Change Color Theme"
              style={{
                background: 'var(--card-subtle-bg, #f1f5f9)',
                color: 'var(--text-main)',
                border: '1px solid var(--card-border, #cbd5e1)',
                padding: '2px 5px',
                borderRadius: 8,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                height: 30
              }}
            >
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="royal">👑 Royal</option>
              <option value="emerald">🌿 Emerald</option>
            </select>
          </div>

          {/* User Account / Profile Button (Prominently styled, high contrast, never cut off) */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <button 
              type="button"
              onClick={currentUser ? onOpenProfile : onOpenAuth}
              className="navbar-user-profile-btn"
              title={`Logged in as ${currentUser?.name || 'Thiru'} (${currentUser?.email || 'thiru1511@gmail.com'}) - Click to view profile`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 10px 3px 5px',
                borderRadius: 20,
                cursor: 'pointer',
                height: 32,
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800,
                color: '#ffffff',
                boxShadow: '0 1px 4px rgba(2, 132, 199, 0.35)',
                flexShrink: 0
              }}>
                {(currentUser?.name || 'Thiru')[0].toUpperCase()}
              </div>
              <span 
                className="navbar-user-name" 
                style={{ 
                  fontWeight: 800, 
                  fontSize: 13,
                  letterSpacing: -0.2
                }}
              >
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'Thiru'}
              </span>
              <ChevronDown size={11} style={{ opacity: 0.65 }} />
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--card-subtle-bg, #f1f5f9)',
              border: '1px solid var(--card-border, #cbd5e1)',
              color: 'var(--text-main)',
              width: 36,
              height: 36,
              borderRadius: 8,
              cursor: 'pointer'
            }}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} color="var(--accent-cyan, #0284c7)" /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Quick Tab Bar */}
      <div className="mobile-menu-btn scroll-touch-x" style={{ display: 'none', marginTop: 8, paddingBottom: 4 }}>
        {allNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => item.action ? item.action() : handleNavClick(item.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--card-subtle-bg, #f1f5f9)',
                color: isActive ? '#fff' : 'var(--text-main, #334155)',
                border: isActive ? '1px solid #0284c7' : '1px solid var(--card-border, #cbd5e1)',
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
                <span style={{ fontSize: 8, background: 'rgba(0,0,0,0.15)', padding: '1px 4px', borderRadius: 4, fontWeight: 800 }}>
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
          background: 'var(--modal-bg, #ffffff)',
          border: '1px solid var(--card-border, #e2e8f0)',
          borderRadius: 14,
          padding: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          animation: 'slideUp 0.2s ease-out'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {allNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => item.action ? item.action() : handleNavClick(item.id)}
                  style={{
                    background: isActive ? 'rgba(2, 132, 199, 0.12)' : 'var(--card-subtle-bg, #f1f5f9)',
                    color: isActive ? 'var(--accent-cyan, #0284c7)' : 'var(--text-main)',
                    border: isActive ? '1px solid var(--accent-cyan, #0284c7)' : '1px solid var(--card-border, #e2e8f0)',
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
                  <Icon size={16} color={isActive ? 'var(--accent-cyan, #0284c7)' : 'var(--text-muted)'} />
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
            background: 'var(--card-subtle-bg, #f1f5f9)',
            padding: '12px',
            borderRadius: 10,
            marginBottom: 12,
            gap: 10
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
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
              <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                {t('nav.language', 'Language')}
              </label>
              <select
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', fontSize: 13 }}
              >
                <option value="EN">English (EN)</option>
                <option value="HI">हिन्दी (HI)</option>
                <option value="ES">Español (ES)</option>
                <option value="FR">Français (FR)</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme && setTheme(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', fontSize: 13, fontWeight: 700 }}
              >
                <option value="light">☀️ Light</option>
                <option value="dark">🌙 Dark</option>
                <option value="royal">👑 Royal</option>
                <option value="emerald">🌿 Emerald</option>
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
                background: 'var(--card-subtle-bg, #f1f5f9)',
                border: '1px solid var(--card-border, #e2e8f0)',
                color: 'var(--text-main)',
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
