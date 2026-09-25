// SelectMyFlight Hotel Database & Catalog

export const HOTEL_CITIES = [
  { code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪', popularArea: 'Downtown & Palm Jumeirah' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', flag: '🇸🇬', popularArea: 'Marina Bay & Orchard Road' },
  { code: 'LHR', city: 'London', country: 'United Kingdom', flag: '🇬🇧', popularArea: 'Westminster & Covent Garden' },
  { code: 'CDG', city: 'Paris', country: 'France', flag: '🇫🇷', popularArea: 'Champs-Élysées & Eiffel District' },
  { code: 'NYC', city: 'New York', country: 'United States', flag: '🇺🇸', popularArea: 'Manhattan & Times Square' },
  { code: 'TYO', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', popularArea: 'Shinjuku & Shibuya' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭', popularArea: 'Sukhumvit & Siam' },
  { code: 'DPS', city: 'Bali', country: 'Indonesia', flag: '🇮🇩', popularArea: 'Seminyak & Ubud' },
  { code: 'FCO', city: 'Rome', country: 'Italy', flag: '🇮🇹', popularArea: 'Colosseum & Trevi' },
  { code: 'MLE', city: 'Maldives', country: 'Maldives', flag: '🇲🇻', popularArea: 'Overwater Luxury Villas' },
  { code: 'GOI', city: 'Goa', country: 'India', flag: '🇮🇳', popularArea: 'North Goa & Candolim Beach' },
  { code: 'DEL', city: 'New Delhi', country: 'India', flag: '🇮🇳', popularArea: 'Aerocity & Connaught Place' },
  { code: 'BOM', city: 'Mumbai', country: 'India', flag: '🇮🇳', popularArea: 'Marine Drive & Bandra West' },
  { code: 'BLR', city: 'Bengaluru', country: 'India', flag: '🇮🇳', popularArea: 'Indiranagar & Whitefield' }
];

export const INITIAL_HOTELS = [
  // DUBAI
  {
    id: 'htl-dxb-1',
    name: 'Burj Al Arab Jumeirah — 7-Star Luxury Suite',
    cityCode: 'DXB',
    cityName: 'Dubai',
    location: 'Jumeirah Beach, Dubai',
    starRating: 5,
    reviewScore: 9.8,
    reviewLabel: 'Exceptional',
    reviewCount: 4890,
    pricePerNight: 58000,
    discountBadge: 'ULTRA 7-STAR SUITE',
    image: '/assets/images/hotel_burj_al_arab.jpg',
    galleryImages: ['/assets/images/hotel_burj_al_arab.jpg', '/assets/images/destination_dubai.jpg', '/assets/images/cabin_luxury_suite.jpg'],
    amenities: ['Private Infinity Pool Balcony', 'Helipad Access', 'Hermès Amenities', '24h Personal Butler', 'Submarine Seafood Dining', 'Private Beach'],
    freeCancellation: true,
    breakfastIncluded: true,
    roomTypes: [
      { id: 'rm-1', name: 'Royal Infinity Ocean Suite', price: 58000, bed: '1 Super King Bed', view: 'Arabian Sea Sunset View', size: '170 sq.m', capacity: '2 Adults, 2 Children' },
      { id: 'rm-2', name: 'Diplomatic Sky Villa Suite', price: 92000, bed: '2 King Beds', view: 'Panoramic Palm Jumeirah View', size: '330 sq.m', capacity: '4 Adults' }
    ]
  },
  {
    id: 'htl-dxb-2',
    name: 'Atlantis The Royal Resort & Residences',
    cityCode: 'DXB',
    cityName: 'Dubai',
    location: 'Palm Jumeirah, Dubai',
    starRating: 5,
    reviewScore: 9.6,
    reviewLabel: 'Exceptional',
    reviewCount: 3840,
    pricePerNight: 34500,
    discountBadge: '20% LUXURY DEAL',
    image: '/assets/images/destination_dubai.jpg',
    galleryImages: ['/assets/images/destination_dubai.jpg', '/assets/images/hotel_burj_al_arab.jpg', '/assets/images/cabin_luxury_suite.jpg'],
    amenities: ['Infinity Sky Pool', 'Private Beach', 'Michelin Dining', 'Luxury Spa', 'Free High-Speed WiFi', 'Airport Limousine'],
    freeCancellation: true,
    breakfastIncluded: true,
    roomTypes: [
      { id: 'rm-3', name: 'Royal Palm King Suite', price: 34500, bed: '1 Extra Large King Bed', view: 'Arabian Gulf View', size: '65 sq.m', capacity: '2 Adults, 1 Child' }
    ]
  },
  {
    id: 'htl-dxb-3',
    name: 'Rove Downtown Dubai',
    cityCode: 'DXB',
    cityName: 'Dubai',
    location: 'Zabeel 2, Downtown Dubai',
    starRating: 4,
    reviewScore: 8.9,
    reviewLabel: 'Fabulous',
    reviewCount: 4920,
    pricePerNight: 7800,
    discountBadge: 'BEST VALUE',
    image: '/assets/images/destination_dubai.jpg',
    amenities: ['Outdoor Pool', '24/7 Gym', 'The Daily Restaurant', 'Free Shuttle to Beach', 'Free WiFi', 'Cinema Room'],
    freeCancellation: true,
    breakfastIncluded: false,
    roomTypes: [
      { id: 'rm-5', name: 'Rover Room King', price: 7800, bed: '1 King Bed', view: 'City View', size: '26 sq.m', capacity: '2 Adults' }
    ]
  },

  // LONDON
  {
    id: 'htl-lhr-1',
    name: 'The Savoy London — A Fairmont Managed Hotel',
    cityCode: 'LHR',
    cityName: 'London',
    location: 'Strand, Covent Garden, London WC2',
    starRating: 5,
    reviewScore: 9.5,
    reviewLabel: 'Exceptional',
    reviewCount: 3100,
    pricePerNight: 48900,
    discountBadge: 'HERITAGE LUXURY',
    image: '/assets/images/hotel_savoy_london.jpg',
    galleryImages: ['/assets/images/hotel_savoy_london.jpg', '/assets/images/destination_london.jpg'],
    amenities: ['River Thames Views', 'Gordon Ramsay Grill', 'Butler Service', 'Indoor Pool', 'Spa & Wellness', 'Traditional Afternoon Tea'],
    freeCancellation: true,
    breakfastIncluded: true,
    roomTypes: [
      { id: 'rm-6', name: 'Superior Queen Room', price: 48900, bed: '1 Queen Bed', view: 'Courtyard View', size: '35 sq.m', capacity: '2 Adults' },
      { id: 'rm-7', name: 'Thames River View Deluxe Suite', price: 82000, bed: '1 King Bed', view: 'Iconic River View', size: '70 sq.m', capacity: '2 Adults' }
    ]
  },
  {
    id: 'htl-lhr-2',
    name: 'Shangri-La The Shard, London',
    cityCode: 'LHR',
    cityName: 'London',
    location: '31 St Thomas St, London Bridge, London',
    starRating: 5,
    reviewScore: 9.4,
    reviewLabel: 'Superb',
    reviewCount: 2840,
    pricePerNight: 52000,
    discountBadge: 'ICONIC SKYLINE',
    image: '/assets/images/destination_london.jpg',
    amenities: ['Sky Pool on Level 52', 'Floor-to-Ceiling Windows', 'GŎNG Sky Bar', 'Marble Bathrooms', 'Free WiFi', '24h Room Service'],
    freeCancellation: true,
    breakfastIncluded: true,
    roomTypes: [
      { id: 'rm-8', name: 'Premier Shard King', price: 52000, bed: '1 King Bed', view: 'Panoramic London Skyline', size: '48 sq.m', capacity: '2 Adults' }
    ]
  },

  // SINGAPORE
  {
    id: 'htl-sin-1',
    name: 'Marina Bay Sands Singapore',
    cityCode: 'SIN',
    cityName: 'Singapore',
    location: '10 Bayfront Avenue, Marina Bay',
    starRating: 5,
    reviewScore: 9.5,
    reviewLabel: 'Exceptional',
    reviewCount: 9400,
    pricePerNight: 41000,
    discountBadge: 'WORLD ICONIC POOL',
    image: '/assets/images/hotel_marina_bay_sands.jpg',
    galleryImages: ['/assets/images/hotel_marina_bay_sands.jpg', '/assets/images/destination_singapore.jpg'],
    amenities: ['World-Famous Rooftop Infinity Pool', 'Sands SkyPark', 'Casino Access', 'Banyan Tree Spa', 'Celebrity Chef Dining', 'The Shoppes Mall'],
    freeCancellation: true,
    breakfastIncluded: true,
    roomTypes: [
      { id: 'rm-10', name: 'Deluxe Marina View Room', price: 41000, bed: '1 King or 2 Doubles', view: 'Marina Bay Skyline', size: '42 sq.m', capacity: '2 Adults, 1 Child' }
    ]
  },

  // GOA
  {
    id: 'htl-goi-1',
    name: 'Taj Exotica Resort & Spa, Goa',
    cityCode: 'GOI',
    cityName: 'Goa',
    location: 'Benaulim Beach, South Goa',
    starRating: 5,
    reviewScore: 9.4,
    reviewLabel: 'Superb',
    reviewCount: 3600,
    pricePerNight: 18500,
    discountBadge: 'BEACHFRONT VILLA',
    image: '/assets/images/destination_goa.jpg',
    galleryImages: ['/assets/images/destination_goa.jpg'],
    amenities: ['Private Beach Access', 'Jiva Ayurvedic Spa', 'Golf Course', 'Seafood Grill', 'Lagoon Pool', 'Kids Activity Club'],
    freeCancellation: true,
    breakfastIncluded: true,
    roomTypes: [
      { id: 'rm-14', name: 'Premium Sea View Villa', price: 18500, bed: '1 King Bed', view: 'Direct Sea View', size: '56 sq.m', capacity: '2 Adults, 2 Children' }
    ]
  },
  {
    id: 'htl-goi-2',
    name: 'W Goa — Vagator Beach',
    cityCode: 'GOI',
    cityName: 'Goa',
    location: 'Vagator Beach, North Goa',
    starRating: 5,
    reviewScore: 9.1,
    reviewLabel: 'Fabulous',
    reviewCount: 2450,
    pricePerNight: 16200,
    discountBadge: 'VIBRANT SUNSET CHIC',
    image: '/assets/images/destination_goa.jpg',
    amenities: ['Rock Pool Sunset Lounge', 'AWAY Spa', 'Direct Beach Trail', 'WOOBAR', 'Fitness Center', 'Free WiFi'],
    freeCancellation: true,
    breakfastIncluded: true,
    roomTypes: [
      { id: 'rm-16', name: 'Wonderful King Room', price: 16200, bed: '1 King Bed', view: 'Chapotora Fort View', size: '48 sq.m', capacity: '2 Adults' }
    ]
  },

  // DELHI
  {
    id: 'htl-del-1',
    name: 'The Leela Palace New Delhi',
    cityCode: 'DEL',
    cityName: 'New Delhi',
    location: 'Diplomatic Enclave, Chanakyapuri, New Delhi',
    starRating: 5,
    reviewScore: 9.6,
    reviewLabel: 'Exceptional',
    reviewCount: 4200,
    pricePerNight: 19500,
    discountBadge: 'ROYAL INDIAN HOSPITALITY',
    image: '/assets/images/hero_flight_banner.jpg',
    amenities: ['Rooftop Temperature Pool', 'ESPA Wellness Spa', 'Megu Japanese Dining', 'Jamavar Royal Indian', 'Butler Service', 'Free WiFi'],
    freeCancellation: true,
    breakfastIncluded: true,
    roomTypes: [
      { id: 'rm-17', name: 'Grande Deluxe King Room', price: 19500, bed: '1 King Bed', view: 'Diplomatic Enclave Greens', size: '52 sq.m', capacity: '2 Adults' },
      { id: 'rm-18', name: 'Royal Suite with Plunge Pool', price: 42000, bed: '1 King Bed', view: 'Palace Gardens', size: '110 sq.m', capacity: '2 Adults' }
    ]
  },
  {
    id: 'htl-del-2',
    name: 'Andaz Delhi — A Concept by Hyatt',
    cityCode: 'DEL',
    cityName: 'New Delhi',
    location: 'Asset No. 1, Aerocity, IGI Airport, New Delhi',
    starRating: 5,
    reviewScore: 9.2,
    reviewLabel: 'Superb',
    reviewCount: 5100,
    pricePerNight: 11800,
    discountBadge: 'AIRPORT LUXURY',
    image: '/assets/images/hero_flight_banner.jpg',
    amenities: ['5 Mins to Airport Terminal 3', 'AnnaMaya Food Hall', 'Juniper Gin Bar', 'Heated Outdoor Pool', 'Free Airport Shuttle', 'Free WiFi'],
    freeCancellation: true,
    breakfastIncluded: true,
    roomTypes: [
      { id: 'rm-19', name: 'Andaz King Runway View', price: 11800, bed: '1 King Bed', view: 'Runway View', size: '38 sq.m', capacity: '2 Adults' }
    ]
  },

  // MUMBAI
  {
    id: 'htl-bom-1',
    name: 'The Taj Mahal Palace, Mumbai',
    cityCode: 'BOM',
    cityName: 'Mumbai',
    location: 'Apollo Bunder, Colaba, Mumbai',
    starRating: 5,
    reviewScore: 9.7,
    reviewLabel: 'Exceptional',
    reviewCount: 8900,
    pricePerNight: 24500,
    discountBadge: 'FLAGSHIP ICON',
    image: '/assets/images/hero_flight_banner.jpg',
    amenities: ['Gateway of India Views', 'Jiva Grand Spa', 'Wasabi by Morimoto', 'Heritage Sea Lounge', 'Swimming Pool', '24h Butler'],
    freeCancellation: true,
    breakfastIncluded: true,
    roomTypes: [
      { id: 'rm-20', name: 'Palace Heritage Sea View Room', price: 24500, bed: '1 King Bed', view: 'Gateway of India View', size: '45 sq.m', capacity: '2 Adults' },
      { id: 'rm-21', name: 'Tata Signature Suite', price: 75000, bed: '1 Grand King Bed', view: 'Full Arabian Sea Panoramic', size: '130 sq.m', capacity: '2 Adults' }
    ]
  }
];
