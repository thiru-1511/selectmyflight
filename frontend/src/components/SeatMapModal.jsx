import React, { useState } from 'react';
import { X, Check, Utensils, Briefcase, Zap, ShieldCheck, ArrowRight, Plane, Sparkles } from 'lucide-react';
import { ADDONS, INITIAL_FLIGHTS } from '../data/mockFlights';

export default function SeatMapModal({ flight: initialFlight, currency, onClose, onProceedToCheckout, isPreviewMode = false }) {
  const [activeFlight, setActiveFlight] = useState(initialFlight || INITIAL_FLIGHTS[0]);
  const [selectedSeat, setSelectedSeat] = useState('04A');
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
    if (row <= 2) return 'Business';
    if (row === 3) return 'Extra Legroom';
    return 'Economy';
  };

  const currentSeatPrice = (() => {
    const row = parseInt(selectedSeat.slice(0, 2));
    const col = selectedSeat.slice(2);
    return getSeatPrice(row, col);
  })();

  const currentMealPrice = (() => {
    const meal = ADDONS.find(a => a.name === selectedMeal);
    return meal ? meal.price : 0;
  })();

  const currentBaggagePrice = selectedBaggage === 5 ? 1200 : selectedBaggage === 10 ? 2200 : 0;
  const currentPriorityPrice = priorityBoarding ? 650 : 0;

  const totalAddonAmount = currentSeatPrice + currentMealPrice + currentBaggagePrice + currentPriorityPrice;
  const grandTotal = (activeFlight?.basePrice || 4850) + totalAddonAmount;

  const convertPrice = (inrPrice) => {
    return currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice;
  };
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const handleContinue = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout({
        flight: activeFlight,
        seat: {
          seatNumber: selectedSeat,
          seatClass: getSeatClass(parseInt(selectedSeat.slice(0, 2))),
          price: currentSeatPrice
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
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1500 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 880 }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
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
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              Flight {activeFlight.flightNumber} • {activeFlight.originCode} ➔ {activeFlight.destinationCode} ({activeFlight.aircraftModel || 'Boeing 787 Dreamliner'})
            </p>
          </div>
          <button
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
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Aircraft Model Selector */}
        <div style={{
          padding: '12px 28px',
          background: 'rgba(0, 210, 255, 0.04)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
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

        {/* Modal Body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 28,
          padding: '24px 28px'
        }}>
          {/* Left: Aircraft Visual Seat Grid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
                Cabin Layout & Seat Selection
              </h4>
              <div style={{ fontSize: 12, color: '#00d2ff', fontWeight: 600 }}>
                Selected: <strong style={{ color: '#fff', fontSize: 14 }}>{selectedSeat}</strong> ({getSeatClass(parseInt(selectedSeat.slice(0, 2)))})
              </div>
            </div>

            {/* Seat Class Legends */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 18, fontSize: 11, color: '#94a3b8', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#f5af19', display: 'inline-block' }} />
                <span>Business (+{currencySymbol}{convertPrice(2500)})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#00d2ff', display: 'inline-block' }} />
                <span>Extra Legroom (+{currencySymbol}{convertPrice(600)})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                <span>Standard (Free)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#334155', display: 'inline-block' }} />
                <span>Occupied</span>
              </div>
            </div>

            {/* Visual Aircraft Body Frame */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '60px 60px 20px 20px',
              padding: '24px 20px',
              position: 'relative'
            }}>
              {/* Cockpit Nose Indicator */}
              <div style={{
                textAlign: 'center',
                fontSize: 10,
                color: '#64748b',
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 16
              }}>
                ▲ COCKPIT / FRONT OF AIRCRAFT ▲
              </div>

              {/* Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                          const isSelected = selectedSeat === seatCode;

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
                            borderColor = 'rgba(245, 175, 25, 0.5)';
                          } else if (isExtraLegroom) {
                            bgColor = 'rgba(0, 210, 255, 0.2)';
                            borderColor = 'rgba(0, 210, 255, 0.4)';
                          }

                          return (
                            <button
                              key={seatCode}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedSeat(seatCode)}
                              title={isBooked ? `${seatCode} (Occupied)` : `${seatCode} - ${getSeatClass(rowNum)} (+${currencySymbol}${convertPrice(getSeatPrice(rowNum, col))})`}
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 6,
                                background: bgColor,
                                border: `1px solid ${borderColor}`,
                                color: isSelected ? '#000' : isBooked ? '#475569' : '#fff',
                                fontSize: 10,
                                fontWeight: 800,
                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s'
                              }}
                            >
                              {seatCode}
                            </button>
                          );
                        })}
                      </div>

                      {/* Aisle */}
                      <div style={{ width: 20, textAlign: 'center', fontSize: 10, color: '#64748b', fontWeight: 700 }}>
                        {rowNum}
                      </div>

                      {/* Right 3 Seats (D, E, F) */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {rightCols.map((col) => {
                          const seatCode = `${rowNum < 10 ? '0' + rowNum : rowNum}${col}`;
                          const isBooked = bookedSeats.includes(seatCode);
                          const isSelected = selectedSeat === seatCode;

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
                            borderColor = 'rgba(245, 175, 25, 0.5)';
                          } else if (isExtraLegroom) {
                            bgColor = 'rgba(0, 210, 255, 0.2)';
                            borderColor = 'rgba(0, 210, 255, 0.4)';
                          }

                          return (
                            <button
                              key={seatCode}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedSeat(seatCode)}
                              title={isBooked ? `${seatCode} (Occupied)` : `${seatCode} - ${getSeatClass(rowNum)} (+${currencySymbol}${convertPrice(getSeatPrice(rowNum, col))})`}
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 6,
                                background: bgColor,
                                border: `1px solid ${borderColor}`,
                                color: isSelected ? '#000' : isBooked ? '#475569' : '#fff',
                                fontSize: 10,
                                fontWeight: 800,
                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s'
                              }}
                            >
                              {seatCode}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: In-Flight Dining & Baggage Add-ons */}
          <div>
            {/* Gourmet Meal Selection */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Utensils size={18} color="#00d2ff" />
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
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
                        borderRadius: 8,
                        background: isMealSelected ? 'rgba(0, 210, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
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

                      <div style={{ fontSize: 13, fontWeight: 700, color: addon.price === 0 ? '#00e676' : '#fff' }}>
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
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
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
                      padding: '10px',
                      borderRadius: 8,
                      textAlign: 'center',
                      background: selectedBaggage === b.kg ? 'rgba(245, 175, 25, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: selectedBaggage === b.kg ? '1px solid #f5af19' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{b.label}</div>
                    <div style={{ fontSize: 12, color: '#f5af19', marginTop: 2, fontWeight: 700 }}>
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
                borderRadius: 8,
                background: priorityBoarding ? 'rgba(0, 230, 118, 0.12)' : 'rgba(255, 255, 255, 0.04)',
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
                <div style={{ fontSize: 13, fontWeight: 700, color: '#00e676' }}>
                  +{currencySymbol}{convertPrice(650)}
                </div>
                <div style={{ fontSize: 11, color: priorityBoarding ? '#00e676' : '#94a3b8' }}>
                  {priorityBoarding ? 'Added' : 'Click to Add'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Price Summary and Continue Button */}
        <div style={{
          padding: '20px 28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(9, 15, 29, 0.95)',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              Base: {currencySymbol}{convertPrice(activeFlight?.basePrice || 4850)} + Add-ons: {currencySymbol}{convertPrice(totalAddonAmount)}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
              Total: {currencySymbol}{convertPrice(grandTotal).toLocaleString()}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              {onProceedToCheckout ? 'Cancel' : 'Close Explorer'}
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: 15 }}
            >
              {onProceedToCheckout ? 'Proceed to Passenger Details' : 'Select Flight with this Configuration'}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
