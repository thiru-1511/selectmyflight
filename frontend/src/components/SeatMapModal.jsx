import React, { useState } from 'react';
import { X, Check, Utensils, Briefcase, Zap, ShieldCheck, ArrowRight, Plane, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import { ADDONS, INITIAL_FLIGHTS } from '../data/mockFlights';

export default function SeatMapModal({ flight: initialFlight, currency, onClose, onProceedToCheckout, isPreviewMode = false }) {
  const [activeFlight, setActiveFlight] = useState(initialFlight || INITIAL_FLIGHTS[0]);
  
  // Multi-seat or single-seat selection: array of seat codes (e.g. ['01A'] or ['01A', '01B'])
  const [selectedSeats, setSelectedSeats] = useState(['01A']);
  const [selectedMeal, setSelectedMeal] = useState(ADDONS[0].name);
  const [selectedBaggage, setSelectedBaggage] = useState(0); // 0, 5, 10
  const [priorityBoarding, setPriorityBoarding] = useState(false);

  // Cabin Models for Switcher
  const AIRCRAFT_MODELS = [
    { name: 'Boeing 787-9 Dreamliner', rows: [1, 2, 3, 4, 5, 6, 7, 8], layout: '3-3-3 Config' },
    { name: 'Airbus A350-900 XWB', rows: [1, 2, 3, 4, 5, 6, 7, 8], layout: 'Quiet Luxury Cabin' },
    { name: 'Airbus A321neo', rows: [1, 2, 3, 4, 5, 6, 7, 8], layout: 'Single Aisle Express' }
  ];

  const rows = [1, 2, 3, 4, 5, 6, 7, 8];
  const leftCols = ['A', 'B', 'C'];
  const rightCols = ['D', 'E', 'F'];
  const bookedSeats = ['01B', '02D', '04C', '06E', '07A'];

  const getSeatPrice = (row, col) => {
    if (row <= 2) return 2500; // Business
    if (row === 3) return 600;  // Extra Legroom
    if (col === 'A' || col === 'F') return 250; // Window
    return 0; // Standard
  };

  const getSeatClass = (row) => {
    if (row <= 2) return 'Business Class';
    if (row === 3) return 'Extra Legroom';
    return 'Economy Class';
  };

  // Toggle seat selection (allows choosing row 1, row 2, row 3 above, and multiple seats if desired)
  const handleSeatClick = (seatCode) => {
    if (bookedSeats.includes(seatCode)) return;
    
    setSelectedSeats((prev) => {
      if (prev.includes(seatCode)) {
        // If clicking the only selected seat, keep it
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== seatCode);
      } else {
        // Allow choosing another seat or switching
        return [...prev, seatCode];
      }
    });
  };

  // Quick single-seat select helper
  const handleQuickSelectSingleSeat = (seatCode) => {
    if (bookedSeats.includes(seatCode)) return;
    setSelectedSeats([seatCode]);
  };

  // Calculate total seat addon price for all chosen seats
  const totalSeatAddonPrice = selectedSeats.reduce((acc, seatCode) => {
    const row = parseInt(seatCode.slice(0, 2), 10);
    const col = seatCode.slice(2);
    return acc + getSeatPrice(row, col);
  }, 0);

  const currentMealPrice = (() => {
    const meal = ADDONS.find(a => a.name === selectedMeal);
    return meal ? meal.price : 0;
  })();

  const currentBaggagePrice = selectedBaggage === 5 ? 1200 : selectedBaggage === 10 ? 2200 : 0;
  const currentPriorityPrice = priorityBoarding ? 650 : 0;

  const totalAddonAmount = totalSeatAddonPrice + currentMealPrice + currentBaggagePrice + currentPriorityPrice;
  const grandTotal = (activeFlight?.basePrice || 4850) * Math.max(1, selectedSeats.length) + totalAddonAmount;

  const convertPrice = (inrPrice) => {
    if (currency === 'USD') return Math.round(inrPrice / 85);
    if (currency === 'EUR') return Math.round(inrPrice / 92);
    if (currency === 'GBP') return Math.round(inrPrice / 108);
    return inrPrice;
  };
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';

  const handleContinue = () => {
    if (onProceedToCheckout) {
      const primarySeat = selectedSeats[0] || '01A';
      const primaryRow = parseInt(primarySeat.slice(0, 2), 10);
      onProceedToCheckout({
        flight: activeFlight,
        seat: {
          seatNumber: selectedSeats.join(', '),
          seatClass: getSeatClass(primaryRow),
          price: totalSeatAddonPrice,
          selectedSeatsList: selectedSeats
        },
        meal: {
          name: selectedMeal,
          price: currentMealPrice
        },
        extraBaggageKg: selectedBaggage,
        extraBaggagePrice: currentBaggagePrice,
        priorityBoarding,
        priorityPrice: currentPriorityPrice,
        totalAddons: totalAddonAmount,
        grandTotal
      });
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1500, padding: 'clamp(10px, 2vw, 20px)' }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: 960, 
          maxHeight: '94vh', 
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: '#0d1527',
          border: '1px solid rgba(0, 210, 255, 0.35)',
          borderRadius: 20,
          boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 40px rgba(0, 210, 255, 0.2)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08), rgba(245, 175, 25, 0.05))',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(16px)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: 900, color: '#fff', margin: 0 }}>
                💺 3D Cabin Seat Selection & Dining Add-ons
              </h3>
              {isPreviewMode && (
                <span style={{
                  background: 'rgba(0, 210, 255, 0.15)',
                  color: '#00d2ff',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 4
                }}>
                  CABIN EXPLORER
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0 0' }}>
              Flight {activeFlight.flightNumber} • {activeFlight.originCode} ➔ {activeFlight.destinationCode} ({activeFlight.aircraftModel || 'Boeing 787-9 Dreamliner'})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#cbd5e1',
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Fleet Model Selector */}
        <div style={{
          padding: '12px 24px',
          background: 'rgba(0, 210, 255, 0.04)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plane size={15} color="#00d2ff" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#00d2ff' }}>Aircraft Fleet Model:</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {AIRCRAFT_MODELS.map((model) => (
              <button
                key={model.name}
                type="button"
                onClick={() => setActiveFlight(prev => ({ ...prev, aircraftModel: model.name }))}
                style={{
                  background: activeFlight.aircraftModel === model.name ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: activeFlight.aircraftModel === model.name ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: activeFlight.aircraftModel === model.name ? '#00d2ff' : '#cbd5e1',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Row Jump Shortcuts */}
        <div style={{
          padding: '10px 24px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>Quick Pick:</span>
          <button
            type="button"
            onClick={() => handleQuickSelectSingleSeat('01A')}
            style={{
              background: selectedSeats.includes('01A') ? 'rgba(245, 175, 25, 0.3)' : 'rgba(245, 175, 25, 0.1)',
              border: '1px solid #f5af19',
              color: '#f5af19',
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            👑 Row 1 Business (01A)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelectSingleSeat('02A')}
            style={{
              background: selectedSeats.includes('02A') ? 'rgba(245, 175, 25, 0.3)' : 'rgba(245, 175, 25, 0.1)',
              border: '1px solid #f5af19',
              color: '#f5af19',
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            👑 Row 2 Business (02A)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelectSingleSeat('03A')}
            style={{
              background: selectedSeats.includes('03A') ? 'rgba(0, 210, 255, 0.3)' : 'rgba(0, 210, 255, 0.1)',
              border: '1px solid #00d2ff',
              color: '#00d2ff',
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🚀 Row 3 Extra Legroom (03A)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelectSingleSeat('04A')}
            style={{
              background: selectedSeats.includes('04A') ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 255, 255, 0.06)',
              border: '1px solid #00e676',
              color: '#00e676',
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            💺 Row 4 Standard (04A)
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          padding: 'clamp(14px, 2.5vw, 24px)'
        }}>
          {/* Left: Aircraft Visual Seat Grid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>
                Cabin Layout & Interactive Seats
              </h4>
              <div style={{
                background: 'rgba(0, 210, 255, 0.12)',
                border: '1px solid rgba(0, 210, 255, 0.35)',
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: 12,
                color: '#00d2ff',
                fontWeight: 700
              }}>
                Selected: <strong style={{ color: '#fff', fontSize: 13 }}>{selectedSeats.join(', ')}</strong> ({selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'})
              </div>
            </div>

            {/* Seat Class Legends */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, fontSize: 11, color: '#cbd5e1', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#f5af19', display: 'inline-block' }} />
                <span>Business (+{currencySymbol}{convertPrice(2500)})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#00d2ff', display: 'inline-block' }} />
                <span>Legroom (+{currencySymbol}{convertPrice(600)})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.18)', display: 'inline-block' }} />
                <span>Standard</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#1e293b', border: '1px solid #334155', display: 'inline-block' }} />
                <span>Occupied</span>
              </div>
            </div>

            {/* Visual Aircraft Body Frame */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(13, 22, 43, 0.8) 100%)',
              border: '2px solid rgba(0, 210, 255, 0.25)',
              borderRadius: '70px 70px 24px 24px',
              padding: '24px 16px',
              position: 'relative',
              overflowX: 'auto'
            }}>
              {/* Cockpit Nose Indicator */}
              <div style={{
                textAlign: 'center',
                fontSize: 11,
                color: '#00d2ff',
                fontWeight: 900,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 16,
                padding: '4px',
                background: 'rgba(0, 210, 255, 0.08)',
                borderRadius: 20
              }}>
                ▲ FRONT OF AIRCRAFT / COCKPIT ▲
              </div>

              {/* Rows Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 260 }}>
                {rows.map((rowNum) => {
                  const isBusiness = rowNum <= 2;
                  const isExtraLegroom = rowNum === 3;

                  return (
                    <div key={rowNum} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      {/* Left 3 Seats (A, B, C) */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {leftCols.map((col) => {
                          const seatCode = `${rowNum < 10 ? '0' + rowNum : rowNum}${col}`;
                          const isBooked = bookedSeats.includes(seatCode);
                          const isSelected = selectedSeats.includes(seatCode);

                          let bgColor = 'rgba(255, 255, 255, 0.1)';
                          let borderColor = 'rgba(255, 255, 255, 0.2)';
                          if (isBooked) {
                            bgColor = '#1e293b';
                            borderColor = '#334155';
                          } else if (isSelected) {
                            bgColor = '#00e676';
                            borderColor = '#00e676';
                          } else if (isBusiness) {
                            bgColor = 'rgba(245, 175, 25, 0.25)';
                            borderColor = 'rgba(245, 175, 25, 0.6)';
                          } else if (isExtraLegroom) {
                            bgColor = 'rgba(0, 210, 255, 0.2)';
                            borderColor = 'rgba(0, 210, 255, 0.5)';
                          }

                          return (
                            <button
                              key={seatCode}
                              type="button"
                              disabled={isBooked}
                              onClick={() => handleSeatClick(seatCode)}
                              title={isBooked ? `${seatCode} (Occupied)` : `${seatCode} - ${getSeatClass(rowNum)} (+${currencySymbol}${convertPrice(getSeatPrice(rowNum, col))})`}
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 7,
                                background: bgColor,
                                border: isSelected ? '2px solid #00e676' : `1px solid ${borderColor}`,
                                color: isSelected ? '#000' : isBooked ? '#475569' : '#fff',
                                fontSize: 10,
                                fontWeight: 900,
                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                boxShadow: isSelected ? '0 0 12px rgba(0, 230, 118, 0.6)' : 'none'
                              }}
                            >
                              <span>{seatCode}</span>
                              {isSelected && <Check size={10} strokeWidth={4} color="#000" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Aisle */}
                      <div style={{ width: 22, textAlign: 'center', fontSize: 11, color: '#00d2ff', fontWeight: 800 }}>
                        {rowNum}
                      </div>

                      {/* Right 3 Seats (D, E, F) */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {rightCols.map((col) => {
                          const seatCode = `${rowNum < 10 ? '0' + rowNum : rowNum}${col}`;
                          const isBooked = bookedSeats.includes(seatCode);
                          const isSelected = selectedSeats.includes(seatCode);

                          let bgColor = 'rgba(255, 255, 255, 0.1)';
                          let borderColor = 'rgba(255, 255, 255, 0.2)';
                          if (isBooked) {
                            bgColor = '#1e293b';
                            borderColor = '#334155';
                          } else if (isSelected) {
                            bgColor = '#00e676';
                            borderColor = '#00e676';
                          } else if (isBusiness) {
                            bgColor = 'rgba(245, 175, 25, 0.25)';
                            borderColor = 'rgba(245, 175, 25, 0.6)';
                          } else if (isExtraLegroom) {
                            bgColor = 'rgba(0, 210, 255, 0.2)';
                            borderColor = 'rgba(0, 210, 255, 0.5)';
                          }

                          return (
                            <button
                              key={seatCode}
                              type="button"
                              disabled={isBooked}
                              onClick={() => handleSeatClick(seatCode)}
                              title={isBooked ? `${seatCode} (Occupied)` : `${seatCode} - ${getSeatClass(rowNum)} (+${currencySymbol}${convertPrice(getSeatPrice(rowNum, col))})`}
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 7,
                                background: bgColor,
                                border: isSelected ? '2px solid #00e676' : `1px solid ${borderColor}`,
                                color: isSelected ? '#000' : isBooked ? '#475569' : '#fff',
                                fontSize: 10,
                                fontWeight: 900,
                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                boxShadow: isSelected ? '0 0 12px rgba(0, 230, 118, 0.6)' : 'none'
                              }}
                            >
                              <span>{seatCode}</span>
                              {isSelected && <Check size={10} strokeWidth={4} color="#000" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{
                textAlign: 'center',
                fontSize: 10,
                color: '#64748b',
                marginTop: 16,
                fontWeight: 700
              }}>
                💡 Tap any seat above to select or switch. Rows 1-2 feature Luxury Business Class.
              </div>
            </div>
          </div>

          {/* Right: In-Flight Dining & Baggage Add-ons */}
          <div>
            {/* Gourmet Meal Selection */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Utensils size={18} color="#00d2ff" />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>
                  Gourmet In-Flight Dining
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ADDONS.map((addon) => {
                  const isMealSelected = selectedMeal === addon.name;
                  return (
                    <div
                      key={addon.name}
                      onClick={() => setSelectedMeal(addon.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: isMealSelected ? 'rgba(0, 210, 255, 0.14)' : 'rgba(255, 255, 255, 0.04)',
                        border: isMealSelected ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: isMealSelected ? '5px solid #00d2ff' : '2px solid #64748b',
                          background: '#fff'
                        }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: isMealSelected ? '#00d2ff' : '#fff' }}>
                            {addon.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            {addon.description}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 800, color: addon.price === 0 ? '#00e676' : '#fff' }}>
                        {addon.price === 0 ? 'Included' : `+${currencySymbol}${convertPrice(addon.price)}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extra Baggage Add-on */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Briefcase size={18} color="#f5af19" />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>
                  Pre-Book Excess Baggage
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { kg: 0, price: 0, label: 'Standard (15kg)' },
                  { kg: 5, price: 1200, label: '+5kg Extra' },
                  { kg: 10, price: 2200, label: '+10kg Extra' }
                ].map((b) => (
                  <div
                    key={b.kg}
                    onClick={() => setSelectedBaggage(b.kg)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 8,
                      textAlign: 'center',
                      background: selectedBaggage === b.kg ? 'rgba(245, 175, 25, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      border: selectedBaggage === b.kg ? '1px solid #f5af19' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{b.label}</div>
                    <div style={{ fontSize: 12, color: '#f5af19', marginTop: 2, fontWeight: 800 }}>
                      {b.price === 0 ? 'Free' : `+${currencySymbol}${convertPrice(b.price)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Boarding */}
            <div
              onClick={() => setPriorityBoarding(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 10,
                background: priorityBoarding ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: priorityBoarding ? '1px solid #00e676' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Zap size={18} color="#00e676" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Priority Check-in & Boarding</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Dedicated queue + priority baggage tag</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#00e676' }}>
                  +{currencySymbol}{convertPrice(650)}
                </div>
                <div style={{ fontSize: 11, color: priorityBoarding ? '#00e676' : '#94a3b8', fontWeight: 600 }}>
                  {priorityBoarding ? '✓ Added' : 'Click to Add'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer with Price Summary and Continue Button */}
        <div style={{
          padding: '18px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(9, 15, 29, 0.98)',
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          flexWrap: 'wrap',
          gap: 14
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              Base: {currencySymbol}{convertPrice(activeFlight?.basePrice || 4850)} ({selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'}) + Add-ons: {currencySymbol}{convertPrice(totalAddonAmount)}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#00e676' }}>
              Total: {currencySymbol}{convertPrice(grandTotal).toLocaleString()}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '10px 18px', fontSize: 13 }}
            >
              {onProceedToCheckout ? 'Cancel' : 'Close Explorer'}
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="btn-primary"
              style={{ padding: '11px 24px', fontSize: 14, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {onProceedToCheckout ? 'Proceed to Passenger Details' : 'Select Flight with this Configuration'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
