// SelectMyFlight SkyGenie TripCraft AI Itinerary Database & Neural Presets

export const ITINERARY_PRESETS = [
  // DUBAI
  {
    destinationCode: 'DXB',
    destinationCity: 'Dubai',
    country: 'United Arab Emirates',
    title: '3-Day Luxury Oasis & Futuristic Skyline',
    theme: 'Luxury & Iconic Sights',
    durationDays: 3,
    heroImage: '/assets/images/destination_dubai.jpg',
    estimatedBudgetInr: 58000,
    highlights: ['Burj Khalifa Level 148 At The Top', 'Desert Dune Safari with Sunset Barbecue', 'Private Yacht Cruise Marina', 'Dubai Mall Fountain Show'],
    recommendedFlightNumber: 'EK-511',
    recommendedHotelId: 'htl-dxb-1',
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & The Pinnacle of Modern Architecture',
        morning: {
          time: '09:00 AM – 12:30 PM',
          activity: 'Ascend Burj Khalifa (Level 148 SKY Lounge)',
          desc: 'Enjoy priority elevator skip-the-line access, 360-degree panoramic skyline views, and welcome Arabic dates & coffee.',
          tag: 'Landmark',
          estCost: '₹8,500'
        },
        afternoon: {
          time: '01:30 PM – 05:00 PM',
          activity: 'Dubai Mall & High-End Luxury Boulevard',
          desc: 'Explore the Grand Atrium, Dubai Aquarium underwater tunnel, and shop at Fashion Avenue with personal styling.',
          tag: 'Shopping & Leisure',
          estCost: '₹3,500'
        },
        evening: {
          time: '06:30 PM – 10:00 PM',
          activity: 'Dubai Fountain Boardwalk & Dinner at Cé La Vi',
          desc: 'Witness the synchronized aquatic choreography from the private boardwalk, followed by Michelin-curated dining overlooking the Burj Khalifa.',
          tag: 'Fine Dining & Sunset',
          estCost: '₹7,200'
        }
      },
      {
        dayNumber: 2,
        title: 'Arabian Desert Thrill & Bedouin Stargazing',
        morning: {
          time: '10:00 AM – 01:00 PM',
          activity: 'Palm Jumeirah View & Atlantis Aquaventure',
          desc: 'Experience The View at The Palm observation deck and walk through the Lost Chambers Aquarium.',
          tag: 'Scenic & Fun',
          estCost: '₹5,400'
        },
        afternoon: {
          time: '03:00 PM – 06:30 PM',
          activity: 'VIP 4x4 Desert Dune Bashing & Sandboarding',
          desc: 'Thrilling safari across the golden red dunes of Lahbab with sunset photography stops and camel riding.',
          tag: 'Adventure',
          estCost: '₹6,000'
        },
        evening: {
          time: '07:30 PM – 10:30 PM',
          activity: 'Royal Desert Fortress Dinner & Fire Show',
          desc: 'Authentic 5-star Arabic barbecue buffet, Tanoura dance performance, henna art, and traditional falconry under the starry desert sky.',
          tag: 'Cultural Heritage',
          estCost: 'Included in Safari'
        }
      },
      {
        dayNumber: 3,
        title: 'Marina Yacht Cruise & Old Dubai Souks',
        morning: {
          time: '09:30 AM – 12:00 PM',
          activity: 'Historic Al Fahidi District & Gold/Spice Souk Abra Ride',
          desc: 'Cross Dubai Creek on a traditional wooden Abra boat (1 AED) and immerse in centuries-old gold jewelry and exotic saffron spice markets.',
          tag: 'Historic Old Town',
          estCost: '₹1,500'
        },
        afternoon: {
          time: '02:00 PM – 05:00 PM',
          activity: 'Private Luxury Catamaran Cruise at Dubai Marina',
          desc: 'Sail past Ain Dubai, JBR Beach, and Atlantis Palm Jumeirah with onboard chilled refreshments.',
          tag: 'Yacht Experience',
          estCost: '₹9,800'
        },
        evening: {
          time: '07:00 PM – 11:00 PM',
          activity: 'Sunset at Aura Skypool & Departure Celebration',
          desc: 'Unwind at the world’s highest 360-degree infinity pool at 200m altitude before catching your return flight.',
          tag: 'Nightlife & Relaxation',
          estCost: '₹8,000'
        }
      }
    ]
  },

  // LONDON
  {
    destinationCode: 'LHR',
    destinationCity: 'London',
    country: 'United Kingdom',
    title: '4-Day Royal Heritage, West End & Thames Vistas',
    theme: 'Culture, Arts & Royal Palaces',
    durationDays: 4,
    heroImage: '/assets/images/destination_london.jpg',
    estimatedBudgetInr: 92000,
    highlights: ['Buckingham Palace Changing of the Guard', 'West End Musical Theatre', 'Tower of London & Crown Jewels', 'River Thames Sunset Cruise'],
    recommendedFlightNumber: 'BA-142',
    recommendedHotelId: 'htl-lhr-1',
    days: [
      {
        dayNumber: 1,
        title: 'Westminster, Big Ben & The London Eye',
        morning: {
          time: '09:00 AM – 12:00 PM',
          activity: 'Westminster Abbey & Parliament Square',
          desc: 'Tour the coronation church of British monarchs and capture iconic photos of Big Ben and the Houses of Parliament.',
          tag: 'Royal Heritage',
          estCost: '₹3,200'
        },
        afternoon: {
          time: '01:30 PM – 04:30 PM',
          activity: 'The London Eye Private Capsule Flight',
          desc: 'Soar 135 meters above the Thames with breathtaking panoramic vistas stretching up to 40km across London.',
          tag: 'Scenic View',
          estCost: '₹4,500'
        },
        evening: {
          time: '06:00 PM – 10:00 PM',
          activity: 'Covent Garden Dinner & Street Performers',
          desc: 'Stroll cobblestone piazzas, enjoy live acoustic artists, and dine at Dishoom or Ivy Market Grill.',
          tag: 'Dining & Vibes',
          estCost: '₹5,000'
        }
      },
      {
        dayNumber: 2,
        title: 'Monarchy, Green Park & The British Museum',
        morning: {
          time: '10:00 AM – 12:30 PM',
          activity: 'Buckingham Palace & Changing of the Guard',
          desc: 'Witness the iconic pageantry and cavalry marching through The Mall and St James’s Park.',
          tag: 'Royal Ceremony',
          estCost: 'Free'
        },
        afternoon: {
          time: '02:00 PM – 05:00 PM',
          activity: 'The British Museum & Rosetta Stone',
          desc: 'Explore the Great Court glass dome, Ancient Egyptian mummies, and Parthenon Sculptures.',
          tag: 'World History',
          estCost: 'Free (Donation)'
        },
        evening: {
          time: '07:30 PM – 10:30 PM',
          activity: 'West End Musical (The Lion King / Phantom of the Opera)',
          desc: 'Experience world-class live theatre in London’s glittering West End theatre district.',
          tag: 'Theatre & Broadway',
          estCost: '₹9,500'
        }
      },
      {
        dayNumber: 3,
        title: 'Tower Bridge, Borough Market & The Shard',
        morning: {
          time: '09:30 AM – 12:30 PM',
          activity: 'Tower of London & Crown Jewels',
          desc: 'Walk with the Yeoman Warders (Beefeaters) through medieval armories and marvel at the Koh-i-Noor diamond.',
          tag: 'Fortress History',
          estCost: '₹3,800'
        },
        afternoon: {
          time: '01:00 PM – 04:00 PM',
          activity: 'Borough Market Gastronomic Tour & Tower Bridge Walk',
          desc: 'Savor gourmet artisanal cheeses, hot salt beef bagels, and walk across Tower Bridge glass walkways.',
          tag: 'Street Food & Bridges',
          estCost: '₹3,000'
        },
        evening: {
          time: '06:30 PM – 10:00 PM',
          activity: 'Sunset Cocktails at Sky Garden (20 Fenchurch)',
          desc: 'Enjoy landscaped botanical indoor gardens and panoramic twilight views of London with live jazz.',
          tag: 'Skyline Lounge',
          estCost: '₹4,200'
        }
      },
      {
        dayNumber: 4,
        title: 'Soho, Mayfair High-End Shopping & Hyde Park',
        morning: {
          time: '10:00 AM – 01:00 PM',
          activity: 'Harrods of Knightsbridge & Hyde Park Serpentine',
          desc: 'Explore the iconic Harrods Food Halls, Egyptian Escalator, and take a stroll along Kensington Gardens.',
          tag: 'Shopping & Nature',
          estCost: '₹4,000'
        },
        afternoon: {
          time: '02:00 PM – 05:00 PM',
          activity: 'Regent Street, Oxford Street & Soho Boutiques',
          desc: 'Visit flagship boutiques, historic Carnaby Street, and artisanal coffee roasteries in Soho.',
          tag: 'Fashion & Shopping',
          estCost: 'Variable'
        },
        evening: {
          time: '06:30 PM – 09:30 PM',
          activity: 'Farewell Traditional British Roast & Pub Experience',
          desc: 'Relax in a cozy historic gastropub with craft ales and Yorkshire pudding before airport transfer.',
          tag: 'Pub Experience',
          estCost: '₹3,800'
        }
      }
    ]
  },

  // GOA
  {
    destinationCode: 'GOI',
    destinationCity: 'Goa',
    country: 'India',
    title: '3-Day Tropical Sunsets, Heritage & Beachfront Dining',
    theme: 'Beach & Coastal Relaxation',
    durationDays: 3,
    heroImage: '/assets/images/destination_goa.jpg',
    estimatedBudgetInr: 24000,
    highlights: ['Vagator & Anjuna Sunset Forts', 'Old Goa Portuguese Churches', 'Dudhsagar Waterfalls Trail', 'Beach Shack Candlelight Seafood'],
    recommendedFlightNumber: '6E-6351',
    recommendedHotelId: 'htl-goi-1',
    days: [
      {
        dayNumber: 1,
        title: 'North Goa Sunsets & Fort Chapora',
        morning: {
          time: '10:00 AM – 01:00 PM',
          activity: 'Candolim & Calangute Beach Watersports',
          desc: 'Parasailing, jet ski rides, and chilled tender coconut water on golden sands.',
          tag: 'Watersports',
          estCost: '₹2,500'
        },
        afternoon: {
          time: '03:30 PM – 06:00 PM',
          activity: 'Chapora Fort (Dil Chahta Hai Point)',
          desc: 'Hike to the ramparts overlooking the dramatic confluence of Chapora River and the Arabian Sea.',
          tag: 'Scenic Viewpoint',
          estCost: 'Free'
        },
        evening: {
          time: '07:00 PM – 11:00 PM',
          activity: 'Curries & Cocktails at Thalassa Greek Tavern',
          desc: 'Sunset dining on the cliff edge with fire dancers and fresh grilled tiger prawns.',
          tag: 'Beach Club & Sunset',
          estCost: '₹3,500'
        }
      },
      {
        dayNumber: 2,
        title: 'Fontainhas Latin Quarter & Spice Plantation',
        morning: {
          time: '09:00 AM – 12:30 PM',
          activity: 'Fontainhas Panaji Heritage Walking Tour',
          desc: 'Photograph pastel Portuguese colonial villas, red tiled roofs, and quaint art galleries in Asia’s only Latin Quarter.',
          tag: 'Colonial Architecture',
          estCost: '₹1,200'
        },
        afternoon: {
          time: '01:30 PM – 04:30 PM',
          activity: 'Sahakari Spice Farm Traditional Buffet',
          desc: 'Guided tour of organic cardamom, vanilla, and cinnamon trees followed by authentic Goan buffet on banana leaf.',
          tag: 'Culinary & Nature',
          estCost: '₹1,800'
        },
        evening: {
          time: '06:00 PM – 09:30 PM',
          activity: 'Mandovi River Sunset Cruise with Goan Folk Dance',
          desc: 'Evening boat cruise featuring live Dekhnni & Fugdi folk dance with DJ music.',
          tag: 'River Cruise',
          estCost: '₹1,500'
        }
      },
      {
        dayNumber: 3,
        title: 'South Goa Pristine Shores & Colva Sunset',
        morning: {
          time: '09:30 AM – 01:00 PM',
          activity: 'Basilica of Bom Jesus & Se Cathedral',
          desc: 'Visit the UNESCO World Heritage baroque churches holding the sacred relics of St. Francis Xavier.',
          tag: 'UNESCO Heritage',
          estCost: 'Free'
        },
        afternoon: {
          time: '02:00 PM – 05:30 PM',
          activity: 'Palolem Beach Kayaking & Dolphin Spotting',
          desc: 'Paddle through calm crescent bay waters and spot playful dolphins.',
          tag: 'Coastal Adventure',
          estCost: '₹2,000'
        },
        evening: {
          time: '06:30 PM – 10:00 PM',
          activity: 'Candlelight Dinner at Fisherman’s Wharf',
          desc: 'Riverside dining enjoying Kingfish Recheado, Goan fish curry rice, and Bebinca dessert.',
          tag: 'Farewell Dinner',
          estCost: '₹2,800'
        }
      }
    ]
  }
];
