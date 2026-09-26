import React, { useState, useEffect } from 'react';
import { X, Check, Utensils, Briefcase, Zap, ArrowRight, Plane, Users, User, CheckCircle2, Sparkles, Plus, Minus } from 'lucide-react';
import { ADDONS, INITIAL_FLIGHTS } from '../data/mockFlights';

const PASSENGER_COLORS = [
  { bg: 'rgba(0, 210, 255, 0.25)', border: '#00d2ff', text: '#00d2ff', badge: 'P1', name: 'Passenger 1' },
  { bg: 'rgba(245, 175, 25, 0.25)', border: '#f5af19', text: '#f5af19', badge: 'P2', name: 'Passenger 2' },
  { bg: 'rgba(0, 230, 118, 0.25)', border: '#00e676', text: '#00e676', badge: 'P3', name: 'Passenger 3' },
  { bg: 'rgba(192, 132, 252, 0.25)', border: '#c084fc', text: '#c084fc', badge: 'P4', name: 'Passenger 4' },
  { bg: 'rgba(244, 63, 94, 0.25)', border: '#f43f5e', text: '#f43f5e', badge: 'P5', name: 'Passenger 5' },
  { bg: 'rgba(56, 189, 248, 0.25)', border: '#38bdf8', text: '#38bdf8', badge: 'P6', name: 'Passenger 6' }
];

export default function SeatMapModal({ 
  flight: initialFlight, 
  currency, 
  onClose, 
  onProceedToCheckout, 
  isPreviewMode = false,
  initialPassengerCount = 1 
}) {
  const [activeFlight, setActiveFlight] = useState(initialFlight || INITIAL_FLIGHTS[0]);
  
  // Passenger count state (1 to 6)
  const [passengerCount, setPassengerCount] = useState(Math.max(1, Math.min(6, initialPassengerCount || 1)));
  const [activePassengerIndex, setActivePassengerIndex] = useState(0);

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

  // Default available seats sequence for auto-assignment
  const defaultAvailableSeats = ['01A', '01C', '02A', '02C', '03A', '03B', '04A', '04B', '05A', '05B'];

  // Multi-seat state: array of seat codes matching passengerCount
  const [selectedSeats, setSelectedSeats] = useState(() => {
    const initialSeats = [];
    let count = Math.max(1, Math.min(6, initialPassengerCount || 1));
    for (let i = 0; i < defaultAvailableSeats.length && initialSeats.length < count; i++) {
      if (!bookedSeats.includes(defaultAvailableSeats[i])) {
        initialSeats.push(defaultAvailableSeats[i]);
      }
    }
    return initialSeats;
  });

  const [selectedMeal, setSelectedMeal] = useState(ADDONS[0].name);
  const [selectedBaggage, setSelectedBaggage] = useState(0); // 0, 5, 10
  const [priorityBoarding, setPriorityBoarding] = useState(false);

  // Sync passenger count changes
  const handlePassengerCountChange = (newCount) => {
    const count = Math.max(1, Math.min(6, newCount));
    setPassengerCount(count);

    if (count > selectedSeats.length) {
      // Find extra available seats
      const updated = [...selectedSeats];
      for (const seat of defaultAvailableSeats) {
        if (!bookedSeats.includes(seat) && !updated.includes(seat)) {
          updated.push(seat);
          if (updated.length === count) break;
        }
      }
      setSelectedSeats(updated);
    } else if (count < selectedSeats.length) {
      setSelectedSeats(selectedSeats.slice(0, count));
      if (activePassengerIndex >= count) {
        setActivePassengerIndex(count - 1);
      }
    }
  };

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

  // Handle seat click on the aircraft map
  const handleSeatClick = (seatCode) => {
    if (bookedSeats.includes(seatCode)) return;
    
    const existingIndex = selectedSeats.indexOf(seatCode);

    if (existingIndex !== -1) {
      // If clicking a seat that is already selected, set active passenger to that seat's owner
      setActivePassengerIndex(existingIndex);
      return;
    }

    // Assign clicked seat to current active passenger
    setSelectedSeats(prev => {
      const updated = [...prev];
      if (activePassengerIndex < updated.length) {
        updated[activePassengerIndex] = seatCode;
      } else {
        updated.push(seatCode);
      }
      return updated;
    });

    // Automatically advance to the next passenger if more than 1 passenger
    if (passengerCount > 1) {
      setActivePassengerIndex(prev => (prev + 1) % passengerCount);
    }
  };

  // Quick Pick preset group handler
  const handleQuickPickGroup = (presetSeats) => {
    const availablePresets = presetSeats.filter(s => !bookedSeats.includes(s));
    setPassengerCount(availablePresets.length);
    setSelectedSeats(availablePresets);
    setActivePassengerIndex(0);
  };

  // Calculate total seat addon price for all chosen seats
  const totalSeatAddonPrice = selectedSeats.reduce((acc, seatCode) => {
    if (!seatCode) return acc;
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

  const totalMealAmount = currentMealPrice * passengerCount;
  const totalPriorityAmount = currentPriorityPrice * passengerCount;
  const totalAddonAmount = totalSeatAddonPrice + totalMealAmount + currentBaggagePrice + totalPriorityAmount;
  const baseAirfareTotal = (activeFlight?.basePrice || 4850) * passengerCount;
  const grandTotal = baseAirfareTotal + totalAddonAmount;

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
      
      const seatsList = selectedSeats.map((s, idx) => {
        const row = parseInt(s.slice(0, 2), 10);
        const col = s.slice(2);
        return {
          passengerIndex: idx + 1,
          seatNumber: s,
          seatClass: getSeatClass(row),
          price: getSeatPrice(row, col)
        };
      });

      onProceedToCheckout({
        flight: activeFlight,
        passengerCount,
        selectedSeatsList: selectedSeats,
        seat: {
          seatNumber: selectedSeats.join(', '),
          seatClass: getSeatClass(primaryRow),
          price: totalSeatAddonPrice,
          selectedSeatsList: selectedSeats,
          detailedSeats: seatsList
        },
        meal: {
          name: selectedMeal,
          price: totalMealAmount,
          perPersonPrice: currentMealPrice
        },
        extraBaggageKg: selectedBaggage,
        extraBaggagePrice: currentBaggagePrice,
        priorityBoarding,
        priorityPrice: totalPriorityAmount,
        totalAddons: totalAddonAmount,
        baseAirfareTotal,
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
          maxWidth: 980, 
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
                💺 Multi-Passenger Seat Selection & In-Flight Dining
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

        {/* Passenger Count & Active Passenger Assignment Strip */}
        <div style={{
          padding: '14px 24px',
          background: 'linear-gradient(90deg, rgba(0, 210, 255, 0.07) 0%, rgba(245, 175, 25, 0.05) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            {/* Passenger Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00d2ff', fontSize: 13, fontWeight: 800 }}>
                <Users size={18} />
                <span>Number of Travelers:</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0, 0, 0, 0.4)', borderRadius: 8, border: '1px solid rgba(0, 210, 255, 0.3)', padding: '2px' }}>
                <button
                  type="button"
                  onClick={() => handlePassengerCountChange(passengerCount - 1)}
                  disabled={passengerCount <= 1}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: passengerCount <= 1 ? '#475569' : '#00d2ff',
                    padding: '4px 8px',
                    cursor: passengerCount <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Remove passenger"
                >
                  <Minus size={14} />
                </button>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 14, minWidth: 24, textAlign: 'center' }}>
                  {passengerCount}
                </span>
                <button
                  type="button"
                  onClick={() => handlePassengerCountChange(passengerCount + 1)}
                  disabled={passengerCount >= 6}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: passengerCount >= 6 ? '#475569' : '#00d2ff',
                    padding: '4px 8px',
                    cursor: passengerCount >= 6 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Add passenger"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                ({passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers • Multi-Seat Enabled'})
              </span>
            </div>

            {/* Hint */}
            <div style={{ fontSize: 12, color: '#00e676', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} />
              <span>Tap a passenger tab below to assign their individual seat:</span>
            </div>
          </div>

          {/* Passenger Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Array.from({ length: passengerCount }).map((_, idx) => {
              const seatCode = selectedSeats[idx] || 'Not Selected';
              const isSelected = activePassengerIndex === idx;
              const colorInfo = PASSENGER_COLORS[idx % PASSENGER_COLORS.length];

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePassengerIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: isSelected ? colorInfo.bg : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? `2px solid ${colorInfo.border}` : '1px solid rgba(255, 255, 255, 0.1)',
                    color: isSelected ? '#fff' : '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 0 14px ${colorInfo.border}44` : 'none'
                  }}
                >
                  <span style={{
                    background: colorInfo.border,
                    color: '#000',
                    fontSize: 10,
                    fontWeight: 900,
                    padding: '1px 5px',
                    borderRadius: 4
                  }}>
                    {colorInfo.badge}
                  </span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: isSelected ? colorInfo.text : '#fff' }}>
                      Passenger {idx + 1}
                    </div>
                    <div style={{ fontSize: 10, color: seatCode !== 'Not Selected' ? '#00e676' : '#94a3b8', fontWeight: 700 }}>
                      Seat: {seatCode}
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 size={13} color={colorInfo.border} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fleet Model Selector & Quick Pick Groups */}
        <div style={{
          padding: '10px 24px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}>
          {/* Quick Preset Pairs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>Quick Pick Groups:</span>
            <button
              type="button"
              onClick={() => handleQuickPickGroup(['01A', '01C'])}
              style={{
                background: selectedSeats.includes('01A') && selectedSeats.includes('01C') ? 'rgba(245, 175, 25, 0.3)' : 'rgba(245, 175, 25, 0.1)',
                border: '1px solid #f5af19',
                color: '#f5af19',
                padding: '3px 9px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              👑 2 Business (01A, 01C)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPickGroup(['03A', '03B'])}
              style={{
                background: selectedSeats.includes('03A') && selectedSeats.includes('03B') ? 'rgba(0, 210, 255, 0.3)' : 'rgba(0, 210, 255, 0.1)',
                border: '1px solid #00d2ff',
                color: '#00d2ff',
                padding: '3px 9px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🚀 2 Extra Legroom (03A, 03B)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPickGroup(['04A', '04B', '04D'])}
              style={{
                background: selectedSeats.includes('04A') && selectedSeats.includes('04B') && selectedSeats.includes('04D') ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                border: '1px solid #00e676',
                color: '#00e676',
                padding: '3px 9px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              👨‍👩‍👦 3 Family (Row 4)
            </button>
          </div>

          {/* Aircraft Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plane size={13} color="#00d2ff" />
            <select
              value={activeFlight.aircraftModel || 'Boeing 787-9 Dreamliner'}
              onChange={(e) => setActiveFlight(prev => ({ ...prev, aircraftModel: e.target.value }))}
              style={{
                background: '#111a33',
                border: '1px solid rgba(0, 210, 255, 0.3)',
                color: '#00d2ff',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 6,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {AIRCRAFT_MODELS.map(m => (
                <option key={m.name} value={m.name} style={{ background: '#0d1527', color: '#fff' }}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: 20,
          padding: 'clamp(14px, 2.5vw, 24px)'
        }}>
          {/* Left: Aircraft Visual Seat Grid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>
                  Interactive 3D Aircraft Cabin Map
                </h4>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  Assigning for: <strong style={{ color: PASSENGER_COLORS[activePassengerIndex % PASSENGER_COLORS.length].border }}>Passenger {activePassengerIndex + 1} ({PASSENGER_COLORS[activePassengerIndex % PASSENGER_COLORS.length].badge})</strong>
                </div>
              </div>
              <div style={{
                background: 'rgba(0, 210, 255, 0.12)',
                border: '1px solid rgba(0, 210, 255, 0.35)',
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: 12,
                color: '#00d2ff',
                fontWeight: 700
              }}>
                Selected: <strong style={{ color: '#fff', fontSize: 13 }}>{selectedSeats.filter(Boolean).join(', ') || 'None'}</strong> ({selectedSeats.length}/{passengerCount} Seats)
              </div>
            </div>

            {/* Seat Class Legends */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, fontSize: 11, color: '#cbd5e1', flexWrap: 'wrap' }}>
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
              padding: '22px 14px',
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 260 }}>
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
                          const seatPassengerIndex = selectedSeats.indexOf(seatCode);
                          const isSelected = seatPassengerIndex !== -1;
                          const passengerColor = isSelected ? PASSENGER_COLORS[seatPassengerIndex % PASSENGER_COLORS.length] : null;

                          let bgColor = 'rgba(255, 255, 255, 0.1)';
                          let borderColor = 'rgba(255, 255, 255, 0.2)';
                          if (isBooked) {
                            bgColor = '#1e293b';
                            borderColor = '#334155';
                          } else if (isSelected) {
                            bgColor = passengerColor.border;
                            borderColor = '#ffffff';
                          } else if (isBusiness) {
                            bgColor = 'rgba(245, 175, 25, 0.22)';
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
                              title={isBooked ? `${seatCode} (Occupied)` : isSelected ? `${seatCode} (Passenger ${seatPassengerIndex + 1})` : `${seatCode} - ${getSeatClass(rowNum)} (+${currencySymbol}${convertPrice(getSeatPrice(rowNum, col))})`}
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 7,
                                background: bgColor,
                                border: isSelected ? `2px solid ${passengerColor.border}` : `1px solid ${borderColor}`,
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
                                boxShadow: isSelected ? `0 0 12px ${passengerColor.border}` : 'none'
                              }}
                            >
                              <span>{seatCode}</span>
                              {isSelected ? (
                                <span style={{ fontSize: 9, fontWeight: 900, background: '#000', color: passengerColor.border, padding: '0 3px', borderRadius: 3, marginTop: 1 }}>
                                  {passengerColor.badge}
                                </span>
                              ) : null}
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
                          const seatPassengerIndex = selectedSeats.indexOf(seatCode);
                          const isSelected = seatPassengerIndex !== -1;
                          const passengerColor = isSelected ? PASSENGER_COLORS[seatPassengerIndex % PASSENGER_COLORS.length] : null;

                          let bgColor = 'rgba(255, 255, 255, 0.1)';
                          let borderColor = 'rgba(255, 255, 255, 0.2)';
                          if (isBooked) {
                            bgColor = '#1e293b';
                            borderColor = '#334155';
                          } else if (isSelected) {
                            bgColor = passengerColor.border;
                            borderColor = '#ffffff';
                          } else if (isBusiness) {
                            bgColor = 'rgba(245, 175, 25, 0.22)';
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
                              title={isBooked ? `${seatCode} (Occupied)` : isSelected ? `${seatCode} (Passenger ${seatPassengerIndex + 1})` : `${seatCode} - ${getSeatClass(rowNum)} (+${currencySymbol}${convertPrice(getSeatPrice(rowNum, col))})`}
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 7,
                                background: bgColor,
                                border: isSelected ? `2px solid ${passengerColor.border}` : `1px solid ${borderColor}`,
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
                                boxShadow: isSelected ? `0 0 12px ${passengerColor.border}` : 'none'
                              }}
                            >
                              <span>{seatCode}</span>
                              {isSelected ? (
                                <span style={{ fontSize: 9, fontWeight: 900, background: '#000', color: passengerColor.border, padding: '0 3px', borderRadius: 3, marginTop: 1 }}>
                                  {passengerColor.badge}
                                </span>
                              ) : null}
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
                fontSize: 11,
                color: '#94a3b8',
                marginTop: 14,
                fontWeight: 700
              }}>
                💡 Click any seat above to assign for the selected passenger badge (P1, P2, etc.).
              </div>
            </div>
          </div>

          {/* Right: In-Flight Dining & Baggage Add-ons */}
          <div>
            {/* Gourmet Meal Selection */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Utensils size={18} color="#00d2ff" />
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>
                    Gourmet In-Flight Dining
                  </h4>
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>For all {passengerCount} travelers</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ADDONS.map((addon) => {
                  const isMealSelected = selectedMeal === addon.name;
                  const itemTotal = addon.price * passengerCount;
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
                        {addon.price === 0 ? 'Included' : `+${currencySymbol}${convertPrice(itemTotal)} (${currencySymbol}${convertPrice(addon.price)}/pax)`}
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
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Dedicated queue for {passengerCount} travelers</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#00e676' }}>
                  +{currencySymbol}{convertPrice(totalPriorityAmount)}
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
              Base: {currencySymbol}{convertPrice(activeFlight?.basePrice || 4850)} × {passengerCount} {passengerCount === 1 ? 'passenger' : 'passengers'} ({currencySymbol}{convertPrice(baseAirfareTotal)}) + Add-ons: {currencySymbol}{convertPrice(totalAddonAmount)}
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
              {onProceedToCheckout ? `Proceed with ${passengerCount} ${passengerCount === 1 ? 'Seat' : 'Seats'} (${selectedSeats.join(', ')})` : 'Select Configuration'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
