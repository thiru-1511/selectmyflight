import React, { useState } from 'react';
import { 
  FileCheck2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  X, 
  Download, 
  Calendar, 
  Plane,
  Building,
  User,
  CreditCard,
  ChevronRight,
  Trash2,
  Edit3,
  FileUp,
  FolderOpen
} from 'lucide-react';
import { VISA_TYPES, INITIAL_VISA_APPLICATIONS } from '../data/mockVisa';

export default function VisaServicesPortal({ currency = 'INR', onClose, onNavigateToFlights }) {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'track', 'apply'
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Applications State
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('smf_visa_applications');
      return saved ? JSON.parse(saved) : INITIAL_VISA_APPLICATIONS;
    } catch {
      return INITIAL_VISA_APPLICATIONS;
    }
  });

  // Tracking State
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [trackedApplication, setTrackedApplication] = useState(applications[0] || null);

  // Application Modal / Active Visa
  const [activeVisaForApply, setActiveVisaForApply] = useState(null);
  const [isExpressSelected, setIsExpressSelected] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [applicantForm, setApplicantForm] = useState({
    fullName: localStorage.getItem('smf_verified_name') || 'Thiru Selvan',
    passportNumber: 'Z8942150',
    email: localStorage.getItem('smf_verified_email') || 'thiru1511@gmail.com',
    phone: '+91 98765 43210',
    nationality: 'Indian',
    travelDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    passportFront: null,
    passportBack: null,
    passportPhoto: null
  });
  const [applicationSuccess, setApplicationSuccess] = useState(null);

  const handleFileSelect = (field, e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUploadError(null);
      const sizeStr = (file.size / 1024).toFixed(1) + ' KB';
      setApplicantForm(prev => ({
        ...prev,
        [field]: {
          name: file.name,
          size: sizeStr,
          type: file.type
        }
      }));
    }
  };

  const handleRemoveFile = (field) => {
    setApplicantForm(prev => ({
      ...prev,
      [field]: null
    }));
  };

  // Filtered visas
  const filteredVisas = VISA_TYPES.filter(v => {
    const matchesCountry = selectedCountry === 'All' || v.countryCode === selectedCountry;
    const matchesQuery = searchQuery === '' || 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  const handleTrackSubmit = (e) => {
    if (e) e.preventDefault();
    const query = trackingIdInput.trim().toUpperCase();
    const found = applications.find(a => a.applicationId.toUpperCase() === query || a.passportNumber.toUpperCase() === query);
    if (found) {
      setTrackedApplication(found);
    } else {
      alert(`No active visa application found for "${trackingIdInput}". Try demo ID: SMF-VISA-4091 or SMF-VISA-3820`);
    }
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!activeVisaForApply) return;

    if (!applicantForm.passportFront || !applicantForm.passportPhoto) {
      setUploadError('Please choose your Passport Bio Page (Front) and Passport Size Photo before proceeding.');
      return;
    }
    setUploadError(null);

    const newAppId = 'SMF-VISA-' + Math.floor(1000 + Math.random() * 9000);
    const totalFee = activeVisaForApply.price + (isExpressSelected ? (activeVisaForApply.expressFee || 0) : 0);

    const newApp = {
      applicationId: newAppId,
      applicantName: applicantForm.fullName,
      passportNumber: applicantForm.passportNumber.toUpperCase(),
      visaType: activeVisaForApply.title,
      country: activeVisaForApply.country,
      submissionDate: new Date().toISOString().split('T')[0],
      currentStage: 2, // 1: Documents Verified, 2: Embassy/GDRFA Filed, 3: Immigration Under Review, 4: Visa Issued
      status: 'IN_PROGRESS',
      statusLabel: 'Filing Dispatched to Immigration Desk',
      estimatedCompletion: isExpressSelected ? 'Within 24 Hours' : activeVisaForApply.processingTime,
      feesPaid: totalFee,
      notes: 'Documents verified by SelectMyFlight automated compliance engine. Embassy submission confirmed.'
    };

    const updatedList = [newApp, ...applications];
    setApplications(updatedList);
    try {
      localStorage.setItem('smf_visa_applications', JSON.stringify(updatedList));
    } catch {
      // ignore
    }

    setApplicationSuccess(newApp);
    setTrackedApplication(newApp);
  };

  const formatPrice = (amount) => {
    if (currency === 'USD') return `$${Math.round(amount / 83)}`;
    if (currency === 'EUR') return `€${Math.round(amount / 90)}`;
    if (currency === 'GBP') return `£${Math.round(amount / 105)}`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', padding: '16px 8px 60px 8px' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(9, 15, 29, 0.95), rgba(15, 23, 42, 0.98))',
        border: '1px solid rgba(0, 210, 255, 0.25)',
        borderRadius: 20,
        padding: '32px 24px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 24,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ maxWidth: 740 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(0, 210, 255, 0.12)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              color: '#00d2ff',
              marginBottom: 10
            }}>
              <FileCheck2 size={13} />
              <span>OFFICIAL VISA & IMMIGRATION DESK</span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: -0.5 }}>
              UAE & Global Tourist Visa Services
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>
              SelectMyFlight authorized visa facilitation with 99.2% approval rate. UAE 30 & 60-Day tourist visas, Airport-to-Airport (A2A) status changes, Singapore eVisas, and Schengen document verification.
            </p>
          </div>

          {/* Navigation Pill Switches */}
          <div style={{ display: 'flex', gap: 8, background: 'rgba(255, 255, 255, 0.05)', padding: 6, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              style={{
                background: activeTab === 'browse' ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent',
                color: activeTab === 'browse' ? '#fff' : '#cbd5e1',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <FileText size={15} />
              <span>Visa Catalog</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('track')}
              style={{
                background: activeTab === 'track' ? 'linear-gradient(135deg, #00e676, #00b0ff)' : 'transparent',
                color: activeTab === 'track' ? '#090f1d' : '#cbd5e1',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Clock size={15} />
              <span>Track Application</span>
              <span style={{ background: '#090f1d', color: '#00e676', padding: '1px 6px', borderRadius: 10, fontSize: 10 }}>
                {applications.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: BROWSE VISA CATALOG */}
      {activeTab === 'browse' && (
        <div>
          {/* Filter & Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20
          }}>
            {/* Country Tabs */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { id: 'All', label: 'All Destinations' },
                { id: 'UAE', label: '🇦🇪 Dubai & UAE (Fast-Track)' },
                { id: 'SIN', label: '🇸🇬 Singapore eVisa' },
                { id: 'THA', label: '🇹🇭 Thailand' },
                { id: 'EU', label: '🇪🇺 Schengen / Europe' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCountry(c.id)}
                  style={{
                    background: selectedCountry === c.id ? 'rgba(0, 210, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedCountry === c.id ? '#00d2ff' : '#94a3b8',
                    border: selectedCountry === c.id ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '8px 14px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 10,
              padding: '8px 12px',
              width: '100%',
              maxWidth: 280
            }}>
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search visa type, country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: 13,
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Visa Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: 20
          }}>
            {filteredVisas.map(visa => (
              <div
                key={visa.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 16,
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 28 }}>{visa.flag}</span>
                      <div>
                        <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                          {visa.country}
                        </div>
                        <div style={{ fontSize: 12, color: '#00d2ff', fontWeight: 600 }}>
                          {visa.category}
                        </div>
                      </div>
                    </div>
                    {visa.badge && (
                      <span style={{
                        background: `${visa.badgeColor}22`,
                        color: visa.badgeColor,
                        border: `1px solid ${visa.badgeColor}55`,
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 800
                      }}>
                        {visa.badge}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: '8px 0', lineHeight: 1.3 }}>
                    {visa.title}
                  </h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 14 }}>
                    {visa.description}
                  </p>

                  {/* Highlights Grid */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                    marginBottom: 16
                  }}>
                    <div>
                      <span style={{ display: 'block', fontSize: 10, color: '#64748b' }}>PROCESSING TIME</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#00e676', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {visa.processingTime}
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: 10, color: '#64748b' }}>STAY DURATION</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>
                        {visa.stayDuration}
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: 10, color: '#64748b' }}>VALIDITY</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        {visa.validity}
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: 10, color: '#64748b' }}>ONLINE FILING</span>
                      <span style={{ fontSize: 11, color: '#00d2ff', fontWeight: 600 }}>
                        100% Paperless
                      </span>
                    </div>
                  </div>

                  {/* Key Requirements List */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                      Document Checklist:
                    </div>
                    {visa.requirements.slice(0, 3).map((req, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8', marginBottom: 3 }}>
                        <CheckCircle2 size={12} color="#00e676" style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Apply Action */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: 10, color: '#94a3b8', display: 'block' }}>Total Govt & Processing Fee</span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>
                      {formatPrice(visa.price)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveVisaForApply(visa);
                      setIsExpressSelected(false);
                      setApplicationSuccess(null);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>Apply Online</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: LIVE APPLICATION TRACKER */}
      {activeTab === 'track' && (
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          {/* Search Box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(0, 210, 255, 0.25)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
              Track Visa Application Status
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, marginBottom: 16 }}>
              Enter your SMF Application ID or Passport Number to check real-time embassy & GDRFA immigration status.
            </p>

            <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                placeholder="e.g. SMF-VISA-4091 or Passport Number..."
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '10px 14px',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #00e676, #00b0ff)',
                  color: '#090f1d',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Lookup Status
              </button>
            </form>

            {/* Quick Demo Pickers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>Quick Test IDs:</span>
              {applications.map(app => (
                <button
                  key={app.applicationId}
                  type="button"
                  onClick={() => {
                    setTrackingIdInput(app.applicationId);
                    setTrackedApplication(app);
                  }}
                  style={{
                    background: 'rgba(0, 210, 255, 0.1)',
                    border: '1px solid rgba(0, 210, 255, 0.3)',
                    color: '#00d2ff',
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {app.applicationId} ({app.country})
                </button>
              ))}
            </div>
          </div>

          {/* Tracked Result Display */}
          {trackedApplication && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 16,
              padding: '28px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
            }}>
              {/* Header Status Bar */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 18 }}>
                <div>
                  <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Application Reference
                  </span>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#00d2ff' }}>
                    {trackedApplication.applicationId}
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600, marginTop: 2 }}>
                    {trackedApplication.visaType}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block',
                    background: trackedApplication.status === 'APPROVED' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(0, 210, 255, 0.15)',
                    color: trackedApplication.status === 'APPROVED' ? '#00e676' : '#00d2ff',
                    border: trackedApplication.status === 'APPROVED' ? '1px solid #00e676' : '1px solid #00d2ff',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 800,
                    marginBottom: 4
                  }}>
                    {trackedApplication.statusLabel}
                  </span>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    Submitted on {trackedApplication.submissionDate}
                  </div>
                </div>
              </div>

              {/* 4-Stage Visual Timeline */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>
                  IMMIGRATION PROCESSING PIPELINE:
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 8,
                  position: 'relative'
                }}>
                  {[
                    { stage: 1, title: 'Document Pre-Check', desc: 'Passport & Photo Verified' },
                    { stage: 2, title: 'Embassy / GDRFA Filed', desc: 'Application Lodged' },
                    { stage: 3, title: 'Immigration Review', desc: 'Security Clearance' },
                    { stage: 4, title: 'Visa Issued', desc: 'Ready for Travel' }
                  ].map((step) => {
                    const isPassed = trackedApplication.currentStage >= step.stage;
                    const isCurrent = trackedApplication.currentStage === step.stage;
                    return (
                      <div
                        key={step.stage}
                        style={{
                          background: isCurrent ? 'rgba(0, 210, 255, 0.12)' : isPassed ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          border: isCurrent ? '1px solid #00d2ff' : isPassed ? '1px solid #00e676' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 10,
                          padding: '12px 10px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: isPassed ? '#00e676' : 'rgba(255, 255, 255, 0.1)',
                          color: isPassed ? '#090f1d' : '#94a3b8',
                          fontSize: 11,
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 6px auto'
                        }}>
                          {isPassed ? '✓' : step.stage}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: isCurrent ? '#00d2ff' : isPassed ? '#fff' : '#64748b' }}>
                          {step.title}
                        </div>
                        <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>
                          {step.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Traveler & Application Specs */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 10,
                padding: '14px 18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                marginBottom: 20
              }}>
                <div>
                  <span style={{ fontSize: 10, color: '#64748b' }}>APPLICANT NAME</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{trackedApplication.applicantName}</div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: '#64748b' }}>PASSPORT NUMBER</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{trackedApplication.passportNumber}</div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: '#64748b' }}>ESTIMATED READY DATE</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#00e676' }}>{trackedApplication.estimatedCompletion}</div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: '#64748b' }}>FEES PAID</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#00d2ff' }}>{formatPrice(trackedApplication.feesPaid)}</div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: '#94a3b8', background: 'rgba(0, 210, 255, 0.05)', padding: 10, borderRadius: 8, marginBottom: 20 }}>
                💡 <strong>Officer Notes:</strong> {trackedApplication.notes}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {trackedApplication.status === 'APPROVED' ? (
                  <button
                    type="button"
                    onClick={() => alert(`Downloading verified eVisa certificate for ${trackedApplication.applicantName} (${trackedApplication.applicationId})...`)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #00e676, #00b0ff)',
                      color: '#090f1d',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    <Download size={16} /> Download Official eVisa (PDF)
                  </button>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, color: '#00d2ff', fontSize: 12 }}>
                    <Clock size={16} /> Automatic updates are pushed via SMS and email as each stage clears.
                  </div>
                )}
                {onNavigateToFlights && (
                  <button
                    type="button"
                    onClick={onNavigateToFlights}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '12px 18px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Plane size={15} /> Book Connecting Flights
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ONLINE VISA APPLICATION FORM */}
      {activeVisaForApply && (
        <div className="modal-overlay" onClick={() => setActiveVisaForApply(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 620, maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: 11, color: '#00d2ff', fontWeight: 800, textTransform: 'uppercase' }}>
                  {activeVisaForApply.country} IMMIGRATION FILING
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '2px 0 0 0' }}>
                  {activeVisaForApply.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVisaForApply(null)}
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

            <div style={{ padding: 24 }}>
              {applicationSuccess ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'rgba(0, 230, 118, 0.15)',
                    border: '2px solid #00e676',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    color: '#00e676'
                  }}>
                    <CheckCircle2 size={34} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
                    Visa Application Lodged!
                  </h3>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#00d2ff', margin: '8px 0' }}>
                    Application ID: {applicationSuccess.applicationId}
                  </div>
                  <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 440, margin: '0 auto 20px auto', lineHeight: 1.5 }}>
                    Your documents have been encrypted and submitted to the SelectMyFlight visa desk. Estimated resolution: <strong>{applicationSuccess.estimatedCompletion}</strong>.
                  </p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveVisaForApply(null);
                        setActiveTab('track');
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Track Application Live
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit}>
                  {/* Personal details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Full Name (as per Passport)</label>
                      <input
                        type="text"
                        required
                        value={applicantForm.fullName}
                        onChange={(e) => setApplicantForm({ ...applicantForm, fullName: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Passport Number</label>
                      <input
                        type="text"
                        required
                        value={applicantForm.passportNumber}
                        onChange={(e) => setApplicantForm({ ...applicantForm, passportNumber: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Email Address</label>
                      <input
                        type="email"
                        required
                        value={applicantForm.email}
                        onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Mobile Number (with Country Code)</label>
                      <input
                        type="tel"
                        required
                        value={applicantForm.phone}
                        onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Nationality</label>
                      <select
                        value={applicantForm.nationality}
                        onChange={(e) => setApplicantForm({ ...applicantForm, nationality: e.target.value })}
                        style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      >
                        <option value="Indian">Indian (IN)</option>
                        <option value="Emirati">Emirati (UAE)</option>
                        <option value="British">British (UK)</option>
                        <option value="American">American (US)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Intended Departure Date</label>
                      <input
                        type="date"
                        required
                        value={applicantForm.travelDate}
                        onChange={(e) => setApplicantForm({ ...applicantForm, travelDate: e.target.value })}
                        style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                  </div>

                  {/* Real Interactive Document Choosers */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                        Choose Verification Documents <span style={{ color: '#ff4d6d' }}>*</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                        Select documents from your device (PDF, JPG, PNG up to 10MB)
                      </div>
                    </div>

                    {uploadError && (
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#f87171',
                        padding: '10px 14px',
                        borderRadius: 8,
                        fontSize: 12,
                        marginBottom: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}>
                        <AlertCircle size={15} />
                        <span>{uploadError}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {/* Document 1: Passport Bio Page (Front) */}
                      <input
                        type="file"
                        id="upload-passportFront"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileSelect('passportFront', e)}
                        style={{ display: 'none' }}
                      />
                      {!applicantForm.passportFront ? (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px dashed rgba(0, 210, 255, 0.35)',
                          borderRadius: 10,
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ background: 'rgba(0, 210, 255, 0.12)', padding: 8, borderRadius: 8, color: '#00d2ff' }}>
                              <FileText size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                                Passport Bio Page (Front) <span style={{ color: '#00d2ff' }}>*</span>
                              </div>
                              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                Color photo & personal details page (PDF, JPG, PNG)
                              </div>
                            </div>
                          </div>
                          <label
                            htmlFor="upload-passportFront"
                            style={{
                              background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                              color: '#fff',
                              padding: '8px 16px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              boxShadow: '0 2px 8px rgba(0, 210, 255, 0.25)'
                            }}
                          >
                            <FolderOpen size={14} />
                            <span>Choose Document</span>
                          </label>
                        </div>
                      ) : (
                        <div style={{
                          background: 'rgba(0, 230, 118, 0.06)',
                          border: '1px solid rgba(0, 230, 118, 0.4)',
                          borderRadius: 10,
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <div style={{ background: 'rgba(0, 230, 118, 0.15)', padding: 8, borderRadius: 8, color: '#00e676' }}>
                              <CheckCircle2 size={18} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 11, color: '#00e676', fontWeight: 700 }}>✓ Passport Bio Page Attached</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {applicantForm.passportFront.name}
                              </div>
                              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                {applicantForm.passportFront.size} • Ready for upload
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                            <label
                              htmlFor="upload-passportFront"
                              title="Choose different file"
                              style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#cbd5e1',
                                padding: '6px 10px',
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <Edit3 size={12} />
                              <span>Change</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile('passportFront')}
                              title="Remove document"
                              style={{
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#f87171',
                                padding: '6px 8px',
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Document 2: Passport Address Page (Back) */}
                      <input
                        type="file"
                        id="upload-passportBack"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileSelect('passportBack', e)}
                        style={{ display: 'none' }}
                      />
                      {!applicantForm.passportBack ? (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px dashed rgba(255, 255, 255, 0.15)',
                          borderRadius: 10,
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: 8, borderRadius: 8, color: '#94a3b8' }}>
                              <FileText size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                                Passport Address Page (Back)
                              </div>
                              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                Address & parent details page (PDF, JPG, PNG)
                              </div>
                            </div>
                          </div>
                          <label
                            htmlFor="upload-passportBack"
                            style={{
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: '#fff',
                              padding: '8px 16px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                          >
                            <FolderOpen size={14} />
                            <span>Choose Document</span>
                          </label>
                        </div>
                      ) : (
                        <div style={{
                          background: 'rgba(0, 230, 118, 0.06)',
                          border: '1px solid rgba(0, 230, 118, 0.4)',
                          borderRadius: 10,
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <div style={{ background: 'rgba(0, 230, 118, 0.15)', padding: 8, borderRadius: 8, color: '#00e676' }}>
                              <CheckCircle2 size={18} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 11, color: '#00e676', fontWeight: 700 }}>✓ Passport Address Page Attached</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {applicantForm.passportBack.name}
                              </div>
                              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                {applicantForm.passportBack.size} • Ready for upload
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                            <label
                              htmlFor="upload-passportBack"
                              title="Choose different file"
                              style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#cbd5e1',
                                padding: '6px 10px',
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <Edit3 size={12} />
                              <span>Change</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile('passportBack')}
                              title="Remove document"
                              style={{
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#f87171',
                                padding: '6px 8px',
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Document 3: Passport Size Photo (White BG) */}
                      <input
                        type="file"
                        id="upload-passportPhoto"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileSelect('passportPhoto', e)}
                        style={{ display: 'none' }}
                      />
                      {!applicantForm.passportPhoto ? (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px dashed rgba(0, 210, 255, 0.35)',
                          borderRadius: 10,
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ background: 'rgba(0, 210, 255, 0.12)', padding: 8, borderRadius: 8, color: '#00d2ff' }}>
                              <User size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                                Passport Size Photograph <span style={{ color: '#00d2ff' }}>*</span>
                              </div>
                              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                Recent color photo with clear white background (JPG, PNG)
                              </div>
                            </div>
                          </div>
                          <label
                            htmlFor="upload-passportPhoto"
                            style={{
                              background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                              color: '#fff',
                              padding: '8px 16px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              boxShadow: '0 2px 8px rgba(0, 210, 255, 0.25)'
                            }}
                          >
                            <FolderOpen size={14} />
                            <span>Choose Photo</span>
                          </label>
                        </div>
                      ) : (
                        <div style={{
                          background: 'rgba(0, 230, 118, 0.06)',
                          border: '1px solid rgba(0, 230, 118, 0.4)',
                          borderRadius: 10,
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <div style={{ background: 'rgba(0, 230, 118, 0.15)', padding: 8, borderRadius: 8, color: '#00e676' }}>
                              <CheckCircle2 size={18} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 11, color: '#00e676', fontWeight: 700 }}>✓ Photograph Attached</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {applicantForm.passportPhoto.name}
                              </div>
                              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                {applicantForm.passportPhoto.size} • Ready for upload
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                            <label
                              htmlFor="upload-passportPhoto"
                              title="Choose different photo"
                              style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#cbd5e1',
                                padding: '6px 10px',
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <Edit3 size={12} />
                              <span>Change</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile('passportPhoto')}
                              title="Remove photo"
                              style={{
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#f87171',
                                padding: '6px 8px',
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Express Toggle */}
                  {activeVisaForApply.expressAvailable && (
                    <div style={{
                      background: 'rgba(0, 230, 118, 0.08)',
                      border: '1px solid rgba(0, 230, 118, 0.3)',
                      borderRadius: 10,
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 16
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                          ⚡ Add 24-Hour Express Fast-Track
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                          Priority queue filing directly with Immigration department.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsExpressSelected(prev => !prev)}
                        style={{
                          background: isExpressSelected ? '#00e676' : 'rgba(255,255,255,0.1)',
                          color: isExpressSelected ? '#090f1d' : '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {isExpressSelected ? `Added (+${formatPrice(activeVisaForApply.expressFee)})` : `+${formatPrice(activeVisaForApply.expressFee)}`}
                      </button>
                    </div>
                  )}

                  {/* Summary & Submit */}
                  <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontSize: 10, color: '#94a3b8', display: 'block' }}>Total Payable Amount</span>
                      <span style={{ fontSize: 22, fontWeight: 900, color: '#00d2ff' }}>
                        {formatPrice(activeVisaForApply.price + (isExpressSelected ? (activeVisaForApply.expressFee || 0) : 0))}
                      </span>
                    </div>

                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <CreditCard size={16} /> Submit & Pay Online
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
