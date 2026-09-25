import React from 'react';
import { Plane, ShieldCheck, Clock, Headphones, Award } from 'lucide-react';

export default function Footer({ onQuickPrompt, onNavigate }) {
  return (
    <footer style={{
      background: '#060a14',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '50px 24px 30px 24px',
      color: '#94a3b8'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Trust Badges Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
          paddingBottom: 40,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: 12, borderRadius: 12, color: '#00d2ff' }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>IATA Accredited</div>
              <div style={{ fontSize: 12 }}>100% verified airline ticketing</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: 'rgba(0, 230, 118, 0.1)', padding: 12, borderRadius: 12, color: '#00e676' }}>
              <Award size={26} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Transparent Pricing</div>
              <div style={{ fontSize: 12 }}>Zero hidden checkout fees or taxes</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: 'rgba(245, 175, 25, 0.1)', padding: 12, borderRadius: 12, color: '#f5af19' }}>
              <Clock size={26} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Flexible Date Search</div>
              <div style={{ fontSize: 12 }}>Save up to 25% across ±3 days</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: 12, borderRadius: 12, color: '#00d2ff' }}>
              <Headphones size={26} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>24/7 AI & Human Concierge</div>
              <div style={{ fontSize: 12 }}>Assistance before and after booking</div>
            </div>
          </div>
        </div>

        {/* Links Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 32,
          marginBottom: 40
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Plane size={20} color="#00d2ff" style={{ transform: 'rotate(-45deg)' }} />
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>SelectMyFlight</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              The premium flight comparison and smart travel booking platform connecting millions of travelers with the world’s leading airlines.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', textTransform: 'uppercase', marginBottom: 14 }}>
              Top Flight Routes
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <li>
                <button
                  onClick={() => onQuickPrompt('DEL', 'DXB')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onMouseEnter={(e) => e.target.style.color = '#00d2ff'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  New Delhi to Dubai Flights
                </button>
              </li>
              <li>
                <button
                  onClick={() => onQuickPrompt('DEL', 'BOM')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onMouseEnter={(e) => e.target.style.color = '#00d2ff'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Delhi to Mumbai Express
                </button>
              </li>
              <li>
                <button
                  onClick={() => onQuickPrompt('DEL', 'LHR')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onMouseEnter={(e) => e.target.style.color = '#00d2ff'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  New Delhi to London Direct
                </button>
              </li>
              <li>
                <button
                  onClick={() => onQuickPrompt('BLR', 'SIN')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onMouseEnter={(e) => e.target.style.color = '#00d2ff'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Bengaluru to Singapore
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', textTransform: 'uppercase', marginBottom: 14 }}>
              Customer Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, padding: 0, margin: 0 }}>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('auth')}
                  style={{ background: 'none', border: 'none', color: '#00d2ff', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                >
                  🔐 Traveler Account & OTP Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('status')}
                  style={{ background: 'none', border: 'none', color: '#00e676', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                >
                  📡 Live Radar & Flight Telemetry
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('trips')}
                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}
                >
                  🎫 My Bookings & Boarding Passes
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', textTransform: 'uppercase', marginBottom: 14 }}>
              Customer Support
            </h4>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              <div>Email: <strong>support@selectmyflight.com</strong></div>
              <div>Toll-free: <strong>1800-FLIGHT-SMF</strong></div>
              <div>Executive: <strong>admin@selectmyflight.com</strong></div>
              <div style={{ color: '#00e676', marginTop: 4 }}>• All systems operating normally</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          textAlign: 'center',
          fontSize: 12,
          paddingTop: 24,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          © 2026 SelectMyFlight Aviation Technologies Inc. All rights reserved. Built for seamless corporate and consumer flight reservations.
        </div>
      </div>
    </footer>
  );
}
