import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Plane,
  Star,
  Zap,
  CheckCircle2,
  X,
  Compass,
  Sliders,
  DollarSign
} from 'lucide-react';
import { ITINERARY_PRESETS } from '../data/mockItineraries';
import { INITIAL_HOTELS } from '../data/mockHotels';

export default function AiItineraryPlanner({
  currency = 'INR',
  currencyRates = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 },
  onNavigateToHotels = () => {},
  onNavigateToFlights = () => {},
  onBookBundledTrip = () => {}
}) {
  const [selectedDest, setSelectedDest] = useState('DXB');
  const [duration, setDuration] = useState(3);
  const [travelTheme, setTravelTheme] = useState('Luxury & Iconic Sights');
  const [travelPace, setTravelPace] = useState('Balanced');
  const [budgetTier, setBudgetTier] = useState('Premium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [activeDayTab, setActiveDayTab] = useState(1);
  const [bundleSuccessModal, setBundleSuccessModal] = useState(false);

  const convertPrice = (inr) => {
    const rate = currencyRates[currency] || 1;
    return Math.round(inr * rate);
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';

  // Build dynamic itinerary object
  const activeItinerary = useMemo(() => {
    const basePreset = ITINERARY_PRESETS.find(p => p.destinationCode === selectedDest) || ITINERARY_PRESETS[0];

    const destCity = basePreset.destinationCity;
    const destCountry = basePreset.country;

    // Generate days array dynamically matching `duration`
    const generatedDays = Array.from({ length: duration }).map((_, i) => {
      const dayNum = i + 1;
      const presetDay = basePreset.days[i];

      if (presetDay) {
        return {
          ...presetDay,
          dayNumber: dayNum
        };
      }

      // Dynamic fallback day generator for day 4, 5, 6, 7
      return {
        dayNumber: dayNum,
        title: `Day ${dayNum}: ${destCity} Hidden Gems & Local Discovery`,
        morning: {
          time: '09:30 AM – 12:30 PM',
          activity: `${destCity} Cultural Quarter & Scenic Viewpoint`,
          desc: `Guided morning tour through historic artisan streets and panoramic observation deck in ${destCity}.`,
          tag: 'Exploration',
          estCost: '₹3,500'
        },
        afternoon: {
          time: '02:00 PM – 05:00 PM',
          activity: `Waterfront Promenade & Designer Boutique Shopping`,
          desc: `Leisurely afternoon exploring signature cafes, local culinary markets, and coastal walkways.`,
          tag: 'Shopping & Leisure',
          estCost: '₹2,800'
        },
        evening: {
          time: '06:30 PM – 10:00 PM',
          activity: `Chef's Special Tasting Menu & Rooftop Lounge`,
          desc: `Enjoy Michelin-curated regional dining with craft cocktail pairings overlooking the city skyline.`,
          tag: 'Fine Dining',
          estCost: '₹5,500'
        }
      };
    });

    const multiplier = duration / 3;
    const paceBudgetMult = travelPace === 'Intensive' ? 1.2 : travelPace === 'Relaxed' ? 0.9 : 1.0;
    const tierMult = budgetTier === 'Ultra-Luxury' ? 1.8 : budgetTier === 'Standard' ? 0.6 : 1.0;
    const estBudgetInr = Math.round(basePreset.estimatedBudgetInr * multiplier * paceBudgetMult * tierMult);

    return {
      destinationCode: selectedDest,
      destinationCity: destCity,
      country: destCountry,
      title: `${duration}-Day ${travelTheme} in ${destCity}`,
      theme: travelTheme,
      durationDays: duration,
      heroImage: basePreset.heroImage,
      estimatedBudgetInr: estBudgetInr,
      highlights: basePreset.highlights,
      recommendedFlightNumber: basePreset.recommendedFlightNumber,
      recommendedHotelId: basePreset.recommendedHotelId,
      days: generatedDays
    };
  }, [selectedDest, duration, travelTheme, travelPace, budgetTier]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep('Scanning live flight & luxury stay corridors...');

    setTimeout(() => {
      setGenerationStep('Synthesizing day-by-day morning/afternoon/evening schedule...');
    }, 400);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep('');
      setActiveDayTab(1);
    }, 900);
  };

  const recommendedHotel = useMemo(() => {
    return INITIAL_HOTELS.find(h => h.id === activeItinerary.recommendedHotelId) || INITIAL_HOTELS[0];
  }, [activeItinerary]);

  const estBudget = convertPrice(activeItinerary.estimatedBudgetInr).toLocaleString();

  const handleBundleCheckout = () => {
    const bundleBooking = {
      id: `bk-bundle-${Date.now()}`,
      bookingType: 'BUNDLE',
      destination: activeItinerary.destinationCity,
      title: activeItinerary.title,
      duration: `${activeItinerary.durationDays} Days`,
      flightNumber: activeItinerary.recommendedFlightNumber,
      hotelName: recommendedHotel?.name || '5-Star Luxury Resort',
      totalPrice: activeItinerary.estimatedBudgetInr,
      currency,
      status: 'CONFIRMED',
      bookingDate: new Date().toISOString()
    };
    onBookBundledTrip(bundleBooking);
    setBundleSuccessModal(true);
  };

  return (
    <div style={{
      maxWidth: 1360,
      margin: '0 auto',
      padding: '24px 24px 80px 24px',
      borderRadius: 24,
      background: "linear-gradient(135deg, rgba(9, 15, 29, 0.88), rgba(15, 23, 42, 0.94)), url('/assets/images/ai_tripcraft_hero.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
    }}>
      {/* Banner */}
      <div style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        margin: '12px 0 32px 0',
        padding: '40px 32px',
        background: "linear-gradient(135deg, rgba(30, 10, 60, 0.85) 0%, rgba(9, 15, 29, 0.92) 100%), url('/assets/images/ai_tripcraft_hero.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(192, 132, 252, 0.35)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ maxWidth: 780 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(192, 132, 252, 0.15)',
            border: '1px solid rgba(192, 132, 252, 0.35)',
            color: '#c084fc',
            padding: '5px 14px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 800,
            marginBottom: 12
          }}>
            <Sparkles size={14} /> SKYGENIE TRIPCRAFT™ NEURAL ITINERARY ENGINE
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
            AI-Powered Personalized <span style={{ color: '#c084fc' }}>Travel Itineraries</span>
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 8 }}>
            Build day-by-day tailored travel schedules with morning, afternoon, and evening recommendations, budget projections, and 1-click bundled booking.
          </p>
        </div>

        {/* Generator Controls Card */}
        <div className="glass-card" style={{ marginTop: 24, padding: 24, background: 'rgba(9, 15, 29, 0.85)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'end' }}>
            {/* Destination */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <MapPin size={14} color="#c084fc" /> Select Destination
              </label>
              <select
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="DXB">Dubai, United Arab Emirates (DXB)</option>
                <option value="LHR">London, United Kingdom (LHR)</option>
                <option value="GOI">Goa, India (GOI)</option>
                <option value="PAR">Paris, France (CDG)</option>
                <option value="SIN">Singapore (SIN)</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Clock size={14} color="#c084fc" /> Trip Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                style={{ width: '100%' }}
              >
                <option value={2}>2 Days (Weekend Express)</option>
                <option value={3}>3 Days (Optimal Highlights)</option>
                <option value={4}>4 Days (Deep Exploration)</option>
                <option value={5}>5 Days (Relaxed Journey)</option>
                <option value={7}>7 Days (Grand Vacation)</option>
              </select>
            </div>

            {/* Travel Vibe */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Sparkles size={14} color="#c084fc" /> Travel Vibe / Style
              </label>
              <select
                value={travelTheme}
                onChange={(e) => setTravelTheme(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Luxury & Iconic Sights">Luxury & Iconic Sights</option>
                <option value="Beach & Coastal Relaxation">Beach & Coastal Relaxation</option>
                <option value="Culture, Arts & Royal Palaces">Culture, Arts & Heritage</option>
                <option value="Adventure & Desert Safaris">Adventure & Thrill</option>
                <option value="Gastronomy & High-End Shopping">Gastronomy & Shopping</option>
              </select>
            </div>

            {/* Submit */}
            <div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-primary"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #c084fc, #00d2ff)',
                  color: '#090f1d',
                  fontWeight: 800,
                  padding: '12px',
                  justifyContent: 'center'
                }}
              >
                {isGenerating ? (
                  <span>Generating...</span>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>Generate Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Banner during generation */}
          {isGenerating && (
            <div style={{ marginTop: 14, background: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '10px 16px', borderRadius: 10, color: '#c084fc', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="live-dot" />
              <span>{generationStep || 'Synthesizing Neural Itinerary...'}</span>
            </div>
          )}

          {/* Quick preference options */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap', fontSize: 12, color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Pace:</span>
              {['Relaxed', 'Balanced', 'Intensive'].map(pace => (
                <button
                  key={pace}
                  onClick={() => setTravelPace(pace)}
                  style={{
                    background: travelPace === pace ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: travelPace === pace ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: travelPace === pace ? '#c084fc' : '#cbd5e1',
                    padding: '3px 10px',
                    borderRadius: 6,
                    cursor: 'pointer'
                  }}
                >
                  {pace}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Budget Tier:</span>
              {['Standard', 'Premium', 'Ultra-Luxury'].map(tier => (
                <button
                  key={tier}
                  onClick={() => setBudgetTier(tier)}
                  style={{
                    background: budgetTier === tier ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: budgetTier === tier ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: budgetTier === tier ? '#00d2ff' : '#cbd5e1',
                    padding: '3px 10px',
                    borderRadius: 6,
                    cursor: 'pointer'
                  }}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
        {/* Left Column: Itinerary Days */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Overview Card */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '4px 10px', borderRadius: 20 }}>
                  {activeItinerary.theme}
                </span>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 10 }}>{activeItinerary.title}</h2>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                  Destination: <strong style={{ color: '#fff' }}>{activeItinerary.destinationCity}, {activeItinerary.country}</strong> • {activeItinerary.durationDays} Days Plan
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Estimated Trip Budget</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#f5af19', display: 'block', marginTop: 2 }}>{currencySymbol}{estBudget}</span>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>Includes stay, dining & activities</span>
              </div>
            </div>

            {/* Highlights */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {activeItinerary.highlights.map((h, i) => (
                <span key={i} style={{ fontSize: 11, background: 'rgba(255, 255, 255, 0.05)', color: '#00d2ff', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  ✦ {h}
                </span>
              ))}
            </div>
          </div>

          {/* Day Tabs */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {activeItinerary.days.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => setActiveDayTab(d.dayNumber)}
                style={{
                  background: activeDayTab === d.dayNumber ? 'linear-gradient(135deg, #c084fc, #00d2ff)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeDayTab === d.dayNumber ? '#090f1d' : '#cbd5e1',
                  border: activeDayTab === d.dayNumber ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '8px 20px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Day {d.dayNumber}
              </button>
            ))}
          </div>

          {/* Active Day Detail Card */}
          {(() => {
            const currentDay = activeItinerary.days.find(d => d.dayNumber === activeDayTab) || activeItinerary.days[0];
            if (!currentDay) return null;

            return (
              <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 12 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                    Day {currentDay.dayNumber}: {currentDay.title}
                  </h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Curated timeline sequence</p>
                </div>

                {/* Timeline items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Morning */}
                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245, 175, 25, 0.2)', border: '2px solid #f5af19', color: '#f5af19', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: 16, flexShrink: 0 }}>
                      🌅
                    </div>
                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#f5af19' }}>{currentDay.morning.time}</span>
                        <span style={{ fontSize: 11, color: '#00e676', fontWeight: 700 }}>{currentDay.morning.estCost}</span>
                      </div>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{currentDay.morning.activity}</h4>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{currentDay.morning.desc}</p>
                    </div>
                  </div>

                  {/* Afternoon */}
                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0, 210, 255, 0.2)', border: '2px solid #00d2ff', color: '#00d2ff', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: 16, flexShrink: 0 }}>
                      ☀️
                    </div>
                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#00d2ff' }}>{currentDay.afternoon.time}</span>
                        <span style={{ fontSize: 11, color: '#00e676', fontWeight: 700 }}>{currentDay.afternoon.estCost}</span>
                      </div>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{currentDay.afternoon.activity}</h4>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{currentDay.afternoon.desc}</p>
                    </div>
                  </div>

                  {/* Evening */}
                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(192, 132, 252, 0.2)', border: '2px solid #c084fc', color: '#c084fc', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: 16, flexShrink: 0 }}>
                      🌙
                    </div>
                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#c084fc' }}>{currentDay.evening.time}</span>
                        <span style={{ fontSize: 11, color: '#00e676', fontWeight: 700 }}>{currentDay.evening.estCost}</span>
                      </div>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{currentDay.evening.activity}</h4>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{currentDay.evening.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right Column: Bundled Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(17, 26, 51, 0.95), rgba(30, 10, 60, 0.95))', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: 11, fontWeight: 800, background: 'rgba(0, 230, 118, 0.15)', color: '#00e676', padding: '3px 10px', borderRadius: 12, border: '1px solid rgba(0, 230, 118, 0.3)' }}>
                1-Click Bundle Savings
              </span>
              <span style={{ fontSize: 11, color: '#c084fc', fontFamily: 'monospace' }}>TripCraft Sync</span>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 14 }}>Complete Package Bundle</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Book flights + luxury stay synced with this exact AI itinerary.
            </p>

            {/* Flight */}
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8' }}>
                <span>Recommended Flight</span>
                <span style={{ color: '#00d2ff', fontWeight: 700 }}>✈️ {activeItinerary.recommendedFlightNumber || 'SMF-Air'}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginTop: 4 }}>Direct Non-Stop Express</div>
              <div style={{ fontSize: 11, color: '#00e676', marginTop: 2 }}>● Synchronized with Day 1 Schedule</div>
            </div>

            {/* Hotel */}
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8' }}>
                <span>Recommended Stay</span>
                <span style={{ color: '#f5af19', fontWeight: 700 }}>★ 5.0 Luxury</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginTop: 4 }}>{recommendedHotel.name}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{recommendedHotel.location}</div>
            </div>

            {/* Total & CTA */}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Package Bundle Price:</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#f5af19' }}>{currencySymbol}{estBudget}</span>
              </div>

              <button
                onClick={handleBundleCheckout}
                className="btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #00d2ff, #c084fc)', color: '#090f1d', fontWeight: 800, padding: '12px', justifyContent: 'center' }}
              >
                Instant Book Flight + Stay
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginTop: 12 }}>
                <button onClick={onNavigateToHotels} style={{ background: 'none', border: 'none', color: '#94a3b8', textDecoration: 'underline', cursor: 'pointer' }}>Browse hotels ➔</button>
                <button onClick={onNavigateToFlights} style={{ background: 'none', border: 'none', color: '#94a3b8', textDecoration: 'underline', cursor: 'pointer' }}>Browse flights ➔</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {bundleSuccessModal && (
        <div className="modal-overlay" onClick={() => setBundleSuccessModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, padding: 24, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0, 230, 118, 0.2)', border: '2px solid #00e676', color: '#00e676', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px auto' }}>
              ✓
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>Trip Bundle Reserved!</h3>
            <p style={{ fontSize: 13, color: '#cbd5e1', margin: '8px 0 16px 0' }}>
              Your {activeItinerary.durationDays}-Day custom itinerary in <strong style={{ color: '#00d2ff' }}>{activeItinerary.destinationCity}</strong> with hotel stay and flights has been locked in and added to your dashboard.
            </p>
            <button onClick={() => setBundleSuccessModal(false)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              View in My Trips
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
