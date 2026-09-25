import React, { useState, useEffect } from 'react';
import { 
  X, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ShieldCheck, 
  Search, 
  ArrowRight,
  AlertCircle,
  CreditCard
} from 'lucide-react';

const SAMPLE_PNRS = [
  { pnr: 'SMF-9021', airline: 'IndiGo (6E-2041)', route: 'DEL ➔ BOM', amount: 3800, statusStep: 3, arn: 'REF-99023481' },
  { pnr: 'SMF-4412', airline: 'Air India (AI-865)', route: 'DEL ➔ BOM', amount: 4600, statusStep: 4, arn: 'REF-77182904' },
  { pnr: 'SMF-7833', airline: 'Vistara (UK-943)', route: 'DEL ➔ BOM', amount: 5400, statusStep: 2, arn: 'REF-55910283' },
  { pnr: 'SMF-1092', airline: 'Emirates (EK-512)', route: 'DEL ➔ DXB', amount: 13500, statusStep: 3, arn: 'REF-88401923' }
];

export default function RefundTrackerModal({ isOpen, onClose, pnr: initialPnr = '', refundAmount: initialAmount = null, currency = 'INR' }) {
  const [searchPnr, setSearchPnr] = useState(initialPnr || 'SMF-9021');
  const [activeRefundData, setActiveRefundData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const pnrToLoad = initialPnr || 'SMF-9021';
      setSearchPnr(pnrToLoad);
      lookupPnr(pnrToLoad, initialAmount);
    }
  }, [isOpen, initialPnr, initialAmount]);

  const lookupPnr = (pnrValue, customAmount) => {
    setIsSearching(true);
    setTimeout(() => {
      const clean = (pnrValue || '').trim().toUpperCase();
      const match = SAMPLE_PNRS.find(s => s.pnr.toUpperCase() === clean) || {
        pnr: clean || 'SMF-9021',
        airline: 'SelectMyFlight Partner Airline',
        route: 'DEL ➔ BOM',
        amount: customAmount || 3800,
        statusStep: 3,
        arn: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`
      };
      
      if (customAmount) {
        match.amount = customAmount;
      }

      setActiveRefundData(match);
      setIsSearching(false);
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchPnr) lookupPnr(searchPnr);
  };

  if (!isOpen) return null;

  const convertPrice = (p) => (currency === 'USD' ? Math.round(p / 85) : p);
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const currentStep = activeRefundData?.statusStep || 3;

  const steps = [
    { 
      step: 1, 
      title: '1. Cancellation Request Received', 
      desc: 'Cancellation ticket registered in airline global distribution system', 
      status: currentStep >= 1 ? 'completed' : 'pending', 
      date: '21 Sep 2026, 14:15 IST' 
    },
    { 
      step: 2, 
      title: '2. Airline Approval & Audit', 
      desc: `${activeRefundData?.airline || 'Airline'} verified fare rules and approved net refund amount`, 
      status: currentStep >= 2 ? (currentStep === 2 ? 'current' : 'completed') : 'pending', 
      date: currentStep >= 2 ? '21 Sep 2026, 16:30 IST' : 'Pending airline verification' 
    },
    { 
      step: 3, 
      title: '3. Payment Gateway Dispatched', 
      desc: `Transferred to banking gateway via Reserve Bank NACH/IMPS clearinghouse`, 
      status: currentStep >= 3 ? (currentStep === 3 ? 'current' : 'completed') : 'pending', 
      date: currentStep >= 3 ? 'In Transit (Expected within 4-6 hrs)' : 'Scheduled after airline verification' 
    },
    { 
      step: 4, 
      title: '4. Bank Account Credit', 
      desc: 'Final credit posted to original payment method (UPI / Card / NetBanking)', 
      status: currentStep >= 4 ? 'completed' : 'pending', 
      date: currentStep >= 4 ? 'Credited Successfully' : 'Estimated 24 Sep 2026' 
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1500 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(0, 230, 118, 0.15)', color: '#00e676', padding: 8, borderRadius: 8 }}>
              <RefreshCw size={22} className={isSearching ? 'spin-anim' : ''} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                Live Refund Status Tracker
              </h3>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                Real-Time Banking & Airline Refund Gateway Sync
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#cbd5e1',
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
        </div>

        {/* PNR Search & Quick Selection Bar */}
        <div style={{ padding: 'clamp(14px, 3vw, 20px) clamp(14px, 3vw, 24px) 0 clamp(14px, 3vw, 24px)' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{
              flex: '1 1 200px',
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              borderRadius: 10,
              padding: '8px 14px',
              gap: 8
            }}>
              <Search size={16} color="#00d2ff" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Enter Booking PNR (e.g. SMF-9021)..."
                value={searchPnr}
                onChange={(e) => setSearchPnr(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  width: '100%',
                  textTransform: 'uppercase',
                  minHeight: 'auto',
                  padding: 0
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: 13, height: 42, flex: '1 1 auto', justifyContent: 'center' }}
            >
              Track PNR
            </button>
          </form>

          {/* Sample PNR Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Quick Sample PNRs:</span>
            {SAMPLE_PNRS.map((item) => (
              <button
                key={item.pnr}
                type="button"
                onClick={() => {
                  setSearchPnr(item.pnr);
                  lookupPnr(item.pnr);
                }}
                style={{
                  background: activeRefundData?.pnr === item.pnr ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: activeRefundData?.pnr === item.pnr ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: activeRefundData?.pnr === item.pnr ? '#00d2ff' : '#cbd5e1',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {item.pnr} ({item.route})
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 'clamp(14px, 3vw, 24px)' }}>
          {/* Refund Amount Banner */}
          {activeRefundData && (
            <div style={{
              background: 'rgba(0, 230, 118, 0.08)',
              border: '1px solid rgba(0, 230, 118, 0.3)',
              borderRadius: 12,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 20
            }}>
              <div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  Approved Refund for <strong style={{ color: '#fff' }}>{activeRefundData.pnr}</strong> ({activeRefundData.airline})
                </div>
                <div style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, color: '#00e676', marginTop: 2 }}>
                  {currencySymbol}{convertPrice(activeRefundData.amount).toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, color: '#cbd5e1' }}>
                <div>Original Mode: <strong>UPI / NetBanking</strong></div>
                <div style={{ color: '#00d2ff', fontSize: 11, fontWeight: 700, marginTop: 2 }}>
                  ARN: {activeRefundData.arn}
                </div>
              </div>
            </div>
          )}

          {/* 4-Step Progress Flow */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
            {steps.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {/* Step Circle */}
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: s.status === 'completed' 
                    ? '#00e676' 
                    : s.status === 'current' 
                      ? '#00d2ff' 
                      : 'rgba(255, 255, 255, 0.1)',
                  color: s.status === 'pending' ? '#64748b' : '#090f1d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 13,
                  flexShrink: 0,
                  marginTop: 2,
                  boxShadow: s.status === 'current' ? '0 0 12px rgba(0, 210, 255, 0.5)' : 'none'
                }}>
                  {s.status === 'completed' ? <CheckCircle2 size={16} /> : s.step}
                </div>

                <div style={{ flex: 1 }}>
                  <div className="refund-step-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.status === 'pending' ? '#94a3b8' : '#fff' }}>
                      {s.title}
                    </div>
                    <div style={{ 
                      fontSize: 11, 
                      color: s.status === 'current' ? '#00d2ff' : s.status === 'completed' ? '#00e676' : '#94a3b8', 
                      fontWeight: 600 
                    }}>
                      {s.date}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 12,
            color: '#94a3b8'
          }}>
            <ShieldCheck size={18} color="#00d2ff" style={{ flexShrink: 0 }} />
            <span>SelectMyFlight adheres strictly to Directorate General of Civil Aviation (DGCA) automated refund guidelines. Funds return to source account within 24-72 hours.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
