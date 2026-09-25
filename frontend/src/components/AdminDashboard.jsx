import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Search, 
  Shield, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  Luggage, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  X, 
  Check, 
  Mail, 
  Phone, 
  Award, 
  Plane, 
  KeyRound, 
  Filter, 
  Tag, 
  Heart,
  Lock
} from 'lucide-react';
import { INITIAL_BOOKINGS } from '../data/mockFlights';

const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+91 98765 43210',
    tier: 'Gold Elite',
    loyaltyPoints: 12450,
    status: 'Active',
    joinedDate: '2025-11-14',
    homeAirport: 'DEL (New Delhi)',
    seatPreference: '04A (Window / Extra Legroom)',
    mealPreference: 'Royal Rajasthani Thali (Veg)',
    bookingsCount: 6,
    totalSpent: 38400,
    recentPnr: 'SMF-9021'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    phone: '+91 98123 45678',
    tier: 'Platinum VIP',
    loyaltyPoints: 24800,
    status: 'Active',
    joinedDate: '2025-08-20',
    homeAirport: 'BOM (Mumbai)',
    seatPreference: '02C (Aisle / Business)',
    mealPreference: 'Gourmet Herb Grilled Chicken',
    bookingsCount: 9,
    totalSpent: 72900,
    recentPnr: 'SMF-4412'
  },
  {
    id: 3,
    name: 'Amitabh Sen',
    email: 'amitabh.sen@outlook.com',
    phone: '+91 97654 32109',
    tier: 'Silver Member',
    loyaltyPoints: 4200,
    status: 'Active',
    joinedDate: '2026-01-10',
    homeAirport: 'BLR (Bengaluru)',
    seatPreference: '06F (Window)',
    mealPreference: 'Jain Special Meal',
    bookingsCount: 2,
    totalSpent: 11200,
    recentPnr: 'SMF-7833'
  },
  {
    id: 4,
    name: 'Farheen Sardar',
    email: 'farheen.sardar@selectmyflight.com',
    phone: '+91 99887 76655',
    tier: 'Diamond Executive',
    loyaltyPoints: 48900,
    status: 'Active',
    joinedDate: '2025-05-12',
    homeAirport: 'DEL (New Delhi)',
    seatPreference: '01A (First Class Suite)',
    mealPreference: 'Chef Vegan Special',
    bookingsCount: 14,
    totalSpent: 146000,
    recentPnr: 'SMF-1092'
  },
  {
    id: 5,
    name: 'Vikramaditya Roy',
    email: 'vikram.roy@techcorp.in',
    phone: '+91 98220 11223',
    tier: 'Silver Member',
    loyaltyPoints: 1800,
    status: 'Suspended',
    joinedDate: '2026-03-02',
    homeAirport: 'HYD (Hyderabad)',
    seatPreference: '07D (Aisle)',
    mealPreference: 'Complimentary Snack',
    bookingsCount: 1,
    totalSpent: 4850,
    recentPnr: 'SMF-3321'
  }
];

export default function AdminDashboard({ currentUser, onExitToPortal, onLogout }) {
  // Tabs: 'customers' (CRUD primary), 'bookings' (Passenger Manifest), 'analytics' (Daily Operations)
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('smf_admin_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('smf_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [actionNotice, setActionNotice] = useState(null);

  // Modals
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Add Customer Form State
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    tier: 'Silver Member',
    status: 'Active',
    loyaltyPoints: 1000,
    homeAirport: 'DEL (New Delhi)',
    seatPreference: 'Window',
    mealPreference: 'Vegetarian'
  });

  // Persist Customers
  useEffect(() => {
    try {
      localStorage.setItem('smf_admin_customers', JSON.stringify(customers));
    } catch {
      // ignore
    }
  }, [customers]);

  // Persist Bookings
  useEffect(() => {
    try {
      localStorage.setItem('smf_bookings', JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showNotification = (msg, type = 'success') => {
    setActionNotice({ msg, type });
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  // 1. CREATE CUSTOMER (CRUD: Create)
  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.email) {
      showNotification('Please enter customer name and email.', 'error');
      return;
    }

    const newCustomer = {
      id: Date.now(),
      name: newCustomerForm.name.trim(),
      email: newCustomerForm.email.trim().toLowerCase(),
      phone: newCustomerForm.phone.trim() || '+91 98000 00000',
      tier: newCustomerForm.tier,
      loyaltyPoints: parseInt(newCustomerForm.loyaltyPoints) || 1000,
      status: newCustomerForm.status,
      joinedDate: new Date().toISOString().split('T')[0],
      homeAirport: newCustomerForm.homeAirport,
      seatPreference: newCustomerForm.seatPreference,
      mealPreference: newCustomerForm.mealPreference,
      bookingsCount: 0,
      totalSpent: 0,
      recentPnr: 'N/A'
    };

    setCustomers(prev => [newCustomer, ...prev]);
    showNotification(`Customer ${newCustomer.name} created successfully! Welcome email dispatched.`);
    setShowAddCustomerModal(false);
    setNewCustomerForm({
      name: '',
      email: '',
      phone: '',
      tier: 'Silver Member',
      status: 'Active',
      loyaltyPoints: 1000,
      homeAirport: 'DEL (New Delhi)',
      seatPreference: 'Window',
      mealPreference: 'Vegetarian'
    });
  };

  // 2. UPDATE CUSTOMER (CRUD: Update)
  const handleUpdateCustomer = (e) => {
    e.preventDefault();
    if (!editingCustomer) return;

    setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? editingCustomer : c));
    showNotification(`Customer profile for ${editingCustomer.name} updated successfully!`);
    setEditingCustomer(null);
  };

  // 3. DELETE CUSTOMER (CRUD: Delete)
  const handleDeleteCustomer = (customerId, customerName) => {
    if (!window.confirm(`Are you sure you want to delete customer account for "${customerName}"? This action cannot be undone.`)) {
      return;
    }

    setCustomers(prev => prev.filter(c => c.id !== customerId));
    showNotification(`Customer ${customerName} has been removed from customer database.`);
  };

  // 4. QUICK ACTIONS: Upgrade Tier
  const handleUpgradeTier = (customerId) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const nextTier = c.tier === 'Silver Member' ? 'Gold Elite' : c.tier === 'Gold Elite' ? 'Platinum VIP' : 'Diamond Executive';
        showNotification(`Upgraded ${c.name} to ${nextTier} with +2,500 bonus loyalty miles!`);
        return {
          ...c,
          tier: nextTier,
          loyaltyPoints: c.loyaltyPoints + 2500
        };
      }
      return c;
    }));
  };

  // 5. QUICK ACTIONS: Toggle Status (Active / Suspended)
  const handleToggleStatus = (customerId) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newStatus = c.status === 'Active' ? 'Suspended' : 'Active';
        showNotification(`Customer ${c.name} marked as ${newStatus}.`);
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  // 6. QUICK ACTIONS: Reset Customer OTP / PIN
  const handleResetSecurity = (customerEmail, customerName) => {
    showNotification(`Security OTP reset link generated for ${customerName || 'traveler'} & sent to ${customerEmail} (Demo code: 7890).`);
  };

  // 7. PASSENGER REFUND OVERRIDE
  const handleRefundBookingOverride = (pnr) => {
    if (!window.confirm(`Issue administrative 100% refund override for PNR ${pnr}?`)) {
      return;
    }

    setBookings(prev => prev.map(b => b.pnr === pnr ? { ...b, status: 'CANCELLED_REFUNDED' } : b));
    showNotification(`PNR ${pnr} refund override approved. Funds credited to traveler's bank account.`);
  };

  // Filtered Customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = !searchTerm || 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm) ||
      (c.recentPnr && c.recentPnr.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  // Calculations
  const totalCustomerSpend = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
  const activeCustomersCount = customers.filter(c => c.status === 'Active').length;
  const vipCustomersCount = customers.filter(c => c.tier.includes('Gold') || c.tier.includes('Platinum') || c.tier.includes('Diamond')).length;

  return (
    <div style={{ minHeight: '100vh', background: '#070c18', color: '#f8fafc', paddingBottom: 60 }}>
      {/* Top Operations Header */}
      <header style={{
        background: 'rgba(13, 22, 43, 0.95)',
        borderBottom: '1px solid rgba(245, 175, 25, 0.25)',
        backdropFilter: 'blur(20px)',
        padding: '16px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          {/* Left Brand / Admin Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f5af19 0%, #e65100 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(245, 175, 25, 0.35)'
            }}>
              <Users size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>
                  Customer CRM & Traveler Operations
                </h1>
                <span style={{
                  background: '#f5af19',
                  color: '#000',
                  fontSize: 10,
                  fontWeight: 900,
                  padding: '2px 6px',
                  borderRadius: 4
                }}>
                  ADMIN
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                Customer Directory • Profile Management • Passenger Manifest • Refund Overrides
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => setActiveTab('customers')}
              style={{
                background: activeTab === 'customers' ? 'rgba(245, 175, 25, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'customers' ? '#f5af19' : '#cbd5e1',
                border: activeTab === 'customers' ? '1px solid #f5af19' : '1px solid rgba(255, 255, 255, 0.1)',
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
              <Users size={16} />
              Customer Directory ({customers.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              style={{
                background: activeTab === 'bookings' ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'bookings' ? '#00d2ff' : '#cbd5e1',
                border: activeTab === 'bookings' ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
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
              <Luggage size={16} />
              Passenger Manifest & Refunds ({bookings.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              style={{
                background: activeTab === 'analytics' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'analytics' ? '#00e676' : '#cbd5e1',
                border: activeTab === 'analytics' ? '1px solid #00e676' : '1px solid rgba(255, 255, 255, 0.1)',
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
              <TrendingUp size={16} />
              Daily CRM Insights
            </button>
          </nav>

          {/* Right Clock & Exit Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {currentUser && (
              <div style={{
                background: 'rgba(245, 175, 25, 0.1)',
                border: '1px solid rgba(245, 175, 25, 0.3)',
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: '#f5af19'
              }}>
                👤 {currentUser.name || 'Admin'}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 12 }}>
              <Clock size={14} color="#f5af19" />
              <span>{currentTime}</span>
            </div>

            <button
              type="button"
              onClick={onExitToPortal}
              className="btn-secondary"
              style={{ padding: '7px 14px', fontSize: 12 }}
            >
              <ArrowLeft size={14} /> Exit to Customer Portal
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  padding: '7px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: actionNotice.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 10,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 14,
          fontWeight: 700,
          zIndex: 2000,
          animation: 'slideUp 0.3s ease'
        }}>
          {actionNotice.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{actionNotice.msg}</span>
        </div>
      )}

      {/* Main Container */}
      <main style={{ maxWidth: 1400, margin: '28px auto 0 auto', padding: '0 24px' }}>
        {/* KPI Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 28
        }}>
          <div className="glass-card" style={{ padding: '20px', borderRadius: 12, border: '1px solid rgba(245, 175, 25, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Total Registered Customers</span>
              <Users size={18} color="#f5af19" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 8 }}>
              {customers.length}
            </div>
            <div style={{ fontSize: 11, color: '#00e676', marginTop: 4, fontWeight: 600 }}>
              🟢 {activeCustomersCount} Active Travelers
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderRadius: 12, border: '1px solid rgba(0, 210, 255, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Total Customer Spend</span>
              <DollarSign size={18} color="#00d2ff" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#00d2ff', marginTop: 8 }}>
              ₹{totalCustomerSpend.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>
              Across {customers.reduce((acc, c) => acc + (c.bookingsCount || 0), 0)} completed flight bookings
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderRadius: 12, border: '1px solid rgba(168, 85, 247, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>VIP & Frequent Flyers</span>
              <Award size={18} color="#c084fc" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#c084fc', marginTop: 8 }}>
              {vipCustomersCount} Members
            </div>
            <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>
              Gold Elite, Platinum & Diamond
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderRadius: 12, border: '1px solid rgba(0, 230, 118, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>100% Refund Resolution</span>
              <RefreshCw size={18} color="#00e676" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#00e676', marginTop: 8 }}>
              100% DGCA
            </div>
            <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>
              Automated IMPS / UPI clearance
            </div>
          </div>
        </div>

        {/* TAB 1: CUSTOMER DIRECTORY & CRUD OPERATIONS */}
        {activeTab === 'customers' && (
          <div>
            {/* Action Bar: Search, Filters & ➕ Add Customer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flex: 1 }}>
                {/* Search Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 10,
                  padding: '8px 14px',
                  gap: 8,
                  minWidth: 280
                }}>
                  <Search size={16} color="#f5af19" />
                  <input
                    type="text"
                    placeholder="Search by customer name, email, phone, PNR..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

                {/* Tier Filter */}
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  style={{
                    background: '#0d1629',
                    color: '#f5af19',
                    border: '1px solid rgba(245, 175, 25, 0.3)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <option value="All">All Loyalty Tiers</option>
                  <option value="Silver Member">Silver Member</option>
                  <option value="Gold Elite">Gold Elite</option>
                  <option value="Platinum VIP">Platinum VIP</option>
                  <option value="Diamond Executive">Diamond Executive</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    background: '#0d1629',
                    color: '#cbd5e1',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* ➕ ADD NEW CUSTOMER BUTTON */}
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #f5af19 0%, #e65100 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 15px rgba(245, 175, 25, 0.35)'
                }}
              >
                <UserPlus size={18} />
                ➕ Add New Customer
              </button>
            </div>

            {/* Customers Table / Directory */}
            <div className="glass-card" style={{ borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                  <thead>
                    <tr style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94a3b8',
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      <th style={{ padding: '16px 20px' }}>Customer Profile</th>
                      <th style={{ padding: '16px 20px' }}>Contact Details</th>
                      <th style={{ padding: '16px 20px' }}>Loyalty Tier & Miles</th>
                      <th style={{ padding: '16px 20px' }}>Travel Preferences</th>
                      <th style={{ padding: '16px 20px' }}>Bookings & Spend</th>
                      <th style={{ padding: '16px 20px' }}>Status</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>CRUD Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                          No customer profiles match your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((cust) => (
                        <tr
                          key={cust.id}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {/* Profile */}
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                width: 38,
                                height: 38,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: 14,
                                color: '#fff',
                                flexShrink: 0
                              }}>
                                {cust.name[0]}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{cust.name}</div>
                                <div style={{ fontSize: 11, color: '#64748b' }}>Joined {cust.joinedDate}</div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
                              <Mail size={13} color="#00d2ff" />
                              <span>{cust.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                              <Phone size={13} color="#00e676" />
                              <span>{cust.phone}</span>
                            </div>
                          </td>

                          {/* Loyalty Tier */}
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              background: cust.tier.includes('Diamond') ? 'rgba(245, 175, 25, 0.2)' : cust.tier.includes('Platinum') ? 'rgba(168, 85, 247, 0.2)' : cust.tier.includes('Gold') ? 'rgba(245, 175, 25, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                              color: cust.tier.includes('Diamond') ? '#f5af19' : cust.tier.includes('Platinum') ? '#c084fc' : cust.tier.includes('Gold') ? '#f5af19' : '#cbd5e1',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              fontSize: 11,
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: 6,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}>
                              <Award size={12} />
                              {cust.tier}
                            </span>
                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                              <strong>{cust.loyaltyPoints.toLocaleString()}</strong> miles
                            </div>
                          </td>

                          {/* Preferences */}
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontSize: 12, color: '#fff' }}>💺 {cust.seatPreference}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>🍱 {cust.mealPreference}</div>
                          </td>

                          {/* Bookings & Total Spent */}
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#00e676' }}>
                              ₹{cust.totalSpent.toLocaleString()}
                            </div>
                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                              {cust.bookingsCount} trips • PNR: <strong style={{ color: '#00d2ff' }}>{cust.recentPnr}</strong>
                            </div>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '16px 20px' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(cust.id)}
                              style={{
                                background: cust.status === 'Active' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: cust.status === 'Active' ? '#00e676' : '#f87171',
                                border: cust.status === 'Active' ? '1px solid rgba(0, 230, 118, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                                padding: '3px 8px',
                                borderRadius: 12,
                                fontSize: 11,
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                              title="Click to toggle Active / Suspended"
                            >
                              {cust.status === 'Active' ? '🟢 Active' : '🔴 Suspended'}
                            </button>
                          </td>

                          {/* CRUD Actions */}
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                              {/* Upgrade Tier */}
                              <button
                                type="button"
                                onClick={() => handleUpgradeTier(cust.id)}
                                title="Upgrade Loyalty Tier (+2500 miles)"
                                style={{
                                  background: 'rgba(245, 175, 25, 0.1)',
                                  border: '1px solid rgba(245, 175, 25, 0.3)',
                                  color: '#f5af19',
                                  padding: '6px 8px',
                                  borderRadius: 6,
                                  cursor: 'pointer'
                                }}
                              >
                                <Award size={14} />
                              </button>

                              {/* Reset PIN / OTP */}
                              <button
                                type="button"
                                onClick={() => handleResetSecurity(cust.email, cust.name)}
                                title="Generate & Send Security OTP (7890)"
                                style={{
                                  background: 'rgba(0, 210, 255, 0.1)',
                                  border: '1px solid rgba(0, 210, 255, 0.3)',
                                  color: '#00d2ff',
                                  padding: '6px 8px',
                                  borderRadius: 6,
                                  cursor: 'pointer'
                                }}
                              >
                                <KeyRound size={14} />
                              </button>

                              {/* Edit Profile */}
                              <button
                                type="button"
                                onClick={() => setEditingCustomer(cust)}
                                title="Edit Customer Profile & Preferences"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.08)',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  color: '#fff',
                                  padding: '6px 8px',
                                  borderRadius: 6,
                                  cursor: 'pointer'
                                }}
                              >
                                <Edit3 size={14} />
                              </button>

                              {/* Delete Customer */}
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                                title="Delete Customer Account"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#f87171',
                                  padding: '6px 8px',
                                  borderRadius: 6,
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PASSENGER MANIFEST & REFUND OVERRIDES */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                  Passenger Flight Manifest & Ticket Overrides
                </h3>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>
                  Manage customer reservations, seat assignments, and process immediate 100% administrative refund overrides.
                </p>
              </div>
            </div>

            <div className="glass-card" style={{ borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                  <thead>
                    <tr style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94a3b8',
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      <th style={{ padding: '16px 20px' }}>PNR & Route</th>
                      <th style={{ padding: '16px 20px' }}>Passenger Name</th>
                      <th style={{ padding: '16px 20px' }}>Seat & Cabin</th>
                      <th style={{ padding: '16px 20px' }}>Travel Date</th>
                      <th style={{ padding: '16px 20px' }}>Amount Paid</th>
                      <th style={{ padding: '16px 20px' }}>Booking Status</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>Admin Overrides</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id || b.pnr} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, color: '#00d2ff' }}>{b.pnr}</div>
                          <div style={{ fontSize: 12, color: '#fff' }}>
                            {b.flight?.originCode || 'DEL'} ➔ {b.flight?.destinationCode || 'BOM'} ({b.flight?.flightNumber || '6E-2041'})
                          </div>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{b.passengerName || 'Rahul Sharma'}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{b.passengerEmail || 'rahul.sharma@gmail.com'}</div>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ color: '#fff', fontWeight: 700 }}>Seat {b.seatNumber || '04A'}</div>
                          <div style={{ fontSize: 11, color: '#f5af19' }}>{b.cabinClass || 'Economy (Window)'}</div>
                        </td>

                        <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>
                          {b.travelDate || '2026-10-05'}
                        </td>

                        <td style={{ padding: '16px 20px', fontWeight: 800, color: '#00e676' }}>
                          ₹{(b.totalPrice || 5300).toLocaleString()}
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            background: b.status === 'CANCELLED_REFUNDED' ? 'rgba(245, 175, 25, 0.2)' : b.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 230, 118, 0.2)',
                            color: b.status === 'CANCELLED_REFUNDED' ? '#f5af19' : b.status === 'CANCELLED' ? '#f87171' : '#00e676',
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 800
                          }}>
                            {b.status === 'CANCELLED_REFUNDED' ? 'REFUNDED 100%' : b.status || 'CONFIRMED'}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          {b.status !== 'CANCELLED_REFUNDED' && (
                            <button
                              type="button"
                              onClick={() => handleRefundBookingOverride(b.pnr)}
                              style={{
                                background: 'rgba(245, 175, 25, 0.15)',
                                border: '1px solid #f5af19',
                                color: '#f5af19',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              🔄 100% Refund Override
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DAILY CRM INSIGHTS */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
            <div className="glass-card" style={{ padding: '24px', borderRadius: 14 }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
                🏆 Top Customer Lifetime Value (CLV)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {customers.slice(0, 4).map((c, i) => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#f5af19', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11 }}>
                        #{i + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.tier} • {c.bookingsCount} trips</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#00e676', fontSize: 15 }}>
                      ₹{c.totalSpent.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', borderRadius: 14 }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
                ⚡ Customer Support & Refund Compliance
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span>DGCA Refund Settlement Timeline:</span>
                  <strong style={{ color: '#00e676' }}>Within 24 Hours (IMPS NACH)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span>Customer Satisfaction (CSAT):</span>
                  <strong style={{ color: '#00d2ff' }}>98.4% (Gold Tier Rating)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span>Loyalty Miles Redeemed This Month:</span>
                  <strong style={{ color: '#f5af19' }}>142,500 Miles</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
                  <span>Security Gateway Status:</span>
                  <strong style={{ color: '#00e676' }}>🟢 OTP & 2FA Enforced</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD NEW CUSTOMER (CRUD: Create) */}
      {showAddCustomerModal && (
        <div className="modal-overlay" onClick={() => setShowAddCustomerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: 'rgba(245, 175, 25, 0.2)', color: '#f5af19', padding: 8, borderRadius: 8 }}>
                  <UserPlus size={20} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                  Add New Customer Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Full Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Roy"
                    value={newCustomerForm.name}
                    onChange={(e) => setNewCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. vikram.roy@gmail.com"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Loyalty Tier
                  </label>
                  <select
                    value={newCustomerForm.tier}
                    onChange={(e) => setNewCustomerForm(prev => ({ ...prev, tier: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', background: '#0d1629', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#f5af19', fontSize: 13, fontWeight: 700, outline: 'none' }}
                  >
                    <option value="Silver Member">Silver Member</option>
                    <option value="Gold Elite">Gold Elite</option>
                    <option value="Platinum VIP">Platinum VIP</option>
                    <option value="Diamond Executive">Diamond Executive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Seat Preference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Window (04A)"
                    value={newCustomerForm.seatPreference}
                    onChange={(e) => setNewCustomerForm(prev => ({ ...prev, seatPreference: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Meal Preference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Rajasthani Veg"
                    value={newCustomerForm.mealPreference}
                    onChange={(e) => setNewCustomerForm(prev => ({ ...prev, mealPreference: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: 14, fontWeight: 800 }}
              >
                Save & Deploy Customer Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CUSTOMER (CRUD: Update) */}
      {editingCustomer && (
        <div className="modal-overlay" onClick={() => setEditingCustomer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: 'rgba(0, 210, 255, 0.2)', color: '#00d2ff', padding: 8, borderRadius: 8 }}>
                  <Edit3 size={20} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                  Edit Customer Profile: {editingCustomer.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Loyalty Tier
                  </label>
                  <select
                    value={editingCustomer.tier}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, tier: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#0d1629', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#f5af19', fontSize: 13, fontWeight: 700, outline: 'none' }}
                  >
                    <option value="Silver Member">Silver Member</option>
                    <option value="Gold Elite">Gold Elite</option>
                    <option value="Platinum VIP">Platinum VIP</option>
                    <option value="Diamond Executive">Diamond Executive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Seat Preference
                  </label>
                  <input
                    type="text"
                    value={editingCustomer.seatPreference}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, seatPreference: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    Meal Preference
                  </label>
                  <input
                    type="text"
                    value={editingCustomer.mealPreference}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, mealPreference: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: 14, fontWeight: 800 }}
              >
                Update Customer Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
