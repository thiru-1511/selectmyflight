import React, { useState } from 'react';
import { X, Headphones, HelpCircle, Send, CheckCircle2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I cancel my booking and get a refund?',
    a: 'Go to "My Trips" in the top navigation bar, locate your confirmed flight, and click "Cancel Trip". Your refund is calculated automatically and credited within 3-5 business days.'
  },
  {
    q: 'Can I change my travel dates after booking?',
    a: 'Yes, date changes are permitted up to 24 hours prior to departure for a nominal fee of ₹1,000 plus any fare difference between the flights.'
  },
  {
    q: 'What is the free baggage allowance included with my ticket?',
    a: 'Standard Economy fares include 1 cabin bag up to 7 kg free, plus 15 kg to 25 kg of checked luggage depending on the airline carrier.'
  },
  {
    q: 'How do I access my Digital Boarding Pass?',
    a: 'Your boarding pass is generated immediately after payment. You can also view and print it anytime from the "My Trips" dashboard.'
  }
];

export default function HelpDeskModal({ isOpen, onClose, onOpenAiChat }) {
  const [activeTab, setActiveTab] = useState('faq'); // 'faq' or 'ticket'
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Ticket Form
  const [ticketData, setTicketData] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    pnr: '',
    category: 'Booking & E-Ticket',
    message: ''
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(null);

  if (!isOpen) return null;

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const ticketId = 'TICK-' + Math.floor(10000 + Math.random() * 90000);
    setTicketSubmitted(ticketId);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(0, 210, 255, 0.15)', color: '#00d2ff', padding: 8, borderRadius: 8 }}>
              <Headphones size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                24/7 Customer Support & Help Desk
              </h3>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                Instant answers & dedicated airline resolution team
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
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

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <button
            onClick={() => setActiveTab('faq')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: activeTab === 'faq' ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
              color: activeTab === 'faq' ? '#00d2ff' : '#94a3b8',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            Frequently Asked Questions
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: activeTab === 'ticket' ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
              color: activeTab === 'ticket' ? '#00d2ff' : '#94a3b8',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            Submit Support Ticket
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {activeTab === 'faq' ? (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {FAQS.map((item, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 10,
                        overflow: 'hidden'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          background: 'none',
                          border: 'none',
                          color: '#fff',
                          fontSize: 14,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <span>{item.q}</span>
                        {isOpen ? <ChevronUp size={16} color="#00d2ff" /> : <ChevronDown size={16} color="#94a3b8" />}
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 14px 16px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* SkyGenie Quick Escalate */}
              <div style={{
                marginTop: 24,
                background: 'rgba(0, 210, 255, 0.08)',
                border: '1px solid rgba(0, 210, 255, 0.25)',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ fontSize: 13, color: '#fff' }}>
                  Need an answer immediately? Chat live with <strong>SkyGenie AI</strong>!
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAiChat();
                  }}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: 12 }}
                >
                  <MessageSquare size={14} /> Open AI Chat
                </button>
              </div>
            </div>
          ) : (
            <div>
              {ticketSubmitted ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <CheckCircle2 size={48} color="#00e676" style={{ margin: '0 auto 12px auto' }} />
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                    Support Ticket Created!
                  </h3>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#00d2ff', margin: '8px 0' }}>
                    Ticket ID: {ticketSubmitted}
                  </div>
                  <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 420, margin: '0 auto 20px auto' }}>
                    Our senior airline customer relations team has received your request. A specialist will follow up via email within 2 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTicketSubmitted(null)}
                    className="btn-secondary"
                    style={{ padding: '8px 18px' }}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Your Name</label>
                      <input
                        type="text"
                        required
                        value={ticketData.name}
                        onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Email Address</label>
                      <input
                        type="email"
                        required
                        value={ticketData.email}
                        onChange={(e) => setTicketData({ ...ticketData, email: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Issue Category</label>
                      <select
                        value={ticketData.category}
                        onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                        style={{ width: '100%', background: '#111a33', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 12px', borderRadius: 8, fontSize: 13 }}
                      >
                        <option value="Booking & E-Ticket">Booking & E-Ticket</option>
                        <option value="Refund & Cancellation">Refund & Cancellation</option>
                        <option value="Baggage & Meals">Baggage & Meals</option>
                        <option value="Flight Delay or Rescheduling">Flight Delay or Rescheduling</option>
                        <option value="Special Assistance">Special Assistance</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>PNR Reference (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. SMF901"
                        value={ticketData.pnr}
                        onChange={(e) => setTicketData({ ...ticketData, pnr: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 12px', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>How can we help?</label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Describe your inquiry or requested change..."
                      value={ticketData.message}
                      onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 12px', borderRadius: 8, fontSize: 13, resize: 'none' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
                    <Send size={16} /> Submit Support Ticket
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
