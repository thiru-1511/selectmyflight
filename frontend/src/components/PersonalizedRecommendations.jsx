import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  TrendingUp, 
  Plane, 
  ArrowRight, 
  Star, 
  Palmtree, 
  Heart, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  SlidersHorizontal,
  MapPin,
  Clock,
  Building2
} from 'lucide-react';
import { HOLIDAY_PACKAGES } from '../data/mockPackages';

export default function PersonalizedRecommendations({ 
  user, 
  currency = 'INR', 
  onSelectRoute = () => {}, 
  onSelectPackage = () => {}, 
  onNavigateToTab = () => {} 
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedHomeAirport, setSelectedHomeAirport] = useState(user?.homeAirport || 'DEL');
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('smf_wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const preferredClass = user?.preferredClass || 'Economy';
  const frequentFlyerTier = user?.frequentFlyerTier || 'Gold Elite';
  const userName = user?.name ? user.name.split(' ')[0] : 'Traveler';

  const formatPrice = (amount) => {
    if (currency === 'USD') return `$${Math.round(amount / 83)}`;
    if (currency === 'EUR') return `€${Math.round(amount / 90)}`;
    if (currency === 'GBP') return `£${Math.round(amount / 105)}`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const toggleWishlist = (item) => {
    const isSaved = wishlist.some(w => w.id === item.id);
    let updated;
    if (isSaved) {
      updated = wishlist.filter(w => w.id !== item.id);
    } else {
      updated = [{ ...item, addedAt: new Date().toISOString() }, ...wishlist];
    }
    setWishlist(updated);
    try {
      localStorage.setItem('smf_wishlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('smf_data_updated'));
    } catch {
      // ignore
    }
  };

  const allRecommendations = [
    {
      id: 'rec-pkg-dubai',
      type: 'HOLIDAY_PACKAGE',
      category: 'luxury',
      matchScore: 98,
      title: 'Dubai Extravaganza & Desert Safari',
      destination: 'Dubai, UAE',
      destCode: 'DXB',
      origin: selectedHomeAirport,
      duration: '5 Days / 4 Nights',
      price: 42500,
      originalPrice: 49900,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80',
      reason: `Direct non-stop flight from ${selectedHomeAirport} • Ideal 27°C sunny weather • UAE visa assistance`,
      bestSeason: 'Nov – Mar (Prime Season)',
      inclusions: ['Roundtrip Flights Included', '4★ Downtown Hotel Stay', 'Burj Khalifa 124th Floor', '4x4 Desert Safari & BBQ'],
      tag: 'Top AI Recommendation',
      tagColor: '#00d2ff',
      packageRef: HOLIDAY_PACKAGES[0]
    },
    {
      id: 'rec-pkg-bali',
      type: 'HOLIDAY_PACKAGE',
      category: 'beach',
      matchScore: 97,
      title: 'Tropical Bali — Ubud Jungle & Beach Luxury',
      destination: 'Bali, Indonesia',
      destCode: 'DPS',
      origin: selectedHomeAirport,
      duration: '6 Days / 5 Nights',
      price: 49800,
      originalPrice: 58000,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80',
      reason: `Matches your romantic & villa preference • Private pool villa in Ubud • Speedboat island tour`,
      bestSeason: 'All Year Tropical (28°C)',
      inclusions: ['Return Flights Included', 'Private Pool Villa Stay', 'Nusa Penida Island Tour', 'Floating Villa Breakfast'],
      tag: 'Honeymoon Special',
      tagColor: '#f5af19',
      packageRef: HOLIDAY_PACKAGES[3]
    },
    {
      id: 'rec-flight-goa',
      type: 'FLIGHT',
      category: 'beach',
      matchScore: 96,
      title: 'Weekend Beach Escape',
      destination: 'Goa (Dabolim / Mopa)',
      destCode: 'GOI',
      origin: selectedHomeAirport,
      duration: '2h 35m Non-stop',
      airline: 'IndiGo 6E-6351',
      price: 5800,
      originalPrice: 7200,
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
      reason: `Quickest direct weekend flight from ${selectedHomeAirport} • Save 15% on Friday departures`,
      bestSeason: 'Oct – May (Beach Festival Season)',
      inclusions: ['Express Direct Flight', 'Cabin + 15kg Checked Bag', 'Double Miles for ' + frequentFlyerTier],
      tag: 'Weekend Flight Deal',
      tagColor: '#00e676'
    },
    {
      id: 'rec-pkg-kerala',
      type: 'HOLIDAY_PACKAGE',
      category: 'nature',
      matchScore: 95,
      title: 'Magical Kerala — Backwaters & Tea Hills',
      destination: 'Kerala, India',
      destCode: 'COK',
      origin: selectedHomeAirport,
      duration: '6 Days / 5 Nights',
      price: 28900,
      originalPrice: 34500,
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
      reason: `100% verified traveler rating • Private Alleppey houseboat with all meals & Munnar hill resort`,
      bestSeason: 'Sep – Mar (Lush & Misty)',
      inclusions: ['Flights to Cochin Included', 'Alleppey Private Houseboat', 'Munnar Tea Hill Resort', 'Chauffeur AC Car'],
      tag: 'Nature & Wellness',
      tagColor: '#10b981',
      packageRef: HOLIDAY_PACKAGES[1]
    },
    {
      id: 'rec-pkg-singapore',
      type: 'HOLIDAY_PACKAGE',
      category: 'luxury',
      matchScore: 94,
      title: 'Singapore & Sentosa Futuristic Wonderland',
      destination: 'Singapore',
      destCode: 'SIN',
      origin: selectedHomeAirport,
      duration: '5 Days / 4 Nights',
      price: 54000,
      originalPrice: 62000,
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=80',
      reason: `Prime international gateway • Universal Studios passes + Gardens by the Bay + Changi Jewel`,
      bestSeason: 'Year Round (Festive Vibes)',
      inclusions: ['Roundtrip Flights Included', '4★ City Hotel Stay', 'Universal Studios Full Pass', 'Airport Private Transfers'],
      tag: 'Family Favorite',
      tagColor: '#c084fc',
      packageRef: HOLIDAY_PACKAGES[2]
    },
    {
      id: 'rec-flight-london',
      type: 'FLIGHT',
      category: 'luxury',
      matchScore: 92,
      title: 'London Metropolis & Royal Heritage Corridor',
      destination: 'London (Heathrow)',
      destCode: 'LHR',
      origin: selectedHomeAirport,
      duration: '9h 00m Direct',
      airline: 'Air India AI-161 (Boeing 787)',
      price: 42900,
      originalPrice: 51000,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=80',
      reason: `Direct long-haul corridor from ${selectedHomeAirport} • Double frequent flyer points for ${frequentFlyerTier}`,
      bestSeason: 'May – Sep (Long Sunny Days)',
      inclusions: ['Non-Stop Dreamliner 787', '2x 23kg Checked Bags', 'Gourmet Inflight Dining', 'Complimentary Lounge Access'],
      tag: 'Global Flagship Route',
      tagColor: '#38bdf8'
    }
  ];

  const filtered = allRecommendations.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'packages') return item.type === 'HOLIDAY_PACKAGE';
    if (activeFilter === 'flights') return item.type === 'FLIGHT';
    if (activeFilter === 'beach') return item.category === 'beach';
    if (activeFilter === 'luxury') return item.category === 'luxury';
    if (activeFilter === 'nature') return item.category === 'nature';
    return true;
  });

  return (
    <div style={{ maxWidth: 1360, margin: '24px auto 50px auto', padding: '0 16px' }}>
      {/* Header & Personalization Persona Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 22, 42, 0.95), rgba(9, 15, 29, 0.98))',
        border: '1px solid rgba(0, 210, 255, 0.25)',
        borderRadius: 20,
        padding: '24px',
        marginBottom: 24,
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(0, 210, 255, 0.12)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              color: '#00d2ff',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              marginBottom: 10,
              letterSpacing: 0.5
            }}>
              <Sparkles size={14} /> AI PERSONALIZED TRIP DISCOVERY
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: -0.5 }}>
              Handpicked Trips & Holidays for {userName}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4, lineHeight: 1.5, maxWidth: 680 }}>
              Tailored routes, bundled flight + stay vacation packages, and verified deals computed by SkyGenie AI based on your home base, tier benefits, and seasonal weather index.
            </p>
          </div>

          {/* User Persona Quick Settings */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 14,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Home Airport
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <MapPin size={13} color="#00d2ff" />
                <select
                  value={selectedHomeAirport}
                  onChange={(e) => setSelectedHomeAirport(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="DEL" style={{ background: '#0b132b' }}>DEL (New Delhi)</option>
                  <option value="BOM" style={{ background: '#0b132b' }}>BOM (Mumbai)</option>
                  <option value="BLR" style={{ background: '#0b132b' }}>BLR (Bengaluru)</option>
                  <option value="MAA" style={{ background: '#0b132b' }}>MAA (Chennai)</option>
                  <option value="HYD" style={{ background: '#0b132b' }}>HYD (Hyderabad)</option>
                </select>
              </div>
            </div>

            <div style={{ width: 1, height: 28, background: 'rgba(255, 255, 255, 0.1)' }} />

            <div>
              <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Tier Status
              </div>
              <div style={{ color: '#f5af19', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Star size={13} fill="#f5af19" />
                {frequentFlyerTier}
              </div>
            </div>

            <div style={{ width: 1, height: 28, background: 'rgba(255, 255, 255, 0.1)' }} />

            <div>
              <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Cabin
              </div>
              <div style={{ color: '#00e676', fontWeight: 800, fontSize: 13, marginTop: 2 }}>
                {preferredClass}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          overflowX: 'auto',
          paddingTop: 18,
          marginTop: 14,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {[
            { id: 'all', label: '✨ All Recommendations (6)' },
            { id: 'packages', label: '🌴 Holiday Packages (4)' },
            { id: 'flights', label: '✈️ Express Flight Deals (2)' },
            { id: 'beach', label: '🏖️ Beach & Sun Escapes' },
            { id: 'luxury', label: '💎 Luxury & Metropolis' },
            { id: 'nature', label: '🌿 Nature & Hills' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                background: activeFilter === tab.id ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: activeFilter === tab.id ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeFilter === tab.id ? '#00d2ff' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: 20
      }}>
        {filtered.map((item) => {
          const isWishlisted = wishlist.some(w => w.id === item.id);
          const isHoliday = item.type === 'HOLIDAY_PACKAGE';

          return (
            <div
              key={item.id}
              style={{
                background: 'linear-gradient(135deg, rgba(16, 26, 48, 0.95), rgba(11, 18, 33, 0.98))',
                border: '1px solid rgba(0, 210, 255, 0.25)',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 210, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(0, 0, 0, 0.45)';
              }}
            >
              {/* Card Image Banner */}
              <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(11, 18, 33, 0.95) 0%, rgba(11, 18, 33, 0.2) 60%, transparent 100%)'
                }} />

                {/* Top Badges */}
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    background: item.tagColor,
                    color: '#000',
                    fontWeight: 800,
                    fontSize: 10,
                    padding: '3px 9px',
                    borderRadius: 12,
                    letterSpacing: 0.5
                  }}>
                    {item.tag}
                  </span>
                  <span style={{
                    background: 'rgba(0, 230, 118, 0.2)',
                    border: '1px solid #00e676',
                    color: '#00e676',
                    fontWeight: 800,
                    fontSize: 10,
                    padding: '3px 8px',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                  }}>
                    <Sparkles size={10} /> {item.matchScore}% MATCH
                  </span>
                </div>

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(item)}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: isWishlisted ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 0, 0, 0.4)',
                    border: isWishlisted ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.2s'
                  }}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                >
                  <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : '#fff'} />
                </button>

                {/* Bottom Route / Duration Tag */}
                <div style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 12,
                  right: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <Clock size={13} color="#f5af19" /> {item.duration}
                  </span>

                  <span style={{
                    fontSize: 11,
                    color: '#38bdf8',
                    fontWeight: 600,
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '2px 8px',
                    borderRadius: 6
                  }}>
                    {item.origin} ➔ {item.destCode}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} color="#00d2ff" />
                    <span>{item.destination}</span>
                  </div>

                  {/* AI Match Reason Box */}
                  <div style={{
                    background: 'rgba(0, 210, 255, 0.06)',
                    border: '1px solid rgba(0, 210, 255, 0.15)',
                    borderRadius: 10,
                    padding: '10px 12px',
                    fontSize: 12,
                    color: '#cbd5e1',
                    lineHeight: 1.4,
                    marginBottom: 12
                  }}>
                    <span style={{ color: '#00d2ff', fontWeight: 700 }}>Why this fits you:</span> {item.reason}
                  </div>

                  {/* Key Inclusions Bullets */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                    {item.inclusions.map((inc, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#cbd5e1' }}>
                        <CheckCircle2 size={13} color="#00e676" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: 11, color: '#f5af19', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} />
                    <span>{item.bestSeason}</span>
                  </div>
                </div>

                {/* Footer Pricing & Actions */}
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>
                      {isHoliday ? 'All-Inclusive / Person' : 'Fares from'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#00e676' }}>
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span style={{ fontSize: 12, color: '#64748b', textDecoration: 'line-through' }}>
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {isHoliday ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (item.packageRef) {
                          onSelectPackage(item.packageRef);
                        } else {
                          onNavigateToTab('packages');
                        }
                      }}
                      className="btn-primary"
                      style={{
                        padding: '10px 16px',
                        fontSize: 12,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #f5af19, #f12711)',
                        color: '#fff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      <Palmtree size={14} />
                      <span>Book Holiday</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectRoute(item.origin, item.destCode)}
                      className="btn-primary"
                      style={{
                        padding: '10px 16px',
                        fontSize: 12,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      <Plane size={14} />
                      <span>Search Flights</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
