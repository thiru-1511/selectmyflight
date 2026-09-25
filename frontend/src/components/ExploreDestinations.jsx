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
    <div style={{
      maxWidth: 1320,
      margin: '24px auto 70px auto',
      padding: '32px 32px 60px 32px',
      borderRadius: 24,
      background: "linear-gradient(135deg, rgba(9, 15, 29, 0.88), rgba(15, 23, 42, 0.94)), url('/assets/images/destination_paris.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      border: '1px solid rgba(0, 210, 255, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Compass size={28} color="#00d2ff" />
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>
              Explore Global Destinations
            </h2>
          </div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
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
            className="glass-card"
            style={{
              overflow: 'hidden',
              borderRadius: 18,
              display: 'flex',
              flexDirection: 'column',
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
                background: 'linear-gradient(to top, rgba(9, 15, 29, 0.95) 0%, rgba(9, 15, 29, 0.1) 60%)'
              }} />
              
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#00d2ff', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Tag size={12} /> {dest.tag}
              </div>

              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0, 210, 255, 0.2)', border: '1px solid rgba(0, 210, 255, 0.4)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Maximize2 size={12} /> Click Lightbox
              </div>

              <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>
                  {dest.city}
                </h3>
                <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={12} /> {dest.country}
                </div>
              </div>
            </div>

            {/* Destination Details */}
            <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
              {/* Weather and Best Season */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '8px 10px', borderRadius: 8 }}>
                  <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CloudSun size={13} color="#f5af19" /> Weather
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff', marginTop: 2 }}>{dest.weather}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '8px 10px', borderRadius: 8 }}>
                  <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={13} color="#00e676" /> Best Season
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff', marginTop: 2 }}>{dest.bestSeason}</div>
                </div>
              </div>

              {/* Attractions Tags */}
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
                  Top Highlights:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {dest.attractions.map((att, i) => (
                    <span
                      key={i}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#cbd5e1',
                        fontSize: 11,
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
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                marginTop: 4
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Fares from</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#00d2ff' }}>
                    {currencySymbol}{convertPrice(dest.avgPrice).toLocaleString()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDestination(dest.id)}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: 12 }}
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
              background: '#090f1d',
              border: '1px solid rgba(0, 210, 255, 0.4)',
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
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ position: 'absolute', bottom: 24, left: 28, right: 28 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0, 210, 255, 0.2)', color: '#00d2ff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                  <Sparkles size={14} /> Interactive Destination Showcase
                </div>
                <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', margin: 0 }}>
                  {activeLightbox.city}, {activeLightbox.country}
                </h2>
                <p style={{ fontSize: 14, color: '#cbd5e1', marginTop: 6, maxWidth: 680, lineHeight: 1.5 }}>
                  {activeLightbox.description}
                </p>
              </div>
            </div>

            {/* Modal Body Info & Action */}
            <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Weather</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{activeLightbox.weather}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Best Season</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{activeLightbox.bestSeason}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Average Airfare</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#00d2ff' }}>
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
