import React, { useState } from 'react';
import { 
  Palmtree, 
  Calendar, 
  MapPin, 
  Star, 
  CheckCircle2, 
  X, 
  Clock, 
  Sparkles, 
  Send, 
  ArrowRight, 
  Plane, 
  Building2, 
  Coffee, 
  Car, 
  ShieldCheck, 
  PhoneCall, 
  Check, 
  Filter,
  Users,
  Compass,
  DollarSign,
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HOLIDAY_PACKAGES } from '../data/mockPackages';

export default function HolidayPackagesPortal({ currency = 'INR', onClose, onPackageBooked, onNavigateToMyTrips }) {
  const [viewMode, setViewMode] = useState('curated'); // 'curated' | 'ai-planner'
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [activePackageModal, setActivePackageModal] = useState(null);
  const [isCustomQuoteOpen, setIsCustomQuoteOpen] = useState(false);
  const [quoteSuccessId, setQuoteSuccessId] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // AI Holiday Planner Form State
  const [plannerDest, setPlannerDest] = useState('DXB');
  const [customDestName, setCustomDestName] = useState('');
  const [plannerVibe, setPlannerVibe] = useState('Beach & Sun Escape');
  const [plannerOrigin, setPlannerOrigin] = useState('DEL');
  const [plannerDuration, setPlannerDuration] = useState(5);
  const [plannerTravelers, setPlannerTravelers] = useState(2);
  const [plannerTier, setPlannerTier] = useState('comfort');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedPackage, setGeneratedPackage] = useState(null);
  const [expandedDay, setExpandedDay] = useState(1);

  // Custom Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    name: localStorage.getItem('smf_verified_name') || 'Thiru Selvan',
    email: localStorage.getItem('smf_verified_email') || 'thiru1511@gmail.com',
    phone: '+91 98765 43210',
    destination: 'Dubai & Abu Dhabi',
    travelDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    adults: 2,
    children: 0,
    budgetPerPerson: '₹40,000 – ₹60,000',
    specialNotes: 'Looking for 4-star family hotel near city center with breakfast & desert safari.'
  });

  const formatPrice = (amount) => {
    if (currency === 'USD') return `$${Math.round(amount / 83)}`;
    if (currency === 'EUR') return `€${Math.round(amount / 90)}`;
    if (currency === 'GBP') return `£${Math.round(amount / 105)}`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredPackages = HOLIDAY_PACKAGES.filter(pkg => {
    if (selectedDestination === 'All') return true;
    return pkg.destinationCode === selectedDestination || pkg.destination.toLowerCase().includes(selectedDestination.toLowerCase());
  });

  // AI Planner Destination Meta Registry
  const DEST_REGISTRY = {
    DXB: { name: 'Dubai', country: 'United Arab Emirates', code: 'DXB', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80', airline: 'Emirates', flightNum: 'EK-511', baseFlight: 22000, hotel: 'Millennium Plaza Downtown 4★', hotelNight: 7500 },
    DPS: { name: 'Bali', country: 'Indonesia', code: 'DPS', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80', airline: 'Singapore Airlines', flightNum: 'SQ-938', baseFlight: 26000, hotel: 'The Kayon Jungle Private Pool Resort 5★', hotelNight: 8500 },
    COK: { name: 'Kerala', country: 'India', code: 'COK', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80', airline: 'IndiGo', flightNum: '6E-442', baseFlight: 9500, hotel: 'Alleppey Deluxe Houseboat & Munnar Tea Resort', hotelNight: 5500 },
    SIN: { name: 'Singapore', country: 'Singapore', code: 'SIN', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=80', airline: 'Air India', flightNum: 'AI-382', baseFlight: 24000, hotel: 'Pan Pacific Marina Bay 5★', hotelNight: 9500 },
    MLE: { name: 'Maldives', country: 'Maldives', code: 'MLE', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=900&q=80', airline: 'IndiGo', flightNum: '6E-1127', baseFlight: 21000, hotel: 'Sun Siyam Olhuveli Overwater Lagoon Villa 5★', hotelNight: 16000 },
    CDG: { name: 'Paris', country: 'France', code: 'CDG', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80', airline: 'Air France', flightNum: 'AF-225', baseFlight: 46000, hotel: 'Pullman Paris Tour Eiffel 4★', hotelNight: 14000 },
    ZRH: { name: 'Switzerland', country: 'Switzerland', code: 'ZRH', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=900&q=80', airline: 'Swiss International Air Lines', flightNum: 'LX-147', baseFlight: 52000, hotel: 'Victoria Jungfrau Grand Alpine Resort 5★', hotelNight: 18000 },
    GOI: { name: 'Goa', country: 'India', code: 'GOI', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80', airline: 'IndiGo', flightNum: '6E-6351', baseFlight: 6800, hotel: 'Taj Fort Aguada Beach Resort & Spa 5★', hotelNight: 6200 },
    JAI: { name: 'Rajasthan', country: 'India', code: 'JAI', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&q=80', airline: 'Air India', flightNum: 'AI-491', baseFlight: 5500, hotel: 'Chomu Palace Heritage Haveli & Resort', hotelNight: 4800 },
    HND: { name: 'Tokyo', country: 'Japan', code: 'HND', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&q=80', airline: 'All Nippon Airways (ANA)', flightNum: 'NH-828', baseFlight: 48000, hotel: 'Keio Plaza Hotel Shinjuku 4★', hotelNight: 12000 }
  };

  const handleGenerateAiHoliday = () => {
    setIsGenerating(true);
    setGenerationStep('Analyzing seasonal weather & peak availability index...');

    setTimeout(() => {
      setGenerationStep(`Pairing direct ${plannerOrigin} flight corridors & verified airlines...`);
    }, 500);

    setTimeout(() => {
      setGenerationStep('Selecting 4★ / 5★ luxury partner stays with complimentary breakfast...');
    }, 1000);

    setTimeout(() => {
      setGenerationStep('Synthesizing bespoke daily morning, afternoon & evening schedule...');
    }, 1500);

    setTimeout(() => {
      const meta = DEST_REGISTRY[plannerDest] || DEST_REGISTRY['DXB'];
      const cityName = customDestName.trim() || meta.name;
      const tierMult = plannerTier === 'luxury' ? 1.45 : plannerTier === 'budget' ? 0.75 : 1.0;
      const hotelTotal = Math.round(meta.hotelNight * (plannerDuration - 1) * tierMult);
      const flightTotal = Math.round(meta.baseFlight * (plannerOrigin === 'DEL' ? 1.0 : 1.15));
      const toursTotal = Math.round(3500 * plannerDuration * tierMult);
      const gross = flightTotal + hotelTotal + toursTotal;
      const savings = Math.round(gross * 0.16); // 16% bundle savings
      const pricePerPerson = gross - savings;

      // Build Day by Day Schedule
      const schedule = Array.from({ length: plannerDuration }).map((_, i) => {
        const day = i + 1;
        if (day === 1) {
          return {
            day: 1,
            title: `Arrival in ${cityName} & VIP Chauffeur Transfer`,
            morning: `Depart from ${plannerOrigin} on confirmed flight ${meta.airline} (${meta.flightNum}).`,
            afternoon: `Arrive in ${cityName}. Private air-conditioned VIP transfer to ${meta.hotel}. Check in and unwind.`,
            evening: `Sunset welcome drink & signature regional culinary dinner.`
          };
        } else if (day === plannerDuration) {
          return {
            day,
            title: `Souvenir Shopping & Farewell Departure`,
            morning: `Gourmet breakfast at ${meta.hotel}. Leisurely stroll through local artisan boutiques.`,
            afternoon: `Private transfer to international airport for return flight to ${plannerOrigin}.`,
            evening: `Touchdown back home with lifetime vacation memories!`
          };
        } else {
          return {
            day,
            title: `Day ${day}: ${cityName} Signature Sights & Local Experiences`,
            morning: `Guided cultural tour of top-rated landmarks, heritage quarters, and scenic observation points.`,
            afternoon: `Curated local tasting experience, waterfront promenade stroll, and designer shopping.`,
            evening: `Evening entertainment, scenic harbor cruise, or rooftop lounge overlooking city skyline.`
          };
        }
      });

      const pkg = {
        id: `ai-pkg-${plannerDest}-${Date.now()}`,
        title: `${plannerDuration}-Day ${plannerVibe} in ${cityName}`,
        destination: `${cityName}, ${meta.country}`,
        destinationCode: meta.code,
        originCity: plannerOrigin,
        duration: `${plannerDuration} Days / ${plannerDuration - 1} Nights`,
        daysCount: plannerDuration,
        nightsCount: plannerDuration - 1,
        pricePerPerson,
        originalPrice: gross,
        rating: 4.9,
        reviewsCount: 890,
        heroImage: meta.image,
        airline: meta.airline,
        flightNum: meta.flightNum,
        hotelName: meta.hotel,
        travelers: plannerTravelers,
        tier: plannerTier,
        inclusions: [
          `Round-Trip Flights on ${meta.airline} (${plannerOrigin} ⇄ ${meta.code})`,
          `${plannerDuration - 1} Nights in ${meta.hotel}`,
          `Daily International Buffet Breakfast Included`,
          `Private Airport Transfers in Air-Conditioned Vehicle`,
          `Full Day Guided Sightseeing & Entry Tickets`,
          `Dedicated 24/7 SelectMyFlight Concierge Support`
        ],
        itinerary: schedule
      };

      setGeneratedPackage(pkg);
      setIsGenerating(false);
      setExpandedDay(1);
    }, 2000);
  };

  const handleBookPackage = (pkg) => {
    const bookingPnr = 'SMF-PKG-' + Math.floor(1000 + Math.random() * 9000);
    const travelerCount = pkg.travelers || 2;
    const newBooking = {
      id: Date.now(),
      pnr: bookingPnr,
      bookingType: 'HOLIDAY_PACKAGE',
      flightNumber: pkg.flightNum || `SMF-${pkg.destinationCode}-PKG`,
      airlineName: pkg.airline || 'SelectMyFlight Holidays',
      airlineCode: 'SMF',
      originCode: pkg.originCity || 'DEL',
      destinationCode: pkg.destinationCode,
      originCity: pkg.originCity === 'DEL' ? 'New Delhi' : pkg.originCity || 'New Delhi',
      destinationCity: pkg.destination,
      departureDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
      departureTime: '08:30',
      arrivalTime: '13:00',
      totalAmount: (pkg.pricePerPerson || 40000) * travelerCount,
      passengersCount: travelerCount,
      packageTitle: pkg.title,
      duration: pkg.duration,
      status: 'CONFIRMED',
      paymentMethod: 'UPI Instant / Verified',
      bookedAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('smf_bookings') || '[]');
      localStorage.setItem('smf_bookings', JSON.stringify([newBooking, ...existing]));
      window.dispatchEvent(new Event('smf_data_updated'));
    } catch {
      // ignore
    }

    try {
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    setConfirmedBooking(newBooking);

    if (onPackageBooked) {
      onPackageBooked(newBooking);
    }

    setActivePackageModal(null);
  };

  const handleCustomQuoteSubmit = (e) => {
    e.preventDefault();
    const quoteRef = 'SMF-QUOTE-' + Math.floor(10000 + Math.random() * 90000);
    setQuoteSuccessId(quoteRef);
  };

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', padding: '16px 8px 60px 8px' }}>
      {/* Hero Banner with Mode Switch */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(9, 15, 29, 0.95), rgba(15, 23, 42, 0.98))',
        border: '1px solid rgba(245, 175, 25, 0.3)',
        borderRadius: 20,
        padding: '30px 24px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 24,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 175, 25, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ maxWidth: 740 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(245, 175, 25, 0.12)',
              border: '1px solid rgba(245, 175, 25, 0.35)',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              color: '#f5af19',
              marginBottom: 10
            }}>
              <Palmtree size={13} />
              <span>HANDPICKED & AI-CURATED VACATIONS</span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: -0.5 }}>
              All-Inclusive Holiday Packages & AI Vacation Planner
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>
              Choose from ready-to-book bestseller tour packages or generate a custom AI holiday package with confirmed flights, 4★/5★ luxury resorts, daily breakfast, and private transfers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsCustomQuoteOpen(true);
              setQuoteSuccessId(null);
            }}
            style={{
              background: 'linear-gradient(135deg, #f5af19, #f12711)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 22px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 18px rgba(245, 175, 25, 0.35)'
            }}
          >
            <Sparkles size={16} />
            <span>Request Custom Tour Quote</span>
          </button>
        </div>

        {/* View Mode Switch Tabs */}
        <div style={{
          display: 'flex',
          gap: 10,
          marginTop: 22,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 18,
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => setViewMode('curated')}
            style={{
              background: viewMode === 'curated' ? 'linear-gradient(135deg, #f5af19, #f12711)' : 'rgba(255, 255, 255, 0.05)',
              border: viewMode === 'curated' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
              boxShadow: viewMode === 'curated' ? '0 4px 15px rgba(245, 175, 25, 0.4)' : 'none'
            }}
          >
            <Palmtree size={16} />
            <span>Curated Packages (5)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('ai-planner');
              if (!generatedPackage) handleGenerateAiHoliday();
            }}
            style={{
              background: viewMode === 'ai-planner' ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'rgba(255, 255, 255, 0.05)',
              border: viewMode === 'ai-planner' ? 'none' : '1px solid rgba(0, 210, 255, 0.3)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
              boxShadow: viewMode === 'ai-planner' ? '0 4px 20px rgba(0, 210, 255, 0.45)' : 'none'
            }}
          >
            <Sparkles size={16} />
            <span>AI Holiday Planner & Custom Generator</span>
            <span style={{
              background: '#00e676',
              color: '#000',
              fontSize: 9,
              fontWeight: 900,
              padding: '2px 6px',
              borderRadius: 8,
              marginLeft: 4
            }}>
              NEW
            </span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: CURATED PACKAGES */}
      {viewMode === 'curated' && (
        <>
          {/* Destination Filters Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 10,
            marginBottom: 20
          }}>
            {[
              { id: 'All', label: 'All Packages (5)' },
              { id: 'DXB', label: '🇦🇪 Dubai Extravaganza' },
              { id: 'COK', label: '🌴 Magical Kerala' },
              { id: 'SIN', label: '🇸🇬 Singapore & Sentosa' },
              { id: 'DPS', label: '🌺 Bali Tropical Romance' },
              { id: 'JAI', label: '🏰 Royal Rajasthan' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedDestination(filter.id)}
                style={{
                  background: selectedDestination === filter.id ? 'rgba(245, 175, 25, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedDestination === filter.id ? '#f5af19' : '#94a3b8',
                  border: selectedDestination === filter.id ? '1px solid #f5af19' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Holiday Package Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: 24
          }}>
            {filteredPackages.map(pkg => (
              <div
                key={pkg.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 18,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245, 175, 25, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Package Image & Badge Header */}
                <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                  <img
                    src={pkg.heroImage}
                    alt={pkg.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)'
                  }} />

                  <span style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: pkg.badgeColor || '#00d2ff',
                    color: '#000000',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 12,
                    letterSpacing: 0.5
                  }}>
                    {pkg.badge}
                  </span>

                  <span style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 14,
                    color: '#cbd5e1',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <Clock size={13} color="#f5af19" />
                    <span>{pkg.duration}</span>
                  </span>

                  <div style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'rgba(0, 0, 0, 0.6)',
                    padding: '3px 8px',
                    borderRadius: 8,
                    color: '#f5af19',
                    fontSize: 12,
                    fontWeight: 700
                  }}>
                    <Star size={13} fill="#f5af19" />
                    <span>{pkg.rating} ({pkg.reviewsCount})</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 19, fontWeight: 800, color: '#fff', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                      {pkg.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#00d2ff', marginBottom: 12 }}>
                      <MapPin size={14} />
                      <span>{pkg.destination}</span>
                    </div>

                    <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5, margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {pkg.overview}
                    </p>

                    {/* Quick Inclusions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                      {pkg.inclusions.slice(0, 3).map((inc, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#e2e8f0' }}>
                          <CheckCircle2 size={14} color="#00e676" style={{ flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Starting from / person
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 22, fontWeight: 800, color: '#00e676' }}>
                          {formatPrice(pkg.pricePerPerson)}
                        </span>
                        <span style={{ fontSize: 13, color: '#64748b', textDecoration: 'line-through' }}>
                          {formatPrice(pkg.originalPrice)}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => setActivePackageModal(pkg)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          padding: '10px 14px',
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBookPackage(pkg)}
                        style={{
                          background: 'linear-gradient(135deg, #f5af19, #f12711)',
                          border: 'none',
                          color: '#fff',
                          padding: '10px 18px',
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <span>Book</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VIEW MODE 2: AI-POWERED HOLIDAY PLANNER */}
      {viewMode === 'ai-planner' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* AI Generator Control Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 26, 48, 0.95), rgba(11, 18, 33, 0.98))',
            border: '1px solid rgba(0, 210, 255, 0.3)',
            borderRadius: 20,
            padding: '24px',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00d2ff', fontSize: 13, fontWeight: 800, marginBottom: 14 }}>
              <Sparkles size={16} />
              <span>CUSTOMIZE YOUR DREAM HOLIDAY PARAMETERS</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {/* Destination Selector */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                  1. Target Destination
                </label>
                <select
                  value={plannerDest}
                  onChange={(e) => {
                    setPlannerDest(e.target.value);
                    setCustomDestName('');
                  }}
                  style={{
                    width: '100%',
                    background: '#111a33',
                    border: '1.5px solid rgba(0, 210, 255, 0.35)',
                    color: '#fff',
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    outline: 'none'
                  }}
                >
                  <option value="DXB">🇦🇪 Dubai & Abu Dhabi (UAE)</option>
                  <option value="DPS">🌺 Bali & Ubud Villas (Indonesia)</option>
                  <option value="COK">🌴 Kerala Backwaters & Tea Hills (India)</option>
                  <option value="SIN">🇸🇬 Singapore & Sentosa Island</option>
                  <option value="MLE">🏖️ Maldives Overwater Bungalows</option>
                  <option value="CDG">🗼 Paris Romance & Versailles (France)</option>
                  <option value="ZRH">🏔️ Swiss Alps & Interlaken (Switzerland)</option>
                  <option value="GOI">🌊 Goa Beach & Luxury Resorts (India)</option>
                  <option value="JAI">🏰 Royal Rajasthan Forts & Palaces (India)</option>
                  <option value="HND">🌸 Tokyo & Mount Fuji (Japan)</option>
                </select>
              </div>

              {/* Holiday Vibe & Style */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                  2. Holiday Vibe & Theme
                </label>
                <select
                  value={plannerVibe}
                  onChange={(e) => setPlannerVibe(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#111a33',
                    border: '1.5px solid rgba(0, 210, 255, 0.35)',
                    color: '#fff',
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    outline: 'none'
                  }}
                >
                  <option value="Beach & Sun Escape">🏖️ Beach & Coastal Island Leisure</option>
                  <option value="Romantic Honeymoon">💍 Romantic Couple / Honeymoon Retreat</option>
                  <option value="Family Fun & Parks">👨‍👩‍👧 Family Fun, Theme Parks & Safari</option>
                  <option value="Scenic Mountains & Hills">🏔️ Scenic Alpine Hills & Tea Plantations</option>
                  <option value="Cultural Heritage & Sights">🏛️ Imperial Heritage & Iconic Sights</option>
                  <option value="Ultra-Luxury & Wellness">💎 5★ Wellness, Spa & Private Dining</option>
                </select>
              </div>

              {/* Departure Airport */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                  3. Departure City
                </label>
                <select
                  value={plannerOrigin}
                  onChange={(e) => setPlannerOrigin(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#111a33',
                    border: '1.5px solid rgba(0, 210, 255, 0.35)',
                    color: '#fff',
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    outline: 'none'
                  }}
                >
                  <option value="DEL">New Delhi (DEL)</option>
                  <option value="BOM">Mumbai (BOM)</option>
                  <option value="BLR">Bengaluru (BLR)</option>
                  <option value="MAA">Chennai (MAA)</option>
                  <option value="HYD">Hyderabad (HYD)</option>
                  <option value="CCU">Kolkata (CCU)</option>
                </select>
              </div>

              {/* Duration Days */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                  4. Vacation Duration
                </label>
                <select
                  value={plannerDuration}
                  onChange={(e) => setPlannerDuration(Number(e.target.value))}
                  style={{
                    width: '100%',
                    background: '#111a33',
                    border: '1.5px solid rgba(0, 210, 255, 0.35)',
                    color: '#fff',
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    outline: 'none'
                  }}
                >
                  <option value={3}>3 Days / 2 Nights (Weekend Break)</option>
                  <option value={5}>5 Days / 4 Nights (Classic Tour)</option>
                  <option value={7}>7 Days / 6 Nights (Grand Escape)</option>
                  <option value={10}>10 Days / 9 Nights (Comprehensive)</option>
                </select>
              </div>

              {/* Number of Travelers */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                  5. Travelers
                </label>
                <select
                  value={plannerTravelers}
                  onChange={(e) => setPlannerTravelers(Number(e.target.value))}
                  style={{
                    width: '100%',
                    background: '#111a33',
                    border: '1.5px solid rgba(0, 210, 255, 0.35)',
                    color: '#fff',
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    outline: 'none'
                  }}
                >
                  <option value={1}>1 Solo Explorer</option>
                  <option value={2}>2 Adults (Couple / 1 Room)</option>
                  <option value={3}>3 Guests (Family / Triple Room)</option>
                  <option value={4}>4 Guests (Family / 2 Rooms)</option>
                  <option value={6}>6+ Guests (Group Booking)</option>
                </select>
              </div>

              {/* Budget / Comfort Tier */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                  6. Budget & Hotel Category
                </label>
                <select
                  value={plannerTier}
                  onChange={(e) => setPlannerTier(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#111a33',
                    border: '1.5px solid rgba(0, 210, 255, 0.35)',
                    color: '#fff',
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    outline: 'none'
                  }}
                >
                  <option value="budget">Value Explorer (3★/4★ Verified Stays)</option>
                  <option value="comfort">Premium Comfort (Handpicked 4★ Resorts)</option>
                  <option value="luxury">Ultra-Luxury VIP (5★ Signature Beach/Pool Villas)</option>
                </select>
              </div>
            </div>

            {/* Inclusions summary pills */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 18,
              paddingTop: 16,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Guaranteed Inclusions:</span>
              {[
                '✈️ Return Flights Included',
                '🏨 4★/5★ Resort with Breakfast',
                '🚗 Private Airport Transfers',
                '🎟️ Guided Tours & Tickets',
                '🛡️ 24/7 AI Concierge'
              ].map((perk, i) => (
                <span key={i} style={{
                  background: 'rgba(0, 230, 118, 0.1)',
                  border: '1px solid rgba(0, 230, 118, 0.3)',
                  color: '#00e676',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 14
                }}>
                  {perk}
                </span>
              ))}
            </div>

            {/* Generate Button */}
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateAiHoliday}
                style={{
                  background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                  border: 'none',
                  color: '#fff',
                  padding: '14px 36px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: isGenerating ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 8px 25px rgba(0, 210, 255, 0.4)',
                  transition: 'all 0.2s'
                }}
              >
                <Sparkles size={18} className={isGenerating ? 'spin-slow' : ''} />
                <span>{isGenerating ? 'Synthesizing Holiday Package...' : '✨ Generate AI Holiday Package'}</span>
              </button>
            </div>

            {/* Generating Live Feedback */}
            {isGenerating && (
              <div style={{
                marginTop: 16,
                textAlign: 'center',
                color: '#00d2ff',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}>
                <Sparkles size={16} className="spin-slow" />
                <span>{generationStep}</span>
              </div>
            )}
          </div>

          {/* GENERATED PACKAGE RESULT CARD */}
          {generatedPackage && !isGenerating && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 26, 48, 0.98), rgba(9, 15, 29, 0.98))',
              border: '2px solid rgba(0, 210, 255, 0.45)',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)'
            }}>
              {/* Hero Banner Header */}
              <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                <img
                  src={generatedPackage.heroImage}
                  alt={generatedPackage.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(9, 15, 29, 0.98) 0%, rgba(9, 15, 29, 0.3) 60%, transparent 100%)'
                }} />

                <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8 }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: 11,
                    padding: '4px 12px',
                    borderRadius: 20,
                    letterSpacing: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <Sparkles size={13} /> AI CUSTOM BESPOKE PACKAGE
                  </span>
                  <span style={{
                    background: 'rgba(0, 230, 118, 0.25)',
                    border: '1px solid #00e676',
                    color: '#00e676',
                    fontWeight: 800,
                    fontSize: 11,
                    padding: '4px 10px',
                    borderRadius: 20
                  }}>
                    99% TAILORED MATCH
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
                  <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: '#fff', margin: 0 }}>
                    {generatedPackage.title}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ color: '#00d2ff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={14} /> {generatedPackage.destination}
                    </span>
                    <span style={{ color: '#f5af19', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} /> {generatedPackage.duration}
                    </span>
                    <span style={{ color: '#cbd5e1', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Users size={14} /> {generatedPackage.travelers} Guests
                    </span>
                  </div>
                </div>
              </div>

              {/* Package Details Body */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18, marginBottom: 24 }}>
                  {/* Flight Corridor Card */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(0, 210, 255, 0.2)',
                    borderRadius: 14,
                    padding: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00d2ff', fontSize: 13, fontWeight: 800, marginBottom: 8 }}>
                      <Plane size={16} />
                      <span>INCLUDED FLIGHT CORRIDOR</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                      {generatedPackage.airline} • {generatedPackage.flightNum}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                      Roundtrip: {generatedPackage.originCity} (08:30) ⇄ {generatedPackage.destinationCode} (13:00)
                    </div>
                    <div style={{ fontSize: 11, color: '#00e676', fontWeight: 600, marginTop: 6 }}>
                      ✓ Includes 20kg Checked Baggage & Inflight Meal
                    </div>
                  </div>

                  {/* Luxury Resort Stay Card */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(245, 175, 25, 0.25)',
                    borderRadius: 14,
                    padding: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f5af19', fontSize: 13, fontWeight: 800, marginBottom: 8 }}>
                      <Building2 size={16} />
                      <span>HANDPICKED LUXURY STAY</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                      {generatedPackage.hotelName}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                      {generatedPackage.nightsCount} Nights in Deluxe Scenic Suite
                    </div>
                    <div style={{ fontSize: 11, color: '#00e676', fontWeight: 600, marginTop: 6 }}>
                      ✓ Daily International Breakfast & Welcome Cocktail
                    </div>
                  </div>
                </div>

                {/* Day-by-Day Accordion Itinerary */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
                    <Calendar size={18} color="#00d2ff" />
                    <span>Day-by-Day Curated Holiday Schedule</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {generatedPackage.itinerary.map(item => {
                      const isExpanded = expandedDay === item.day;
                      return (
                        <div
                          key={item.day}
                          style={{
                            background: isExpanded ? 'rgba(0, 210, 255, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                            border: isExpanded ? '1px solid rgba(0, 210, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: 12,
                            overflow: 'hidden',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div
                            onClick={() => setExpandedDay(isExpanded ? null : item.day)}
                            style={{
                              padding: '14px 18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              userSelect: 'none'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{
                                background: isExpanded ? '#00d2ff' : 'rgba(255, 255, 255, 0.1)',
                                color: isExpanded ? '#000' : '#fff',
                                fontWeight: 900,
                                fontSize: 12,
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {item.day}
                              </span>
                              <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>
                                {item.title}
                              </span>
                            </div>
                            {isExpanded ? <ChevronUp size={18} color="#00d2ff" /> : <ChevronDown size={18} color="#94a3b8" />}
                          </div>

                          {isExpanded && (
                            <div style={{ padding: '0 18px 16px 18px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                              <div style={{ color: '#cbd5e1' }}>
                                <strong style={{ color: '#f5af19' }}>🌅 Morning:</strong> {item.morning}
                              </div>
                              <div style={{ color: '#cbd5e1' }}>
                                <strong style={{ color: '#38bdf8' }}>☀️ Afternoon:</strong> {item.afternoon}
                              </div>
                              <div style={{ color: '#cbd5e1' }}>
                                <strong style={{ color: '#c084fc' }}>🌙 Evening:</strong> {item.evening}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Package Inclusions Checklist */}
                <div style={{
                  background: 'rgba(0, 230, 118, 0.06)',
                  border: '1px solid rgba(0, 230, 118, 0.2)',
                  borderRadius: 14,
                  padding: '16px',
                  marginBottom: 24
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#00e676', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={16} />
                    <span>Package Inclusions & Benefits (Zero Hidden Costs):</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
                    {generatedPackage.inclusions.map((inc, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#e2e8f0' }}>
                        <CheckCircle2 size={14} color="#00e676" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transparent Price Summary & 1-Click Booking */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(9, 15, 29, 0.98))',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 16,
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 18
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Bundled Total ({generatedPackage.travelers} Guests)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
                      <span style={{ fontSize: 26, fontWeight: 900, color: '#00e676' }}>
                        {formatPrice(generatedPackage.pricePerPerson * generatedPackage.travelers)}
                      </span>
                      <span style={{ fontSize: 14, color: '#94a3b8' }}>
                        ({formatPrice(generatedPackage.pricePerPerson)} / person)
                      </span>
                      <span style={{ fontSize: 13, color: '#ef4444', textDecoration: 'line-through' }}>
                        {formatPrice(generatedPackage.originalPrice * generatedPackage.travelers)}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#00d2ff', fontWeight: 700, marginTop: 2 }}>
                      🎉 Includes 16% bundled airfare + luxury resort discount
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleGenerateAiHoliday}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        padding: '12px 20px',
                        borderRadius: 12,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Re-generate
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBookPackage(generatedPackage)}
                      style={{
                        background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                        border: 'none',
                        color: '#fff',
                        padding: '12px 28px',
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 20px rgba(0, 210, 255, 0.45)'
                      }}
                    >
                      <Sparkles size={16} />
                      <span>Book AI Holiday Package</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking Confirmed Celebration Modal */}
      {confirmedBooking && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0d1527, #070c18)',
            border: '2px solid #00e676',
            borderRadius: 20,
            padding: '28px',
            maxWidth: 500,
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(0, 230, 118, 0.3)'
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(0, 230, 118, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#00e676'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 8px 0' }}>
              Holiday Package Confirmed!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Your flight tickets, luxury resort stay, and private transfer vouchers have been issued and saved to your account.
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
              padding: '14px',
              textAlign: 'left',
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>Booking Reference (PNR):</span>
                <span style={{ color: '#f5af19', fontWeight: 800, fontSize: 13 }}>{confirmedBooking.pnr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>Destination:</span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{confirmedBooking.destinationCity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>Guests:</span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{confirmedBooking.passengersCount} Travelers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>Total Amount:</span>
                <span style={{ color: '#00e676', fontWeight: 900, fontSize: 14 }}>{formatPrice(confirmedBooking.totalAmount)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setConfirmedBooking(null)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmedBooking(null);
                  if (onNavigateToMyTrips) onNavigateToMyTrips();
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                  border: 'none',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                View in "My Trips"
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Detail Modal (for Curated packages) */}
      {activePackageModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0d1527, #070c18)',
            border: '1px solid rgba(245, 175, 25, 0.4)',
            borderRadius: 20,
            maxWidth: 720,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            position: 'relative',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)'
          }}>
            <button
              onClick={() => setActivePackageModal(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ height: 200, borderRadius: 14, overflow: 'hidden', marginBottom: 18, position: 'relative' }}>
              <img src={activePackageModal.heroImage} alt={activePackageModal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #070c18 0%, transparent 60%)' }} />
              <span style={{ position: 'absolute', bottom: 12, left: 14, color: '#f5af19', fontWeight: 800, fontSize: 13 }}>
                {activePackageModal.duration}
              </span>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>
              {activePackageModal.title}
            </h2>
            <div style={{ fontSize: 13, color: '#00d2ff', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={14} /> {activePackageModal.destination}
            </div>

            <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>
              {activePackageModal.overview}
            </p>

            {/* Inclusions */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#00e676', marginBottom: 8 }}>Package Inclusions:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {activePackageModal.inclusions.map((inc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#e2e8f0' }}>
                    <CheckCircle2 size={13} color="#00e676" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Book */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Starting Price / Person</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#00e676' }}>
                  {formatPrice(activePackageModal.pricePerPerson)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleBookPackage(activePackageModal)}
                style={{
                  background: 'linear-gradient(135deg, #f5af19, #f12711)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span>Confirm & Book Package</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Quote Modal */}
      {isCustomQuoteOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0d1527, #070c18)',
            border: '1px solid rgba(245, 175, 25, 0.4)',
            borderRadius: 20,
            maxWidth: 580,
            width: '100%',
            padding: '24px',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsCustomQuoteOpen(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>
              Request Custom Holiday Quotation
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 16px 0' }}>
              Tell our destination specialists your dream itinerary and hotel preferences.
            </p>

            {quoteSuccessId ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={48} color="#00e676" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>
                  Quotation Request Dispatched!
                </h4>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  Reference: <strong style={{ color: '#f5af19' }}>{quoteSuccessId}</strong>. Our senior holiday planner will email your custom plan within 3 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCustomQuoteOpen(false)}
                  style={{
                    marginTop: 14,
                    background: 'linear-gradient(135deg, #f5af19, #f12711)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomQuoteSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Target Destination</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.destination}
                      onChange={(e) => setQuoteForm({ ...quoteForm, destination: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Travel Date</label>
                    <input
                      type="date"
                      required
                      value={quoteForm.travelDate}
                      onChange={(e) => setQuoteForm({ ...quoteForm, travelDate: e.target.value })}
                      style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Budget per person</label>
                    <select
                      value={quoteForm.budgetPerPerson}
                      onChange={(e) => setQuoteForm({ ...quoteForm, budgetPerPerson: e.target.value })}
                      style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                    >
                      <option value="₹25,000 – ₹40,000">₹25,000 – ₹40,000 (Value)</option>
                      <option value="₹40,000 – ₹60,000">₹40,000 – ₹60,000 (Comfort 4★)</option>
                      <option value="₹60,000 – ₹1,00,000">₹60,000 – ₹1,00,000 (Luxury 5★)</option>
                      <option value="₹1,00,000+">₹1,00,000+ (Ultra VIP)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Specific Requests / Inclusions</label>
                  <textarea
                    rows="3"
                    value={quoteForm.specialNotes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, specialNotes: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13, resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f5af19, #f12711)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <Send size={15} /> Send Custom Quote Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
