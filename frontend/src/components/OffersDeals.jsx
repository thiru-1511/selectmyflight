import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, Percent, GraduationCap, Gift, CreditCard, ArrowRight } from 'lucide-react';

const PROMO_OFFERS = [
  {
    code: 'FLYSMF10',
    title: '10% Flat Instant Discount',
    desc: 'Valid across all domestic & international routes with zero minimum spend.',
    category: 'Universal Deal',
    discount: '10% OFF',
    icon: Sparkles,
    color: '#00d2ff',
    bg: 'rgba(0, 210, 255, 0.1)'
  },
  {
    code: 'STUDENT',
    title: 'Student Saver + 10kg Extra Baggage',
    desc: 'Special student fare discount with free additional baggage allowance.',
    category: 'Student Special',
    discount: '₹1,200 OFF',
    icon: GraduationCap,
    color: '#00e676',
    bg: 'rgba(0, 230, 118, 0.1)'
  },
  {
    code: 'FESTIVE',
    title: 'International Gateway Voucher',
    desc: 'Get flat discount on Emirates, British Airways & Singapore Airlines flights.',
    category: 'Airline Partner',
    discount: '₹1,500 OFF',
    icon: Gift,
    color: '#f5af19',
    bg: 'rgba(245, 175, 25, 0.1)'
  },
  {
    code: 'ICICISMF',
    title: 'Bank Credit & Debit Card Offer',
    desc: 'Instant cashback when paying via ICICI, HDFC, or Axis Bank cards.',
    category: 'Bank Offer',
    discount: '₹2,000 OFF',
    icon: CreditCard,
    color: '#ff4d6d',
    bg: 'rgba(255, 77, 109, 0.1)'
  }
];

export default function OffersDeals({ onApplyCode }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    if (onApplyCode) onApplyCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '20px auto 40px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245, 175, 25, 0.12)', color: '#f5af19', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            <Tag size={14} /> EXCLUSIVE AIRLINE OFFERS & PROMO CODES
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
            Featured Deals & Flight Coupons
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
            Copy promotional codes to claim instant airline discounts, student concessions, and bank rebates at checkout.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16
      }}>
        {PROMO_OFFERS.map((deal) => {
          const IconComponent = deal.icon;
          const isCopied = copiedCode === deal.code;

          return (
            <div
              key={deal.code}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: `1px solid ${deal.color}33`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Dot */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: deal.color,
                color: '#090f1d',
                fontSize: 10,
                fontWeight: 800,
                padding: '4px 10px',
                borderBottomLeftRadius: 8
              }}>
                {deal.category}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: deal.bg,
                    color: deal.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
                      {deal.discount}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>
                      {deal.title}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, marginBottom: 16 }}>
                  {deal.desc}
                </p>
              </div>

              {/* Code Box & Copy Action */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: 8,
                padding: '8px 12px'
              }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, color: deal.color, letterSpacing: 1 }}>
                  {deal.code}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(deal.code)}
                  style={{
                    background: isCopied ? '#00e676' : 'rgba(255, 255, 255, 0.1)',
                    color: isCopied ? '#090f1d' : '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '5px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    transition: 'all 0.2s'
                  }}
                >
                  {isCopied ? (
                    <>
                      <Check size={13} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
