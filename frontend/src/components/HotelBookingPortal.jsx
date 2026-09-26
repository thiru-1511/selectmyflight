import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Star, 
  Check, 
  Sparkles, 
  SlidersHorizontal, 
  ArrowRight,
  ShieldCheck,
  Coffee,
  Waves,
  Radio,
  Loader2,
  Percent
} from 'lucide-react';
import { HOTEL_CITIES, INITIAL_HOTELS } from '../data/mockHotels';
import HotelDetailsModal from './HotelDetailsModal';
import { api } from '../services/api';

export default function HotelBookingPortal({ currency = 'INR', onBookHotelSuccess }) {
  const [selectedCity, setSelectedCity] = useState('DXB');
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  // Live RapidAPI State & Profit Margin
  const [liveHotels, setLiveHotels] = useState([]);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [profitMargin, setProfitMargin] = useState(0.12); // 12% default profit margin

  // Fetch live hotels whenever city or dates change
  useEffect(() => {
    let isCancelled = false;
    async function loadHotels() {
      setIsLoadingLive(true);
      try {
        const liveResults = await api.searchLiveHotels(selectedCity, checkInDate, checkOutDate, guests, rooms, profitMargin);
        if (!isCancelled && liveResults && liveResults.length > 0) {
          setLiveHotels(liveResults);
          setIsLiveConnected(true);
        } else if (!isCancelled) {
          setLiveHotels([]);
          setIsLiveConnected(false);
        }
      } catch {
        if (!isCancelled) {
          setLiveHotels([]);
          setIsLiveConnected(false);
        }
      } finally {
        if (!isCancelled) setIsLoadingLive(false);
      }
    }

    loadHotels();
    return () => { isCancelled = true; };
  }, [selectedCity, checkInDate, checkOutDate, guests, rooms, profitMargin]);

  // Filters
  const [starFilter, setStarFilter] = useState('All'); // 'All', '5', '4'
  const [maxPrice, setMaxPrice] = useState(350000);
  const [selectedAmenity, setSelectedAmenity] = useState('All');
  const [freeCancelOnly, setFreeCancelOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended', 'price_asc', 'rating_desc'
  const [visibleLimit, setVisibleLimit] = useState(8);

  // Mobile filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Selected hotel for booking modal
  const [activeHotelModal, setActiveHotelModal] = useState(null);

  const convertPrice = (inr) => {
    if (currency === 'USD') return Math.round(inr / 85);
    if (currency === 'EUR') return Math.round(inr / 92);
    if (currency === 'GBP') return Math.round(inr / 108);
    return inr;
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';

  // Filtered Hotels (prefer live results when available)
  const currentHotelPool = liveHotels.length > 0 ? liveHotels : INITIAL_HOTELS;

  const filteredHotels = useMemo(() => {
    return currentHotelPool.filter((h) => {
      const matchesCity = selectedCity === 'ALL' || h.cityCode === selectedCity;
      const matchesStars = starFilter === 'All' || h.starRating === parseInt(starFilter, 10);
      const matchesPrice = h.pricePerNight <= maxPrice;
      const matchesAmenity = selectedAmenity === 'All' || h.amenities.some(a => a.toLowerCase().includes(selectedAmenity.toLowerCase()));
      const matchesCancel = !freeCancelOnly || h.freeCancellation;
      return matchesCity && matchesStars && matchesPrice && matchesAmenity && matchesCancel;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'rating_desc') return b.reviewScore - a.reviewScore;
      return b.reviewCount - a.reviewCount;
    });
  }, [currentHotelPool, selectedCity, starFilter, maxPrice, selectedAmenity, freeCancelOnly, sortBy]);

  const CITY_HERO_IMAGES = {
    'DXB': '/assets/images/hotel_burj_al_arab.jpg',
    'SIN': '/assets/images/hotel_marina_bay_sands.jpg',
    'LHR': '/assets/images/hotel_savoy_london.jpg',
    'CDG': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    'NYC': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80',
    'TYO': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
    'BKK': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80',
    'DPS': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
    'FCO': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
    'MLE': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
    'GOI': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
    'DEL': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
    'BOM': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
    'BLR': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80'
  };

  const [heroHotelImage, setHeroHotelImage] = useState('/assets/images/hotel_burj_al_arab.jpg');

  useEffect(() => {
    if (CITY_HERO_IMAGES[selectedCity]) {
      setHeroHotelImage(CITY_HERO_IMAGES[selectedCity]);
    }
  }, [selectedCity]);

  return (
    <div style={{
      maxWidth: 1360,
      margin: '0 auto',
      padding: 'clamp(14px, 2.5vw, 24px) clamp(12px, 2.5vw, 24px) 80px clamp(12px, 2.5vw, 24px)',
      borderRadius: 24,
      background: "linear-gradient(135deg, rgba(9, 15, 29, 0.88), rgba(15, 23, 42, 0.94)), url('/assets/images/hotel_marina_bay_sands.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
    }}>
      {/* Hero Hotel Search Banner */}
      <div style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        margin: '12px 0 28px 0',
        padding: 'clamp(24px, 4vw, 44px) clamp(16px, 3vw, 32px)',
        backgroundImage: `linear-gradient(to right, rgba(9, 15, 29, 0.94) 30%, rgba(9, 15, 29, 0.7)), url('${heroHotelImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(0, 210, 255, 0.3)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
      }}>
        {/* Dynamic Hotel Image Backdrop Chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          <span style={{ fontSize: 11, color: '#94a3b8', display: 'inline-flex', alignItems: 'center', fontWeight: 600, marginRight: 4 }}>
            🌆 Featured Skylines:
          </span>
          {[
            { label: 'Tokyo', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80' },
            { label: 'Paris', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80' },
            { label: 'New York', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80' }
          ].map(chip => (
            <button
              key={chip.label}
              onClick={() => setHeroHotelImage(chip.img)}
              style={{
                background: heroHotelImage === chip.img ? 'rgba(0, 210, 255, 0.85)' : 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '4px 10px',
                borderRadius: 14,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)'
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <div style={{ maxWidth: 780 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(245, 175, 25, 0.15)',
            border: '1px solid rgba(245, 175, 25, 0.35)',
            color: '#f5af19',
            padding: '5px 14px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 800,
            marginBottom: 12
          }}>
            <Building2 size={14} /> LUXURY HOTELS, VILLAS & RESORTS
          </div>

          <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: '#fff', margin: '0 0 8px 0', lineHeight: 1.2 }}>
            Reserve World-Class Stays with Instant Confirmation
          </h1>
          <p style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: '#94a3b8', margin: '0 0 22px 0' }}>
            Exclusive rates across 5-star suites, private plunge pools, and verified boutique resorts with complimentary gourmet breakfasts.
          </p>
        </div>

        {/* Search Controls Container */}
        <div style={{
          background: 'rgba(13, 22, 43, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 210, 255, 0.3)',
          borderRadius: 18,
          padding: 'clamp(14px, 2vw, 20px)',
          boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
          alignItems: 'end'
        }}>
          {/* Destination */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
              DESTINATION CITY
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#00d2ff' }}>
                <MapPin size={16} />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 36px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 210, 255, 0.25)',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All Destinations</option>
                {HOTEL_CITIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.city}, {c.country} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Check-In */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
              CHECK-IN DATE
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#00d2ff' }}>
                <Calendar size={16} />
              </div>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 36px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 210, 255, 0.25)',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Check-Out */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
              CHECK-OUT DATE
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#00d2ff' }}>
                <Calendar size={16} />
              </div>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 36px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 210, 255, 0.25)',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Rooms & Guests */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
              ROOMS & GUESTS
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={rooms}
                onChange={(e) => setRooms(parseInt(e.target.value, 10))}
                style={{
                  flex: 1,
                  padding: '11px 8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 210, 255, 0.25)',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value={1}>1 Room</option>
                <option value={2}>2 Rooms</option>
                <option value={3}>3+ Rooms</option>
              </select>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                style={{
                  flex: 1,
                  padding: '11px 8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 210, 255, 0.25)',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4+ Guests</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="mobile-menu-btn" style={{ marginBottom: 16, display: 'none', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="btn-secondary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '12px 18px',
            borderRadius: 12,
            background: showMobileFilters ? 'rgba(0, 210, 255, 0.18)' : 'rgba(255, 255, 255, 0.06)',
            borderColor: showMobileFilters ? '#00d2ff' : 'rgba(255, 255, 255, 0.15)',
            color: showMobileFilters ? '#00d2ff' : '#fff',
            fontWeight: 800,
            fontSize: 14
          }}
        >
          <SlidersHorizontal size={16} />
          <span>{showMobileFilters ? 'Hide Hotel Filters' : `Filter Stays (${starFilter !== 'All' || selectedAmenity !== 'All' || freeCancelOnly ? 'Active' : 'All'})`}</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="hotel-portal-layout">
        {/* Left Filter Sidebar (Sticky on desktop, toggleable on mobile) */}
        <div 
          className="sticky-sidebar"
          style={{
            background: '#0d1527',
            border: '1px solid rgba(0, 210, 255, 0.2)',
            borderRadius: 18,
            padding: '22px',
            color: '#f8fafc',
            display: (typeof window !== 'undefined' && window.innerWidth < 992 && !showMobileFilters) ? 'none' : 'block'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 800 }}>
              <SlidersHorizontal size={16} color="#00d2ff" />
              <span>Filter Stays</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setStarFilter('All');
                setMaxPrice(350000);
                setSelectedAmenity('All');
                setFreeCancelOnly(false);
              }}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
            >
              Reset All
            </button>
          </div>

          {/* Star Rating Filter */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>
              PROPERTY CLASSIFICATION
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['All', '5', '4', '3'].map((s) => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="starRating"
                    checked={starFilter === s}
                    onChange={() => setStarFilter(s)}
                    style={{ accentColor: '#00d2ff' }}
                  />
                  <span>{s === 'All' ? 'All Star Ratings' : `⭐ ${s}-Star Luxury & Premier`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
              <span style={{ fontWeight: 700 }}>MAX PRICE / NIGHT</span>
              <span style={{ color: '#00e676', fontWeight: 800 }}>{currencySymbol}{convertPrice(maxPrice).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={2000}
              max={350000}
              step={5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: '#00d2ff', cursor: 'pointer' }}
            />
          </div>

          {/* Top Amenities */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>
              POPULAR AMENITIES
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'All', label: 'All Amenities' },
                { id: 'Pool', label: '🏊 Infinity / Lagoon Pool' },
                { id: 'Beach', label: '🏖️ Private Beach Access' },
                { id: 'Spa', label: '💆 Luxury Spa & Wellness' },
                { id: 'Breakfast', label: '☕ Gourmet Breakfast' }
              ].map((am) => (
                <label key={am.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="amenityFilter"
                    checked={selectedAmenity === am.id}
                    onChange={() => setSelectedAmenity(am.id)}
                    style={{ accentColor: '#00d2ff' }}
                  />
                  <span>{am.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Free Cancellation Toggle */}
          <div style={{
            background: 'rgba(0, 230, 118, 0.08)',
            border: '1px solid rgba(0, 230, 118, 0.25)',
            borderRadius: 10,
            padding: '10px 12px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#00e676', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={freeCancelOnly}
                onChange={(e) => setFreeCancelOnly(e.target.checked)}
                style={{ accentColor: '#00e676' }}
              />
              <span>100% Free Cancellation Only</span>
            </label>
          </div>
        </div>

        {/* Right Hotel Cards List */}
        <div>
          {/* Live Booking.com API Status Banner */}
          <div style={{
            background: isLiveConnected ? 'rgba(0, 230, 118, 0.12)' : 'rgba(0, 210, 255, 0.1)',
            border: `1px solid ${isLiveConnected ? 'rgba(0, 230, 118, 0.4)' : 'rgba(0, 210, 255, 0.3)'}`,
            borderRadius: 14,
            padding: '12px 18px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: isLiveConnected ? '#00e676' : '#00d2ff',
                boxShadow: isLiveConnected ? '0 0 10px #00e676' : '0 0 10px #00d2ff'
              }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                  {isLiveConnected ? '🟢 Live Booking.com API Connected' : '⚡ Local Verified Catalog Active'}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  {isLiveConnected 
                    ? `Live room inventory, real-time rates, and high-res photos loaded directly from Booking.com API.`
                    : `Verified real-world property catalog with instant reservation engine.`}
                </div>
              </div>
            </div>

            {/* Profit Margin Markup Controller */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(9, 15, 29, 0.7)',
              padding: '6px 12px',
              borderRadius: 10,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Percent size={13} color="#f5af19" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1' }}>Markup:</span>
              <select
                value={profitMargin}
                onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
                style={{
                  background: '#0f172a',
                  color: '#f5af19',
                  border: '1px solid rgba(245, 175, 25, 0.4)',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: 12,
                  fontWeight: 800,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={0.08}>+8% Margin</option>
                <option value={0.12}>+12% (Standard)</option>
                <option value={0.15}>+15% Margin</option>
                <option value={0.20}>+20% (Peak)</option>
              </select>
            </div>
          </div>

          {/* Header toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 'clamp(16px, 3vw, 20px)', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {filteredHotels.length} Verified Properties
                </h3>
                {isLoadingLive && (
                  <span style={{ fontSize: 12, color: '#00d2ff', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Loader2 size={14} className="spin-slow" /> Syncing live rates...
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0 0' }}>
                Prices include all complimentary amenities, live taxes, and markup
              </p>
            </div>

            {/* Sort selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: '#0d1527',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 8,
                  color: '#00d2ff',
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="recommended">⭐ Recommended</option>
                <option value="price_asc">💰 Lowest Price</option>
                <option value="rating_desc">🏆 Top Reviews</option>
              </select>
            </div>
          </div>

          {/* Cards */}
          {filteredHotels.length === 0 ? (
            <div style={{
              background: '#0d1527',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 18,
              padding: '48px 24px',
              textAlign: 'center',
              color: '#94a3b8'
            }}>
              <Building2 size={48} color="#00d2ff" style={{ margin: '0 auto 16px auto', opacity: 0.6 }} />
              <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>No properties matched your exact filter</h4>
              <p style={{ fontSize: 13, margin: '0 0 16px 0' }}>Try broadening your price range or selecting "All Destinations".</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCity('ALL');
                  setStarFilter('All');
                  setMaxPrice(80000);
                  setSelectedAmenity('All');
                }}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: 13 }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {filteredHotels.slice(0, visibleLimit).map((hotel) => (
                <div key={hotel.id} className="hotel-card-layout">
                  {/* Photo & Badge */}
                  <div className="hotel-card-image-wrap">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/hotel_marina_bay_sands.jpg';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(9, 15, 29, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: '#f5af19',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                      ⭐ {hotel.starRating} STARS
                    </div>

                    {hotel.discountBadge && (
                      <div style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        background: 'linear-gradient(135deg, #00d2ff, #0052cc)',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 900,
                        letterSpacing: 0.5,
                        boxShadow: '0 4px 12px rgba(0, 210, 255, 0.4)'
                      }}>
                        {hotel.discountBadge}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: 'clamp(14px, 2vw, 22px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Top ratings row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 10 }}>
                        <div>
                          <h4 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>
                            {hotel.name}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94a3b8' }}>
                            <MapPin size={13} color="#00d2ff" />
                            <span>{hotel.location}</span>
                          </div>
                        </div>

                        <div style={{
                          background: 'rgba(0, 210, 255, 0.12)',
                          border: '1px solid rgba(0, 210, 255, 0.3)',
                          padding: '4px 10px',
                          borderRadius: 8,
                          textAlign: 'right',
                          flexShrink: 0
                        }}>
                          <span style={{ fontSize: 14, fontWeight: 900, color: '#00d2ff' }}>{hotel.reviewScore}</span>
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>/10</span>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{hotel.reviewLabel}</div>
                        </div>
                      </div>

                      {/* Amenities Tag Row */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0 12px 0' }}>
                        {hotel.amenities.slice(0, 4).map((am, i) => (
                          <span
                            key={i}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: '#cbd5e1',
                              fontSize: 11,
                              padding: '3px 8px',
                              borderRadius: 6,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <Check size={11} color="#00e676" />
                            {am}
                          </span>
                        ))}
                      </div>

                      {hotel.freeCancellation && (
                        <div style={{ fontSize: 12, color: '#00e676', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <ShieldCheck size={14} /> Free cancellation available
                        </div>
                      )}
                    </div>

                    {/* Bottom Pricing & Action */}
                    <div className="hotel-action-footer">
                      <div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Starting from</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                          <span style={{ fontSize: 22, fontWeight: 900, color: '#00e676' }}>
                            {currencySymbol}{convertPrice(hotel.pricePerNight).toLocaleString()}
                          </span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>/ night</span>
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>Includes complimentary breakfast & WiFi</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveHotelModal(hotel)}
                        className="btn-primary"
                        style={{
                          padding: '12px 22px',
                          fontSize: 13,
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          boxShadow: '0 4px 15px rgba(0, 210, 255, 0.35)',
                          minHeight: 44
                        }}
                      >
                        <span>View Rooms & Reserve</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {visibleLimit < filteredHotels.length && (
                <div style={{ textAlign: 'center', marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => setVisibleLimit(prev => prev + 8)}
                    className="btn-secondary"
                    style={{
                      padding: '12px 28px',
                      borderRadius: 14,
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      maxWidth: 400,
                      justifyContent: 'center'
                    }}
                  >
                    <Sparkles size={16} />
                    <span>Show More ({filteredHotels.length - visibleLimit} more available)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hotel Room Selection & Confirmation Modal */}
      {activeHotelModal && (
        <HotelDetailsModal
          hotel={activeHotelModal}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guests={guests}
          currency={currency}
          onClose={() => setActiveHotelModal(null)}
          onConfirmBooking={(booking) => {
            if (onBookHotelSuccess) {
              onBookHotelSuccess(booking);
            }
          }}
        />
      )}
    </div>
  );
}
