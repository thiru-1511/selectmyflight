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
      {/* Official Devanagari Pe 'पे' symbol */}
      <g transform="translate(1.7, 2.0) scale(1.9)">
        <path
          fill="#ffffff"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.206 9.941h2.949v4.692c-.402.201-.938.268-1.34.268-1.072 0-1.609-.536-1.609-1.743V9.941zM17.445 8.869a.887.887 0 0 0-.871-.871h-1.609l-3.686-4.222c-.335-.402-.871-.536-1.407-.402l-1.274.401c-.201.067-.268.335-.134.469l4.021 3.82H6.386c-.201 0-.335.134-.335.335v.67c0 .469.402.871.871.871h.938v3.217c0 2.413 1.273 3.82 3.418 3.82.67 0 1.206-.067 1.877-.335v2.145c0 .603.469 1.072 1.072 1.072h.938a.432.432 0 0 0 .402-.402V9.874h1.542c.201 0 .335-.134.335-.335v-.67z"
        />
      </g>
    </svg>
  );
}

// 3. Paytm Logo
export function PaytmLogo({ size = 24, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect width="48" height="48" rx="10" fill="#002970" />
      {/* Official Paytm two-tone branding */}
      <text x="24" y="28" fontSize="13" fontWeight="900" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" textAnchor="middle" letterSpacing="-0.3">
        <tspan fill="#ffffff">Pay</tspan>
        <tspan fill="#00BAF2">tm</tspan>
      </text>
      <path d="M12 34h24" stroke="#00BAF2" strokeWidth="2.5" strokeLinecap="round" />
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

// 17. Google Official Icon
export function GoogleLogo({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}
