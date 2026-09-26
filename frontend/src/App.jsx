import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import RealTimeTicker from './components/RealTimeTicker';
import FeatureHub from './components/FeatureHub';
import FeatureLauncher from './components/FeatureLauncher';
import HeroSearch from './components/HeroSearch';
import NearbyAirports from './components/NearbyAirports';
import FlexibleDateGrid from './components/FlexibleDateGrid';
import FlightList from './components/FlightList';
import ExploreDestinations from './components/ExploreDestinations';
import FlightStatusTracker from './components/FlightStatusTracker';
import InteractiveFlightMap from './components/InteractiveFlightMap';
import MyTripsDashboard from './components/MyTripsDashboard';
import AiChatbot from './components/AiChatbot';
import OffersDeals from './components/OffersDeals';
import PersonalizedRecommendations from './components/PersonalizedRecommendations';
import Footer from './components/Footer';

// Modals
import SeatMapModal from './components/SeatMapModal';
import CheckoutModal from './components/CheckoutModal';
import ETicketModal from './components/ETicketModal';
import PriceAlertModal from './components/PriceAlertModal';
import FareRulesModal from './components/FareRulesModal';
import UserProfileModal from './components/UserProfileModal';
import WishlistDrawer from './components/WishlistDrawer';
import NotificationsPanel from './components/NotificationsPanel';
import RefundTrackerModal from './components/RefundTrackerModal';
import HelpDeskModal from './components/HelpDeskModal';
import AuthPage from './components/AuthPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import HotelBookingPortal from './components/HotelBookingPortal';
import AiItineraryPlanner from './components/AiItineraryPlanner';

import { api } from './services/api';
import { INITIAL_FLIGHTS, INITIAL_NOTIFICATIONS } from './data/mockFlights';
import { Bot } from 'lucide-react';

export default function App() {
  const getInitialRoute = () => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (['auth', 'admin', 'admin-login', 'explore', 'status', 'map', 'trips', 'ai', 'hotels', 'itinerary'].includes(hash)) {
        return hash;
      }
      if (hash === 'login' || hash === 'register') {
        return 'auth';
      }
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (['auth', 'admin', 'admin-login'].includes(path)) {
        return path;
      }
    } catch {
      // ignore
    }
    return 'search';
  };

  // Navigation tab: 'search', 'explore', 'status', 'map', 'trips', 'ai', 'hotels', 'itinerary', 'login', 'register', 'admin'
  const [activeTab, setActiveTab] = useState(getInitialRoute);

  const navigateTo = (route) => {
    setActiveTab(route);
    if (route === 'search') {
      window.location.hash = '';
    } else {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (hash && ['auth', 'login', 'register', 'admin', 'admin-login', 'explore', 'status', 'map', 'trips', 'ai', 'hotels', 'itinerary'].includes(hash)) {
        setActiveTab(hash === 'login' || hash === 'register' ? 'auth' : hash);
      } else if (!hash) {
        setActiveTab('search');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Currency & Language
  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('EN');

  // Search Parameters
  const [searchParams, setSearchParams] = useState({
    origin: 'DEL',
    destination: 'BOM',
    departureDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    returnDate: '',
    passengers: 1,
    cabinClass: 'All'
  });

  // Data states
  const [flights, setFlights] = useState([]);
  const [flexibleDates, setFlexibleDates] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // User Profile & Authentication State (Defaults to null if unauthenticated)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('smf_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Wishlist / Saved Flights State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('smf_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('smf_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Modal Visibility States
  const [selectedFlightForBooking, setSelectedFlightForBooking] = useState(null); // Seat Map Modal in Booking flow
  const [isCabinExplorerOpen, setIsCabinExplorerOpen] = useState(false);          // 3D Cabin Explorer Preview Mode
  const [checkoutBookingDetails, setCheckoutBookingDetails] = useState(null);     // Checkout Modal
  const [confirmedETicket, setConfirmedETicket] = useState(null);                 // E-Ticket Modal
  const [rulesModalFlight, setRulesModalFlight] = useState(null);                 // Fare Rules Modal
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);              // Price Alert Modal
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);                      // Floating AI Chatbot
  const [isProfileOpen, setIsProfileOpen] = useState(false);                      // User Profile Modal
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);                    // Wishlist Drawer
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);          // Notifications Panel
  const [isHelpDeskOpen, setIsHelpDeskOpen] = useState(false);                    // Help Desk Modal
  const [isRefundTrackerOpen, setIsRefundTrackerOpen] = useState(false);          // Direct Refund Tracker Modal
  const [refundTrackerData, setRefundTrackerData] = useState(null);               // Specific PNR refund payload
  const [isFeatureLauncherOpen, setIsFeatureLauncherOpen] = useState(false);      // Universal Command Palette (Ctrl+K)

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K to open Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsFeatureLauncherOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Persist Wishlist
  useEffect(() => {
    try {
      localStorage.setItem('smf_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Persist Notifications
  useEffect(() => {
    try {
      localStorage.setItem('smf_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Could not save notifications to localStorage', e);
    }
  }, [notifications]);

  // Persist User
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('smf_user', JSON.stringify(currentUser));
      }
    } catch (e) {
      console.warn('Could not save user to localStorage', e);
    }
  }, [currentUser]);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [flightsData, flexData, tripsData] = await Promise.all([
        api.searchFlights(searchParams.origin, searchParams.destination, searchParams.cabinClass),
        api.getFlexibleDates(searchParams.origin, searchParams.destination, searchParams.departureDate),
        api.getMyTrips()
      ]);
      setFlights(flightsData && flightsData.length > 0 ? flightsData : INITIAL_FLIGHTS);
      setFlexibleDates(flexData);
      setBookings(tripsData);
    } catch (err) {
      console.error('Failed to fetch flight data:', err);
      setFlights(INITIAL_FLIGHTS);
    } finally {
      setLoading(false);
    }
  }, [searchParams.origin, searchParams.destination, searchParams.cabinClass, searchParams.departureDate]);

  // Initial Load
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Trigger search with current params
  const handleSearch = async () => {
    setLoading(true);
    try {
      const [flightsData, flexData] = await Promise.all([
        api.searchFlights(searchParams.origin, searchParams.destination, searchParams.cabinClass),
        api.getFlexibleDates(searchParams.origin, searchParams.destination, searchParams.departureDate)
      ]);
      setFlights(flightsData && flightsData.length > 0 ? flightsData : await api.searchFlights());
      setFlexibleDates(flexData);
      setActiveTab('search');
      setTimeout(() => {
        document.getElementById('flight-results-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Quick Prompt search (from hero chips, destinations, route map, or footer)
  const handleQuickPrompt = async (origin, destination) => {
    setSearchParams(prev => ({ ...prev, origin, destination }));
    setLoading(true);
    try {
      const [flightsData, flexData] = await Promise.all([
        api.searchFlights(origin, destination, searchParams.cabinClass),
        api.getFlexibleDates(origin, destination, searchParams.departureDate)
      ]);
      setFlights(flightsData && flightsData.length > 0 ? flightsData : await api.searchFlights());
      setFlexibleDates(flexData);
      setActiveTab('search');
      setTimeout(() => {
        document.getElementById('flight-results-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Quick prompt error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Select flexible date
  const handleSelectFlexibleDate = async (newDate) => {
    setSearchParams(prev => ({ ...prev, departureDate: newDate }));
    setLoading(true);
    try {
      const flightsData = await api.searchFlights(searchParams.origin, searchParams.destination, searchParams.cabinClass);
      setFlights(flightsData);
    } finally {
      setLoading(false);
    }
  };

  // Feature Hub Direct Action Picker Handler
  const handleSelectFeatureHub = (featureId) => {
    switch (featureId) {
      case 'search':
        navigateTo('search');
        setTimeout(() => {
          document.getElementById('hero-search-flights-btn')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        break;
      case 'hotels':
        navigateTo('hotels');
        break;
      case 'itinerary':
        navigateTo('itinerary');
        break;
      case 'status':
        navigateTo('status');
        break;
      case 'refund':
        setIsRefundTrackerOpen(true);
        break;
      case 'ai':
        navigateTo('ai');
        break;
      case 'cabin':
        setIsCabinExplorerOpen(true);
        break;
      case 'alerts':
        setIsAlertsModalOpen(true);
        break;
      case 'trips':
        navigateTo('trips');
        break;
      case 'deals':
        navigateTo('search');
        setTimeout(() => {
          document.getElementById('deals-section-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
        break;
      case 'map':
        navigateTo('map');
        break;
      case 'explore':
        navigateTo('explore');
        break;
      case 'support':
        setIsHelpDeskOpen(true);
        break;
      default:
        navigateTo('search');
    }
  };

  // Hotel Booking Success Handler
  const handleHotelBookingSuccess = (hotelBooking) => {
    setBookings(prev => [hotelBooking, ...prev]);
    setNotifications(prev => [
      {
        id: Date.now(),
        type: 'booking',
        title: `Hotel Confirmed: ${hotelBooking.hotelName}`,
        message: `Voucher #${hotelBooking.voucherCode} issued for ${hotelBooking.destinationCity}. Check-in: ${hotelBooking.checkInDate}. Total: ₹${hotelBooking.totalPrice?.toLocaleString()}.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };



  // Bundled TripCraft Itinerary Booking Handler
  const handleBundleBookingSuccess = (bundleBooking) => {
    setBookings(prev => [bundleBooking, ...prev]);
    setNotifications(prev => [
      {
        id: Date.now(),
        type: 'booking',
        title: `TripCraft Bundle Confirmed: ${bundleBooking.destination}`,
        message: `${bundleBooking.duration} package with flight ${bundleBooking.flightNumber} and ${bundleBooking.hotelName} locked in.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  // Wishlist Toggle
  const handleToggleWishlist = (flight) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === flight.id);
      if (exists) {
        return prev.filter(item => item.id !== flight.id);
      } else {
        // Add new notification
        setNotifications(curr => [
          {
            id: Date.now(),
            type: 'price',
            title: `Flight Saved: ${flight.airlineName} (${flight.flightNumber})`,
            message: `${flight.originCode} ➔ ${flight.destinationCode} saved to your wishlist.`,
            time: 'Just now',
            read: false
          },
          ...curr
        ]);
        return [...prev, flight];
      }
    });
  };

  const handleRemoveFromWishlist = (flightId) => {
    setWishlist(prev => prev.filter(f => f.id !== flightId));
  };

  // Notifications
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Booking Flow: Step 1: Open Seat Map Modal
  const handleSelectFlight = (flight) => {
    setSelectedFlightForBooking(flight);
  };

  // Booking Flow: Step 2: Proceed from Seat Map to Checkout Modal
  const handleProceedToCheckout = (details) => {
    setSelectedFlightForBooking(null);
    setIsCabinExplorerOpen(false);
    setCheckoutBookingDetails(details);
  };

  // Booking Flow: Step 3: Confirm Booking and Issue E-Ticket
  const handleBookingSuccess = async (bookingPayload) => {
    try {
      const confirmed = await api.createBooking(bookingPayload);
      setCheckoutBookingDetails(null);
      setConfirmedETicket(confirmed);
      
      // Add confirmation notification with Email and SMS dispatch confirmation
      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'booking',
          title: `Booking Confirmed: PNR ${confirmed.pnr}`,
          message: `${confirmed.flight?.originCode || searchParams.origin} ➔ ${confirmed.flight?.destinationCode || searchParams.destination}. 📧 E-Ticket & Tax Invoice PDF emailed to ${currentUser?.email || 'rahul.sharma@gmail.com'}. 📱 SMS sent to ${currentUser?.phone || '+91 98765 43210'}. Gate B14, Terminal T3.`,
          time: 'Just now',
          read: false
        },
        ...prev
      ]);

      // Refresh trips
      const updatedTrips = await api.getMyTrips();
      setBookings(updatedTrips);
    } catch (err) {
      console.error('Booking creation error:', err);
    }
  };

  // Refresh trips list after cancellation or update
  const refreshBookings = async () => {
    const updated = await api.getMyTrips();
    setBookings(updated);
  };

  // Launch Refund Tracker for specific PNR
  const handleOpenRefundTracker = (pnr, refundAmount) => {
    setRefundTrackerData({ pnr, refundAmount });
    setIsRefundTrackerOpen(true);
  };

  // Dedicated Auth Handlers
  const handleAuthSuccess = (user, isAdmin) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('smf_user', JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    setNotifications(prev => [
      {
        id: Date.now(),
        type: 'booking',
        title: `Welcome, ${user.name}!`,
        message: (isAdmin || user?.role === 'ROLE_ADMIN')
          ? 'Admin Operations Console unlocked with executive privileges.'
          : 'Logged in successfully. Frequent Flyer tier benefits active.',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    if (isAdmin || user?.role === 'ROLE_ADMIN') {
      navigateTo('admin');
    } else {
      navigateTo('search');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('smf_user');
    } catch (e) {
      console.warn(e);
    }
    setCurrentUser(null);
    navigateTo('auth');
  };

  const handleUpdateUser = (updatedData) => {
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // 1. Dedicated Separate Admin Login View
  if (activeTab === 'admin-login') {
    return (
      <AdminLoginPage
        onAdminLoginSuccess={(adminUser) => {
          handleAuthSuccess(adminUser, true);
        }}
        onNavigateToCustomerLogin={() => navigateTo('search')}
      />
    );
  }

  // 2. Separate Full-Page Admin Dashboard View
  if (activeTab === 'admin') {
    if (!currentUser || currentUser.role !== 'ROLE_ADMIN') {
      return (
        <AdminLoginPage
          onAdminLoginSuccess={(adminUser) => {
            handleAuthSuccess(adminUser, true);
          }}
          onNavigateToCustomerLogin={() => navigateTo('search')}
        />
      );
    }
    return (
      <AdminDashboard
        currentUser={currentUser}
        onExitToPortal={() => navigateTo('search')}
        onLogout={() => {
          try {
            localStorage.removeItem('smf_user');
          } catch {
            // ignore
          }
          setCurrentUser(null);
          navigateTo('admin-login');
        }}
      />
    );
  }

  // 3. Customer Authentication (Unified Sign In & Register)
  if (activeTab === 'auth' || activeTab === 'login' || activeTab === 'register') {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        onNavigateToHome={() => navigateTo('search')}
        onNavigateToAdmin={() => navigateTo('admin-login')}
        initialMode={activeTab === 'register' ? 'register' : 'login'}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Real-Time Operations & Flight Telemetry Ticker */}
      <RealTimeTicker onOpenFeature={handleSelectFeatureHub} />

      {/* 2. Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateTo}
        myTripsCount={bookings.filter(b => b.status !== 'CANCELLED').length}
        wishlistCount={wishlist.length}
        unreadNotificationsCount={unreadNotificationsCount}
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        currentUser={currentUser}
        onOpenAlerts={() => setIsAlertsModalOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(prev => !prev)}
        onOpenHelpDesk={() => setIsHelpDeskOpen(true)}
        onOpenRefundTracker={() => {
          setRefundTrackerData(null);
          setIsRefundTrackerOpen(true);
        }}
        onOpenFeatureLauncher={() => setIsFeatureLauncherOpen(true)}
        onOpenAuth={() => navigateTo('auth')}
        onOpenAdmin={() => navigateTo(currentUser?.role === 'ROLE_ADMIN' ? 'admin' : 'admin-login')}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
      />

      {/* Notifications Floating Dropdown */}
      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
      />

      {/* Universal Command Palette (Ctrl+K) */}
      <FeatureLauncher
        isOpen={isFeatureLauncherOpen}
        onClose={() => setIsFeatureLauncherOpen(false)}
        onSelectFeature={handleSelectFeatureHub}
        onQuickPrompt={handleQuickPrompt}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* TAB 1: Search & Flights View */}
        {activeTab === 'search' && (
          <>
            {/* Feature 1: Smart Flight Search (One-way, Round-trip, Multi-city) */}
            <HeroSearch
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onSearch={handleSearch}
              currency={currency}
              onQuickPrompt={handleQuickPrompt}
              loading={loading}
            />

            {/* 3. Prominent Traveler Feature Hub & Quick Action Dock */}
            <FeatureHub
              onSelectFeature={handleSelectFeatureHub}
              activeFeatureId="search"
            />

            {/* Scroll Target Anchor */}
            <div id="flight-results-anchor" style={{ scrollMarginTop: 80, height: 1 }} />

            {/* Feature 4: Flexible Date Search Grid */}
            <FlexibleDateGrid
              flexibleDates={flexibleDates}
              selectedDate={searchParams.departureDate}
              onSelectDate={handleSelectFlexibleDate}
              currency={currency}
            />

            {/* Features 2, 5 & 7: Flight Comparison, Filters, Sorting & Baggage */}
            <FlightList
              flights={flights}
              currency={currency}
              onSelectFlight={handleSelectFlight}
              onViewRules={(flight) => setRulesModalFlight(flight)}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />

            {/* Pillar 3: Nearby Alternative Airport Recommendations */}
            <NearbyAirports
              currentOrigin={searchParams.origin}
              currency={currency}
              onSelectAirport={(airportCode) => handleQuickPrompt(airportCode, searchParams.destination)}
            />

            {/* Pillar 1 & 4: Exclusive Airline Offers & Promo Codes */}
            <div id="deals-section-anchor">
              <OffersDeals
                onApplyCode={(code) => {
                  setNotifications(prev => [
                    {
                      id: Date.now(),
                      type: 'price',
                      title: `Promo Code Applied: ${code}`,
                      message: `Voucher ${code} copied to clipboard and activated for your next flight checkout.`,
                      time: 'Just now',
                      read: false
                    },
                    ...prev
                  ]);
                }}
              />
            </div>

            {/* Pillar 2 & 4: AI Personalized Route Recommendations */}
            <PersonalizedRecommendations
              user={currentUser}
              currency={currency}
              onSelectRoute={(origin, destination) => handleQuickPrompt(origin, destination)}
            />
          </>
        )}

        {/* TAB: Hotel Booking Portal */}
        {activeTab === 'hotels' && (
          <div style={{ maxWidth: 1400, margin: '24px auto 60px auto', padding: '0 24px' }}>
            <HotelBookingPortal
              currency={currency}
              onClose={() => navigateTo('search')}
              onBookingSuccess={handleHotelBookingSuccess}
            />
          </div>
        )}

        {/* TAB: AI Itinerary Planner (SkyGenie TripCraft) */}
        {activeTab === 'itinerary' && (
          <div style={{ maxWidth: 1400, margin: '24px auto 60px auto', padding: '0 24px' }}>
            <AiItineraryPlanner
              currency={currency}
              onNavigateToHotels={() => navigateTo('hotels')}
              onNavigateToFlights={() => navigateTo('search')}
              onBookBundledTrip={handleBundleBookingSuccess}
            />
          </div>
        )}

        {/* TAB 2: Explore Destinations */}
        {activeTab === 'explore' && (
          <ExploreDestinations
            currency={currency}
            onSelectDestination={(destCode) => handleQuickPrompt(searchParams.origin, destCode)}
          />
        )}

        {/* TAB 3: Real-Time Flight Status Tracker */}
        {activeTab === 'status' && (
          <FlightStatusTracker />
        )}

        {/* TAB 4: Interactive Global Flight Map */}
        {activeTab === 'map' && (
          <InteractiveFlightMap
            onSelectRoute={(from, to) => handleQuickPrompt(from, to)}
          />
        )}

        {/* TAB 5: My Trips & Travel Dashboard */}
        {activeTab === 'trips' && (
          <MyTripsDashboard
            bookings={bookings}
            currency={currency}
            onRefreshBookings={refreshBookings}
            onViewETicket={(booking) => setConfirmedETicket(booking)}
            onBookFlight={() => setActiveTab('search')}
            onTrackRefund={handleOpenRefundTracker}
          />
        )}

        {/* TAB 6: AI Assistant Full-Page View */}
        {activeTab === 'ai' && (
          <div style={{
            maxWidth: 960,
            margin: '24px auto 80px auto',
            padding: '36px 28px 48px 28px',
            borderRadius: 24,
            background: "linear-gradient(135deg, rgba(9, 15, 29, 0.88), rgba(15, 23, 42, 0.94)), url('/assets/images/ai_tripcraft_hero.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(192, 132, 252, 0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>
                🤖 SkyGenie AI Travel Concierge
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 15, marginTop: 4 }}>
                Ask our neural engine for budget trips under ₹15,000, shortest flight durations, or Dubai getaways.
              </p>
            </div>
            <div style={{ height: 640, position: 'relative' }}>
              <AiChatbot
                isOpen={true}
                onClose={() => setActiveTab('search')}
                onSelectFlight={(flight) => {
                  setSelectedFlightForBooking(flight);
                  setActiveTab('search');
                }}
                currency={currency}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating SkyGenie AI Button (when not on 'ai' tab) */}
      {activeTab !== 'ai' && !isChatbotOpen && (
        <button
          type="button"
          onClick={() => setIsChatbotOpen(true)}
          style={{
            position: 'fixed',
            bottom: 'clamp(16px, 3vw, 24px)',
            right: 'clamp(14px, 3vw, 24px)',
            background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
            border: 'none',
            borderRadius: 30,
            padding: '10px 18px',
            color: '#fff',
            fontWeight: 800,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 10px 30px rgba(0, 210, 255, 0.45), 0 0 20px rgba(0, 210, 255, 0.3)',
            cursor: 'pointer',
            zIndex: 800,
            transition: 'transform 0.2s',
            backdropFilter: 'blur(8px)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Bot size={18} />
          <span>Ask SkyGenie AI</span>
          <span className="live-dot" />
        </button>
      )}

      {/* Floating AI Chatbot Modal */}
      {activeTab !== 'ai' && (
        <AiChatbot
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
          onSelectFlight={(flight) => {
            setSelectedFlightForBooking(flight);
            setIsChatbotOpen(false);
          }}
          currency={currency}
        />
      )}

      {/* Modals & Drawers */}
      {/* 1. Seat Selection in Booking Flow */}
      {selectedFlightForBooking && (
        <SeatMapModal
          flight={selectedFlightForBooking}
          currency={currency}
          initialPassengerCount={searchParams?.passengers || 1}
          onClose={() => setSelectedFlightForBooking(null)}
          onProceedToCheckout={handleProceedToCheckout}
          isPreviewMode={false}
        />
      )}

      {/* 2. Standalone 3D Cabin Explorer Preview Mode */}
      {isCabinExplorerOpen && (
        <SeatMapModal
          flight={flights[0] || INITIAL_FLIGHTS[0]}
          currency={currency}
          initialPassengerCount={searchParams?.passengers || 1}
          onClose={() => setIsCabinExplorerOpen(false)}
          onProceedToCheckout={handleProceedToCheckout}
          isPreviewMode={true}
        />
      )}

      {/* 3. Checkout Modal */}
      {checkoutBookingDetails && (
        <CheckoutModal
          bookingDetails={checkoutBookingDetails}
          currency={currency}
          onClose={() => setCheckoutBookingDetails(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* 4. Electronic Ticket / Boarding Pass Modal */}
      {confirmedETicket && (
        <ETicketModal
          booking={confirmedETicket}
          currency={currency}
          onClose={() => setConfirmedETicket(null)}
          onViewMyTrips={() => {
            setConfirmedETicket(null);
            setActiveTab('trips');
          }}
        />
      )}

      {/* 5. Route Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        currentOrigin={searchParams.origin}
        currentDestination={searchParams.destination}
        currency={currency}
      />

      {/* 6. Fare Rules & Baggage Modal */}
      <FareRulesModal
        flight={rulesModalFlight}
        currency={currency}
        onClose={() => setRulesModalFlight(null)}
      />

      {/* 7. User Profile & Preferences Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        user={currentUser}
        onClose={() => setIsProfileOpen(false)}
        onUpdateUser={handleUpdateUser}
        onSwitchAccount={() => {
          setIsProfileOpen(false);
          navigateTo('auth');
        }}
      />

      {/* 8. Wishlist / Saved Flights Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        wishlist={wishlist}
        onClose={() => setIsWishlistOpen(false)}
        onRemove={handleRemoveFromWishlist}
        onSelectFlight={(flight) => {
          setIsWishlistOpen(false);
          handleSelectFlight(flight);
        }}
        currency={currency}
      />

      {/* 9. Live Direct PNR Refund Status Tracker Modal */}
      {isRefundTrackerOpen && (
        <RefundTrackerModal
          isOpen={isRefundTrackerOpen}
          onClose={() => {
            setIsRefundTrackerOpen(false);
            setRefundTrackerData(null);
          }}
          pnr={refundTrackerData?.pnr || ''}
          refundAmount={refundTrackerData?.refundAmount || null}
          currency={currency}
        />
      )}

      {/* 10. Customer Support Help Desk Modal */}
      <HelpDeskModal
        isOpen={isHelpDeskOpen}
        onClose={() => setIsHelpDeskOpen(false)}
        onOpenAiChat={() => {
          setIsHelpDeskOpen(false);
          setActiveTab('ai');
        }}
      />

      {/* Footer */}
      <Footer onQuickPrompt={handleQuickPrompt} onNavigate={navigateTo} />
    </div>
  );
}
