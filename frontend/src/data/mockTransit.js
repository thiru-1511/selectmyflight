// SelectMyFlight High-Speed Rail & Luxury Express Bus Transit Database

export const TRANSIT_STATIONS = [
  { code: 'NDLS', city: 'New Delhi', name: 'New Delhi Railway Station (NDLS)', state: 'Delhi', type: 'TRAIN' },
  { code: 'MMCT', city: 'Mumbai', name: 'Mumbai Central (MMCT)', state: 'Maharashtra', type: 'TRAIN' },
  { code: 'CSMT', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', state: 'Maharashtra', type: 'TRAIN' },
  { code: 'SBC', city: 'Bengaluru', name: 'KSR Bengaluru City Junction (SBC)', state: 'Karnataka', type: 'TRAIN' },
  { code: 'MAS', city: 'Chennai', name: 'MGR Chennai Central (MAS)', state: 'Tamil Nadu', type: 'TRAIN' },
  { code: 'MAO', city: 'Goa', name: 'Madgaon Junction (MAO)', state: 'Goa', type: 'TRAIN' },
  { code: 'HWH', city: 'Kolkata', name: 'Howrah Junction (HWH)', state: 'West Bengal', type: 'TRAIN' },
  { code: 'ISBT-DEL', city: 'New Delhi', name: 'Kashmere Gate ISBT', state: 'Delhi', type: 'BUS' },
  { code: 'BORIVALI-BOM', city: 'Mumbai', name: 'Borivali Western Express Hub', state: 'Maharashtra', type: 'BUS' },
  { code: 'MAJESTIC-BLR', city: 'Bengaluru', name: 'Majestic Kempegowda Bus Station', state: 'Karnataka', type: 'BUS' },
  { code: 'PANAJI-GOA', city: 'Goa', name: 'Panaji KTC Central Bus Terminal', state: 'Goa', type: 'BUS' }
];

export const INITIAL_TRANSIT_ROUTES = [
  // 1. TRAIN: Delhi to Mumbai (Vande Bharat Express)
  {
    id: 'tr-01',
    transitType: 'TRAIN',
    serviceNumber: '22436',
    operatorName: 'Indian Railways (Vande Bharat)',
    serviceName: 'Vande Bharat Superfast Express',
    originCode: 'NDLS',
    originCity: 'New Delhi',
    destinationCode: 'MMCT',
    destinationCity: 'Mumbai',
    departureTime: '06:00',
    arrivalTime: '17:35',
    durationMinutes: 695, // 11h 35m
    runsOnDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    distanceKm: 1384,
    speedMaxKmh: 160,
    rating: 4.8,
    reviewsCount: 1420,
    features: ['180° Rotating Recliner Seats', 'Gourmet Meal Included', 'Free Onboard WiFi & Infotainment', 'Automatic Sliding Doors', 'Bio-Vacuum Restrooms'],
    classes: [
      { id: 'cls-ec', name: 'Executive Chair Car (EC)', price: 3450, availableSeats: 28, status: 'AVAILABLE' },
      { id: 'cls-cc', name: 'AC Chair Car (CC)', price: 1850, availableSeats: 94, status: 'AVAILABLE' }
    ]
  },

  // 2. TRAIN: Delhi to Mumbai (Rajdhani Express)
  {
    id: 'tr-02',
    transitType: 'TRAIN',
    serviceNumber: '12952',
    operatorName: 'Indian Railways (Rajdhani)',
    serviceName: 'Mumbai Tejas Rajdhani Express',
    originCode: 'NDLS',
    originCity: 'New Delhi',
    destinationCode: 'MMCT',
    destinationCity: 'Mumbai',
    departureTime: '16:55',
    arrivalTime: '08:35',
    durationMinutes: 940, // 15h 40m
    runsOnDays: ['Daily'],
    distanceKm: 1384,
    speedMaxKmh: 130,
    rating: 4.6,
    reviewsCount: 3890,
    features: ['Overnight Sleeper Berths', 'Full Course Dining Included', 'Clean Bedding & Pillows', 'CCTV Security', 'Dedicated Attendant'],
    classes: [
      { id: 'cls-1a', name: 'First AC (1A) Coupe Suite', price: 4950, availableSeats: 8, status: 'AVAILABLE' },
      { id: 'cls-2a', name: '2-Tier AC (2A)', price: 2950, availableSeats: 32, status: 'AVAILABLE' },
      { id: 'cls-3a', name: '3-Tier AC (3A)', price: 2150, availableSeats: 64, status: 'AVAILABLE' }
    ]
  },

  // 3. TRAIN: Mumbai to Goa (Vande Bharat Express)
  {
    id: 'tr-03',
    transitType: 'TRAIN',
    serviceNumber: '22229',
    operatorName: 'Indian Railways (Vande Bharat)',
    serviceName: 'Goa Vande Bharat Express',
    originCode: 'CSMT',
    originCity: 'Mumbai',
    destinationCode: 'MAO',
    destinationCity: 'Goa',
    departureTime: '05:25',
    arrivalTime: '13:10',
    durationMinutes: 465, // 7h 45m
    runsOnDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    distanceKm: 586,
    speedMaxKmh: 140,
    rating: 4.9,
    reviewsCount: 980,
    features: ['Konkan Ghats Scenic Route', 'Panoramic Large Windows', 'Hot Breakfast & Snacks', 'High Comfort Suspension'],
    classes: [
      { id: 'cls-ec', name: 'Executive Chair Car (EC)', price: 2850, availableSeats: 16, status: 'AVAILABLE' },
      { id: 'cls-cc', name: 'AC Chair Car (CC)', price: 1540, availableSeats: 72, status: 'AVAILABLE' }
    ]
  },

  // 4. TRAIN: Bengaluru to Chennai (Shatabdi Express)
  {
    id: 'tr-04',
    transitType: 'TRAIN',
    serviceNumber: '12028',
    operatorName: 'Indian Railways (Shatabdi)',
    serviceName: 'KSR Bengaluru – Chennai Shatabdi',
    originCode: 'SBC',
    originCity: 'Bengaluru',
    destinationCode: 'MAS',
    destinationCity: 'Chennai',
    departureTime: '06:00',
    arrivalTime: '11:00',
    durationMinutes: 300, // 5h 00m
    runsOnDays: ['Daily (Except Tue)'],
    distanceKm: 362,
    speedMaxKmh: 130,
    rating: 4.7,
    reviewsCount: 1650,
    features: ['Punctual Express', 'Breakfast & Tea Service', 'Ergonomic Seating', 'Reading Lights'],
    classes: [
      { id: 'cls-ec', name: 'Executive Chair Car (EC)', price: 1980, availableSeats: 22, status: 'AVAILABLE' },
      { id: 'cls-cc', name: 'AC Chair Car (CC)', price: 990, availableSeats: 110, status: 'AVAILABLE' }
    ]
  },

  // 5. BUS: Bengaluru to Goa (Volvo 9600 Luxury Multi-Axle Sleeper)
  {
    id: 'bus-01',
    transitType: 'BUS',
    serviceNumber: 'INTR-9600',
    operatorName: 'IntrCity SmartBus Premium',
    serviceName: 'Volvo 9600 Ultra-Luxury Multi-Axle AC Sleeper',
    originCode: 'MAJESTIC-BLR',
    originCity: 'Bengaluru',
    destinationCode: 'PANAJI-GOA',
    destinationCity: 'Goa',
    departureTime: '21:30',
    arrivalTime: '08:15',
    durationMinutes: 645, // 10h 45m
    runsOnDays: ['Daily'],
    distanceKm: 560,
    speedMaxKmh: 100,
    rating: 4.8,
    reviewsCount: 2100,
    features: ['Individual AC Berth Cabins', 'Privacy Curtains', 'USB Fast Chargers', 'Water Bottle & Blanket', 'Live GPS Tracking', 'Pre-Cleaned Linens'],
    classes: [
      { id: 'cls-slp-lower', name: 'Lower Luxury AC Sleeper', price: 1850, availableSeats: 12, status: 'AVAILABLE' },
      { id: 'cls-slp-upper', name: 'Upper Private AC Sleeper', price: 1650, availableSeats: 18, status: 'AVAILABLE' }
    ]
  },

  // 6. BUS: Mumbai to Goa (Scania Executive Multi-Axle)
  {
    id: 'bus-02',
    transitType: 'BUS',
    serviceNumber: 'ZING-77',
    operatorName: 'ZingBus Electric & Multi-Axle Gold',
    serviceName: 'Scania Metrolink HD Executive Sleeper',
    originCode: 'BORIVALI-BOM',
    originCity: 'Mumbai',
    destinationCode: 'PANAJI-GOA',
    destinationCity: 'Goa',
    departureTime: '20:45',
    arrivalTime: '07:30',
    durationMinutes: 645, // 10h 45m
    runsOnDays: ['Daily'],
    distanceKm: 570,
    speedMaxKmh: 100,
    rating: 4.7,
    reviewsCount: 1850,
    features: ['Air Suspension Smooth Ride', 'Individual Reading Lights', 'Emergency SOS Button', 'Snack Pack & Fresh Water', 'Rest Stop at Top Highway Diners'],
    classes: [
      { id: 'cls-slp-lower', name: 'Lower AC Single Sleeper', price: 1950, availableSeats: 8, status: 'AVAILABLE' },
      { id: 'cls-slp-upper', name: 'Upper AC Double/Single', price: 1750, availableSeats: 14, status: 'AVAILABLE' }
    ]
  },

  // 7. BUS: Delhi to Jaipur / Agra (InterCity Electric Express)
  {
    id: 'bus-03',
    transitType: 'BUS',
    serviceNumber: 'NUEGO-101',
    operatorName: 'NueGo 100% Electric Intercity',
    serviceName: 'Zero-Emission Quiet AC Executive Coach',
    originCode: 'ISBT-DEL',
    originCity: 'New Delhi',
    destinationCode: 'JAIPUR-RJ',
    destinationCity: 'Jaipur',
    departureTime: '07:00',
    arrivalTime: '11:45',
    durationMinutes: 285, // 4h 45m
    runsOnDays: ['Daily'],
    distanceKm: 280,
    speedMaxKmh: 90,
    rating: 4.9,
    reviewsCount: 3200,
    features: ['100% Quiet Electric Drive', 'Deep Cleaned Air Purifier', 'Comfort Recliner 2x2', 'Free High Speed WiFi', 'Complimentary Beverage'],
    classes: [
      { id: 'cls-elec-seat', name: 'Executive Recliner Seat', price: 750, availableSeats: 26, status: 'AVAILABLE' }
    ]
  }
];
