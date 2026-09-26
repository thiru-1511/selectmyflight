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
  ExternalLink,
  Users,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const RAZORPAY_KEY_ID = 'rzp_test_1DP5mmOlF5G5ag';

export default function CheckoutModal({ bookingDetails, currency, onClose, onBookingSuccess }) {
  const { 
    flight, 
    seat, 
    meal, 
    extraBaggageKg = 0, 
    extraBaggagePrice = 0, 
    priorityPrice = 0, 
    grandTotal 
  } = bookingDetails;

  const passengerCount = bookingDetails.passengerCount || (bookingDetails.selectedSeatsList ? bookingDetails.selectedSeatsList.length : 1);
  const selectedSeatsList = bookingDetails.selectedSeatsList || (seat?.selectedSeatsList) || (seat?.seatNumber ? seat.seatNumber.split(', ') : ['01A']);

  const defaultTemplates = [
    { title: 'Mr', firstName: 'Rahul', lastName: 'Sharma', gender: 'Male', age: '28' },
    { title: 'Ms', firstName: 'Priya', lastName: 'Sharma', gender: 'Female', age: '26' },
    { title: 'Mr', firstName: 'Amitabh', lastName: 'Sharma', gender: 'Male', age: '54' },
    { title: 'Mrs', firstName: 'Sunita', lastName: 'Sharma', gender: 'Female', age: '50' },
    { title: 'Master', firstName: 'Aarav', lastName: 'Sharma', gender: 'Male', age: '10' },
    { title: 'Ms', firstName: 'Ananya', lastName: 'Sharma', gender: 'Female', age: '8' }
  ];

  // Multi-passenger details state
  const [passengers, setPassengers] = useState(() => {
    const list = [];
    for (let i = 0; i < passengerCount; i++) {
      const template = defaultTemplates[i] || { title: 'Mr', firstName: `Traveler${i + 1}`, lastName: 'Sharma', gender: 'Male', age: '25' };
      const assignedSeat = selectedSeatsList[i] || `0${i + 1}A`;
      list.push({
        id: i + 1,
        title: template.title,
        firstName: template.firstName,
        lastName: template.lastName,
        gender: template.gender,
        age: template.age,
        seatNumber: assignedSeat
      });
    }
    return list;
  });

  // Primary Contact details
  const [contactInfo, setContactInfo] = useState({
    email: 'rahul.sharma@gmail.com',
    phone: '+91 98765 43210'
  });

  const handlePassengerChange = (index, field, value) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

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
      cardHolder: name || `${passengers[0]?.firstName} ${passengers[0]?.lastName}`.toUpperCase()
    });
  };

  // Launch official Razorpay Popup or in-app checkout
  const handleLaunchRazorpayPopup = () => {
    const primaryPax = passengers[0] || { firstName: 'Rahul', lastName: 'Sharma' };
    if (window.Razorpay) {
      try {
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: finalPayable * 100, // In paise
          currency: "INR",
          name: "SelectMyFlight",
          description: `Flight ${flight.flightNumber} Booking (${passengerCount} ${passengerCount === 1 ? 'Pax' : 'Pax'} • Seats: ${selectedSeatsList.join(', ')})`,
          image: "https://cdn.razorpay.com/static/assets/logo/rzp.png",
          prefill: {
            name: `${primaryPax.firstName} ${primaryPax.lastName}`,
            email: contactInfo.email,
            contact: contactInfo.phone
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

      const formattedPassengers = passengers.map((p, idx) => ({
        title: p.title || 'Mr',
        firstName: p.firstName || `Passenger${idx + 1}`,
        lastName: p.lastName || '',
        gender: p.gender || 'Male',
        age: p.age || '25',
        seatNumber: p.seatNumber || selectedSeatsList[idx] || '01A',
        mealPreference: meal?.name || 'Standard In-Flight Meal',
        extraBaggageKg: extraBaggageKg || 0
      }));

      const bookingPayload = {
        flightId: flight.id,
        travelDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        totalAmount: finalPayable,
        passengerCount,
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
        contactEmail: contactInfo.email,
        contactPhone: contactInfo.phone,
        flight,
        passengers: formattedPassengers
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
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1600, padding: 'clamp(10px, 2vw, 20px)' }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 880, maxHeight: '94vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(16px)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>
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
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0 0' }}>
              Flight {flight.flightNumber} • {flight.originCode} ➔ {flight.destinationCode} | {passengerCount} {passengerCount === 1 ? 'Traveler' : 'Travelers'} • Seats: <strong style={{ color: '#00d2ff' }}>{selectedSeatsList.join(', ')}</strong>
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
        <form onSubmit={handleSubmit} style={{ padding: 'clamp(16px, 3vw, 24px) clamp(14px, 3vw, 28px)', overflowX: 'hidden' }}>
          
          {/* Passenger Information Cards for All Travelers */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={18} color="#00d2ff" />
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>
                  1. Passenger Details ({passengerCount} {passengerCount === 1 ? 'Traveler' : 'Travelers'})
                </h4>
              </div>
              <span style={{ fontSize: 12, color: '#00e676', fontWeight: 700 }}>
                ✓ {passengerCount} Seats Allocated
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {passengers.map((pax, idx) => (
                <div 
                  key={pax.id} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                    padding: '16px'
                  }}
                >
                  {/* Passenger Card Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        background: idx === 0 ? '#00d2ff' : '#f5af19',
                        color: '#000',
                        fontSize: 10,
                        fontWeight: 900,
                        padding: '2px 6px',
                        borderRadius: 4
                      }}>
                        P{idx + 1}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                        {idx === 0 ? 'Passenger 1 (Primary Contact Traveler)' : `Passenger ${idx + 1} (Co-Traveler)`}
                      </span>
                    </div>

                    <div style={{
                      background: 'rgba(0, 210, 255, 0.12)',
                      border: '1px solid rgba(0, 210, 255, 0.3)',
                      color: '#00d2ff',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 6
                    }}>
                      💺 Seat: {pax.seatNumber}
                    </div>
                  </div>

                  {/* Name & Title Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Title</label>
                      <select
                        value={pax.title}
                        onChange={(e) => handlePassengerChange(idx, 'title', e.target.value)}
                        style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px', borderRadius: 8, fontSize: 13, minHeight: 42 }}
                      >
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Dr">Dr</option>
                        <option value="Master">Master</option>
                      </select>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>First & Middle Name *</label>
                      <input
                        type="text"
                        required
                        value={pax.firstName}
                        onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                        placeholder="e.g. Rahul"
                        style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 12px', borderRadius: 8, fontSize: 13, outline: 'none', minHeight: 42 }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Last Name *</label>
                      <input
                        type="text"
                        required
                        value={pax.lastName}
                        onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                        placeholder="e.g. Sharma"
                        style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 12px', borderRadius: 8, fontSize: 13, outline: 'none', minHeight: 42 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Gender</label>
                      <select
                        value={pax.gender}
                        onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                        style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px', borderRadius: 8, fontSize: 13, minHeight: 42 }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Fields for Primary Passenger */}
                  {idx === 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 10, paddingTop: 10, borderTop: '1px dashed rgba(255, 255, 255, 0.08)' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Email (for PDF E-Tickets of all travelers) *</label>
                        <input
                          type="email"
                          required
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 12px', borderRadius: 8, fontSize: 13, outline: 'none', minHeight: 42 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Mobile Number (for SMS & WhatsApp Boarding Passes) *</label>
                        <input
                          type="text"
                          required
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 12px', borderRadius: 8, fontSize: 13, outline: 'none', minHeight: 42 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>
                2. Select Razorpay Payment Method
              </h4>
              <span style={{ fontSize: 11, color: '#00d2ff', fontWeight: 800 }}>
                ⚡ Powered by Razorpay Secure
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8 }}>
              <div
                onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 10,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_UPI' ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_UPI' ? '1.5px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none',
                  minHeight: 74,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <QrCode size={20} color={paymentMethod === 'RAZORPAY_UPI' ? '#00d2ff' : '#cbd5e1'} style={{ margin: '0 auto 4px auto' }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>UPI / QR</div>
                <div style={{ fontSize: 10, color: '#00e676', fontWeight: 800 }}>⚡ 0% Fee</div>
              </div>

              <div
                onClick={() => setPaymentMethod('RAZORPAY_CARD')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 10,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_CARD' ? 'rgba(0, 82, 204, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_CARD' ? '1.5px solid #0052cc' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none',
                  minHeight: 74,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <CreditCard size={20} color={paymentMethod === 'RAZORPAY_CARD' ? '#00d2ff' : '#cbd5e1'} style={{ margin: '0 auto 4px auto' }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Cards</div>
                <div style={{ fontSize: 10, color: '#cbd5e1' }}>RuPay / Visa</div>
              </div>

              <div
                onClick={() => setPaymentMethod('RAZORPAY_NETBANKING')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 10,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_NETBANKING' ? 'rgba(0, 230, 118, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_NETBANKING' ? '1.5px solid #00e676' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none',
                  minHeight: 74,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Building2 size={20} color={paymentMethod === 'RAZORPAY_NETBANKING' ? '#00e676' : '#cbd5e1'} style={{ margin: '0 auto 4px auto' }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>NetBanking</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>50+ Banks</div>
              </div>

              <div
                onClick={() => setPaymentMethod('RAZORPAY_WALLET')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 10,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_WALLET' ? 'rgba(245, 175, 25, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_WALLET' ? '1.5px solid #f5af19' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none',
                  minHeight: 74,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Wallet size={20} color={paymentMethod === 'RAZORPAY_WALLET' ? '#f5af19' : '#cbd5e1'} style={{ margin: '0 auto 4px auto' }} />
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Smartphone size={16} color="#00d2ff" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                    Razorpay UPI Instant Intent & Dynamic QR
                  </span>
                </div>
                <span style={{ background: '#00e676', color: '#000', fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 4, letterSpacing: 0.5 }}>
                  INSTANT DISPATCH
                </span>
              </div>

              {/* UPI Apps Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))', gap: 8, marginBottom: 14 }}>
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
                      background: selectedUpiApp === app.id ? 'rgba(0, 210, 255, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                      border: selectedUpiApp === app.id ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: selectedUpiApp === app.id ? '#00d2ff' : '#cbd5e1',
                      borderRadius: 8,
                      padding: '8px 6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      minHeight: 46
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{app.label}</div>
                    <div style={{ fontSize: 9, color: '#94a3b8' }}>{app.sub}</div>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'stretch' }}>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI VPA (e.g. name@upi)"
                  style={{
                    flex: '1 1 180px',
                    minWidth: 0,
                    minHeight: 44,
                    boxSizing: 'border-box',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(0, 210, 255, 0.35)',
                    borderRadius: 8,
                    color: '#fff',
                    padding: '10px 14px',
                    fontSize: 13,
                    fontWeight: 700
                  }}
                />
                <button
                  type="button"
                  onClick={handleLaunchRazorpayPopup}
                  style={{
                    background: 'rgba(0, 210, 255, 0.18)',
                    border: '1px solid #00d2ff',
                    color: '#00d2ff',
                    padding: '10px 18px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    minHeight: 44,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <span>Open Razorpay Window</span>
                  <ExternalLink size={14} />
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
                    style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 82, 204, 0.4)', borderRadius: 8, color: '#fff', padding: '10px 12px', fontSize: 13, fontWeight: 700, minHeight: 42 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>MM / YY</label>
                  <input
                    type="text"
                    required
                    value={cardData.cardExp}
                    onChange={(e) => setCardData({ ...cardData, cardExp: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 82, 204, 0.4)', borderRadius: 8, color: '#fff', padding: '10px 12px', fontSize: 13, textAlign: 'center', minHeight: 42 }}
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
                    style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 82, 204, 0.4)', borderRadius: 8, color: '#fff', padding: '10px 12px', fontSize: 13, textAlign: 'center', minHeight: 42 }}
                  />
                </div>
              </div>

              {/* Test Card Quick Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 11 }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>Razorpay Test Cards:</span>
                <button
                  type="button"
                  onClick={() => handleFillTestCard('4111111111111111', `${passengers[0]?.firstName} ${passengers[0]?.lastName}`)}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#00d2ff', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}
                >
                  💳 Visa (4111...)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillTestCard('5242001122334455', 'PRIYA SHARMA')}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#f5af19', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}
                >
                  💳 Mastercard
                </button>
                <button
                  type="button"
                  onClick={() => handleFillTestCard('6080123456789012', 'AMITABH SHARMA')}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#00e676', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}
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

          {/* 4. RAZORPAY WALLET & EMI VIEW */}
          {paymentMethod === 'RAZORPAY_WALLET' && (
            <div style={{
              background: 'rgba(245, 175, 25, 0.06)',
              border: '1px solid rgba(245, 175, 25, 0.3)',
              borderRadius: 12,
              padding: 'clamp(12px, 2vw, 18px)',
              marginBottom: 20
            }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                Select Digital Wallet / EMI Option
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8 }}>
                {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet', 'MobiKwik', 'No-Cost EMI (3M)', 'Cardless EMI'].map((wal) => (
                  <button
                    key={wal}
                    type="button"
                    style={{
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: 'rgba(245, 175, 25, 0.15)',
                      border: '1px solid rgba(245, 175, 25, 0.35)',
                      color: '#f5af19',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {wal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Promo Code Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px dashed rgba(255, 255, 255, 0.25)',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 180px', minWidth: 0 }}>
                <Tag size={18} color="#f5af19" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Enter Promo Code (e.g. FLYSMF10)..."
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, outline: 'none', textTransform: 'uppercase', padding: 0, minHeight: 36 }}
                />
              </div>
              <button
                type="button"
                onClick={handleApplyPromo}
                style={{
                  background: 'rgba(245, 175, 25, 0.22)',
                  border: '1px solid #f5af19',
                  color: '#f5af19',
                  borderRadius: 8,
                  padding: '8px 18px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  minHeight: 38,
                  flexShrink: 0
                }}
              >
                Apply Voucher
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
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 22,
            fontSize: 13
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: 6 }}>
              <span>Base Airfare ({flight.airlineName} • {passengerCount} {passengerCount === 1 ? 'Traveler' : 'Travelers'})</span>
              <span>{currencySymbol}{convertPrice(flight.basePrice * passengerCount).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: 6 }}>
              <span>Seat Selection ({selectedSeatsList.join(', ')} - {seat.seatClass})</span>
              <span>{currencySymbol}{convertPrice(seat.price).toLocaleString()}</span>
            </div>
            {meal?.price > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: 6 }}>
                <span>In-Flight Meals ({meal.name} for {passengerCount} pax)</span>
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
                <span>Priority Boarding & Express Check-in ({passengerCount} pax)</span>
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
              <span style={{ fontSize: 22, fontWeight: 900, color: '#00d2ff' }}>
                {currencySymbol}{convertPrice(finalPayable).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Button & Security Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
              <ShieldCheck size={18} color="#00e676" style={{ flexShrink: 0 }} />
              <span>Razorpay Verified • 256-bit RBI Compliant TLS Gateway</span>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="btn-secondary"
                style={{ padding: '12px 22px', fontSize: 14, minHeight: 46 }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary"
                style={{
                  padding: '12px 28px',
                  fontSize: 14,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #00d2ff 0%, #0052cc 100%)',
                  boxShadow: '0 4px 20px rgba(0, 210, 255, 0.4)',
                  minHeight: 46,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
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
