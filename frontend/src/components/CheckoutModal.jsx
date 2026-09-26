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
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  GPayLogo, 
  PhonePeLogo, 
  PaytmLogo, 
  UpiLogo, 
  VisaLogo, 
  MastercardLogo, 
  RupayLogo, 
  AmexLogo, 
  HdfcBankLogo, 
  SbiBankLogo, 
  IciciBankLogo, 
  AxisBankLogo, 
  KotakBankLogo, 
  AmazonPayLogo, 
  MobiKwikLogo, 
  RazorpayLogo 
} from './PaymentLogos';

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

  // Switch UPI App and update default handle
  const handleSelectUpiApp = (appId) => {
    setSelectedUpiApp(appId);
    if (appId === 'GPAY') setUpiId('rahul@okaxis');
    else if (appId === 'PHONEPE') setUpiId('rahul@ybl');
    else if (appId === 'PAYTM') setUpiId('9876543210@paytm');
    else if (appId === 'QR') setUpiId('selectmyflight@upi');
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
          ? `Razorpay UPI (${selectedUpiApp === 'GPAY' ? 'Google Pay' : selectedUpiApp === 'PHONEPE' ? 'PhonePe' : selectedUpiApp === 'PAYTM' ? 'Paytm' : 'BHIM QR'})` 
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
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08), rgba(0, 82, 204, 0.06))',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(16px)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>
                💳 Passenger Checkout & Razorpay Gateway
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  background: 'linear-gradient(135deg, #00d2ff, #0052cc)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 900,
                  padding: '3px 8px',
                  borderRadius: 4,
                  letterSpacing: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <RazorpayLogo size={14} /> RAZORPAY SECURE
                </span>
              </div>
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
                ✓ {passengerCount} Seats Allocated ({selectedSeatsList.join(', ')})
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

          {/* Payment Method Selector with Official Brand Logos */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>
                2. Select Payment Method
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#00d2ff', fontWeight: 800 }}>
                  ⚡ Instant Razorpay Gateway
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 }}>
              {/* UPI Tab */}
              <div
                onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 12,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_UPI' ? 'rgba(0, 210, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_UPI' ? '2px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none',
                  minHeight: 88,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: paymentMethod === 'RAZORPAY_UPI' ? '0 0 16px rgba(0, 210, 255, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <GPayLogo size={18} />
                  <PhonePeLogo size={18} />
                  <PaytmLogo size={18} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>UPI / QR</div>
                <div style={{ fontSize: 10, color: '#00e676', fontWeight: 800 }}>⚡ 0% Fee • Instant</div>
              </div>

              {/* Cards Tab */}
              <div
                onClick={() => setPaymentMethod('RAZORPAY_CARD')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 12,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_CARD' ? 'rgba(0, 82, 204, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_CARD' ? '2px solid #0052cc' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none',
                  minHeight: 88,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: paymentMethod === 'RAZORPAY_CARD' ? '0 0 16px rgba(0, 82, 204, 0.3)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <VisaLogo size={14} />
                  <MastercardLogo size={14} />
                  <RupayLogo size={14} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Cards</div>
                <div style={{ fontSize: 10, color: '#cbd5e1' }}>RuPay / Visa / MC</div>
              </div>

              {/* NetBanking Tab */}
              <div
                onClick={() => setPaymentMethod('RAZORPAY_NETBANKING')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 12,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_NETBANKING' ? 'rgba(0, 230, 118, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_NETBANKING' ? '2px solid #00e676' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none',
                  minHeight: 88,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: paymentMethod === 'RAZORPAY_NETBANKING' ? '0 0 16px rgba(0, 230, 118, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <HdfcBankLogo size={16} />
                  <SbiBankLogo size={16} />
                  <IciciBankLogo size={16} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>NetBanking</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>50+ Indian Banks</div>
              </div>

              {/* Wallets & EMI Tab */}
              <div
                onClick={() => setPaymentMethod('RAZORPAY_WALLET')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 12,
                  textAlign: 'center',
                  background: paymentMethod === 'RAZORPAY_WALLET' ? 'rgba(245, 175, 25, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'RAZORPAY_WALLET' ? '2px solid #f5af19' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none',
                  minHeight: 88,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: paymentMethod === 'RAZORPAY_WALLET' ? '0 0 16px rgba(245, 175, 25, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AmazonPayLogo size={14} />
                  <PaytmLogo size={14} />
                  <MobiKwikLogo size={14} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Wallets & EMI</div>
                <div style={{ fontSize: 10, color: '#f5af19' }}>Amazon/Paytm/EMI</div>
              </div>
            </div>
          </div>

          {/* 1. RAZORPAY UPI VIEW WITH LOGOS */}
          {paymentMethod === 'RAZORPAY_UPI' && (
            <div style={{
              background: 'rgba(0, 210, 255, 0.06)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              borderRadius: 14,
              padding: 'clamp(14px, 2vw, 20px)',
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UpiLogo size={22} />
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', display: 'block' }}>
                      Choose your preferred UPI App
                    </span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>
                      Instant redirection or scan with any UPI App
                    </span>
                  </div>
                </div>
                <span style={{ background: '#00e676', color: '#000', fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 4, letterSpacing: 0.5 }}>
                  0% TRANSACTION FEE
                </span>
              </div>

              {/* UPI Apps Grid with Brand Logos */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
                {/* Google Pay */}
                <button
                  type="button"
                  onClick={() => handleSelectUpiApp('GPAY')}
                  style={{
                    background: selectedUpiApp === 'GPAY' ? 'rgba(66, 133, 244, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedUpiApp === 'GPAY' ? '2px solid #4285F4' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 10,
                    padding: '12px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                    boxShadow: selectedUpiApp === 'GPAY' ? '0 0 14px rgba(66, 133, 244, 0.4)' : 'none'
                  }}
                >
                  <GPayLogo size={32} />
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>Google Pay</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>@okaxis / @okhdfc</div>
                </button>

                {/* PhonePe */}
                <button
                  type="button"
                  onClick={() => handleSelectUpiApp('PHONEPE')}
                  style={{
                    background: selectedUpiApp === 'PHONEPE' ? 'rgba(95, 37, 159, 0.35)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedUpiApp === 'PHONEPE' ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 10,
                    padding: '12px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                    boxShadow: selectedUpiApp === 'PHONEPE' ? '0 0 14px rgba(168, 85, 247, 0.4)' : 'none'
                  }}
                >
                  <PhonePeLogo size={32} />
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>PhonePe</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>@ybl / @ibl</div>
                </button>

                {/* Paytm UPI */}
                <button
                  type="button"
                  onClick={() => handleSelectUpiApp('PAYTM')}
                  style={{
                    background: selectedUpiApp === 'PAYTM' ? 'rgba(0, 186, 242, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedUpiApp === 'PAYTM' ? '2px solid #00BAF2' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 10,
                    padding: '12px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                    boxShadow: selectedUpiApp === 'PAYTM' ? '0 0 14px rgba(0, 186, 242, 0.4)' : 'none'
                  }}
                >
                  <PaytmLogo size={32} />
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>Paytm UPI</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>@paytm</div>
                </button>

                {/* BHIM / QR Code */}
                <button
                  type="button"
                  onClick={() => handleSelectUpiApp('QR')}
                  style={{
                    background: selectedUpiApp === 'QR' ? 'rgba(0, 230, 118, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedUpiApp === 'QR' ? '2px solid #00e676' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 10,
                    padding: '12px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                    boxShadow: selectedUpiApp === 'QR' ? '0 0 14px rgba(0, 230, 118, 0.4)' : 'none'
                  }}
                >
                  <UpiLogo size={32} />
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>Scan & Pay QR</div>
                  <div style={{ fontSize: 10, color: '#00e676' }}>Any UPI App</div>
                </button>
              </div>

              {/* Dynamic QR Preview Box when QR is selected */}
              {selectedUpiApp === 'QR' ? (
                <div style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(0, 230, 118, 0.3)',
                  borderRadius: 12,
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 14
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ background: '#fff', padding: 8, borderRadius: 8, display: 'inline-block' }}>
                      <QrCode size={64} color="#090f1d" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Scan with PhonePe, GPay, Paytm or CRED</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Amount to pay: <strong style={{ color: '#00e676', fontSize: 13 }}>{currencySymbol}{convertPrice(finalPayable).toLocaleString()}</strong></div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                        <PhonePeLogo size={16} />
                        <GPayLogo size={16} />
                        <PaytmLogo size={16} />
                        <UpiLogo size={16} />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLaunchRazorpayPopup}
                    style={{
                      background: 'linear-gradient(135deg, #00e676 0%, #00b0ff 100%)',
                      border: 'none',
                      color: '#090f1d',
                      padding: '10px 18px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>Launch Razorpay Popup</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              ) : (
                /* VPA Input Row */
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'stretch' }}>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder={selectedUpiApp === 'GPAY' ? "Enter Google Pay VPA (e.g. rahul@okaxis)" : selectedUpiApp === 'PHONEPE' ? "Enter PhonePe VPA (e.g. rahul@ybl)" : "Enter UPI VPA (e.g. name@paytm)"}
                    style={{
                      flex: '1 1 200px',
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
                    <span>Pay with {selectedUpiApp === 'GPAY' ? 'Google Pay' : selectedUpiApp === 'PHONEPE' ? 'PhonePe' : 'Paytm'}</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. RAZORPAY CARD VIEW WITH BRAND LOGOS */}
          {paymentMethod === 'RAZORPAY_CARD' && (
            <div style={{
              background: 'rgba(0, 82, 204, 0.08)',
              border: '1px solid rgba(0, 82, 204, 0.35)',
              borderRadius: 14,
              padding: 'clamp(14px, 2vw, 20px)',
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lock size={16} color="#00d2ff" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                    Razorpay 256-Bit Encrypted Card Payment
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <VisaLogo size={18} />
                  <MastercardLogo size={18} />
                  <RupayLogo size={18} />
                  <AmexLogo size={18} />
                </div>
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

              {/* Test Card Quick Chips with Brand Logos */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 11 }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>Quick Test Cards:</span>
                <button
                  type="button"
                  onClick={() => handleFillTestCard('4111111111111111', `${passengers[0]?.firstName} ${passengers[0]?.lastName}`)}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#00d2ff', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <VisaLogo size={14} /> <span>Visa (4111...)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillTestCard('5242001122334455', 'PRIYA SHARMA')}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#f5af19', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <MastercardLogo size={14} /> <span>Mastercard</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillTestCard('6080123456789012', 'AMITABH SHARMA')}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#00e676', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <RupayLogo size={14} /> <span>RuPay Card</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. RAZORPAY NETBANKING VIEW WITH BANK LOGOS */}
          {paymentMethod === 'RAZORPAY_NETBANKING' && (
            <div style={{
              background: 'rgba(0, 230, 118, 0.06)',
              border: '1px solid rgba(0, 230, 118, 0.3)',
              borderRadius: 14,
              padding: 'clamp(14px, 2vw, 20px)',
              marginBottom: 20
            }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                Select NetBanking Institution (Instant Authorization)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                {[
                  { id: 'HDFC', name: 'HDFC Bank', Logo: HdfcBankLogo },
                  { id: 'SBI', name: 'SBI Bank', Logo: SbiBankLogo },
                  { id: 'ICICI', name: 'ICICI Bank', Logo: IciciBankLogo },
                  { id: 'AXIS', name: 'Axis Bank', Logo: AxisBankLogo },
                  { id: 'KOTAK', name: 'Kotak Bank', Logo: KotakBankLogo },
                  { id: 'OTHER', name: 'Other 50+ Banks', Logo: Building2 }
                ].map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => setSelectedBank(bank.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 8,
                      background: selectedBank === bank.id ? 'rgba(0, 230, 118, 0.22)' : 'rgba(255,255,255,0.04)',
                      border: selectedBank === bank.id ? '1.5px solid #00e676' : '1px solid rgba(255,255,255,0.1)',
                      color: selectedBank === bank.id ? '#00e676' : '#cbd5e1',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.15s'
                    }}
                  >
                    <bank.Logo size={20} color={selectedBank === bank.id ? '#00e676' : '#cbd5e1'} />
                    <span>{bank.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. RAZORPAY WALLET & EMI VIEW WITH LOGOS */}
          {paymentMethod === 'RAZORPAY_WALLET' && (
            <div style={{
              background: 'rgba(245, 175, 25, 0.06)',
              border: '1px solid rgba(245, 175, 25, 0.3)',
              borderRadius: 14,
              padding: 'clamp(14px, 2vw, 20px)',
              marginBottom: 20
            }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                Select Digital Wallet / EMI Option
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                {[
                  { name: 'Amazon Pay', Logo: AmazonPayLogo },
                  { name: 'Paytm Wallet', Logo: PaytmLogo },
                  { name: 'PhonePe Wallet', Logo: PhonePeLogo },
                  { name: 'MobiKwik', Logo: MobiKwikLogo }
                ].map((wal) => (
                  <button
                    key={wal.name}
                    type="button"
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'rgba(245, 175, 25, 0.15)',
                      border: '1px solid rgba(245, 175, 25, 0.35)',
                      color: '#f5af19',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <wal.Logo size={20} />
                    <span>{wal.name}</span>
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

          {/* Submit Button & Security Footer with Trust Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <RazorpayLogo size={18} />
                <GPayLogo size={16} />
                <PhonePeLogo size={16} />
                <VisaLogo size={14} />
                <MastercardLogo size={14} />
                <RupayLogo size={14} />
              </div>
              <span>256-bit RBI Compliant Payment Gateway</span>
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
