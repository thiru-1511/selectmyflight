import React from 'react';

// 1. Google Pay Logo
export function GPayLogo({ size = 24, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="48" height="48" rx="10" fill="#ffffff" />
      {/* Google 'G' shape */}
      <path d="M36.6 24.5c0-.8-.07-1.5-.2-2.2H24v4.5h7.1c-.3 1.6-1.2 3-2.6 3.9v3.2h4.2c2.5-2.3 3.9-5.7 3.9-9.4z" fill="#4285F4" />
      <path d="M24 37.3c3.6 0 6.6-1.2 8.8-3.2l-4.2-3.2c-1.2.8-2.7 1.3-4.6 1.3-3.5 0-6.5-2.4-7.6-5.6h-4.3v3.3c2.2 4.4 6.7 7.4 11.9 7.4z" fill="#34A853" />
      <path d="M16.4 26.6c-.3-.8-.5-1.7-.5-2.6s.2-1.8.5-2.6v-3.3h-4.3c-.9 1.8-1.4 3.8-1.4 5.9s.5 4.1 1.4 5.9l4.3-3.3z" fill="#FBBC05" />
      <path d="M24 15.4c2 0 3.7.7 5.1 2l3.8-3.8c-2.3-2.1-5.3-3.4-8.9-3.4-5.2 0-9.7 3-11.9 7.4l4.3 3.3c1.1-3.2 4.1-5.5 7.6-5.5z" fill="#EA4335" />
    </svg>
  );
}

// 2. PhonePe Logo
export function PhonePeLogo({ size = 24, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="48" height="48" rx="10" fill="#5f259f" />
      <circle cx="24" cy="24" r="18" fill="#5f259f" />
      {/* Devanagari Pe 'पे' symbol */}
      <path d="M22 13v22M22 21h7a5 5 0 0 0 5-5 5 5 0 0 0-5-5h-9" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 24l9 11" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// 3. Paytm Logo
export function PaytmLogo({ size = 24, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="48" height="48" rx="10" fill="#002970" />
      {/* Paytm styled text */}
      <text x="24" y="27" fill="#00BAF2" fontSize="13" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="-0.5">Paytm</text>
      <path d="M12 33h24" stroke="#00BAF2" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 4. UPI & BHIM Logo
export function UpiLogo({ size = 24, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="48" height="48" rx="10" fill="#ffffff" />
      {/* UPI Green and Orange chevron triangles */}
      <path d="M28 12l-12 12h8l-4 12 16-16h-9l11-8z" fill="#097939" />
      <path d="M20 12l-8 8h6l-3 8 11-11h-7l7-5z" fill="#EF5423" />
      <text x="24" y="44" fill="#097939" fontSize="9" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">UPI</text>
    </svg>
  );
}

// 5. Visa Logo
export function VisaLogo({ size = 24, style = {} }) {
  return (
    <svg width={size * 1.5} height={size} viewBox="0 0 60 36" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="60" height="36" rx="6" fill="#1434CB" />
      <text x="30" y="25" fill="#FFFFFF" fontSize="18" fontStyle="italic" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">VISA</text>
      <path d="M14 13l2 5" stroke="#F7B600" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 6. Mastercard Logo
export function MastercardLogo({ size = 24, style = {} }) {
  return (
    <svg width={size * 1.4} height={size} viewBox="0 0 54 36" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="54" height="36" rx="6" fill="#1e293b" />
      <circle cx="21" cy="18" r="11" fill="#EB001B" />
      <circle cx="33" cy="18" r="11" fill="#F79E1B" fillOpacity="0.9" />
      <path d="M27 10.2a11 11 0 0 1 0 15.6 11 11 0 0 1 0-15.6z" fill="#FF5F00" />
    </svg>
  );
}

// 7. RuPay Logo
export function RupayLogo({ size = 24, style = {} }) {
  return (
    <svg width={size * 1.5} height={size} viewBox="0 0 60 36" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="60" height="36" rx="6" fill="#ffffff" />
      <text x="24" y="24" fill="#0A3A82" fontSize="14" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">Ru</text>
      <text x="44" y="24" fill="#00A551" fontSize="14" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">Pay</text>
      <path d="M49 10l5 8-5 8" stroke="#EF5423" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 8. American Express Logo
export function AmexLogo({ size = 24, style = {} }) {
  return (
    <svg width={size * 1.4} height={size} viewBox="0 0 54 36" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="54" height="36" rx="6" fill="#006FCF" />
      <rect x="4" y="4" width="46" height="28" rx="3" stroke="#ffffff" strokeWidth="1.5" fill="none" />
      <text x="27" y="23" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">AMEX</text>
    </svg>
  );
}

// 9. HDFC Bank Logo
export function HdfcBankLogo({ size = 22, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="40" height="40" rx="8" fill="#004C8F" />
      <rect x="7" y="7" width="26" height="26" fill="#ED232A" />
      <rect x="13" y="13" width="14" height="14" fill="#004C8F" />
      <rect x="17" y="9" width="6" height="22" fill="#ffffff" />
      <rect x="9" y="17" width="22" height="6" fill="#ffffff" />
    </svg>
  );
}

// 10. SBI (State Bank of India) Logo
export function SbiBankLogo({ size = 22, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="40" height="40" rx="8" fill="#280071" />
      <circle cx="20" cy="20" r="14" fill="#00A9E0" />
      <circle cx="20" cy="20" r="5" fill="#ffffff" />
      <rect x="18" y="20" width="4" height="14" fill="#ffffff" />
    </svg>
  );
}

// 11. ICICI Bank Logo
export function IciciBankLogo({ size = 22, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="40" height="40" rx="8" fill="#B02A30" />
      <circle cx="20" cy="20" r="13" stroke="#F37024" strokeWidth="3" fill="none" />
      <path d="M20 11v18M15 15h10M15 25h10" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 12. Axis Bank Logo
export function AxisBankLogo({ size = 22, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="40" height="40" rx="8" fill="#97144D" />
      <path d="M20 9l11 19H9L20 9z" fill="#ffffff" />
      <path d="M20 16l6 12H14L20 16z" fill="#97144D" />
    </svg>
  );
}

// 13. Kotak Bank Logo
export function KotakBankLogo({ size = 22, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="40" height="40" rx="8" fill="#ED1C24" />
      <path d="M14 20a6 6 0 0 1 6-6c3.3 0 6 2.7 6 6s-2.7 6-6 6a6 6 0 0 1-6-6z" stroke="#ffffff" strokeWidth="3" fill="none" />
      <circle cx="20" cy="20" r="2.5" fill="#ffffff" />
    </svg>
  );
}

// 14. Amazon Pay Logo
export function AmazonPayLogo({ size = 24, style = {} }) {
  return (
    <svg width={size * 1.5} height={size} viewBox="0 0 60 36" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="60" height="36" rx="6" fill="#232F3E" />
      <text x="30" y="19" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">amazon</text>
      <path d="M16 25c7 4 19 4 28 0" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 23l3 2-2 3" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 15. MobiKwik Logo
export function MobiKwikLogo({ size = 22, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="40" height="40" rx="8" fill="#E31B6D" />
      <path d="M12 28V12l8 10 8-10v16" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 16. Razorpay Official Badge
export function RazorpayLogo({ size = 24, style = {} }) {
  return (
    <svg width={size * 1.3} height={size} viewBox="0 0 50 36" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="50" height="36" rx="6" fill="#0C2340" />
      <path d="M26 6L14 30h8l4-8h8l2-4h-8l3-6h8l2-6H26z" fill="#00BAF2" />
    </svg>
  );
}
