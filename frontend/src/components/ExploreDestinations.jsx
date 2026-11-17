import React, { useState } from 'react';
import { Compass, CloudSun, Calendar, MapPin, ArrowRight, Tag, Eye, X, Maximize2, Sparkles } from 'lucide-react';

const DESTINATIONS = [
  {
    id: 'DXB',
    city: 'Dubai',
    country: 'United Arab Emirates',
    image: '/assets/images/destination_dubai.jpg',
    avgPrice: 12900,
    weather: '31°C Sunny',
    bestSeason: 'Nov – Mar',
    attractions: ['Burj Khalifa', 'Palm Jumeirah', 'Desert Safari', 'Dubai Mall'],
    tag: 'Luxury & Shopping',
    description: 'Experience futuristic skyscrapers, golden desert dunes, world-class shopping promenades, and 7-star luxury oceanfront resorts.'
  },
  {
    id: 'LHR',
    city: 'London',
    country: 'United Kingdom',
    image: '/assets/images/destination_london.jpg',
    avgPrice: 42900,
    weather: '18°C Mild',
    bestSeason: 'May – Sep',
    attractions: ['Tower Bridge', 'Big Ben', 'British Museum', 'Hyde Park'],
    tag: 'Heritage & Culture',
    description: 'Immerse in royal palaces, historic river Thames vistas, West End musical theatre, and centuries-old architectural grandeur.'
  },
  {
    id: 'GOI',
    city: 'Goa',
    country: 'India',
    image: '/assets/images/destination_goa.jpg',
    avgPrice: 4800,
    weather: '28°C Tropical Sun',
    bestSeason: 'Oct – May',
    attractions: ['Vagator Beach', 'Chapora Fort', 'Fontainhas Old Goa', 'Dudhsagar Falls'],
    tag: 'Tropical Beach Resort',
    description: 'Sun-drenched golden beaches, vibrant beachfront shacks, heritage Portuguese colonial villas, and fresh coastal gastronomy.'
  },
  {
    id: 'SIN',
    city: 'Singapore',
    country: 'Singapore',
    image: '/assets/images/destination_singapore.jpg',
    avgPrice: 13800,
    weather: '29°C Tropical',
    bestSeason: 'All Year Round',
    attractions: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Changi Jewel'],
    tag: 'Futuristic City',
    description: 'A global garden city boasting the iconic rooftop infinity pool, Supertree Grove, Michelin hawker dining, and lush urban rainforests.'
  },
  {
    id: 'JFK',
    city: 'New York City',
    country: 'United States',
    image: '/assets/images/destination_newyork.jpg',
    avgPrice: 58900,
    weather: '22°C Clear',
    bestSeason: 'Apr – Jun, Sep – Nov',
    attractions: ['Times Square', 'Empire State Building', 'Central Park', 'Statue of Liberty'],
    tag: 'Global Metropolis',
    description: 'The city that never sleeps — dazzling Manhattan skyline vistas, Broadway theater, world-famous museums, and iconic food districts.'
  },
  {
    id: 'CDG',
    city: 'Paris',
    country: 'France',
    image: '/assets/images/destination_paris.jpg',
    avgPrice: 38500,
    weather: '21°C Pleasant',
    bestSeason: 'Apr – Oct',
    attractions: ['Eiffel Tower', 'Louvre Museum', 'Seine River', 'Champs-Élysées'],
    tag: 'Romance & Art',
    description: 'The global capital of art, gastronomy, and couture fashion — stroll along the Seine, visit Place Vendôme, and marvel at the Eiffel Tower.'
  }
];

export default function ExploreDestinations({ currency, onSelectDestination }) {
  const [activeLightbox, setActiveLightbox] = useState(null);

  const convertPrice = (inrPrice) => {
    return currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice;
  };
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  return (
    <div className="explore-destinations-container" style={{
      maxWidth: 1320,
      margin: '16px auto 70px auto',
      padding: 'clamp(14px, 2.5vw, 28px) clamp(12px, 2.5vw, 28px) 60px clamp(12px, 2.5vw, 28px)',
      borderRadius: 24,
      background: "var(--card-bg, #ffffff)",
      boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12)',
      border: '1px solid var(--card-border, #e2e8f0)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Compass size={28} color="var(--accent-cyan, #0284c7)" />
            <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: 'var(--text-main, #0f172a)', margin: 0 }}>
              Explore Global Destinations
            </h2>
          </div>
          <p style={{ fontSize: 'clamp(13px, 2vw, 14px)', color: 'var(--text-muted, #475569)', marginTop: 6, marginBottom: 0 }}>
            Click on any photo to launch HD Interactive Lightbox. Discover live weather, top attractions, and instant flight bookings.
          </p>
        </div>
      </div>

      {/* Grid of Destinations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24
      }}>
        {DESTINATIONS.map((dest) => (
          <div
            key={dest.id}
            className="glass-card dest-card"
            style={{
              overflow: 'hidden',
              borderRadius: 18,
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--card-bg, #ffffff)',
              border: '1px solid var(--card-border, #e2e8f0)',
              boxShadow: '0 4px 18px rgba(15, 23, 42, 0.06)',
              transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Interactive Image Header with Zoom Lightbox Trigger */}
            <div
              onClick={() => setActiveLightbox(dest)}
              style={{
                height: 220,
                backgroundImage: `url(${dest.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                cursor: 'pointer'
              }}
              title="Click to view full-screen HD photo"
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(9, 15, 29, 0.95) 0%, rgba(9, 15, 29, 0.2) 60%, transparent 100%)'
              }} />
              
              <div className="dest-photo-tag" style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(9, 15, 29, 0.8)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(255,255,255,0.2)' }}>
                <Tag size={12} /> {dest.tag}
              </div>

              <div className="dest-photo-badge" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(2, 132, 199, 0.85)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                <Maximize2 size={12} color="#ffffff" /> Click Lightbox
              </div>

              <div style={{ position: 'absolute', bottom: 12, left: 16, zIndex: 2 }}>
                <h3 className="dest-card-city" style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
                  {dest.city}
                </h3>
                <div className="dest-card-country" style={{ fontSize: 12, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, textShadow: '0 1px 6px rgba(0,0,0,0.95)', fontWeight: 600 }}>
                  <MapPin size={12} color="#38bdf8" /> {dest.country}
                </div>
              </div>
            </div>

            {/* Destination Details */}
            <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
              {/* Weather and Best Season */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                <div style={{ background: 'var(--card-subtle-bg, #f8fafc)', border: '1px solid var(--card-border, #e2e8f0)', padding: '8px 10px', borderRadius: 8 }}>
                  <div style={{ color: 'var(--text-muted, #64748b)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>
                    <CloudSun size={13} color="#f5af19" /> Weather
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main, #0f172a)', marginTop: 2 }}>{dest.weather}</div>
                </div>

                <div style={{ background: 'var(--card-subtle-bg, #f8fafc)', border: '1px solid var(--card-border, #e2e8f0)', padding: '8px 10px', borderRadius: 8 }}>
                  <div style={{ color: 'var(--text-muted, #64748b)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>
                    <Calendar size={13} color="var(--accent-green, #059669)" /> Best Season
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main, #0f172a)', marginTop: 2 }}>{dest.bestSeason}</div>
                </div>
              </div>

              {/* Attractions Tags */}
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', fontWeight: 800, marginBottom: 6, letterSpacing: 0.5 }}>
                  Top Highlights:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {dest.attractions.map((att, i) => (
                    <span
                      key={i}
                      style={{
                        background: 'var(--card-subtle-bg, #f1f5f9)',
                        border: '1px solid var(--card-border, #e2e8f0)',
                        color: 'var(--text-main, #334155)',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 6
                      }}
                    >
                      {att}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTop: '1px solid var(--card-border, #e2e8f0)',
                marginTop: 4
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #64748b)', fontWeight: 600 }}>Fares from</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-cyan, #0284c7)' }}>
                    {currencySymbol}{convertPrice(dest.avgPrice).toLocaleString()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDestination(dest.id)}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: 12, fontWeight: 800 }}
                >
                  Find Flights <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Photo Lightbox Modal */}
      {activeLightbox && (
        <div className="modal-overlay" onClick={() => setActiveLightbox(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 900,
              background: 'var(--card-bg, #ffffff)',
              border: '1px solid var(--card-border, #e2e8f0)',
              borderRadius: 24,
              overflow: 'hidden',
              padding: 0
            }}
          >
            {/* Full High-Res Photo View */}
            <div style={{
              height: 440,
              backgroundImage: `url(${activeLightbox.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(9, 15, 29, 0.98) 0%, rgba(9, 15, 29, 0.2) 60%)'
              }} />

              <button
                onClick={() => setActiveLightbox(null)}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3
                }}
              >
                <X size={20} color="#ffffff" />
              </button>

              <div style={{ position: 'absolute', bottom: 24, left: 28, right: 28, zIndex: 2 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(2, 132, 199, 0.85)', color: '#ffffff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                  <Sparkles size={14} color="#ffffff" /> Interactive Destination Showcase
                </div>
                <h2 className="photo-overlay-title" style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
                  {activeLightbox.city}, {activeLightbox.country}
                </h2>
                <p className="photo-overlay-subtitle" style={{ fontSize: 14, color: '#f1f5f9', marginTop: 6, maxWidth: 680, lineHeight: 1.5, textShadow: '0 1px 6px rgba(0,0,0,0.95)' }}>
                  {activeLightbox.description}
                </p>
              </div>
            </div>

            {/* Modal Body Info & Action */}
            <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, background: 'var(--card-bg, #ffffff)' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #64748b)', fontWeight: 600 }}>Weather</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>{activeLightbox.weather}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #64748b)', fontWeight: 600 }}>Best Season</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>{activeLightbox.bestSeason}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted, #64748b)', fontWeight: 600 }}>Average Airfare</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent-cyan, #0284c7)' }}>
                    {currencySymbol}{convertPrice(activeLightbox.avgPrice).toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectDestination(activeLightbox.id);
                  setActiveLightbox(null);
                }}
                className="btn-primary"
                style={{ padding: '12px 24px', fontSize: 13, fontWeight: 800 }}
              >
                Search Flights to {activeLightbox.city} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
