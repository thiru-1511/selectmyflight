import React from 'react';
import { Calendar, TrendingDown, ArrowRight } from 'lucide-react';

export default function FlexibleDateGrid({ flexibleDates, selectedDate, onSelectDate, currency }) {
  if (!flexibleDates || flexibleDates.length === 0) return null;

  const convertPrice = (inrPrice) => {
    return currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice;
  };

  const currencySymbol = currency === 'USD' ? '$' : '₹';

  return (
    <div style={{ maxWidth: 1200, margin: '16px auto 24px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ padding: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              background: 'rgba(0, 230, 118, 0.15)',
              padding: 6,
              borderRadius: 8,
              color: '#00e676',
              display: 'flex',
              alignItems: 'center'
            }}>
              <TrendingDown size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                Flexible Dates Fare Matrix (±3 Days)
              </h3>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>
                Compare prices across dates to save up to 25%.
              </p>
            </div>
          </div>
          <span style={{ fontSize: 11, color: '#00d2ff', fontWeight: 600 }}>
            🟢 Lowest Fare
          </span>
        </div>

        {/* Date Tiles Horizontal Swipe Strip */}
        <div className="scroll-touch-x" style={{ paddingBottom: 6 }}>
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
                  borderRadius: 10,
                  padding: '10px 14px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  flex: '0 0 auto',
                  minWidth: 110
                }}
              >
                {item.isCheapest && (
                  <div style={{
                    position: 'absolute',
                    top: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#00e676',
                    color: '#090f1d',
                    fontSize: 8,
                    fontWeight: 900,
                    padding: '1px 6px',
                    borderRadius: 10,
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap'
                  }}>
                    CHEAPEST
                  </div>
                )}
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                  {item.dayOfWeek}
                </div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, margin: '2px 0' }}>
                  {item.date.split('-').slice(1).join('/')}
                </div>
                <div style={{
                  fontSize: 13,
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
