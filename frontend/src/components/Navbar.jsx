import React from 'react';
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
  Shield,
  RefreshCw,
  Search,
  Sparkles,
  Building2,
  ChevronDown,
  Tag
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
  onOpenAdmin,
  onOpenProfile,
  onLogout
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 15, 29, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0, 210, 255, 0.15)',
      padding: '10px 24px'
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Left: Brand Logo & Live Beacon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div 
            onClick={() => setActiveTab('search')} 
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0, 210, 255, 0.35)',
              flexShrink: 0
            }}>
              <Plane size={22} color="#ffffff" style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 4, lineHeight: 1.1 }}>
                <span style={{ color: '#fff' }}>SelectMy</span>
                <span style={{ 
                  background: 'linear-gradient(135deg, #00d2ff, #f5af19)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800
                }}>Flight</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span className="live-dot" style={{ width: 6, height: 6 }} />
                <span style={{ fontSize: 9, color: '#00e676', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 800 }}>
                  LIVE OPERATIONS
                </span>
              </div>
            </div>
          </div>

          {/* Quick Feature Command Palette Trigger */}
          <button
            type="button"
            onClick={onOpenFeatureLauncher}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 20,
              padding: '6px 14px',
              color: '#94a3b8',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Search any feature, route, or task (Ctrl+K)"
          >
            <Search size={14} color="#00d2ff" />
            <span style={{ color: '#cbd5e1', fontWeight: 500 }}>Find Features...</span>
            <kbd style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1px 6px',
              borderRadius: 4,
              fontSize: 10,
              color: '#94a3b8'
            }}>Ctrl K</kbd>
          </button>
        </div>

        {/* Center: Main Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {/* Flights */}
          <button 
            type="button"
            onClick={() => setActiveTab('search')}
            style={{
              background: activeTab === 'search' ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
              color: activeTab === 'search' ? '#00d2ff' : '#cbd5e1',
              border: activeTab === 'search' ? '1px solid rgba(0, 210, 255, 0.4)' : '1px solid transparent',
              padding: '7px 13px',
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
            <Plane size={15} />
            Flights
          </button>

          {/* Hotels */}
          <button 
            type="button"
            onClick={() => setActiveTab('hotels')}
            style={{
              background: activeTab === 'hotels' ? 'rgba(245, 175, 25, 0.18)' : 'transparent',
              color: activeTab === 'hotels' ? '#f5af19' : '#cbd5e1',
              border: activeTab === 'hotels' ? '1px solid rgba(245, 175, 25, 0.45)' : '1px solid transparent',
              padding: '7px 13px',
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
            <Building2 size={15} color={activeTab === 'hotels' ? '#f5af19' : '#cbd5e1'} />
            Hotels
            <span style={{
              background: '#f5af19',
              color: '#090f1d',
              fontSize: 9,
              padding: '1px 5px',
              borderRadius: 6,
              fontWeight: 800
            }}>NEW</span>
          </button>

          {/* AI TripCraft */}
          <button 
            type="button"
            onClick={() => setActiveTab('itinerary')}
            style={{
              background: activeTab === 'itinerary' ? 'rgba(192, 132, 252, 0.2)' : 'transparent',
              color: activeTab === 'itinerary' ? '#c084fc' : '#cbd5e1',
              border: activeTab === 'itinerary' ? '1px solid rgba(192, 132, 252, 0.5)' : '1px solid transparent',
              padding: '7px 13px',
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
            <Sparkles size={15} color={activeTab === 'itinerary' ? '#c084fc' : '#cbd5e1'} />
            AI TripCraft
          </button>

          {/* Live Flight Status */}
          <button 
            type="button"
            onClick={() => setActiveTab('status')}
            style={{
              background: activeTab === 'status' ? 'rgba(0, 230, 118, 0.15)' : 'transparent',
              color: activeTab === 'status' ? '#00e676' : '#cbd5e1',
              border: activeTab === 'status' ? '1px solid rgba(0, 230, 118, 0.4)' : '1px solid transparent',
              padding: '7px 13px',
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
            <Radio size={15} color="#00e676" />
            Live Status
            <span style={{
              background: '#00e676',
              color: '#090f1d',
              fontSize: 9,
              padding: '1px 5px',
              borderRadius: 6,
              fontWeight: 800
            }}>RADAR</span>
          </button>

          {/* Live Refund Tracker */}
          <button 
            type="button"
            onClick={onOpenRefundTracker}
            style={{
              background: 'rgba(245, 175, 25, 0.08)',
              color: '#f5af19',
              border: '1px solid rgba(245, 175, 25, 0.25)',
              padding: '7px 13px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={14} color="#f5af19" />
            Refund Tracker
            <span style={{
              background: '#f5af19',
              color: '#000',
              fontSize: 9,
              padding: '1px 5px',
              borderRadius: 6,
              fontWeight: 900
            }}>PNR</span>
          </button>

          {/* SkyGenie AI */}
          <button 
            type="button"
            onClick={() => setActiveTab('ai')}
            style={{
              background: activeTab === 'ai' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === 'ai' ? '#c084fc' : '#cbd5e1',
              border: activeTab === 'ai' ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
              padding: '7px 13px',
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
            <Bot size={15} color="#c084fc" />
            SkyGenie AI
          </button>

          {/* Explore */}
          <button 
            type="button"
            onClick={() => setActiveTab('explore')}
            style={{
              background: activeTab === 'explore' ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
              color: activeTab === 'explore' ? '#00d2ff' : '#cbd5e1',
              border: activeTab === 'explore' ? '1px solid rgba(0, 210, 255, 0.4)' : '1px solid transparent',
              padding: '7px 13px',
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
            <Compass size={15} />
            Destinations
          </button>

          {/* Route Map */}
          <button 
            type="button"
            onClick={() => setActiveTab('map')}
            style={{
              background: activeTab === 'map' ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
              color: activeTab === 'map' ? '#00d2ff' : '#cbd5e1',
              border: activeTab === 'map' ? '1px solid rgba(0, 210, 255, 0.4)' : '1px solid transparent',
              padding: '7px 13px',
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
            <Globe size={15} />
            Route Map
          </button>

          {/* My Trips */}
          <button 
            type="button"
            onClick={() => setActiveTab('trips')}
            style={{
              background: activeTab === 'trips' ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === 'trips' ? '#00d2ff' : '#cbd5e1',
              border: activeTab === 'trips' ? '1px solid rgba(0, 210, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
              padding: '7px 13px',
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
            <Luggage size={15} />
            My Trips
            {myTripsCount > 0 && (
              <span style={{
                background: '#00e676',
                color: '#090f1d',
                fontSize: 10,
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: 10
              }}>
                {myTripsCount}
              </span>
            )}
          </button>



        </nav>

        {/* Right: Quick Tools & Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Price Alerts */}
          <button 
            type="button"
            onClick={onOpenAlerts}
            title="Flight Price Alerts"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '7px 10px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Bell size={15} color="#fb923c" />
            <span style={{ fontSize: 12 }}>Alerts</span>
          </button>

          {/* Wishlist */}
          <button 
            type="button"
            onClick={onOpenWishlist}
            title="Saved Flights / Wishlist"
            style={{
              background: wishlistCount > 0 ? 'rgba(255, 59, 48, 0.12)' : 'rgba(255, 255, 255, 0.05)',
              color: wishlistCount > 0 ? '#ff4d6d' : '#cbd5e1',
              border: wishlistCount > 0 ? '1px solid rgba(255, 59, 48, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
              padding: '7px 10px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Heart size={15} fill={wishlistCount > 0 ? '#ff4d6d' : 'none'} color="#ff4d6d" />
            {wishlistCount > 0 && (
              <span style={{
                background: '#ff4d6d',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 10,
                padding: '1px 5px'
              }}>
                {wishlistCount}
              </span>
            )}
          </button>

          {/* In-App Notifications */}
          <button 
            type="button"
            onClick={onOpenNotifications}
            title="Notifications"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '7px 10px',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Bell size={15} color="#00d2ff" />
            {unreadNotificationsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -3,
                right: -3,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#00e676',
                boxShadow: '0 0 8px #00e676'
              }} />
            )}
          </button>

          {/* Help Desk */}
          <button 
            type="button"
            onClick={onOpenHelpDesk}
            title="24/7 Help Desk & Support"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '7px 10px',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <HelpCircle size={15} color="#94a3b8" />
          </button>

          {/* Currency Switcher */}
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              background: '#0d1629',
              color: '#00d2ff',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              borderRadius: 8,
              padding: '6px 8px',
              fontSize: 12,
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>

          {/* Language Switcher */}
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: '#0d1629',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 8,
              padding: '6px 8px',
              fontSize: 12,
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="EN">EN</option>
            <option value="HI">हिन्दी</option>
            <option value="ES">ES</option>
            <option value="FR">FR</option>
          </select>

          {/* User Profile / Auth Buttons */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button 
                type="button"
                onClick={onOpenProfile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(0, 210, 255, 0.1)',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  padding: '5px 12px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: currentUser.role === 'ROLE_ADMIN' 
                    ? 'linear-gradient(135deg, #f5af19, #e65100)' 
                    : 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#fff'
                }}>
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <span>{currentUser.name ? currentUser.name.split(' ')[0] : 'User'}</span>
                {currentUser.role === 'ROLE_ADMIN' && (
                  <span style={{ fontSize: 10, background: '#f5af19', color: '#000', padding: '1px 5px', borderRadius: 4, fontWeight: 900 }}>ADMIN</span>
                )}
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sign Out"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '5px 9px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <button 
              type="button"
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0, 210, 255, 0.25)'
              }}
            >
              <User size={15} />
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
