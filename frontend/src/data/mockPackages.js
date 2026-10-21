// SelectMyFlight Curated Holiday Packages & Tour Catalog

export const HOLIDAY_PACKAGES = [
  {
    id: 'pkg-dubai-5d',
    title: 'Dubai Extravaganza & Desert Wonder',
    destination: 'Dubai, UAE',
    destinationCode: 'DXB',
    duration: '5 Days / 4 Nights',
    daysCount: 5,
    nightsCount: 4,
    pricePerPerson: 42500,
    originalPrice: 49900,
    badge: 'BESTSELLER',
    badgeColor: '#00d2ff',
    rating: 4.9,
    reviewsCount: 3120,
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80',
    overview: 'Experience the glitz and glamour of modern Dubai, from scaling the dizzying heights of Burj Khalifa to experiencing an exhilarating Red Dune Desert Safari with starlit BBQ dining.',
    inclusions: [
      'Round-Trip Flights (Economy class with baggage)',
      '4 Nights in 4-Star Downtown Hotel (e.g. Millennium Plaza / Hyatt Place)',
      'Daily International Buffet Breakfast',
      'Burj Khalifa 124th & 125th Floor Observation Deck Tickets',
      'Red Dune Desert Safari with Dune Bashing, Camel Ride, Tanoura & BBQ Dinner',
      'Dubai Marina Dhow Dinner Cruise with live entertainment',
      'Private Airport Transfers in Air-Conditioned Vehicle',
      'UAE 30-Day Single Entry Tourist Visa included'
    ],
    exclusions: [
      'Tourism Dirham fee payable directly at hotel',
      'Personal expenses & tips',
      'Travel Insurance (available as add-on)'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Dubai & Marina Dhow Dinner Cruise', desc: 'Welcome to Dubai International Airport. Meet our SMF representative, private transfer to hotel. Evening luxury Marina Dhow Cruise with buffet.' },
      { day: 2, title: 'Half-Day Dubai City Tour & Burj Khalifa At The Top', desc: 'Visit Dubai Frame, Jumeirah Mosque, Burj Al Arab photo stop. Sunset visit to 124th floor of Burj Khalifa & Dubai Fountain show.' },
      { day: 3, title: 'Red Dune Desert Safari & Bedouin Camp BBQ', desc: 'Morning at leisure. Afternoon 4x4 Land Cruiser desert safari, sandboarding, camel ride, fire show, and Arabic BBQ feast under the stars.' },
      { day: 4, title: 'Abu Dhabi Day Excursion (Optional) or Souks & Mall of Emirates', desc: 'Visit the majestic Sheikh Zayed Grand Mosque in Abu Dhabi or spend day shopping at Gold Souk and Mall of the Emirates.' },
      { day: 5, title: 'Souvenirs & Departure to Airport', desc: 'Enjoy breakfast, last-minute shopping at Dubai Duty Free, and private transfer to DXB airport for your return flight.' }
    ]
  },
  {
    id: 'pkg-kerala-6d',
    title: 'Magical Kerala — Backwaters, Tea Hills & Wildlife',
    destination: 'Kerala, India',
    destinationCode: 'COK',
    duration: '6 Days / 5 Nights',
    daysCount: 6,
    nightsCount: 5,
    pricePerPerson: 28900,
    originalPrice: 34500,
    badge: 'NATURE RETREAT',
    badgeColor: '#00e676',
    rating: 4.8,
    reviewsCount: 1850,
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
    overview: 'Unwind in Gods Own Country. Sail through the emerald palm-fringed backwaters of Alleppey on a private luxury houseboat and breathe misty mountain air among the rolling tea plantations of Munnar.',
    inclusions: [
      'Round-Trip Flights (Cochin arrival & departure)',
      '2 Nights Munnar Hill Resort (Mountain View)',
      '1 Night Thekkady Spice Sanctuary Hotel',
      '1 Night Deluxe Private Houseboat in Alleppey Backwaters with all meals',
      '1 Night Fort Kochi Heritage Hotel',
      'All transfers in private chauffeur-driven AC Sedan',
      'Tea plantation tour, spice plantation walk, and Kathakali show'
    ],
    exclusions: [
      'Entry tickets to national parks',
      'Lunch and beverages (except meals on houseboat)',
      'Personal ayurvedic massage therapies'
    ],
    itinerary: [
      { day: 1, title: 'Arrival at Cochin & Scenic Drive to Munnar', desc: 'Arrive at Cochin Airport. Scenic mountain drive to Munnar passing Cheeyappara & Valara waterfalls. Check into hill resort.' },
      { day: 2, title: 'Munnar Tea Gardens, Mattupetty & Eravikulam National Park', desc: 'Explore lush green tea estates, Mattupetty Dam, Echo Point, and spot the endangered Nilgiri Tahr at Eravikulam National Park.' },
      { day: 3, title: 'Munnar to Thekkady Spice Trail & Periyar Boating', desc: 'Scenic transfer to Thekkady. Walk through cardamom and pepper plantations. Enjoy evening Periyar Lake wildlife boat cruise.' },
      { day: 4, title: 'Thekkady to Alleppey Houseboat Cruise', desc: 'Board your private traditional Kettuvallam houseboat. Cruise through serene canals and village life. Authentic Kerala lunch and dinner prepared on board.' },
      { day: 5, title: 'Alleppey to Fort Kochi Heritage Walk', desc: 'Disembark after breakfast. Drive to Fort Kochi. Witness historic Chinese Fishing Nets, St. Francis Church, and colorful Jewish Town street.' },
      { day: 6, title: 'Departure from Cochin', desc: 'Breakfast at hotel and seamless transfer to Cochin International Airport for flight home.' }
    ]
  },
  {
    id: 'pkg-singapore-5d',
    title: 'Futuristic Singapore & Sentosa Wonderland',
    destination: 'Singapore',
    destinationCode: 'SIN',
    duration: '5 Days / 4 Nights',
    daysCount: 5,
    nightsCount: 4,
    pricePerPerson: 54000,
    originalPrice: 62000,
    badge: 'FAMILY FAVORITE',
    badgeColor: '#c084fc',
    rating: 4.9,
    reviewsCount: 2410,
    heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=80',
    overview: 'Step into tomorrow with Singapore: Marvel at the supertrees of Gardens by the Bay, scream on world-class rollercoasters at Universal Studios Sentosa, and savor Michelin-star hawker fare.',
    inclusions: [
      'Round-Trip Flights (Changi arrival & departure)',
      '4 Nights in 4-Star Hotel (Orchard Road / Marina Bay area)',
      'Daily Buffet Breakfast',
      'Universal Studios Singapore Full-Day Pass',
      'Gardens by the Bay (Flower Dome & Cloud Forest)',
      'Sentosa Cable Car Ride & S.E.A. Aquarium Entry',
      'Singapore River Cruise by Electric Bumboat',
      'Private Airport Transfers'
    ],
    exclusions: [
      'Singapore Tourist Visa processing (can be bundled for ₹2,600)',
      'Meals not specified in inclusions',
      'Personal expenses'
    ],
    itinerary: [
      { day: 1, title: 'Touchdown in Singapore & Night Safari', desc: 'Arrive at Changi Jewel. Check in at hotel. Evening visit to the worlds first nocturnal wildlife park: Singapore Night Safari with tram ride.' },
      { day: 2, title: 'Gardens by the Bay & Marina Bay Sands SkyPark', desc: 'Walk through the breathtaking Cloud Forest waterfall and Flower Dome. Evening light show at Supertree Grove and 57th-floor Sands SkyPark views.' },
      { day: 3, title: 'Full Day Universal Studios Singapore', desc: 'Transfer to Sentosa Island. Enjoy thrill rides like Battlestar Galactica, Transformers 3D, and Jurassic Park Rapids Adventure.' },
      { day: 4, title: 'City Highlights, Little India & Chinatown', desc: 'Sightseeing tour of Merlion Park, Chinatown temples, colorful Haji Lane street art, and shopping on Orchard Road.' },
      { day: 5, title: 'Jewel Changi Rain Vortex & Departure', desc: 'Breakfast, check out. Early transfer to Changi Airport to explore the famous indoor HSBC Rain Vortex waterfall before flight.' }
    ]
  },
  {
    id: 'pkg-bali-6d',
    title: 'Tropical Bali — Ubud Jungle & Beach Luxury',
    destination: 'Bali, Indonesia',
    destinationCode: 'DPS',
    duration: '6 Days / 5 Nights',
    daysCount: 6,
    nightsCount: 5,
    pricePerPerson: 49800,
    originalPrice: 58000,
    badge: 'HONEYMOON SPECIAL',
    badgeColor: '#f5af19',
    rating: 4.9,
    reviewsCount: 1670,
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80',
    overview: 'An unforgettable island escape featuring private pool villas in bohemian Ubud and vibrant beach sunsets along the golden sands of Seminyak and Nusa Penida.',
    inclusions: [
      'Round-Trip Flights (Denpasar Bali)',
      '3 Nights in Luxury Private Pool Villa in Ubud',
      '2 Nights in 5-Star Beachfront Resort in Seminyak / Kuta',
      'Daily Floating Villa Breakfast & Hotel Breakfasts',
      'Nusa Penida Island Tour with Kelingking T-Rex cliff by speedboat',
      'Ubud Bali Swing & Tegallalang Rice Terrace experience',
      'Sunset at Tanah Lot Sea Temple',
      'Private AC Car with English-speaking Chauffeur Guide'
    ],
    exclusions: [
      'Bali Tourist Levy & Visa-on-Arrival fee (~$35 USD paid at airport)',
      'Lunch and Dinners',
      'Water sports equipment rentals'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Denpasar & Transfer to Ubud', desc: 'Welcome flower garland greeting at Ngurah Rai airport. Scenic transfer to your secluded private pool villa in Ubud.' },
      { day: 2, title: 'Tegallalang Rice Terraces, Bali Swing & Monkey Forest', desc: 'Experience the iconic jungle swing over lush rice paddies. Visit sacred Ubud Monkey Forest and explore artistic craft villages.' },
      { day: 3, title: 'Mount Batur Sunrise or Kintamani Volcano View', desc: 'Scenic mountain drive to Kintamani overlooking Lake Batur and active volcano. Visit Tirta Empul holy water spring temple.' },
      { day: 4, title: 'Full Day Nusa Penida Island Speedboat Tour', desc: 'Transfer to Sanur port. Fast boat to Nusa Penida. Visit the jaw-dropping Kelingking Beach cliff, Broken Beach, and Angel Billabong.' },
      { day: 5, title: 'Seminyak Beach Day & Tanah Lot Sunset', desc: 'Relax at Seminyak beach clubs. In the late afternoon, witness the dramatic temple perched on an offshore rock at Tanah Lot during sunset.' },
      { day: 6, title: 'Departure from Bali', desc: 'Savor your final Balinese breakfast, pack memories, and transfer to DPS airport for your flight back home.' }
    ]
  },
  {
    id: 'pkg-rajasthan-5d',
    title: 'Royal Rajasthan Heritage & Golden Fortresses',
    destination: 'Rajasthan, India',
    destinationCode: 'JAI',
    duration: '5 Days / 4 Nights',
    daysCount: 5,
    nightsCount: 4,
    pricePerPerson: 24500,
    originalPrice: 29900,
    badge: 'ROYAL HERITAGE',
    badgeColor: '#fb923c',
    rating: 4.8,
    reviewsCount: 1420,
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&q=80',
    overview: 'Walk the footsteps of Maharajas across the Pink City of Jaipur and the romantic city of lakes, Udaipur. Stay in authentic royal Havelis with folk dance and royal Rajasthani banquets.',
    inclusions: [
      'Round-Trip Flights (Jaipur arrival, Udaipur departure)',
      '2 Nights Heritage Haveli Stay in Jaipur (Pink City)',
      '2 Nights Lake View Hotel in Udaipur',
      'Daily Royal Breakfast included',
      'Amber Fort Jeep ride & City Palace Guided Tour in Jaipur',
      'Romantic Lake Pichola boat ride overlooking Lake Palace in Udaipur',
      'Chauffeur-driven AC vehicle for intercity travel'
    ],
    exclusions: [
      'Monument entry fees and camera charges',
      'Lunches & personal shopping',
      'Driver tips'
    ],
    itinerary: [
      { day: 1, title: 'Jaipur Arrival, Hawa Mahal & Chokhi Dhani', desc: 'Arrive at Jaipur Airport. Check into heritage Haveli. Photo stop at Hawa Mahal, evening cultural folk extravaganza at Chokhi Dhani.' },
      { day: 2, title: 'Majestic Amber Fort & City Palace', desc: 'Ascend Amber Fort by jeep. Explore Sheesh Mahal (hall of mirrors), Jal Mahal, and the royal museum at City Palace.' },
      { day: 3, title: 'Jaipur to Udaipur via Chittorgarh Fort', desc: 'Drive across the Aravalli hills to Udaipur. Enroute visit the legendary Chittorgarh Fort, symbol of Rajput chivalry.' },
      { day: 4, title: 'Udaipur City Palace & Lake Pichola Boat Cruise', desc: 'Visit Udaipur City Palace, Jagdish Temple, and Saheliyon Ki Bari. Evening sunset boat cruise on Lake Pichola.' },
      { day: 5, title: 'Departure from Udaipur', desc: 'Breakfast, shopping for Rajasthani handicrafts and blue pottery, transfer to Maharana Pratap Airport (UDR).' }
    ]
  }
];
