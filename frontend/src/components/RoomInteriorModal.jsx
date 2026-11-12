import React, { useState } from 'react';
import { 
  X, 
  Bed, 
  Bath, 
  Maximize2, 
  Eye, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Coffee, 
  Tv, 
  Wifi, 
  Compass, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  VolumeX,
  Wind
} from 'lucide-react';

export default function RoomInteriorModal({ room, hotel, currency = 'INR', onClose, onSelectRoom }) {
  const [activeAngle, setActiveAngle] = useState('bedroom'); // 'bedroom' | 'bathroom' | 'lounge' | 'balcony'
  const [rotationAngle, setRotationAngle] = useState(0); // 0, 90, 180, 270 for 360 simulation

  if (!room) return null;

  const interiorGallery = room.interiorPhotos || [
    {
      id: 'bedroom',
      label: 'Master Bedroom',
      icon: '🛏️',
      title: 'Luxury Sleeping Quarters',
      desc: '400 thread-count Egyptian cotton linens, plush feather-topped mattress, acoustic soundproof walls, and bedside motorized controls.',
      image: room.bedroomImage || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80'
    },
    {
      id: 'bathroom',
      label: 'Marble En-Suite',
      icon: '🛁',
      title: 'Italian Marble Spa Bathroom',
      desc: 'Deep freestanding soaking Jacuzzi tub, dual vanity basins, ceiling rain shower, Hermès / Molton Brown amenities & plush terry bathrobes.',
      image: room.bathroomImage || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80'
    },
    {
      id: 'lounge',
      label: 'Living Area & Desk',
      icon: '🛋️',
      title: 'Executive Living Lounge',
      desc: 'Designer seating lounge, ergonomic executive workspace, Nespresso artisan coffee bar, minibar, and 65" 4K OLED Smart TV with surround sound.',
      image: room.loungeImage || 'https://images.unsplash.com/photo-1545083036-b175dd155a1d?w=1200&q=80'
    },
    {
      id: 'balcony',
      label: 'Private Terrace / View',
      icon: '🌅',
      title: 'Panoramic Balcony Terrace',
      desc: `Direct open-air terrace overlooking ${room.view || 'iconic skyline'}, equipped with luxury lounge recliners for private sunrise and sunset dining.`,
      image: room.balconyImage || 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200&q=80'
    }
  ];

  const currentView = interiorGallery.find(v => v.id === activeAngle) || interiorGallery[0];

  const convertPrice = (inr) => {
    if (currency === 'USD') return Math.round(inr / 85);
    if (currency === 'EUR') return Math.round(inr / 92);
    if (currency === 'GBP') return Math.round(inr / 108);
    return inr;
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      style={{
        zIndex: 1800,
        padding: 'clamp(8px, 2vw, 20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(2, 6, 23, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          width: '100%',
          maxWidth: 960,
          maxHeight: '94vh',
          background: '#090f1e',
          border: '1px solid rgba(0, 210, 255, 0.4)',
          borderRadius: 20,
          overflowY: 'auto',
          boxShadow: '0 25px 70px rgba(0,0,0,0.9), 0 0 40px rgba(0, 210, 255, 0.25)',
          color: '#f8fafc',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.12), rgba(245, 175, 25, 0.06))',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backdropFilter: 'blur(16px)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(0, 210, 255, 0.2)',
                color: '#00d2ff',
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 4,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}>
                <Eye size={12} /> 360° INTERIOR TOUR
              </span>
              {room.isLiveVerified && (
                <span style={{
                  background: 'rgba(0, 230, 118, 0.2)',
                  color: '#00e676',
                  border: '1px solid rgba(0, 230, 118, 0.4)',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 4,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <ShieldCheck size={12} /> VERIFIED HOTEL ROOM PHOTO
                </span>
              )}
              <span style={{ fontSize: 13, color: '#94a3b8' }}>
                {hotel?.name || 'Luxury Hotel Suite'}
              </span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '4px 0 0 0' }}>
              {room.name}
            </h3>
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
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Interior Viewer Body */}
        <div style={{ padding: 'clamp(14px, 2vw, 24px)' }}>
          {/* Main Visual Display */}
          <div style={{
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            aspectRatio: '16/9',
            maxHeight: 460,
            background: '#020617',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)'
          }}>
            <img 
              src={currentView.image} 
              alt={currentView.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `rotate(${rotationAngle}deg)`,
                transition: 'transform 0.4s ease, opacity 0.3s ease'
              }}
            />

            {/* Overlay Gradient */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(9, 15, 30, 0.95) 0%, rgba(9, 15, 30, 0.2) 40%, transparent 100%)',
              pointerEvents: 'none'
            }} />

            {/* 360 Simulation Controls Pill */}
            <div style={{
              position: 'absolute',
              top: 14,
              right: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(9, 15, 30, 0.75)',
              backdropFilter: 'blur(10px)',
              padding: '6px 12px',
              borderRadius: 30,
              border: '1px solid rgba(0, 210, 255, 0.3)'
            }}>
              <Compass size={14} color="#00d2ff" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>
                Pan Angle: {rotationAngle}°
              </span>
              <button
                type="button"
                onClick={() => setRotationAngle(prev => (prev + 90) % 360)}
                style={{
                  background: 'rgba(0, 210, 255, 0.2)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 22,
                  height: 22,
                  cursor: 'pointer',
                  fontSize: 10,
                  fontWeight: 900
                }}
                title="Rotate 360 view"
              >
                ↻
              </button>
            </div>

            {/* Bottom Caption Overlay */}
            <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{currentView.icon}</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>
                  {currentView.title}
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, maxWidth: 680, lineHeight: 1.4 }}>
                {currentView.desc}
              </p>
            </div>
          </div>

          {/* Angle Selectors / Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10,
            marginTop: 14,
            marginBottom: 20
          }}>
            {interiorGallery.map((item) => {
              const isActive = activeAngle === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveAngle(item.id);
                    setRotationAngle(0);
                  }}
                  style={{
                    background: isActive ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isActive ? '2px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                    padding: '10px 14px',
                    color: isActive ? '#00d2ff' : '#cbd5e1',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <div>
                    <div style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>Interior View</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Architectural Specifications Grid */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 14,
            padding: '18px 20px',
            marginBottom: 20
          }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#00d2ff', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Maximize2 size={15} /> Room Interior Blueprint & Dimensions
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 14,
              fontSize: 12
            }}>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: 11 }}>Floor Area</span>
                <strong style={{ color: '#fff', fontSize: 13 }}>{room.size || '52 sq.m (560 sq.ft)'}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: 11 }}>Bed Arrangement</span>
                <strong style={{ color: '#fff', fontSize: 13 }}>{room.bed || '1 Super King Bed'}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: 11 }}>Balcony / Orientation</span>
                <strong style={{ color: '#fff', fontSize: 13 }}>{room.view || 'Panoramic Skyline'}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: 11 }}>Ceiling Height</span>
                <strong style={{ color: '#fff', fontSize: 13 }}>3.2 Meters (10.5 ft)</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: 11 }}>Acoustics & Isolation</span>
                <strong style={{ color: '#00e676', fontSize: 13 }}>STC 55 Soundproofed</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: 11 }}>Guest Capacity</span>
                <strong style={{ color: '#fff', fontSize: 13 }}>{room.capacity || '2 Adults, 1 Child'}</strong>
              </div>
            </div>
          </div>

          {/* Smart Amenities Matrix */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={15} color="#f5af19" /> High-Spec In-Room Amenities
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
              {[
                { icon: <Tv size={14} color="#00d2ff" />, text: '65" 4K OLED Smart TV with AirPlay' },
                { icon: <Wifi size={14} color="#00e676" />, text: 'Dedicated 1 Gbps Wi-Fi 6' },
                { icon: <Coffee size={14} color="#f5af19" />, text: 'Nespresso Vertuo & Artisan Teas' },
                { icon: <Wind size={14} color="#38bdf8" />, text: 'Dual-Zone HEPA Climate Control' },
                { icon: <VolumeX size={14} color="#a855f7" />, text: 'Triple-Glazed Quiet Acoustic Glass' },
                { icon: <Bath size={14} color="#00d2ff" />, text: 'Dyson Supersonic & Designer Toiletries' }
              ].map((am, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: 8, fontSize: 12, color: '#cbd5e1' }}>
                  {am.icon}
                  <span>{am.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            paddingTop: 16,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Tariff per night:</span>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#00e676' }}>
                {currencySymbol}{convertPrice(room.price).toLocaleString()}
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}> / night</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  padding: '10px 18px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close Interior Tour
              </button>
              {onSelectRoom && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom(room);
                    onClose();
                  }}
                  className="btn-primary"
                  style={{
                    padding: '10px 24px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Check size={16} />
                  <span>Choose This Suite</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

