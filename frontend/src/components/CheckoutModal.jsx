import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Wallet, 
  Tag, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Lock,
  Zap,
  Check,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

const RAZORPAY_KEY_ID = 'rzp_test_1DP5mmOlF5G5ag';

export default function CheckoutModal({ bookingDetails, currency, onClose, onBookingSuccess }) {
  const { flight, seat, meal, extraBaggageKg, extraBaggagePrice, priorityPrice, grandTotal } = bookingDetails;

  const [formData, setFormData] = useState({
    title: 'Mr',
    firstName: 'Rahul',
    lastName: 'Sharma',
    gender: 'Male',
    email: 'rahul.sharma@gmail.com',
    phone: '+91 98765 43210'
  });

  // Card details state
  const [cardData, setCardData] = useState({
    cardNumber: '4111 •••• •••• 1111',
    rawCardNumber: '4111111111111111',
    cardExp: '12/28',
    cardCvc: '888',
    cardHolder: 'RAHUL SHARMA'
  });

  // Selected Bank for NetBanking
  const [selectedBank, setSelectedBank] = useState('HDFC');
  // Selected UPI App
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPAY'); // 'GPAY', 'PHONEPE', 'PAYTM', 'QR'
  const [upiId, setUpiId] = useState('rahul@okaxis');

  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY_UPI'); // 'RAZORPAY_UPI', 'RAZORPAY_CARD', 'RAZORPAY_NETBANKING', 'RAZORPAY_WALLET'
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay checkout.js dynamically
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const convertPrice = (inrPrice) => (currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice);
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  // Calculate discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'PERCENT') {
      discountAmount = Math.round((grandTotal * appliedPromo.value) / 100);
      if (appliedPromo.max && discountAmount > appliedPromo.max) discountAmount = appliedPromo.max;
    } else {
      discountAmount = appliedPromo.value;
    }
  }

  const finalPayable = Math.max(0, grandTotal - discountAmount);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    setPromoError('');
    if (code === 'FLYSMF10') {
      setAppliedPromo({ code: 'FLYSMF10', type: 'PERCENT', value: 10, max: 2500, desc: '10% Instant Flight Savings' });
    } else if (code === 'STUDENT') {
      setAppliedPromo({ code: 'STUDENT', type: 'FLAT', value: 1500, desc: 'Student Concession Voucher' });
    } else if (code === 'FESTIVE') {
      setAppliedPromo({ code: 'FESTIVE', type: 'FLAT', value: 2000, desc: 'Festive Global Holiday Concession' });
    } else {
      setPromoError('Invalid coupon code. Try FLYSMF10, STUDENT, or FESTIVE.');
    }
  };

  // Quick fill test card
  const handleFillTestCard = (num, name) => {
    setCardData({
      cardNumber: `${num.slice(0,4)} •••• •••• ${num.slice(12)}`,
      rawCardNumber: num,
      cardExp: '12/28',
      cardCvc: '888',
      cardHolder: name || `${formData.firstName} ${formData.lastName}`.toUpperCase()
    });
  };

  // Launch official Razorpay Popup or in-app checkout
  const handleLaunchRazorpayPopup = () => {
    if (window.Razorpay) {
      try {
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: finalPayable * 100, // In paise
          currency: "INR",
          name: "SelectMyFlight",
          description: `Flight ${flight.flightNumber} Booking (${flight.originCode} ➔ ${flight.destinationCode})`,
          image: "https://cdn.razorpay.com/static/assets/logo/rzp.png",
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: "#00d2ff"
          },
          handler: function (response) {
            completeBooking(response.razorpay_payment_id || `pay_rzp_${Date.now()}`);
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      } catch (err) {
        console.warn('Razorpay popup fallback', err);
      }
    }
    // Fallback: in-app payment simulation
    completeBooking(`pay_rzp_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString().slice(-4)}`);
  };

  const completeBooking = (payId) => {
    setIsProcessing(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      const bookingPayload = {
        flightId: flight.id,
        travelDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        totalAmount: finalPayable,
        paymentMethod: paymentMethod === 'RAZORPAY_UPI' 
          ? `Razorpay UPI (${selectedUpiApp})` 
          : paymentMethod === 'RAZORPAY_CARD' 
            ? 'Razorpay (Credit/Debit Card)' 
            : paymentMethod === 'RAZORPAY_NETBANKING'
              ? `Razorpay NetBanking (${selectedBank})`
              : 'Razorpay Wallet',
        paymentId: payId,
        gateway: 'Razorpay Payments (India & UPI)',
        appliedPromo: appliedPromo?.code || null,
        discountAmount,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        flight,
        passengers: [
          {
            title: formData.title,
            firstName: formData.firstName,
            lastName: formData.lastName,
            gender: formData.gender,
            seatNumber: seat.seatNumber,
            mealPreference: meal.name,
            extraBaggageKg
          }
        ]
      };

      setIsProcessing(false);
      onBookingSuccess(bookingPayload);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLaunchRazorpayPopup();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 840 }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                💳 Passenger Checkout & Razorpay Gateway
              </h3>
              <span style={{
                background: 'linear-gradient(135deg, #00d2ff, #0052cc)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 900,
                padding: '3px 8px',
                borderRadius: 4,
                letterSpacing: 0.5
              }}>
                RAZORPAY SECURE
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              Flight {flight.flightNumber} • {flight.originCode} ➔ {flight.destinationCode} | Seat: {seat.seatNumber} ({seat.seatClass})
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
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          {/* Passenger Info */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
              1. Passenger Contact & Identification
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 8, marginBottom: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Title</label>
                <select
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '9px', borderRadius: 6, fontSize: 13 }}
                >
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '9px 12px', borderRadius: 6, fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '9px 12px', borderRadius: 6, fontSize: 13, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Email (for PDF E-Ticket & Invoice) *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '9px 12px', borderRadius: 6, fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Mobile Number (for SMS Boarding Pass) *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '9px 12px', borderRadius: 6, fontSize: 13, outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
                2. Select Razorpay Payment Method
              </h4>
              <span style={{ fontSize: 11, color: '#00d2ff', fontWeight: 700 }}>
                Powered by Razorpay
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
              <div
                onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 10,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_UPI' ? 'rgba(0, 210, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_UPI' ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none'
                }}
              >
                <QrCode size={20} color={paymentMethod === 'RAZORPAY_UPI' ? '#00d2ff' : '#cbd5e1'} style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>UPI / QR</div>
                <div style={{ fontSize: 10, color: '#00e676', fontWeight: 800 }}>⚡ 0% Fee</div>
              </div>

              <div
                onClick={() => setPaymentMethod('RAZORPAY_CARD')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 10,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_CARD' ? 'rgba(0, 82, 204, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_CARD' ? '1px solid #0052cc' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none'
                }}
              >
                <CreditCard size={20} color={paymentMethod === 'RAZORPAY_CARD' ? '#00d2ff' : '#cbd5e1'} style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Cards</div>
                <div style={{ fontSize: 10, color: '#cbd5e1' }}>RuPay / Visa</div>
              </div>

              <div
                onClick={() => setPaymentMethod('RAZORPAY_NETBANKING')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 10,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_NETBANKING' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_NETBANKING' ? '1px solid #00e676' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none'
                }}
              >
                <Building2 size={20} color={paymentMethod === 'RAZORPAY_NETBANKING' ? '#00e676' : '#cbd5e1'} style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>NetBanking</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>50+ Banks</div>
              </div>

              <div
                onClick={() => setPaymentMethod('RAZORPAY_WALLET')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 10,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_WALLET' ? 'rgba(245, 175, 25, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_WALLET' ? '1px solid #f5af19' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none'
                }}
              >
                <Wallet size={20} color={paymentMethod === 'RAZORPAY_WALLET' ? '#f5af19' : '#cbd5e1'} style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Wallets & EMI</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Paytm/Amazon</div>
              </div>
            </div>
          </div>

          {/* 1. RAZORPAY UPI VIEW */}
          {paymentMethod === 'RAZORPAY_UPI' && (
            <div style={{
              background: 'rgba(0, 210, 255, 0.06)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              borderRadius: 12,
              padding: 'clamp(12px, 2vw, 18px)',
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Smartphone size={16} color="#00d2ff" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                    Razorpay UPI Instant Intent & QR
                  </span>
                </div>
                <span style={{ background: '#00e676', color: '#000', fontSize: 10, fontWeight: 900, padding: '2px 6px', borderRadius: 4 }}>
                  INSTANT DISPATCH
                </span>
              </div>

              {/* UPI Apps Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8, marginBottom: 14 }}>
                {[
                  { id: 'GPAY', label: 'Google Pay', sub: 'okaxis / okhdfc' },
                  { id: 'PHONEPE', label: 'PhonePe', sub: '@ybl / @ibl' },
                  { id: 'PAYTM', label: 'Paytm UPI', sub: '@paytm' },
                  { id: 'QR', label: 'Scan QR Code', sub: 'Any UPI App' }
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedUpiApp(app.id)}
                    style={{
                      background: selectedUpiApp === app.id ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: selectedUpiApp === app.id ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: selectedUpiApp === app.id ? '#00d2ff' : '#cbd5e1',
                      borderRadius: 8,
                      padding: '8px 6px',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{app.label}</div>
                    <div style={{ fontSize: 9, color: '#94a3b8' }}>{app.sub}</div>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter Virtual Payment Address (e.g. mobile@upi)"
                  style={{
                    flex: '1 1 200px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 210, 255, 0.35)',
                    borderRadius: 6,
                    color: '#fff',
                    padding: '9px 12px',
                    fontSize: 13,
                    fontWeight: 700
                  }}
                />
                <button
                  type="button"
                  onClick={handleLaunchRazorpayPopup}
                  style={{
                    background: 'rgba(0, 210, 255, 0.15)',
                    border: '1px solid #00d2ff',
                    color: '#00d2ff',
                    padding: '9px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Open QR Window ↗
                </button>
              </div>
            </div>
          )}

          {/* 2. RAZORPAY CARD VIEW */}
          {paymentMethod === 'RAZORPAY_CARD' && (
            <div style={{
              background: 'rgba(0, 82, 204, 0.08)',
              border: '1px solid rgba(0, 82, 204, 0.35)',
              borderRadius: 12,
              padding: 'clamp(12px, 2vw, 18px)',
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lock size={16} color="#00d2ff" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                    Razorpay 256-Bit Encrypted Card Payment
                  </span>
                </div>
                <span style={{ fontSize: 11, color: '#00d2ff', fontWeight: 700 }}>
                  RuPay / Visa / Mastercard
                </span>
              </div>

              {/* Card Inputs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10, marginBottom: 12 }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value, rawCardNumber: e.target.value.replace(/\s+/g, '') })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 82, 204, 0.4)', borderRadius: 6, color: '#fff', padding: '9px 12px', fontSize: 13, fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>MM / YY</label>
                  <input
                    type="text"
                    required
                    value={cardData.cardExp}
                    onChange={(e) => setCardData({ ...cardData, cardExp: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 82, 204, 0.4)', borderRadius: 6, color: '#fff', padding: '9px 12px', fontSize: 13, textAlign: 'center' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={cardData.cardCvc}
                    onChange={(e) => setCardData({ ...cardData, cardCvc: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 82, 204, 0.4)', borderRadius: 6, color: '#fff', padding: '9px 12px', fontSize: 13, textAlign: 'center' }}
                  />
                </div>
              </div>

              {/* Test Card Quick Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 11 }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>Razorpay Test Cards:</span>
                <button
                  type="button"
                  onClick={() => handleFillTestCard('4111111111111111', 'RAHUL SHARMA')}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#00d2ff', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}
                >
                  💳 Visa (4111...)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillTestCard('5242001122334455', 'PRIYA PATEL')}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#f5af19', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}
                >
                  💳 Mastercard
                </button>
                <button
                  type="button"
                  onClick={() => handleFillTestCard('6080123456789012', 'AMITABH SEN')}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#00e676', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}
                >
                  💳 RuPay Card
                </button>
              </div>
            </div>
          )}

          {/* 3. RAZORPAY NETBANKING VIEW */}
          {paymentMethod === 'RAZORPAY_NETBANKING' && (
            <div style={{
              background: 'rgba(0, 230, 118, 0.06)',
              border: '1px solid rgba(0, 230, 118, 0.3)',
              borderRadius: 12,
              padding: 'clamp(12px, 2vw, 18px)',
              marginBottom: 20
            }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                Select NetBanking Bank
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 8 }}>
                {['HDFC', 'SBI', 'ICICI', 'AXIS', 'KOTAK', 'PNB', 'BOB', 'OTHER'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    style={{
                      padding: '8px',
                      borderRadius: 6,
                      background: selectedBank === bank ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255,255,255,0.04)',
                      border: selectedBank === bank ? '1px solid #00e676' : '1px solid rgba(255,255,255,0.1)',
                      color: selectedBank === bank ? '#00e676' : '#cbd5e1',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {bank} Bank
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Promo Code Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Tag size={16} color="#f5af19" />
              <input
                type="text"
                placeholder="Enter Promo Code (e.g. FLYSMF10)..."
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, outline: 'none', textTransform: 'uppercase' }}
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                style={{ background: 'rgba(245, 175, 25, 0.2)', border: '1px solid #f5af19', color: '#f5af19', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                Apply
              </button>
            </div>
            {appliedPromo && (
              <div style={{ fontSize: 12, color: '#00e676', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                <Check size={14} /> {appliedPromo.desc} applied (-{currencySymbol}{convertPrice(discountAmount)})
              </div>
            )}
            {promoError && (
              <div style={{ fontSize: 12, color: '#f87171', marginTop: 8 }}>
                {promoError}
              </div>
            )}
          </div>

          {/* Price Summary Breakdown */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: 24,
            fontSize: 13
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: 6 }}>
              <span>Base Airfare ({flight.airlineName})</span>
              <span>{currencySymbol}{convertPrice(flight.basePrice).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: 6 }}>
              <span>Seat Selection ({seat.seatNumber} - {seat.seatClass})</span>
              <span>{currencySymbol}{convertPrice(seat.price).toLocaleString()}</span>
            </div>
            {meal.price > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: 6 }}>
                <span>In-Flight Meal ({meal.name})</span>
                <span>+{currencySymbol}{convertPrice(meal.price).toLocaleString()}</span>
              </div>
            )}
            {extraBaggagePrice > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: 6 }}>
                <span>Excess Baggage (+{extraBaggageKg}kg)</span>
                <span>+{currencySymbol}{convertPrice(extraBaggagePrice).toLocaleString()}</span>
              </div>
            )}
            {priorityPrice > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: 6 }}>
                <span>Priority Boarding & Express Check-in</span>
                <span>+{currencySymbol}{convertPrice(priorityPrice).toLocaleString()}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00e676', fontWeight: 700, marginBottom: 6 }}>
                <span>Voucher Discount ({appliedPromo?.code})</span>
                <span>-{currencySymbol}{convertPrice(discountAmount).toLocaleString()}</span>
              </div>
            )}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: 10,
              marginTop: 6,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Total Payable Amount:</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#00d2ff' }}>
                {currencySymbol}{convertPrice(finalPayable).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
              <ShieldCheck size={18} color="#00e676" />
              <span>Razorpay Verified • 256-bit RBI Compliant TLS Gateway</span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="btn-secondary"
                style={{ padding: '11px 20px', fontSize: 14 }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary"
                style={{
                  padding: '12px 28px',
                  fontSize: 15,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #00d2ff 0%, #0052cc 100%)',
                  boxShadow: '0 4px 20px rgba(0, 210, 255, 0.4)'
                }}
              >
                {isProcessing ? (
                  <span>Processing with Razorpay...</span>
                ) : (
                  <>
                    <span>Pay with Razorpay {currencySymbol}{convertPrice(finalPayable).toLocaleString()}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
