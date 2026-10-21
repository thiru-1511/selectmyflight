// SelectMyFlight Official Visa & Immigration Services Catalog

export const VISA_TYPES = [
  {
    id: 'uae-30',
    country: 'United Arab Emirates',
    countryCode: 'UAE',
    flag: '🇦🇪',
    title: 'Dubai / UAE 30-Day Tourist Visa',
    category: 'Tourist Single Entry',
    validity: '60 Days from Issue',
    stayDuration: '30 Days',
    processingTime: '24 – 48 Hours',
    price: 6850,
    badge: 'MOST POPULAR',
    badgeColor: '#00d2ff',
    description: 'Ideal for leisure travelers, tourists, and short family vacations to Dubai, Abu Dhabi, or Sharjah.',
    requirements: [
      'Colored passport copy (front & back, minimum 6 months validity)',
      'Recent passport-size photo with white background',
      'Confirmed return flight ticket',
      'Hotel booking confirmation or host address'
    ],
    expressAvailable: true,
    expressFee: 1500
  },
  {
    id: 'uae-60',
    country: 'United Arab Emirates',
    countryCode: 'UAE',
    flag: '🇦🇪',
    title: 'Dubai / UAE 60-Day Express Tourist Visa',
    category: 'Long Stay Single Entry',
    validity: '60 Days from Issue',
    stayDuration: '60 Days',
    processingTime: '24 Hours (Express)',
    price: 13500,
    badge: 'EXPRESS APPROVAL',
    badgeColor: '#00e676',
    description: 'Perfect for extended holidays, job seekers, or visiting relatives with fast-track immigration filing.',
    requirements: [
      'Colored passport copy (valid for at least 6 months)',
      'Clear white-background passport photograph',
      'Return airline ticket confirmation',
      'PAN Card / National ID copy'
    ],
    expressAvailable: false,
    expressFee: 0
  },
  {
    id: 'uae-a2a',
    country: 'United Arab Emirates',
    countryCode: 'UAE',
    flag: '🇦🇪',
    title: 'UAE Airport-to-Airport (A2A) Visa Change Package',
    category: 'Visa Extension / Status Change',
    validity: 'Immediate on Return',
    stayDuration: 'New 30 or 60 Days',
    processingTime: 'Same Day Exit & Re-entry',
    price: 21900,
    badge: 'EXCLUSIVE SMF SERVICE',
    badgeColor: '#f5af19',
    description: 'Complete round-trip shuttle flight from Sharjah/Dubai to Muscat/Bahrain/Kuwait with immediate re-entry visa approval.',
    requirements: [
      'Current UAE Tourist / Visit Visa copy',
      'Passport copy with entry stamp',
      'Passport-size photograph',
      'Guarantor / Contact reference in UAE'
    ],
    expressAvailable: true,
    expressFee: 2000
  },
  {
    id: 'sin-30',
    country: 'Singapore',
    countryCode: 'SIN',
    flag: '🇸🇬',
    title: 'Singapore 30-Day Multiple Entry eVisa',
    category: 'Tourist Multiple Entry',
    validity: 'Up to 2 Years',
    stayDuration: '30 Days per Entry',
    processingTime: '3 – 4 Working Days',
    price: 2600,
    badge: 'ICA APPROVED AGENT',
    badgeColor: '#c084fc',
    description: 'Official Singapore eVisa issued directly via Singapore Immigration (ICA) through SelectMyFlight authorized desk.',
    requirements: [
      'Form 14A duly signed by applicant',
      'Passport copy (first & last pages, 6 months validity)',
      'Passport photo (35x45mm, matte finish, 80% face view)',
      'Confirmed flight tickets & hotel confirmation'
    ],
    expressAvailable: false,
    expressFee: 0
  },
  {
    id: 'tha-evisa',
    country: 'Thailand',
    countryCode: 'THA',
    flag: '🇹🇭',
    title: 'Thailand Official Tourist eVisa',
    category: 'Tourist Single Entry',
    validity: '90 Days',
    stayDuration: '60 Days',
    processingTime: '2 – 3 Working Days',
    price: 3400,
    badge: 'FAST APPROVAL',
    badgeColor: '#38bdf8',
    description: 'Hassle-free digital eVisa for Bangkok, Phuket, and Pattaya vacations without embassy visit.',
    requirements: [
      'Passport bio-data page copy',
      'Photograph taken within 6 months',
      'Round-trip airline confirmation',
      'Bank statement showing minimum ₹50,000 balance'
    ],
    expressAvailable: true,
    expressFee: 800
  },
  {
    id: 'schengen-consult',
    country: 'Schengen / Europe',
    countryCode: 'EU',
    flag: '🇪🇺',
    title: 'Schengen Tourist Visa Full Consultation & Dossier',
    category: 'Embassy Filing Assistance',
    validity: 'Up to 90 Days',
    stayDuration: 'Based on Travel Itinerary',
    processingTime: '10 – 15 Working Days',
    price: 7500,
    badge: '98.4% SUCCESS RATE',
    badgeColor: '#ec4899',
    description: 'Full documentation assistance: Cover letter preparation, verified flight itinerary, hotel vouchers, and VFS Global appointment booking.',
    requirements: [
      'Valid Indian Passport (issued within 10 years, 2 blank pages)',
      '6 Months Bank Statements with bank stamp & seal',
      'Last 3 Years Income Tax Returns (ITR)',
      'Employment leave sanction letter & salary slips'
    ],
    expressAvailable: false,
    expressFee: 0
  }
];

export const INITIAL_VISA_APPLICATIONS = [
  {
    applicationId: 'SMF-VISA-4091',
    applicantName: 'Thiru Selvan',
    passportNumber: 'Z8942150',
    visaType: 'Dubai / UAE 30-Day Tourist Visa',
    country: 'United Arab Emirates',
    submissionDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    currentStage: 3, // 1: Documents Verified, 2: Embassy/GDRFA Filed, 3: Immigration Under Review, 4: Visa Issued
    status: 'IN_PROGRESS',
    statusLabel: 'Immigration Under Review (GDRFA Dubai)',
    estimatedCompletion: 'Tomorrow, by 4:00 PM',
    feesPaid: 6850,
    notes: 'All documents verified by SMF Senior Visa Officer. Application forwarded to Dubai Immigration.'
  },
  {
    applicationId: 'SMF-VISA-3820',
    applicantName: 'Priya Narayanan',
    passportNumber: 'T4719024',
    visaType: 'Singapore 30-Day Multiple Entry eVisa',
    country: 'Singapore',
    submissionDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    currentStage: 4,
    status: 'APPROVED',
    statusLabel: 'Approved & eVisa Issued',
    estimatedCompletion: 'Completed',
    feesPaid: 2600,
    notes: 'Official ICA eVisa issued. Electronic certificate ready for print & travel.'
  }
];
