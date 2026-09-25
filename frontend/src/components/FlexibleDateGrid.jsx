import React from 'react';
import { Calendar, TrendingDown, ArrowRight } from 'lucide-react';

export default function FlexibleDateGrid({ flexibleDates, selectedDate, onSelectDate, currency }) {
  if (!flexibleDates || flexibleDates.length === 0) return null;

  const convertPrice = (inrPrice) => {
    return currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice;
  };

  const currencySymbol = currency === 'USD' ? '$' : '₹';

  return (
    <div style={{ maxWidth: 1200, margin: '24px auto 32px auto', padding: '0 24px' }}>
      <div className="glass-card" style={{ padding: '20px 24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: 'rgba(0, 230, 118, 0.15)',
              padding: 8,
              borderRadius: 8,
              color: '#00e676',
              display: 'flex',
              alignItems: 'center'
            }}>
              <TrendingDown size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                Flexible Dates Fare Matrix (±3 Days)
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>
                Compare prices across nearby dates to save up to 25% on your booking.
              </p>
            </div>
          </div>
          <span style={{ fontSize: 12, color: '#00d2ff', fontWeight: 600 }}>
            🟢 Highlighted = Lowest Fare Days
          </span>
        </div>

        {/* Date Tiles Horizontal Scroll / Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 12
        }}>
          {flexibleDates.map((item, index) => {
            const isSelected = selectedDate === item.date;
            return (
              <div
                key={index}
                onClick={() => onSelectDate(item.date)}
                style={{
                  background: isSelected 
                    ? 'rgba(0, 210, 255, 0.18)' 
                    : item.isCheapest 
                      ? 'rgba(0, 230, 118, 0.1)' 
                      : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected 
                    ? '2px solid #00d2ff' 
                    : item.isCheapest 
                      ? '1px solid rgba(0, 230, 118, 0.4)' 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  padding: '14px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {item.isCheapest && (
                  <div style={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#00e676',
                    color: '#090f1d',
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 10,
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap'
                  }}>
                    CHEAPEST
                  </div>
                )}
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                  {item.dayOfWeek}
                </div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, margin: '4px 0' }}>
                  {item.date.slice(5)}
                </div>
                <div style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: item.isCheapest ? '#00e676' : isSelected ? '#00d2ff' : '#f8fafc'
                }}>
                  {currencySymbol}{convertPrice(item.price).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
