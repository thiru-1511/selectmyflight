import React from 'react';
import { Sparkles, Compass, TrendingUp, Plane, ArrowRight, Star } from 'lucide-react';

export default function PersonalizedRecommendations({ user, currency, onSelectRoute }) {
  const homeAirport = user?.homeAirport || 'DEL';
  const preferredClass = user?.preferredClass || 'Economy';
  const userName = user?.name ? user.name.split(' ')[0] : 'Traveler';

  const convertPrice = (p) => (currency === 'USD' ? Math.round(p / 85) : p);
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const recommendations = [
    {
      id: 'rec-1',
      title: 'Weekend Beach Escape',
      origin: homeAirport,
      destination: 'GOI',
      destName: 'Goa',
      airline: 'IndiGo (6E-6351)',
      price: 5800,
      tag: 'Matching Home Airport',
      reason: `Based on departures from ${homeAirport}`,
      duration: '2h 35m Non-stop',
      discount: 'Save 15% this weekend'
    },
    {
      id: 'rec-2',
      title: 'International Luxury Corridor',
      origin: homeAirport,
      destination: 'DXB',
      destName: 'Dubai',
      airline: 'Emirates (EK-511)',
      price: 14800,
      tag: 'Gold Elite Top Pick',
      reason: `Matches your ${preferredClass} preference`,
      duration: '4h 05m Non-stop',
      discount: 'Complimentary Lounge Access'
    },
    {
      id: 'rec-3',
      title: 'Heritage & Metropolis Gateway',
      origin: homeAirport,
      destination: 'LHR',
      destName: 'London',
      airline: 'Air India (AI-161)',
      price: 42900,
      tag: 'Trending International',
      reason: 'Frequent route search match',
      duration: '9h 00m Direct',
      discount: 'Double Frequent Flyer Miles'
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '20px auto 40px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0, 210, 255, 0.12)', color: '#00d2ff', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            <Sparkles size={14} /> AI-CURATED FOR YOU
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
            Recommended Flights for {userName}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
            Personalized routes based on your home base ({homeAirport}), preferred cabin ({preferredClass}), and recent travel patterns.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 16
      }}>
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="glass-card"
            style={{
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(0, 210, 255, 0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <span style={{
                  background: 'rgba(0, 210, 255, 0.15)',
                  color: '#00d2ff',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  {rec.tag}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 8, marginBottom: 2 }}>
                  {rec.title}
                </h3>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  {rec.reason}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Fares from</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#00e676' }}>
                  {currencySymbol}{convertPrice(rec.price).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Flight Route Details */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>{rec.origin}</div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#00d2ff', gap: 4 }}>
                  <Plane size={14} />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{rec.duration}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>{rec.destination}</div>
              </div>

              <div style={{ fontSize: 11, color: '#f5af19', fontWeight: 600 }}>
                {rec.airline.split(' ')[0]}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#00e676', fontWeight: 600 }}>
                ✨ {rec.discount}
              </span>

              <button
                type="button"
                onClick={() => onSelectRoute(rec.origin, rec.destination)}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                Search Flights <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
